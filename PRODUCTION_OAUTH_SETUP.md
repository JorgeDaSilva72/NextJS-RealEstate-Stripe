# Production OAuth Setup Guide

## Environment Variables Required

Add these to your production environment (Vercel/your hosting platform):

```env
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# OAuth Redirect URI (must match Google Cloud Console)
# Use the canonical callback route
GOOGLE_REDIRECT_URI=https://afriqueavenirimmobilier.com/api/auth/callback/google

# Base URL for the application (REQUIRED in production)
NEXT_PUBLIC_BASE_URL=https://afriqueavenirimmobilier.com

# Google Analytics Property ID
GOOGLE_ANALYTICS_PROPERTY_ID=514683326
```

> **IMPORTANT**: `NEXT_PUBLIC_BASE_URL` is **REQUIRED** in production. The application will fail with 500 errors if this is not set.

## Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Select your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, ensure you have **ONLY** these:
   ```
   http://localhost:3000/api/auth/callback/google   (for development)
   https://afriqueavenirimmobilier.com/api/auth/callback/google   (for production)
   ```
5. **Remove any old redirect URIs**:
   - ❌ `/oauth2callback` (deprecated)
   - ❌ `/[locale]/oauth2callback` (deprecated)
   - ❌ `/api/analytics/oauth2callback` (deprecated)

## Canonical OAuth Flow

The correct OAuth flow uses these routes:

1. **Initiate OAuth**: `/api/analytics/auth` or `/api/auth/google`
2. **Google redirects to**: `/api/auth/callback/google` (canonical callback)
3. **Final redirect**: `/[locale]/analytics/dashboard?success=true`

## Testing in Production

1. Visit: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`
2. Click "Connect Google Analytics"
3. You should be redirected to Google OAuth
4. After authorization, you'll be redirected to `/api/auth/callback/google`
5. Finally redirected back to the dashboard with data

## Troubleshooting

### Error: 500 Internal Server Error on dashboard

**Cause**: Missing `NEXT_PUBLIC_BASE_URL` environment variable in production

**Solution**: 
1. Go to your hosting platform (Vercel, etc.)
2. Add environment variable: `NEXT_PUBLIC_BASE_URL=https://afriqueavenirimmobilier.com`
3. Redeploy your application

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI in your Google Cloud Console doesn't match the one being used

**Solution**:
1. Check Google Cloud Console → Credentials → OAuth 2.0 Client
2. Ensure redirect URI is exactly: `https://afriqueavenirimmobilier.com/api/auth/callback/google`
3. Remove any old/deprecated redirect URIs
4. Wait a few minutes for changes to propagate

### Error: "Configuration error"

**Cause**: Required environment variables are missing

**Solution**:
- Verify `GOOGLE_CLIENT_ID` is set
- Verify `GOOGLE_CLIENT_SECRET` is set
- Verify `NEXT_PUBLIC_BASE_URL` is set
- Check production logs for specific error messages

### Error: "Database table does not exist"

**Solution**: Run database migrations in production:
```bash
npx prisma migrate deploy
```

### Analytics data not loading

**Possible causes**:
1. Verify `GOOGLE_ANALYTICS_PROPERTY_ID=514683326` is set correctly
2. Check that the property ID has access to GA4 Data API
3. Ensure the authenticated user has access to the property
4. Check production logs for specific API errors


