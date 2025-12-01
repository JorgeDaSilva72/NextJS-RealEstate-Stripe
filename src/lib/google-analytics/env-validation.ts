/**
 * Validate Google Analytics environment variables
 * Returns error message if validation fails, null if all valid
 */
export function validateGoogleAnalyticsEnv(): string | null {
  const requiredVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };

  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value || value.trim() === "") {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    return `Missing required environment variables: ${missing.join(", ")}. Please check your environment configuration.`;
  }

  // Note: NEXT_PUBLIC_BASE_URL is optional as we have a hardcoded fallback for production
  // Check if redirect URI can be determined
  const redirectUri = getRedirectUri();

  if (!redirectUri) {
    return "Failed to determine OAuth redirect URI.";
  }

  return null;
}

/**
 * Get the redirect URI for OAuth
 * Uses environment variable if set, otherwise falls back to hardcoded production URL
 */
export function getRedirectUri(): string {
  // Explicit redirect URI takes precedence
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }

  // In production, use NEXT_PUBLIC_BASE_URL if set, otherwise fallback to production URL
  if (process.env.NODE_ENV === "production") {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://afriqueavenirimmobilier.com";
    return `${baseUrl}/oauth2callback`;
  }

  // Development fallback
  return "http://localhost:3000/oauth2callback";
}
