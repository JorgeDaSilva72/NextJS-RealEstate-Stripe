# OAuth Debug Steps

## Current Status
- ✅ Environment variables are set correctly
- ✅ User is authenticated (`kp_8fdbfd33409a4dfc91acd43ae4ed863b`)
- ❌ **NO tokens in database** (`sampleCount: 0`)
- ❌ Dashboard shows generic error

## Problem
The OAuth callback is either:
1. Not being called at all
2. Failing before storing tokens
3. Storing tokens but they're not persisting

## Debug Steps

### Step 1: Test OAuth Flow Setup
```bash
curl https://afriqueavenirimmobilier.com/api/debug-oauth-flow
```

This will show:
- OAuth URL to use
- Redirect URI being used
- Whether user exists in database
- Any existing tokens

### Step 2: Check OAuth Callback Route
The callback should be at:
- `https://afriqueavenirimmobilier.com/oauth2callback`

**IMPORTANT**: Make sure this EXACT URL is registered in Google Cloud Console:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- APIs & Services → Credentials
- Click your OAuth 2.0 Client ID
- Under "Authorized redirect URIs", ensure you have:
  - `https://afriqueavenirimmobilier.com/oauth2callback` (NO trailing slash)

### Step 3: Test OAuth Flow Manually

1. **Get OAuth URL**:
   ```bash
   curl https://afriqueavenirimmobilier.com/api/debug-oauth-flow
   ```
   Copy the `oauthUrl` from the response

2. **Open OAuth URL in browser** (while logged in)
   - This will redirect to Google
   - Authorize the app
   - Google will redirect back to `/oauth2callback?code=...`

3. **Check server logs** for:
   - `[OAuth Callback] Processing OAuth callback`
   - `[OAuth Callback] ====== STORING TOKENS ======`
   - `[storeTokens] Starting token storage`
   - `[storeTokens] Token stored successfully`
   - `[OAuth Callback] ====== VERIFICATION SUCCESS ======`

### Step 4: Check Server Logs

Look for these log prefixes:
- `[OAuth Callback]` - Callback processing
- `[storeTokens]` - Token storage
- `[getStoredTokens]` - Token retrieval

**If you see NO logs**, the callback route is not being hit. Check:
- Is the redirect URI correct in Google Console?
- Is the route file in the correct location? (`src/app/oauth2callback/route.ts`)

### Step 5: Verify Database Connection

The tokens are stored in Prisma. Check:
1. Is `DATABASE_URL` set in production?
2. Has Prisma migrated the `GoogleAnalyticsToken` table?
3. Can the app write to the database?

Test with:
```bash
curl https://afriqueavenirimmobilier.com/api/debug-analytics
```

Check the `dbCheck` field - if `hasTokensTable: false`, the table doesn't exist.

### Step 6: Common Issues

#### Issue 1: Redirect URI Mismatch
**Symptom**: Google shows "redirect_uri_mismatch" error

**Fix**: 
- Ensure Google Console has EXACTLY: `https://afriqueavenirimmobilier.com/oauth2callback`
- No trailing slash
- No `/en/` prefix
- Must match exactly what's in `GOOGLE_REDIRECT_URI` or `NEXT_PUBLIC_BASE_URL/oauth2callback`

#### Issue 2: Callback Not Being Hit
**Symptom**: No logs when completing OAuth

**Fix**:
- Check if route exists: `src/app/oauth2callback/route.ts`
- Verify the route exports `GET` function
- Check Next.js routing - ensure it's at root level, not under `[locale]`

#### Issue 3: Database Write Fails
**Symptom**: Logs show storage attempt but verification fails

**Fix**:
- Check `DATABASE_URL` environment variable
- Verify Prisma can connect
- Check database permissions
- Ensure `GoogleAnalyticsToken` table exists

#### Issue 4: User ID Mismatch
**Symptom**: Tokens stored but can't be retrieved

**Fix**:
- Check logs for actual user ID being used
- Compare with user ID in database
- Ensure Kinde user ID matches database user ID

## Next Steps

1. Run `/api/debug-oauth-flow` to get OAuth URL
2. Complete OAuth flow manually
3. Check server logs for detailed error messages
4. Share the logs if tokens still aren't stored

## Expected Log Flow

When OAuth completes successfully, you should see:

```
[OAuth Callback] Processing OAuth callback (root route)...
[OAuth Callback] ====== STORING TOKENS ======
[OAuth Callback] User ID: kp_8fdbfd33409a4dfc91acd43ae4ed863b
[storeTokens] Starting token storage for user: kp_8fdbfd33409a4dfc91acd43ae4ed863b
[storeTokens] Token stored successfully
[OAuth Callback] ====== VERIFICATION SUCCESS ======
[OAuth Callback] Redirecting to dashboard...
```

If any step is missing, that's where the problem is.

