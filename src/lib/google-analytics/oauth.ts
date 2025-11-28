import { google } from "googleapis";
import { prisma } from "../prisma";

// Google OAuth2 configuration
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/analytics/oauth2callback"
);

// Scopes required for Google Analytics Data API
export const SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
];

/**
 * Generate the OAuth2 authorization URL
 */
export function getAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // Force consent to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string) {
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
 */
export async function setOAuth2Credentials(userId: string) {
  const accessToken = await getValidAccessToken(userId);
  
  if (!accessToken) {
    throw new Error("No valid access token available");
  }

  const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
    where: { userId },
  });

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: tokenRecord?.refreshToken || undefined,
  });

  return oauth2Client;
}

