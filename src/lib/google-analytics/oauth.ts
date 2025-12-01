import { google } from "googleapis";
import { prisma } from "../prisma";
import { getRedirectUri as getRedirectUriFromEnv } from "./env-validation";

// Scopes required for Google Analytics Data API
export const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
];

/**
 * Get the OAuth redirect URI based on environment
 * Uses centralized validation from env-validation.ts
 */
function getRedirectUri(): string {
  return getRedirectUriFromEnv();
}

/**
 * Create OAuth2 client with dynamic redirect URI
 */
function createOAuth2Client(redirectUri?: string) {
  const uri = redirectUri || getRedirectUri();
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    uri
  );
}

/**
 * Generate the OAuth2 authorization URL
 * @param userId - User ID to include in state parameter for security
 */
export function getAuthUrl(userId?: string): string {
  const redirectUri = getRedirectUri();
  const oauth2Client = createOAuth2Client(redirectUri);

  // Log for debugging
  console.log("[OAuth] Using redirect URI:", redirectUri);
  if (userId) {
    console.log("[OAuth] User ID:", userId);
  }

  const authUrlOptions: any = {
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent to get refresh token
  };

  // Include userId in state parameter for security
  if (userId) {
    authUrlOptions.state = userId;
  }

  return oauth2Client.generateAuthUrl(authUrlOptions);
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string, redirectUri?: string) {
  const oauth2Client = createOAuth2Client(redirectUri);
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Store tokens in database for a user
 */
export async function storeTokens(
  userId: string,
  accessToken: string,
  refreshToken: string | null | undefined,
  expiryDate: Date
) {
  console.log(`[storeTokens] Storing tokens for user: ${userId}`);
  console.log(`[storeTokens] Access token length: ${accessToken.length}`);
  console.log(`[storeTokens] Refresh token present: ${!!refreshToken}`);
  console.log(`[storeTokens] Expiry date: ${expiryDate.toISOString()}`);
  
  // Simple encryption - in production, use a proper encryption library
  // For now, we'll store them directly (consider using crypto for encryption)
  const tokenData = {
    userId,
    accessToken,
    refreshToken: refreshToken || "",
    expiryDate,
  };

  try {
    const result = await prisma.googleAnalyticsToken.upsert({
      where: { userId },
      update: tokenData,
      create: tokenData,
    });
    console.log(`[storeTokens] Tokens stored successfully for user: ${userId}`);
    return result;
  } catch (error) {
    console.error(`[storeTokens] Error storing tokens for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get stored tokens for a user
 */
export async function getStoredTokens(userId: string) {
  const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
    where: { userId },
  });

  if (!tokenRecord) {
    return null;
  }

  return {
    accessToken: tokenRecord.accessToken,
    refreshToken: tokenRecord.refreshToken,
    expiryDate: tokenRecord.expiryDate,
  };
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() >= expiryDate;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  userId: string
): Promise<{ accessToken: string; expiryDate: Date } | null> {
  const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
    where: { userId },
  });

  if (!tokenRecord || !tokenRecord.refreshToken) {
    return null;
  }

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: tokenRecord.refreshToken,
  });

  try {
    const { credentials } = await oauth2Client.refreshAccessToken();

    if (credentials.access_token && credentials.expiry_date) {
      const expiryDate = new Date(credentials.expiry_date);

      await prisma.googleAnalyticsToken.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token,
          expiryDate,
        },
      });

      return {
        accessToken: credentials.access_token,
        expiryDate,
      };
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }

  return null;
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(userId: string): Promise<string | null> {
  try {
    const tokens = await getStoredTokens(userId);

    if (!tokens) {
      console.warn(`[getValidAccessToken] No stored tokens for user: ${userId}`);
      return null;
    }

    console.log(`[getValidAccessToken] Found tokens for user: ${userId}`);
    console.log(`[getValidAccessToken] Token expiry: ${tokens.expiryDate.toISOString()}`);
    console.log(`[getValidAccessToken] Current time: ${new Date().toISOString()}`);

    // Check if token is expired or will expire in the next 5 minutes
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    if (tokens.expiryDate <= fiveMinutesFromNow) {
      console.log(`[getValidAccessToken] Token expired or expiring soon, attempting refresh...`);
      // Token is expired or about to expire, refresh it
      const refreshed = await refreshAccessToken(userId);
      if (refreshed) {
        console.log(`[getValidAccessToken] Token refreshed successfully`);
        return refreshed.accessToken;
      }
      console.warn(`[getValidAccessToken] Token refresh failed, but returning existing token anyway`);
      // Even if refresh fails, try using the existing token (it might still work)
      return tokens.accessToken;
    }

    console.log(`[getValidAccessToken] Token is still valid, returning it`);
    return tokens.accessToken;
  } catch (error) {
    console.error(`[getValidAccessToken] Error getting valid access token for user ${userId}:`, error);
    return null;
  }
}

/**
 * Set credentials for OAuth2 client
 * Returns null if no valid token is available (instead of throwing)
 */
export async function setOAuth2Credentials(userId: string): Promise<ReturnType<typeof createOAuth2Client> | null> {
  try {
    console.log(`[setOAuth2Credentials] Setting credentials for user: ${userId}`);
    
    const accessToken = await getValidAccessToken(userId);

    if (!accessToken) {
      console.warn(`[setOAuth2Credentials] No valid access token for user: ${userId}`);
      return null;
    }

    console.log(`[setOAuth2Credentials] Access token obtained, length: ${accessToken.length}`);

    const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      console.warn(`[setOAuth2Credentials] No token record found for user: ${userId}`);
      return null;
    }

    console.log(`[setOAuth2Credentials] Token record found, refresh token present: ${!!tokenRecord.refreshToken}`);

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: tokenRecord.refreshToken || undefined,
    });

    console.log(`[setOAuth2Credentials] OAuth2 client configured successfully`);
    return oauth2Client;
  } catch (error) {
    console.error(`[setOAuth2Credentials] Error setting credentials for user ${userId}:`, error);
    return null;
  }
}

