import { google } from "googleapis";
import { prisma } from "../prisma";
import { getRedirectUri as getRedirectUriFromEnv } from "./env-validation";

// Scopes required for Google Analytics Data API and user info
export const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/analytics",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "openid",
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
 * IMPORTANT: Must use the same redirect_uri that was used in generateAuthUrl
 */
export async function getTokensFromCode(code: string, redirectUri?: string) {
  const uri = redirectUri || getRedirectUri();
  console.log(`[getTokensFromCode] Using redirect URI: ${uri}`);
  
  const oauth2Client = createOAuth2Client(uri);
  const { tokens } = await oauth2Client.getToken(code);
  
  console.log(`[getTokensFromCode] Token exchange successful`);
  console.log(`[getTokensFromCode] Has access_token: ${!!tokens.access_token}`);
  console.log(`[getTokensFromCode] Has refresh_token: ${!!tokens.refresh_token}`);
  console.log(`[getTokensFromCode] Expiry date: ${tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'not provided'}`);
  
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
  console.log(`[refreshAccessToken] Attempting to refresh token for user: ${userId}`);
  
  const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
    where: { userId },
  });

  if (!tokenRecord || !tokenRecord.refreshToken) {
    console.warn(`[refreshAccessToken] No token record or refresh token for user: ${userId}`);
    return null;
  }

  console.log(`[refreshAccessToken] Refresh token found, length: ${tokenRecord.refreshToken.length}`);

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: tokenRecord.refreshToken,
  });

  try {
    console.log(`[refreshAccessToken] Calling refreshAccessToken()...`);
    const { credentials } = await oauth2Client.refreshAccessToken();
    console.log(`[refreshAccessToken] Token refresh successful`);

    if (credentials.access_token && credentials.expiry_date) {
      const expiryDate = new Date(credentials.expiry_date);

      await prisma.googleAnalyticsToken.update({
        where: { userId },
        data: {
          accessToken: credentials.access_token,
          expiryDate,
        },
      });

      console.log(`[refreshAccessToken] Token updated in database, new expiry: ${expiryDate.toISOString()}`);
      return {
        accessToken: credentials.access_token,
        expiryDate,
      };
    } else {
      console.warn(`[refreshAccessToken] Token refresh returned no access_token or expiry_date`);
      return null;
    }
  } catch (error: any) {
    console.error(`[refreshAccessToken] Error refreshing token for user ${userId}:`, error);
    console.error(`[refreshAccessToken] Error message:`, error?.message);
    console.error(`[refreshAccessToken] Error code:`, error?.code);
    console.error(`[refreshAccessToken] Error response:`, error?.response?.data);
    return null;
  }
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
    console.log(`[setOAuth2Credentials] Access token preview: ${accessToken.substring(0, 20)}...`);

    // Validate token format (OAuth tokens are typically base64-like strings)
    if (!accessToken || accessToken.trim().length === 0) {
      console.error(`[setOAuth2Credentials] Access token is empty or invalid for user: ${userId}`);
      return null;
    }

    const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      console.warn(`[setOAuth2Credentials] No token record found for user: ${userId}`);
      return null;
    }
    
    // Validate stored token matches what we retrieved
    if (tokenRecord.accessToken !== accessToken) {
      console.warn(`[setOAuth2Credentials] Token mismatch - stored token differs from retrieved token`);
      console.warn(`[setOAuth2Credentials] Stored token length: ${tokenRecord.accessToken.length}`);
      console.warn(`[setOAuth2Credentials] Retrieved token length: ${accessToken.length}`);
    }

    console.log(`[setOAuth2Credentials] Token record found, refresh token present: ${!!tokenRecord.refreshToken}`);

    const oauth2Client = createOAuth2Client();
    
    // Set credentials with all necessary fields
    const credentials: any = {
      access_token: accessToken,
    };
    
    if (tokenRecord.refreshToken) {
      credentials.refresh_token = tokenRecord.refreshToken;
    }
    
    // Set expiry if available (convert Date to seconds, not milliseconds)
    if (tokenRecord.expiryDate) {
      credentials.expiry_date = Math.floor(tokenRecord.expiryDate.getTime() / 1000);
    }
    
    oauth2Client.setCredentials(credentials);
    
    // Try to get a fresh access token - this will automatically refresh if needed
    try {
      const tokenResponse = await oauth2Client.getAccessToken();
      if (tokenResponse.token && tokenResponse.token !== accessToken) {
        // Token was refreshed, update in database
        console.log(`[setOAuth2Credentials] Token was automatically refreshed`);
        const newExpiry = tokenResponse.res?.data?.expiry_date 
          ? new Date(tokenResponse.res.data.expiry_date * 1000)
          : new Date(Date.now() + 3600 * 1000); // Default to 1 hour
        
        await prisma.googleAnalyticsToken.update({
          where: { userId },
          data: {
            accessToken: tokenResponse.token,
            expiryDate: newExpiry,
          },
        });
        
        // Update credentials with new token (expiry in seconds)
        oauth2Client.setCredentials({
          ...credentials,
          access_token: tokenResponse.token,
          expiry_date: Math.floor(newExpiry.getTime() / 1000),
        });
      }
    } catch (tokenError: any) {
      console.warn(`[setOAuth2Credentials] Error getting/refreshing access token:`, tokenError?.message);
      // Continue anyway - the token might still work
    }
    
    // Verify credentials were set
    const clientCredentials = oauth2Client.credentials;
    console.log(`[setOAuth2Credentials] Client credentials after setting:`, {
      hasAccessToken: !!clientCredentials.access_token,
      accessTokenLength: clientCredentials.access_token?.length || 0,
      hasRefreshToken: !!clientCredentials.refresh_token,
      expiryDate: clientCredentials.expiry_date ? new Date(clientCredentials.expiry_date).toISOString() : null,
    });

    console.log(`[setOAuth2Credentials] OAuth2 client configured successfully`);
    return oauth2Client;
  } catch (error) {
    console.error(`[setOAuth2Credentials] Error setting credentials for user ${userId}:`, error);
    return null;
  }
}

