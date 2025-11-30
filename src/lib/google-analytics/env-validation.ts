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

  // In production, NEXT_PUBLIC_BASE_URL is required
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_BASE_URL) {
    return "NEXT_PUBLIC_BASE_URL must be set in production environment. Please add it to your hosting platform environment variables.";
  }

  // Check if redirect URI is properly configured
  const redirectUri = getRedirectUri();
  
  if (!redirectUri) {
    return "Failed to determine OAuth redirect URI. Please set GOOGLE_REDIRECT_URI or NEXT_PUBLIC_BASE_URL.";
  }

  return null;
}

/**
 * Get the redirect URI for OAuth
 * In production, this MUST use NEXT_PUBLIC_BASE_URL
 */
export function getRedirectUri(): string {
  // Explicit redirect URI takes precedence
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  
  // In production, require NEXT_PUBLIC_BASE_URL
  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("[env-validation] CRITICAL: NEXT_PUBLIC_BASE_URL is not set in production!");
      throw new Error("NEXT_PUBLIC_BASE_URL must be set in production environment");
    }
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`;
  }
  
  // Development fallback
  return "http://localhost:3000/api/auth/callback/google";
}

