#!/bin/bash
if [ -f src/lib/google-analytics/config.ts ]; then
  cat > src/lib/google-analytics/config.ts << 'EOF'
/**
 * Google Analytics Configuration
 * 
 * All credentials are read from environment variables.
 * Set these in your .env.local file.
 */

export const googleAnalyticsConfig = {
  // Google OAuth2 Credentials - From environment variables
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  
  // Redirect URIs
  redirectUri: {
    production: process.env.GOOGLE_REDIRECT_URI_PRODUCTION || "https://afriqueavenirimmobilier.com/oauth2callback",
    development: process.env.GOOGLE_REDIRECT_URI_DEVELOPMENT || "http://localhost:3000/oauth2callback",
  },
  
  // Property ID - From environment variable
  propertyId: process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "",
};
EOF
fi

