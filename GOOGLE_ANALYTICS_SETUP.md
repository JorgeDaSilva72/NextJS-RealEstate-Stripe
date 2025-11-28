# Google Analytics Data API (GA4) Integration Setup

This document explains how to set up and use the Google Analytics Data API integration in your Next.js project.

## Prerequisites

1. A Google Cloud Project with the Google Analytics Data API enabled
2. OAuth2 credentials (Client ID and Client Secret)
3. A GA4 property ID

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/analytics/oauth2callback

# Google Analytics Property ID (format: 123456789)
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id-here

# Base URL (for production)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Migration

After adding the new `GoogleAnalyticsToken` model to your Prisma schema, run:

```bash
npx prisma migrate dev --name add_google_analytics_token
npx prisma generate
```

## Setup Steps

### 1. Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (`afriqueavenirimmobilier`)
3. Navigate to "APIs & Services" > "Library"
4. Search for "Google Analytics Data API"
5. Click "Enable"

### 2. Configure OAuth2 Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Configure the consent screen with your app information
3. Add the required scopes:
   - `https://www.googleapis.com/auth/analytics.readonly`

### 3. Create OAuth2 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Create OAuth 2.0 Client ID (if not already created)
3. Set authorized redirect URIs:
   - `http://localhost:3000/api/analytics/oauth2callback` (for development)
   - `https://yourdomain.com/api/analytics/oauth2callback` (for production)

### 4. Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property
3. Go to Admin > Property Settings
4. Copy the Property ID (format: 123456789)
5. Add it to your `.env.local` as `GOOGLE_ANALYTICS_PROPERTY_ID`

## Usage

### Accessing the Dashboard

1. Navigate to `/analytics/dashboard` (or `/[locale]/analytics/dashboard` if using i18n)
2. Click "Connect Google Analytics"
3. Authorize the application
4. You'll be redirected back to the dashboard with your analytics data

### API Endpoints

- `GET /api/analytics/auth` - Initiate OAuth2 flow
- `GET /api/analytics/oauth2callback` - OAuth2 callback handler
- `GET /api/analytics/status` - Check connection status
- `GET /api/analytics/data?type={type}&startDate={date}&endDate={date}` - Fetch analytics data

#### Data Types

- `realtime` - Real-time active users
- `overview` - Traffic overview (users, sessions, page views)
- `topPages` - Top pages by views
- `behavior` - User behavior by device and location
- `sources` - Traffic sources

#### Example API Call

```typescript
const response = await fetch(
  '/api/analytics/data?type=overview&startDate=30daysAgo&endDate=today'
);
const { data } = await response.json();
```

## Features

- ✅ OAuth2 authentication flow
- ✅ Secure token storage in database
- ✅ Automatic token refresh
- ✅ Real-time analytics
- ✅ Traffic overview dashboard
- ✅ Top pages analysis
- ✅ User behavior insights
- ✅ Traffic sources tracking

## Security Notes

1. **Token Storage**: Tokens are stored in the database. In production, consider encrypting sensitive tokens.
2. **Environment Variables**: Never commit `.env.local` to version control.
3. **HTTPS**: Always use HTTPS in production for OAuth2 redirects.
4. **Token Refresh**: Tokens are automatically refreshed when expired.

## Troubleshooting

### "Authentication required" error

- Check if tokens are stored in the database
- Verify OAuth2 credentials are correct
- Ensure the redirect URI matches exactly

### "Property not found" error

- Verify `GOOGLE_ANALYTICS_PROPERTY_ID` is set correctly
- Ensure the property ID format is correct (numbers only)
- Check that the authenticated user has access to the property

### Token refresh fails

- Verify the refresh token is stored
- Check if the OAuth2 consent screen is properly configured
- Ensure the user hasn't revoked access

## Production Deployment

1. Update `GOOGLE_REDIRECT_URI` to your production domain
2. Update `NEXT_PUBLIC_BASE_URL` to your production URL
3. Ensure all environment variables are set in your hosting platform
4. Run database migrations in production
5. Test the OAuth2 flow in production

