import { google } from "googleapis";
import { prisma } from "../prisma";
import { getRedirectUri, validateGoogleAnalyticsEnv } from "./env-validation";

// Validate environment variables on module load
const envError = validateGoogleAnalyticsEnv();
if (envError && process.env.NODE_ENV === "production") {
  console.error("Google Analytics Environment Error:", envError);
}

// Google OAuth2 configuration
// Use environment variable or auto-detect based on NODE_ENV
const redirectUri = getRedirectUri();

// Initialize OAuth2 client with validation
function createOAuth2Client() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = getRedirectUri();
    
    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
    }
    
    return new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
  } catch (error) {
    console.error("Failed to initialize OAuth2 client:", error);
    // Create a dummy client to prevent crashes, but it won't work
    return new google.auth.OAuth2("", "", getRedirectUri());
  }
}

export const oauth2Client = createOAuth2Client();

// Scopes required for Google Analytics Data API
export const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
];

/**
 * Generate the OAuth2 authorization URL
 */
export function getAuthUrl(): string {
  try {
    const envError = validateGoogleAnalyticsEnv();
    if (envError) {
      throw new Error(envError);
    }

    const redirectUri = getRedirectUri();
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
    }
    
    // Create a new OAuth2 client with the correct redirect URI
    const client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );
    
    // Log for debugging (always log in production for troubleshooting)
    console.log("[Google OAuth] Using redirect URI:", redirectUri);
    console.log("[Google OAuth] Client ID configured:", !!clientId);
    
    return client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent", // Force consent to get refresh token
    });
  } catch (error: any) {
    console.error("[Google OAuth] Error generating auth URL:", error);
    throw new Error(`Failed to generate OAuth URL: ${error.message}`);
  }
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
  try {
    if (!code || code.trim() === "") {
      throw new Error("Authorization code is required");
    }

    const envError = validateGoogleAnalyticsEnv();
    if (envError) {
      throw new Error(envError);
    }

    // Create a fresh client with validated credentials
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = getRedirectUri();
    
    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
    }

    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    console.log("[Google OAuth] Exchanging code for tokens...");
    console.log("[Google OAuth] Redirect URI:", redirectUri);
    
    const { tokens } = await client.getToken(code);
    
    if (!tokens || !tokens.access_token) {
      throw new Error("Failed to obtain access token from Google");
    }
    
    console.log("[Google OAuth] Successfully obtained tokens");
    return tokens;
  } catch (error: any) {
    console.error("[Google OAuth] Error exchanging code for tokens:", error);
    console.error("[Google OAuth] Error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data || error.response,
    });
    throw new Error(`Failed to exchange authorization code: ${error.message || "Unknown error"}`);
  }
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
  try {
    console.log("[storeTokens] Starting token storage for user:", userId);
    console.log("[storeTokens] Token details:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      expiryDate: expiryDate.toISOString(),
    });

    // Simple encryption - in production, use a proper encryption library
    // For now, we'll store them directly (consider using crypto for encryption)
    const tokenData = {
      userId,
      accessToken,
      refreshToken: refreshToken || "",
      expiryDate,
    };

    console.log("[storeTokens] Attempting database upsert...");
    const result = await prisma.googleAnalyticsToken.upsert({
      where: { userId },
      update: tokenData,
      create: tokenData,
    });

    console.log("[storeTokens] Token stored successfully:", {
      userId: result.userId,
      hasAccessToken: !!result.accessToken,
      hasRefreshToken: !!result.refreshToken,
      expiryDate: result.expiryDate.toISOString(),
    });

    // Verify the token was actually stored
    const verification = await prisma.googleAnalyticsToken.findUnique({
      where: { userId },
    });

    if (!verification) {
      console.error("[storeTokens] CRITICAL: Token not found after storage!");
      throw new Error("Token storage verification failed - token not found in database");
    }

    console.log("[storeTokens] Verification successful - token confirmed in database");
    return result;
  } catch (error: any) {
    console.error("[storeTokens] Error storing tokens:", error);
    console.error("[storeTokens] Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    throw new Error(`Failed to store Google Analytics tokens: ${error.message || "Unknown error"}`);
  }
}

/**
 * Get stored tokens for a user
 */
export async function getStoredTokens(userId: string) {
  try {
    console.log("[getStoredTokens] Looking up tokens for user:", userId);
    
    const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord) {
      console.log("[getStoredTokens] No tokens found for user:", userId);
      return null;
    }

    console.log("[getStoredTokens] Tokens found:", {
      userId: tokenRecord.userId,
      hasAccessToken: !!tokenRecord.accessToken,
      hasRefreshToken: !!tokenRecord.refreshToken,
      expiryDate: tokenRecord.expiryDate.toISOString(),
    });

    return {
      accessToken: tokenRecord.accessToken,
      refreshToken: tokenRecord.refreshToken,
      expiryDate: tokenRecord.expiryDate,
    };
  } catch (error: any) {
    console.error("[getStoredTokens] Error getting stored tokens:", error);
    console.error("[getStoredTokens] Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiryDate: Date): boolean {
  try {
    if (!expiryDate) {
      return true; // If no expiry date, consider it expired
    }
    const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
    return new Date() >= expiry;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true; // On error, assume expired for safety
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  userId: string
): Promise<{ accessToken: string; expiryDate: Date } | null> {
  try {
    const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
      where: { userId },
    });

    if (!tokenRecord || !tokenRecord.refreshToken) {
      return null;
    }

    // Create a fresh client for token refresh
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = getRedirectUri();
    
    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
    }

    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({
      refresh_token: tokenRecord.refreshToken,
    });

    try {
      const { credentials } = await client.refreshAccessToken();
      
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
  } catch (error) {
    console.error("Error in refreshAccessToken:", error);
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
  } catch (error) {
    console.error("Error getting valid access token:", error);
    return null;
  }
}

/**
 * Set credentials for OAuth2 client
 */
export async function setOAuth2Credentials(userId: string) {
  try {
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }

    const accessToken = await getValidAccessToken(userId);
    
    if (!accessToken) {
      throw new Error("No valid access token available. Please reconnect your Google Analytics account.");
    }

    let tokenRecord;
    try {
      tokenRecord = await prisma.googleAnalyticsToken.findUnique({
        where: { userId },
      });
    } catch (error: any) {
      console.error("[OAuth] Error fetching token record:", error);
      throw new Error("Failed to retrieve token record from database");
    }

    // Create a fresh client with validated credentials
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = getRedirectUri();
    
    if (!clientId || !clientSecret) {
      throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set");
    }

    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    client.setCredentials({
      access_token: accessToken,
      refresh_token: tokenRecord?.refreshToken || undefined,
    });

    return client;
  } catch (error: any) {
    console.error("[OAuth] Error setting OAuth2 credentials:", error);
    throw new Error(`Failed to set OAuth2 credentials: ${error.message || "Unknown error"}`);
  }
}

