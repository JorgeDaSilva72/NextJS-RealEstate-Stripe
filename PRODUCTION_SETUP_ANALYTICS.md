# Production Setup: Google Analytics on afriqueavenirimmobilier.com

This guide will help you configure Google Analytics for your production website.

## Step 1: Update Google Cloud Console OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `afriqueavenirimmobilier`
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID
5. Under **Authorized redirect URIs**, add:
   ```
   https://afriqueavenirimmobilier.com/oauth2callback
   ```
6. Under **Authorized JavaScript origins**, add:
   ```
   https://afriqueavenirimmobilier.com
   ```
7. Click **Save**

**Important:** Keep both localhost and production URIs:
- `http://localhost:3000/oauth2callback` (for development)
- `https://afriqueavenirimmobilier.com/oauth2callback` (for production)

## Step 2: Update Environment Variables

### For Production (Vercel/Deployment Platform)

Add these environment variables in your deployment platform (Vercel, etc.):

```env
# Google OAuth2 Credentials (same as localhost)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Production Redirect URI
GOOGLE_REDIRECT_URI=https://afriqueavenirimmobilier.com/oauth2callback

# Google Analytics Property ID (your GA4 property)
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id-here

# Production Base URL
NEXT_PUBLIC_BASE_URL=https://afriqueavenirimmobilier.com
```

### For Local Development (.env.local)

Keep your local development settings:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Verify Your GA4 Property ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your GA4 property for **afriqueavenirimmobilier.com**
3. Go to **Admin** → **Property Settings**
4. Copy the **Property ID** (numeric, e.g., `123456789`)
5. Add it to your production environment variables as `GOOGLE_ANALYTICS_PROPERTY_ID`

## Step 4: Deploy to Production

### If using Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all the environment variables from Step 2
4. Make sure to select **Production** environment
5. Redeploy your application

### If using another platform:

1. Add the environment variables in your platform's settings
2. Redeploy your application

## Step 5: Test the Connection

1. Visit: `https://afriqueavenirimmobilier.com/fr/analytics/dashboard` (or your locale)
2. Click **"Connect Google Analytics"**
3. You'll be redirected to Google to authorize
4. After authorization, you'll be redirected back to the dashboard
5. The dashboard should now show real analytics data from your website

## Step 6: Verify Analytics is Tracking

1. Visit your website: https://afriqueavenirimmobilier.com
2. Navigate through a few pages
3. Wait a few minutes
4. Check the analytics dashboard - you should see:
   - Real-time active users
   - Page views
   - Traffic sources
   - User behavior data

## Troubleshooting

### "redirect_uri_mismatch" Error

- Verify the redirect URI in Google Cloud Console matches exactly: `https://afriqueavenirimmobilier.com/oauth2callback`
- Make sure there are no trailing slashes
- Check that `GOOGLE_REDIRECT_URI` environment variable is set correctly

### All Metrics Show Zero

- **This is normal if your website is new or has low traffic**
- Make sure Google Analytics tracking code is installed on your website
- Verify the Property ID is correct
- Check that you're viewing the correct date range
- Wait a few hours for data to accumulate

### "Property not found" Error

- Verify `GOOGLE_ANALYTICS_PROPERTY_ID` is set correctly
- Make sure you're using the GA4 Property ID (not Universal Analytics)
- Check that the property exists in your Google Analytics account

### Authentication Issues

- Clear your browser cookies for the domain
- Try disconnecting and reconnecting Google Analytics
- Verify OAuth credentials are correct in environment variables

## Important Notes

1. **HTTPS Required**: Production OAuth requires HTTPS. Make sure your site uses SSL.

2. **Domain Verification**: Google may require domain verification for production OAuth.

3. **Analytics Tracking**: Make sure your website has the Google Analytics tracking code installed. If not, you'll need to add it to track visitors.

4. **Data Delay**: Analytics data may take 24-48 hours to fully populate for historical data. Real-time data appears immediately.

5. **Multiple Environments**: You can use the same OAuth credentials for both development and production, just add both redirect URIs in Google Cloud Console.

## Next Steps

After setup:
1. Monitor the dashboard regularly
2. Set up custom reports if needed
3. Configure alerts for important metrics
4. Share access with team members if needed

