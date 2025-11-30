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
  const uri = getRedirectUriFromEnv();
  if (!uri) {
    console.error("[oauth] Failed to get redirect URI - environment not configured properly");
    // Return empty string to prevent crashes, calling code should handle this
    return "";
  }
  return uri;
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
  // Simple encryption - in production, use a proper encryption library
  // For now, we'll store them directly (consider using crypto for encryption)
  const tokenData = {
    userId,
    accessToken,
    refreshToken: refreshToken || "",
    expiryDate,
  };

  await prisma.googleAnalyticsToken.upsert({
    where: { userId },
    update: tokenData,
    create: tokenData,
  });
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
  const tokens = await getStoredTokens(userId);

  if (!tokens) {
    return null;
  }

  // Check if token is expired or will expire in the next 5 minutes
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  if (tokens.expiryDate <= fiveMinutesFromNow) {
    // Token is expired or about to expire, refresh it
    const refreshed = await refreshAccessToken(userId);
    if (refreshed) {
      return refreshed.accessToken;
    }
    return null;
  }

  return tokens.accessToken;
}

/**
 * Set credentials for OAuth2 client
 * Returns null if no valid token is available (instead of throwing)
 */
export async function setOAuth2Credentials(userId: string): Promise<ReturnType<typeof createOAuth2Client> | null> {
  try {
    const accessToken = await getValidAccessToken(userId);

    if (!accessToken) {
      console.warn(`[setOAuth2Credentials] No valid access token for user: ${userId}`);
      return null;
    }

    const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      console.warn(`[setOAuth2Credentials] No token record found for user: ${userId}`);
      return null;
    }

    const oauth2Client = createOAuth2Client();
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: tokenRecord.refreshToken || undefined,
    });

    return oauth2Client;
  } catch (error) {
    console.error(`[setOAuth2Credentials] Error setting credentials for user ${userId}:`, error);
    return null;
  }
}

