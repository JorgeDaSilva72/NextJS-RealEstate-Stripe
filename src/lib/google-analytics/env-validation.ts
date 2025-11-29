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
    return `Missing required environment variables: ${missing.join(", ")}. Please check your production environment configuration.`;
  }

  // Check if redirect URI is properly configured
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 
    (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_BASE_URL
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`
      : null);

  if (!redirectUri) {
    return "GOOGLE_REDIRECT_URI or NEXT_PUBLIC_BASE_URL must be set in production";
  }

  return null;
}

/**
 * Get the redirect URI for OAuth
 */
export function getRedirectUri(): string {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI;
  }
  
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_BASE_URL) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`;
  }
  
  return "http://localhost:3000/api/auth/callback/google";
}

