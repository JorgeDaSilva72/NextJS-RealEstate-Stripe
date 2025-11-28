# Quick Start: Google Analytics Integration

## 🚀 Setup Steps

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_google_analytics_token
npx prisma generate
```

### 2. Set Environment Variables

Add these to your `.env.local` file:

```env
# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/analytics/oauth2callback

# IMPORTANT: Get your GA4 Property ID from Google Analytics
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id-here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Get Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property
3. Go to **Admin** → **Property Settings**
4. Copy the **Property ID** (format: `123456789`)
5. Add it to `.env.local` as `GOOGLE_ANALYTICS_PROPERTY_ID`

### 4. Enable Google Analytics Data API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `afriqueavenirimmobilier`
3. Navigate to **APIs & Services** → **Library**
4. Search for "Google Analytics Data API"
5. Click **Enable**

### 5. Configure OAuth2 Redirect URI

1. Go to **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add authorized redirect URI:
   - Development: `http://localhost:3000/api/analytics/oauth2callback`
   - Production: `https://yourdomain.com/api/analytics/oauth2callback`

## 📍 Access the Dashboard

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/fr/analytics/dashboard` (or your locale)
3. Click **"Connect Google Analytics"**
4. Authorize the application
5. You'll be redirected back to the dashboard with your analytics data

## 🎯 Features

- ✅ Real-time active users
- ✅ Traffic overview (users, sessions, page views)
- ✅ Top pages analysis
- ✅ User behavior by device and location
- ✅ Traffic sources
- ✅ Automatic token refresh
- ✅ Secure token storage

## 📚 API Endpoints

- `GET /api/analytics/auth` - Initiate OAuth2 flow
- `GET /api/analytics/oauth2callback` - OAuth2 callback
- `GET /api/analytics/status` - Check connection status
- `GET /api/analytics/data?type={type}&startDate={date}&endDate={date}` - Fetch data

### Data Types:
- `realtime` - Real-time active users
- `overview` - Traffic overview
- `topPages` - Top pages by views
- `behavior` - User behavior metrics
- `sources` - Traffic sources

## 🔒 Security Notes

- Tokens are stored securely in the database
- Automatic token refresh when expired
- OAuth2 flow requires user authentication
- Never commit `.env.local` to version control

## 🐛 Troubleshooting

**"Property not found" error:**
- Verify `GOOGLE_ANALYTICS_PROPERTY_ID` is set correctly
- Ensure the property ID is numeric only (e.g., `123456789`)

**"Authentication required" error:**
- Reconnect your Google Analytics account
- Check if tokens exist in the database

**Token refresh fails:**
- Verify OAuth2 consent screen is configured
- Check that refresh token was saved during initial authorization

For more details, see `GOOGLE_ANALYTICS_SETUP.md`

