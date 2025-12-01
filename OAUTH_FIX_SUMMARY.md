# Google Analytics OAuth Integration - Complete Fix

## ✅ Changes Applied

### 1. New OAuth Callback Route
- **Created**: `/app/api/auth/callback/google/route.ts`
- **Redirect URI**: `https://afriqueavenirimmobilier.com/api/auth/callback/google`
- **Features**:
  - Receives `userId` from `state` parameter
  - Exchanges code for tokens
  - Validates refresh token is present
  - Stores tokens in Prisma database
  - Verifies token storage
  - Redirects to dashboard with success

### 2. Updated OAuth Scopes
- **File**: `src/lib/google-analytics/oauth.ts`
- **New Scopes**:
  ```typescript
  [
    "openid",
    "email", 
    "profile",
    "https://www.googleapis.com/auth/analytics.readonly",
  ]
  ```

### 3. Updated OAuth URL Generation
- **File**: `src/lib/google-analytics/oauth.ts`
- **Changes**:
  - `getAuthUrl()` now requires `userId` parameter
  - Includes `userId` in `state` parameter
  - Uses new redirect URI: `/api/auth/callback/google`

### 4. Updated Auth Route
- **File**: `src/app/api/analytics/auth/route.ts`
- **Changes**:
  - Passes `user.id` to `getAuthUrl(user.id)`
  - Ensures userId is included in OAuth state

### 5. Updated Redirect URI Configuration
- **File**: `src/lib/google-analytics/env-validation.ts`
- **New Default**: `/api/auth/callback/google`

### 6. Enhanced Debug Endpoint
- **File**: `src/app/api/debug-analytics/route.ts`
- **Added**: POST method to get all tokens count
- **Returns**: Token count, token list, and environment check

## 🔧 Required Configuration

### Google Cloud Console Setup

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Navigate to**: APIs & Services → Credentials
3. **Select**: Your OAuth 2.0 Client ID
4. **Update Authorized redirect URIs**:
   ```
   https://afriqueavenirimmobilier.com/api/auth/callback/google
   ```
5. **Remove old redirect URIs** (if any):
   - `/oauth2callback`
   - `/api/analytics/oauth2callback`

### Environment Variables

Update your production environment variables:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://afriqueavenirimmobilier.com/api/auth/callback/google
GOOGLE_ANALYTICS_PROPERTY_ID=your-property-id
NEXT_PUBLIC_BASE_URL=https://afriqueavenirimmobilier.com
```

**OR** if you don't set `GOOGLE_REDIRECT_URI`, it will auto-generate from `NEXT_PUBLIC_BASE_URL`.

## 🧪 Testing Steps

### 1. Test OAuth Flow
1. Visit: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`
2. Click "Connect Google Analytics"
3. Complete OAuth flow
4. Should redirect back to dashboard with `?connected=1&success=true`

### 2. Verify Token Storage
```bash
# Check tokens via POST request
curl -X POST https://afriqueavenirimmobilier.com/api/debug-analytics
```

**Expected Response**:
```json
{
  "ok": true,
  "count": 1,
  "tokens": [
    {
      "userId": "user-id-here",
      "hasAccessToken": true,
      "hasRefreshToken": true,
      "expiryDate": "2024-..."
    }
  ],
  "env": { ... }
}
```

### 3. Test Dashboard
1. Visit: `https://afriqueavenirimmobilier.com/en/analytics/dashboard`
2. Should show analytics data (not "Connect" button)

## 🔍 Troubleshooting

### Issue: "No refresh token received"
**Solution**: 
- Go to Google Cloud Console → OAuth consent screen
- Remove all Test Users
- Try connecting again

### Issue: "redirect_uri_mismatch"
**Solution**:
- Verify redirect URI in Google Console matches exactly:
  `https://afriqueavenirimmobilier.com/api/auth/callback/google`
- No trailing slash
- Exact match required

### Issue: "Token storage verification failed"
**Solution**:
- Check database connection
- Verify Prisma migrations ran
- Check server logs for database errors

## 📝 Next Steps

1. **Deploy these changes**
2. **Update Google Cloud Console** redirect URI
3. **Test OAuth flow**
4. **Verify tokens are stored** (use POST to `/api/debug-analytics`)
5. **Remove debug endpoints** after confirming everything works

## 🗑️ Cleanup (After Testing)

Once everything works, you can remove:
- `/app/api/debug-analytics/route.ts` (debug endpoint)
- `/app/api/debug-env/route.ts` (debug endpoint)
- Old callback routes (if not needed):
  - `/app/oauth2callback/route.ts`
  - `/app/[locale]/oauth2callback/route.ts`
  - `/app/api/analytics/oauth2callback/route.ts`



