# Fixing 404 Error for WhatsApp Webhook in Production

## Problem
- ✅ Works locally: `http://localhost:3000/api/whatsapp/webhook` returns `test123"`
- ❌ Returns 404 in production: `https://afrique-avenir.com/api/whatsapp/webhook` returns "This page could not be found"

## Root Cause
A 404 in production but working locally typically means:
1. **Route file not deployed** - File wasn't committed to git or included in deployment
2. **Build cache issue** - Old build cache excluding the route
3. **Deployment platform issue** - Route not recognized by deployment platform
4. **File path issue** - Route file in wrong location or named incorrectly

## Step-by-Step Fix

### Step 1: Verify File Exists and is Committed

```bash
# Check if file exists locally
ls -la src/app/api/whatsapp/webhook/route.ts

# Check git status
git status src/app/api/whatsapp/webhook/route.ts

# If file is not tracked, add it:
git add src/app/api/whatsapp/webhook/route.ts
git commit -m "Add WhatsApp webhook route"
git push
```

### Step 2: Verify Route File Structure

Ensure the file is at exactly:
```
src/app/api/whatsapp/webhook/route.ts
```

**NOT:**
- ❌ `src/pages/api/whatsapp/webhook.ts` (Pages Router)
- ❌ `src/app/api/whatsapp/webhook.ts` (Missing folder)
- ❌ `src/app/api/whatsapp/webhook/index.ts` (Wrong filename)

### Step 3: Clear Build Cache and Rebuild

```bash
# Delete build cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build

# Test build locally
npm start
# Then test: http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123
```

### Step 4: Verify Route Exports

Ensure `route.ts` has these exports:
```typescript
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) { ... }
export async function POST(request: NextRequest) { ... }
```

### Step 5: Test Diagnostic Endpoint

After deployment, test these endpoints:

```bash
# 1. Test debug endpoint (should work)
curl https://afrique-avenir.com/api/whatsapp/webhook-debug

# 2. Test health endpoint (should work)
curl https://afrique-avenir.com/api/whatsapp/health

# 3. Test webhook endpoint (should NOT return 404)
curl "https://afrique-avenir.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123"
```

**Expected Results:**
- ✅ Debug endpoint: Returns JSON with route info
- ✅ Health endpoint: Returns JSON with status
- ✅ Webhook endpoint: Returns plain text `test123` (NOT 404)

### Step 6: Check Deployment Logs

#### Vercel
```bash
# Check build logs
vercel logs

# Or check in Vercel dashboard:
# Deployments → Select deployment → Build Logs
# Look for: "Compiling /api/whatsapp/webhook"
```

#### Other Platforms
- Check build logs for route compilation
- Look for errors about missing routes
- Verify `src/app/api/whatsapp/webhook/route.ts` is included in build

### Step 7: Verify Middleware Configuration

Ensure `src/middleware.ts` skips `/api` routes:

```typescript
if (pathname.startsWith("/api")) {
  return NextResponse.next(); // ✅ This allows API routes
}
```

### Step 8: Force Redeploy

If route still doesn't work:

1. **Make a small change** to trigger rebuild:
   ```typescript
   // Add a comment to route.ts
   // Updated: 2024-01-XX
   ```

2. **Commit and push:**
   ```bash
   git add src/app/api/whatsapp/webhook/route.ts
   git commit -m "Force webhook route rebuild"
   git push
   ```

3. **Wait for deployment** and test again

## Platform-Specific Fixes

### Vercel
1. Go to Project Settings → Build & Development Settings
2. Ensure "Build Command" is: `npm run build` or `next build`
3. Ensure "Output Directory" is: `.next` (or leave default)
4. Clear deployment cache: Settings → Clear Build Cache
5. Redeploy

### Netlify
1. Check `netlify.toml` doesn't exclude API routes
2. Ensure build command: `npm run build`
3. Clear cache and redeploy

### Railway/Render
1. Check build logs for route compilation
2. Verify Node.js version compatibility
3. Clear build cache and redeploy

## Verification Checklist

After fixing, verify:

- [ ] File exists at `src/app/api/whatsapp/webhook/route.ts`
- [ ] File is committed to git
- [ ] File is pushed to repository
- [ ] Build completes without errors
- [ ] Route appears in build logs
- [ ] `/api/whatsapp/webhook-debug` returns 200
- [ ] `/api/whatsapp/health` returns 200
- [ ] `/api/whatsapp/webhook` returns 200 (not 404)
- [ ] Webhook verification works in Facebook Developer Console

## Still Getting 404?

If you still get 404 after all steps:

1. **Check deployment platform logs** for route registration
2. **Verify Next.js version** - Ensure using Next.js 13+ (App Router)
3. **Check for conflicting routes** - Ensure no `pages/api/whatsapp/webhook.ts`
4. **Test with simple route** - Create minimal test route to verify deployment works
5. **Contact deployment platform support** - May be platform-specific issue

## Quick Test Commands

```bash
# Test locally (should work)
curl "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123"

# Test production (should NOT return 404)
curl "https://afrique-avenir.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123"

# Test debug endpoint
curl https://afrique-avenir.com/api/whatsapp/webhook-debug
```

