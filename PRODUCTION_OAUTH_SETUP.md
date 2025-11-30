# Production OAuth Setup Guide

## Environment Variables Required

Add these to your production environment (Vercel/your hosting platform):

```env
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# OAuth Redirect URI (must match Google Cloud Console)
GOOGLE_REDIRECT_URI=https://afriqueavenirimmobilier.com/api/auth/callback/google

# Base URL for the application
NEXT_PUBLIC_BASE_URL=https://afriqueavenirimmobilier.com

# Google Analytics Property ID
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id-here
```

## Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Select your OAuth 2.0 Client ID
4. Under **Authorized redirect URIs**, add:
   ```
   https://afriqueavenirimmobilier.com/api/auth/callback/google
   ```
5. **Important**: Remove any old redirect URIs that are no longer used:
   - `/oauth2callback` (old route)
   - `/api/analytics/oauth2callback` (old route)

## API Routes

### Working Routes:
- ✅ `/api/auth/google` → Redirects to `/api/analytics/auth`
- ✅ `/api/analytics/auth` → Initiates OAuth flow
- ✅ `/api/auth/callback/google` → Handles OAuth callback (PRIMARY)
- ✅ `/oauth2callback` → Legacy callback route (for backward compatibility)
- ✅ `/api/analytics/status` → Checks connection status
- ✅ `/api/analytics/data` → Fetches GA4 data

## Testing in Production

1. Visit: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`
2. Click "Connect Google Analytics"
3. You should be redirected to Google OAuth
4. After authorization, you'll be redirected back to the dashboard
5. The dashboard should load analytics data

## Troubleshooting

### Error: "This page could not be found" on `/api/auth/google`
- ✅ **Fixed**: Route now exists and redirects properly

### Error: "OAuth configuration error"
- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Verify the redirect URI matches exactly in Google Cloud Console

### Error: "Database table does not exist"
- Run: `npx prisma migrate deploy` in production
- Or manually create the table using: `npx prisma db execute --file scripts/create_ga_token_table.sql`

### Error: "Server Components render error"
- ✅ **Fixed**: Dashboard is now client-side only with proper error boundaries
- Check server logs for specific error details

### Analytics data not loading
- Verify `GOOGLE_ANALYTICS_PROPERTY_ID` is set correctly
- Check that the user has connected their Google Analytics account
- Verify the property ID has access to GA4 Data API

