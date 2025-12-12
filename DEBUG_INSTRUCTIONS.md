# Debug Instructions for Analytics Dashboard Error

## Quick Steps

1. **Test the debug endpoints** (after deployment):
   ```bash
   # Check environment variables
   curl https://afriqueavenirimmobilier.com/api/debug-env
   
   # Test analytics functions
   curl https://afriqueavenirimmobilier.com/api/debug-analytics
   ```

2. **Check server logs** for these prefixes:
   - `[RootLayout]` - Layout rendering errors
   - `[AnalyticsDashboard]` - Dashboard component errors
   - `[OAuth Callback]` - OAuth callback errors
   - `[Analytics Status]` - Status check errors
   - `DEBUG-ANALYTICS-ERROR:` - Debug API errors

3. **Check log files** (if file logging works):
   - `debug-analytics.log` - Debug API errors
   - `dashboard-error.log` - Dashboard page errors
   - `dashboard-fetch-error.log` - Dashboard fetch errors

## Finding Logs by Platform

### Vercel
```bash
# View logs in dashboard
# Or use CLI:
vercel logs <deployment-url>

# Search for error digest
vercel logs | grep "DASHBOARD-SERVER-ERROR"
```

### Railway
- Check logs in Railway dashboard
- Or use: `railway logs`

### Docker
```bash
docker logs <container-name>
docker logs <container-name> | grep "DEBUG-ANALYTICS-ERROR"
```

### Systemd / PM2
```bash
# Systemd
journalctl -u your-service -f | grep "DEBUG-ANALYTICS-ERROR"

# PM2
pm2 logs | grep "DEBUG-ANALYTICS-ERROR"
```

### Direct Server Access
```bash
# SSH into server and check log files
cat debug-analytics.log
cat dashboard-error.log
tail -f debug-analytics.log  # Follow logs in real-time
```

## Using the Debug Endpoints

### 1. Check Environment Variables
```bash
curl https://afriqueavenirimmobilier.com/api/debug-env
```

This will show:
- Which environment variables are set
- Which are missing
- The redirect URI being used
- Validation errors

### 2. Test Analytics Functions
```bash
curl https://afriqueavenirimmobilier.com/api/debug-analytics
```

This will:
- Check authentication
- Check stored tokens
- Check access token validity
- Try to call GA4 API
- Return detailed error at each step

## What to Look For

### Common Errors:

1. **Missing Environment Variables**
   - Check `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_ANALYTICS_PROPERTY_ID`
   - Solution: Add missing vars to production environment

2. **Invalid Redirect URI**
   - Error: `redirect_uri_mismatch`
   - Solution: Ensure `GOOGLE_REDIRECT_URI` matches Google Cloud Console

3. **Token Issues**
   - Error: `No valid access token`
   - Solution: User needs to reconnect Google Analytics

4. **GA4 API Permission Errors**
   - Error: `403 Forbidden` or `PERMISSION_DENIED`
   - Solution: Grant service account access in Google Analytics

5. **Property ID Issues**
   - Error: `Invalid property ID`
   - Solution: Use numeric GA4 property ID (not measurement ID)

## After Finding the Error

1. **Copy the exact error message and stack trace**
2. **Check which step failed** (from debug-analytics response)
3. **Fix the root cause**
4. **Remove debug endpoints** after fixing:
   - Delete `src/app/api/debug-analytics/route.ts`
   - Delete `src/app/api/debug-env/route.ts`
   - Delete log files

## Testing Locally in Production Mode

```bash
# Build for production
npm run build

# Start production server
npm run start

# Test locally
curl http://localhost:3000/api/debug-env
curl http://localhost:3000/api/debug-analytics

# Visit dashboard
open http://localhost:3000/en/analytics/dashboard
```

## Error Digest Mapping

If you see a digest in the browser (e.g., `Digest: 2762112722`):

1. Search server logs for that digest
2. The log entry will contain the full error message
3. Look for entries around the same timestamp as the error

## Next Steps

1. Deploy these debug endpoints
2. Call `/api/debug-env` and `/api/debug-analytics`
3. Check server logs for error messages
4. Share the exact error message and I'll help fix it

