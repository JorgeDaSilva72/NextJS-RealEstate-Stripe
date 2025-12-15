# WhatsApp Webhook Deployment Fix

## Issues Fixed

1. ✅ Removed duplicate API routes (`pages/api` vs `app/api`)
2. ✅ Added explicit runtime configuration
3. ✅ Improved error handling with plain text responses
4. ✅ Added OPTIONS handler for CORS
5. ✅ Enhanced logging for debugging

## Testing Locally

### Test GET Request (Webhook Verification)
```bash
curl "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test_challenge_123"
```

**Expected Response:** Plain text `test_challenge_123` (not JSON)

### Test POST Request (Webhook Events)
```bash
curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[]}'
```

**Expected Response:** `{"success": true}`

## Production Deployment Checklist

### 1. Environment Variables
Ensure these are set in your production environment:
```env
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_verify_123
WHATSAPP_APP_SECRET=your_app_secret
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
```

### 2. Verify Route File Location
Ensure the route file exists at:
```
src/app/api/whatsapp/webhook/route.ts
```

### 3. Test After Deployment

#### Test GET (Facebook Verification)
```bash
curl "https://afrique-avenir.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123"
```

**Expected:** Plain text response `test123` (status 200)

#### Test POST
```bash
curl -X POST https://afrique-avenir.com/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{"object":"whatsapp_business_account","entry":[]}'
```

**Expected:** `{"success": true}` (status 200)

### 4. Facebook Developer Console Setup

1. Go to Meta Developer Console
2. Navigate to WhatsApp → Configuration → Webhooks
3. Set **Callback URL**: `https://afrique-avenir.com/api/whatsapp/webhook`
4. Set **Verify Token**: `whatsapp_verify_123` (must match `WHATSAPP_WEBHOOK_VERIFY_TOKEN`)
5. Click **Verify and Save**

## Troubleshooting 405 Method Not Allowed

If you still get 405 in production:

### Solution 1: Clear Build Cache
```bash
# Delete .next folder and rebuild
rm -rf .next
npm run build
```

### Solution 2: Check Deployment Platform
- **Vercel**: Ensure route is in `app/api` directory (not `pages/api`)
- **Netlify**: May need `netlify.toml` configuration
- **Railway/Render**: Ensure Node.js version is compatible

### Solution 3: Verify Route Exports
Ensure `route.ts` exports:
- `export async function GET()`
- `export async function POST()`
- `export const runtime = 'nodejs'`

### Solution 4: Check Server Logs
Look for errors like:
- "Route not found"
- "Method not allowed"
- "Route handler not exported"

### Solution 5: Test Route Directly
```bash
# Should return 400 (missing params) not 405
curl "https://afrique-avenir.com/api/whatsapp/webhook"

# Should return challenge (200) not 405
curl "https://afrique-avenir.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test"
```

## Common Issues

### Issue: Returns JSON instead of plain text
**Solution:** Facebook requires plain text challenge. The route now returns:
```typescript
return new NextResponse(challenge, {
  headers: { 'Content-Type': 'text/plain' }
});
```

### Issue: Verification fails
**Solution:** 
1. Check `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches Facebook console
2. Ensure token has no extra spaces or quotes
3. Check server logs for token comparison

### Issue: 405 in production but works locally
**Solution:**
1. Clear build cache
2. Rebuild and redeploy
3. Check deployment platform logs
4. Verify route file is included in build

## Next Steps

1. ✅ Deploy the updated code
2. ✅ Set environment variables in production
3. ✅ Test GET endpoint with curl
4. ✅ Configure webhook in Facebook Developer Console
5. ✅ Verify webhook receives events

