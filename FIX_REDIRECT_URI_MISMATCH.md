# Fix: redirect_uri_mismatch Error

## Problem
Error 400: `redirect_uri_mismatch` occurs when the redirect URI in your code doesn't match what's configured in Google Cloud Console.

## Solution

### Step 1: Check Your Current Redirect URI

The code uses:
- Default: `http://localhost:3000/api/analytics/oauth2callback`
- Or from env: `GOOGLE_REDIRECT_URI` environment variable

### Step 2: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `afriqueavenirimmobilier`
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/analytics/oauth2callback` (for development)
   - `https://yourdomain.com/api/analytics/oauth2callback` (for production)

### Step 3: Verify Environment Variable

Make sure your `.env.local` has:

```env
GOOGLE_REDIRECT_URI=http://localhost:3000/api/analytics/oauth2callback
```

**Important:** The URI must match EXACTLY (including http/https, port, and path)

### Step 4: Common Issues

#### Issue: Using different port
- If your app runs on port 3001, use: `http://localhost:3001/api/analytics/oauth2callback`
- Update both `.env.local` and Google Cloud Console

#### Issue: Using production domain
- If testing on a domain, use: `https://yourdomain.com/api/analytics/oauth2callback`
- Make sure it's added in Google Cloud Console

#### Issue: Trailing slash
- ✅ Correct: `http://localhost:3000/api/analytics/oauth2callback`
- ❌ Wrong: `http://localhost:3000/api/analytics/oauth2callback/`

### Step 5: Restart Server

After making changes:
1. Stop your dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Try connecting again

## Quick Checklist

- [ ] Redirect URI added in Google Cloud Console
- [ ] `GOOGLE_REDIRECT_URI` set in `.env.local`
- [ ] URI matches exactly (no trailing slash, correct port)
- [ ] Server restarted after changes
- [ ] Using correct protocol (http for localhost, https for production)

## Still Having Issues?

1. Check the browser console for the exact redirect URI being used
2. Compare it character-by-character with Google Cloud Console
3. Make sure there are no extra spaces or special characters
4. Wait a few minutes after updating Google Cloud Console (changes can take time to propagate)

