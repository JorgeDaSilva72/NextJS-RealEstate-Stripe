# Reauthorize Google Analytics - Production Fix Guide

## Problem
If you're experiencing 401 errors when accessing Google Analytics data in production, your stored tokens may be invalid, expired, or missing required scopes. This guide will help you clear old tokens and reauthorize with fresh tokens.

## Prerequisites
- You must have access to the production database or API endpoints
- The Google account you use must have access to the GA4 property
- The redirect URI `https://afriqueavenirimmobilier.com/oauth2callback` must be configured in Google Cloud Console

## Step-by-Step Reauthorization Process

### Step 1: Clear Existing Tokens

**Option A: Using the API endpoint (Recommended)**
1. Make sure you're logged into the production site
2. Visit: `https://afriqueavenirimmobilier.com/api/analytics/clear`
3. You should see: `{"success": true, "message": "Tokens cleared successfully..."}`

**Option B: Using Database (if you have direct access)**
```sql
DELETE FROM "GoogleAnalyticsToken" WHERE "userId" = 'your-user-id';
```

### Step 2: Verify Tokens Are Cleared

Visit: `https://afriqueavenirimmobilier.com/api/analytics/debug`

You should see `"tokenRecord": null` confirming tokens are deleted.

### Step 3: Reauthorize with Google

1. Go to: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`
2. Click "Connect Google Analytics"
3. You'll be redirected to Google's OAuth consent screen
4. **Important**: Make sure you grant ALL requested permissions:
   - View your Google Analytics data
   - See your email address
   - See your personal info
5. Click "Allow" or "Continue"
6. You'll be redirected back to the dashboard

### Step 4: Verify New Tokens

Visit: `https://afriqueavenirimmobilier.com/api/analytics/test-token`

You should see:
```json
{
  "success": true,
  "hasToken": true,
  "hasOAuthClient": true,
  "googleUserInfo": { ... },
  "ga4Test": {
    "success": true,
    "hasData": true
  },
  "message": "Token is valid and working with both OAuth2 and GA4 APIs"
}
```

### Step 5: Test the Dashboard

Visit: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`

You should now see analytics data without any 401 errors.

## Troubleshooting

### Error: "redirect_uri_mismatch"
- **Cause**: The redirect URI in Google Cloud Console doesn't match
- **Fix**: 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Navigate to: APIs & Services → Credentials
  3. Click your OAuth 2.0 Client ID
  4. Under "Authorized redirect URIs", ensure this exact URI is listed:
     ```
     https://afriqueavenirimmobilier.com/oauth2callback
     ```
  5. Save and wait 1-2 minutes for changes to propagate

### Error: "No refresh token received"
- **Cause**: Google didn't issue a refresh token (common if you've authorized before)
- **Fix**: 
  1. Clear tokens using `/api/analytics/clear`
  2. Go to [Google Account Settings](https://myaccount.google.com/permissions)
  3. Find "Afrique Avenir Immobilier" or your app name
  4. Click "Remove access"
  5. Reauthorize from scratch

### Error: "insufficient_scope" or "unauthorized_client"
- **Cause**: The token doesn't have the required scopes
- **Fix**: 
  1. Clear tokens
  2. Reauthorize (the app now requests all required scopes automatically)
  3. Make sure you grant ALL permissions when prompted

### Error: "Property not found" or "403 Forbidden"
- **Cause**: The Google account doesn't have access to the GA4 property
- **Fix**:
  1. Go to [Google Analytics](https://analytics.google.com/)
  2. Click Admin (gear icon) → Property Access Management
  3. Add your Google account with at least "Viewer" or "Analyst" role
  4. Wait a few minutes for permissions to propagate

### Error: Still getting 401 after reauthorization
- **Cause**: Token format or storage issue
- **Fix**:
  1. Check server logs for detailed error messages
  2. Verify `GOOGLE_ANALYTICS_PROPERTY_ID` is set correctly in production
  3. Try force refresh: `https://afriqueavenirimmobilier.com/api/analytics/force-refresh`
  4. If still failing, clear tokens and reauthorize again

## Verification Checklist

After reauthorization, verify:

- [ ] `/api/analytics/debug` shows `tokenRecord` with valid tokens
- [ ] `/api/analytics/test-token` returns `success: true` with GA4 test passing
- [ ] `/api/analytics/force-refresh` returns success
- [ ] Dashboard at `/en/analytics/dashboard` loads data without errors
- [ ] No 401 errors in browser console

## What Changed in the Fix

The following improvements were made to fix authentication issues:

1. **Unified Redirect URI**: All OAuth flows now use `/oauth2callback` consistently
2. **Complete Scopes**: Added all required scopes (analytics.readonly, analytics, userinfo.email, userinfo.profile, openid)
3. **Forced Consent**: OAuth flow now forces consent screen to ensure refresh token is issued
4. **Proper Token Storage**: Tokens are stored exactly as returned by Google
5. **Automatic Token Refresh**: GA4 client automatically refreshes tokens before API calls
6. **Better Error Handling**: Enhanced logging and error messages for debugging

## Support

If you continue to experience issues after following this guide:

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (should be `https://afriqueavenirimmobilier.com/oauth2callback`)
   - `GOOGLE_ANALYTICS_PROPERTY_ID`
3. Ensure the Google account has access to the GA4 property
4. Verify the redirect URI matches exactly in Google Cloud Console

