# Google Cloud Translation API Setup Guide

## Prerequisites
- Google Cloud Project with Translation API enabled
- Appropriate authentication configured

## Authentication Setup

This integration uses **Application Default Credentials (ADC)** - no private keys needed in code!

### Option 1: Local Development with gcloud CLI (Recommended)

1. Install Google Cloud SDK if not already installed:
   - Windows: Download from https://cloud.google.com/sdk/docs/install
   - Mac: `brew install google-cloud-sdk`
   - Linux: Follow instructions at https://cloud.google.com/sdk/docs/install

2. Authenticate with your Google Account:
   ```bash
   gcloud auth application-default login
   ```

3. Set your project ID:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

### Option 2: Service Account (Production)

For production deployment (Vercel, etc.):

1. Create a service account in Google Cloud Console
2. Grant it the "Cloud Translation API User" role
3. Download the service account key JSON file
4. Set the environment variable:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```

### Option 3: Vercel/Cloud Platform

Most cloud platforms have built-in authentication. For Vercel:

1. Add Google Cloud credentials to Vercel environment variables
2. Set `GOOGLE_PROJECT_ID` in Vercel dashboard
3. Use service account impersonation or workload identity

## Environment Variables

Add to your `.env.local` file:

```env
GOOGLE_PROJECT_ID=your-google-cloud-project-id
```

**Important**: Do NOT add `GOOGLE_CLIENT_EMAIL` or `GOOGLE_PRIVATE_KEY` - we're using ADC!

## Enable Translation API

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Navigate to "APIs & Services" > "Library"
3. Search for "Cloud Translation API"
4. Click "Enable"

## Verify Setup

Test your translation API:

```bash
curl -X POST http://localhost:3000/api/translate \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Bonjour le monde","target":"en"}'
```

Expected response:
```json
{"translation":"Hello world"}
```

## Troubleshooting

### "Permission denied" error
- Ensure Translation API is enabled in your GCP project
- Verify your service account has the correct role
- Check that `GOOGLE_PROJECT_ID` is set correctly

### "Could not load the default credentials" error  
- Run `gcloud auth application-default login`
- Or set `GOOGLE_APPLICATION_CREDENTIALS` to your service account key path

### Translation returns original text
- Check browser console for errors
- Verify `/api/translate` endpoint is reachable
- Check server logs for translation errors

## Pricing

Google Cloud Translation API pricing (as of 2024):
- First 500,000 characters per month: FREE
- Additional characters: $20 per 1 million characters

For a real estate website, typical usage:
- Average property title: ~50 characters
- Average description: ~500 characters
- 1,000 properties = ~550,000 characters = FREE tier

## Security Best Practices

✅ **DO**:
- Use Application Default Credentials (ADC)
- Set `GOOGLE_PROJECT_ID` in environment variables
- Use service account impersonation in production
- Restrict API keys to specific APIs

❌ **DON'T**:
- Hardcode credentials in source code
- Commit service account keys to version control
- Expose private keys in client-side code
- Share service account keys publicly

## Additional Resources

- [Google Cloud Translation API Documentation](https://cloud.google.com/translate/docs)
- [Authentication Overview](https://cloud.google.com/docs/authentication)
- [Pricing Calculator](https://cloud.google.com/products/calculator)
