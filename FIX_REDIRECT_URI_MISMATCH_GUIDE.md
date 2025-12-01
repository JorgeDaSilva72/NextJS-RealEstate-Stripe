# Fix Redirect URI Mismatch Error

## Problem
You're getting: `Error 400: redirect_uri_mismatch`

This means the redirect URI your app is sending to Google doesn't match what's registered in Google Cloud Console.

## Step 1: Check What Redirect URI Your App Is Using

Visit this URL in your browser (while logged in):
```
https://afriqueavenirimmobilier.com/api/debug-env
```

This will show you:
- The exact `GOOGLE_REDIRECT_URI` value from your environment
- The computed redirect URI that's being used
- All environment variables

## Step 2: Verify Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Scroll down to **Authorized redirect URIs**

## Step 3: Add the Correct Redirect URI

Based on your environment variable, you should have **EXACTLY** this URI (no trailing slash, exact match):

```
https://afriqueavenirimmobilier.com/oauth2callback
```

### Important Notes:
- ✅ Must be **exactly** `https://afriqueavenirimmobilier.com/oauth2callback`
- ❌ NOT `https://afriqueavenirimmobilier.com/oauth2callback/` (no trailing slash)
- ❌ NOT `http://afriqueavenirimmobilier.com/oauth2callback` (must be https)
- ❌ NOT `https://www.afriqueavenirimmobilier.com/oauth2callback` (no www)

## Step 4: Remove Old/Incorrect URIs

Remove any redirect URIs that don't match:
- `/api/auth/callback/google` (if you have this, remove it)
- Any localhost URIs (unless you're testing locally)
- Any other variations

## Step 5: Save and Wait

1. Click **Save** in Google Cloud Console
2. Wait 1-2 minutes for changes to propagate
3. Try the OAuth flow again

## Step 6: Verify the Fix

1. Go to: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`
2. Click "Connect Google Analytics"
3. You should now be redirected to Google's OAuth consent screen (not the error)

## Troubleshooting

### Still Getting the Error?

1. **Double-check the exact URI**: Copy-paste the URI from `/api/debug-env` and make sure it matches Google Cloud Console exactly (character by character)

2. **Check for typos**: Common mistakes:
   - Missing `https://`
   - Extra spaces
   - Wrong domain (www vs non-www)
   - Trailing slash

3. **Clear browser cache**: Sometimes cached OAuth errors persist

4. **Check environment variables**: Make sure `GOOGLE_REDIRECT_URI` is set correctly in your production environment (Vercel/hosting platform)

### Need to Change the Redirect URI?

If you want to use a different redirect URI:

1. Update `GOOGLE_REDIRECT_URI` in your production environment
2. Add the new URI to Google Cloud Console
3. Remove the old URI from Google Cloud Console
4. Redeploy your application

## Current Configuration

Based on your environment:
- **Environment Variable**: `GOOGLE_REDIRECT_URI=https://afriqueavenirimmobilier.com/oauth2callback`
- **Expected in Google Cloud Console**: `https://afriqueavenirimmobilier.com/oauth2callback`
- **Callback Route**: `/oauth2callback` (handled by `src/app/oauth2callback/route.ts`)

