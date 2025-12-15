# 🔐 WhatsApp Integration - Environment Variables Setup

This document provides detailed instructions for setting up environment variables required for the WhatsApp Business API integration.

---

## 📋 **REQUIRED ENVIRONMENT VARIABLES**

Add these variables to your `.env.local` (development) and production environment:

```bash
# ============================================
# WHATSAPP BUSINESS API CONFIGURATION
# ============================================

# API Version (usually v18.0 or later)
WHATSAPP_API_VERSION=v18.0

# WhatsApp Business Account ID
# Found in: Meta Business Suite > WhatsApp > API Setup
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id_here

# WhatsApp Phone Number ID
# Found in: Meta Business Suite > WhatsApp > API Setup > Phone Number
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here

# Permanent Access Token
# Generated in: Meta Developers > Your App > WhatsApp > API Setup
# ⚠️ IMPORTANT: Keep this secret! Never commit to version control
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here

# App ID and App Secret
# Found in: Meta Developers > Your App > Settings > Basic
WHATSAPP_APP_ID=your_app_id_here
WHATSAPP_APP_SECRET=your_app_secret_here

# ============================================
# WEBHOOK CONFIGURATION
# ============================================

# Webhook Verify Token (Create a random, secure string)
# This is used to verify webhook requests from Meta
# Example: Use a password generator to create a 32-character string
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_secure_token_here

# Your webhook URL (must be HTTPS in production)
# Example: https://yourdomain.com/api/whatsapp/webhook
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp/webhook

# ============================================
# SECURITY
# ============================================

# Encryption Key for storing sensitive data (32 characters minimum)
# Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
WHATSAPP_ENCRYPTION_KEY=your_32_character_encryption_key_here

# ============================================
# OPTIONAL CONFIGURATIONS
# ============================================

# Enable/Disable WhatsApp feature
WHATSAPP_ENABLED=true

# Enable debug mode (logs detailed information)
# Set to false in production
WHATSAPP_DEBUG_MODE=false

# Redis URL for rate limiting and caching (optional)
# If not provided, in-memory caching will be used
# REDIS_URL=redis://localhost:6379

# Application URL (for generating property links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🚀 **STEP-BY-STEP SETUP GUIDE**

### **Step 1: Create a Meta Developer Account**

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Sign in with your Facebook account
3. Click "My Apps" > "Create App"
4. Select "Business" as the app type
5. Fill in app details and create

### **Step 2: Set Up WhatsApp Business API**

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. Follow the setup wizard to:
   - Link your WhatsApp Business Account
   - Add a phone number (or use Meta's test number)
   - Verify your business

### **Step 3: Get Your Credentials**

#### **Business Account ID & Phone Number ID**
```
Location: Meta Business Suite > WhatsApp > API Setup
- Business Account ID: Found at the top of the page
- Phone Number ID: Listed under your phone number
```

#### **Access Token**
```
Location: Meta Developers > Your App > WhatsApp > API Setup
Steps:
1. Go to "API Setup" tab
2. Click "Generate Access Token"
3. For production: Create a System User and generate a permanent token
4. Copy the token immediately (you won't see it again!)
```

#### **App ID & App Secret**
```
Location: Meta Developers > Your App > Settings > Basic
- App ID: Listed at the top
- App Secret: Click "Show" to reveal
```

### **Step 4: Configure Webhooks**

1. **Set Your Webhook URL**
   ```
   Go to: Meta Developers > Your App > WhatsApp > Configuration
   
   Webhook URL: https://yourdomain.com/api/whatsapp/webhook
   Verify Token: Use the same token you set in WHATSAPP_WEBHOOK_VERIFY_TOKEN
   ```

2. **Subscribe to Webhook Fields**
   - ✅ messages
   - ✅ message_status (for delivery/read receipts)
   - ✅ messaging_postback (optional)

3. **Verify Webhook**
   - Click "Verify and Save"
   - Meta will send a GET request to your webhook URL
   - Your server must respond with the challenge parameter

### **Step 5: Generate Encryption Key**

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as `WHATSAPP_ENCRYPTION_KEY`.

### **Step 6: Test Your Setup**

1. **Check Environment Variables**
   ```bash
   # Create a test script: test-env.js
   require('dotenv').config({ path: '.env.local' });
   
   console.log('Environment Variables Check:');
   console.log('✓ API Version:', process.env.WHATSAPP_API_VERSION);
   console.log('✓ Phone Number ID:', process.env.WHATSAPP_PHONE_NUMBER_ID ? 'Set' : 'Missing');
   console.log('✓ Access Token:', process.env.WHATSAPP_ACCESS_TOKEN ? 'Set' : 'Missing');
   console.log('✓ Webhook Token:', process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ? 'Set' : 'Missing');
   console.log('✓ Encryption Key:', process.env.WHATSAPP_ENCRYPTION_KEY ? 'Set' : 'Missing');
   ```

   ```bash
   node test-env.js
   ```

2. **Test Webhook (Local Development)**
   ```bash
   # Install ngrok for local testing
   npm install -g ngrok
   
   # Start your Next.js server
   npm run dev
   
   # In another terminal, start ngrok
   ngrok http 3000
   
   # Use the ngrok URL as your webhook URL in Meta Dashboard
   # Example: https://abc123.ngrok.io/api/whatsapp/webhook
   ```

3. **Send Test Message**
   ```bash
   # Using curl or Postman
   curl -X POST https://yourdomain.com/api/whatsapp/send \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
     -d '{
       "to": "+221771234567",
       "message": "Test message from WhatsApp API",
       "type": "text"
     }'
   ```

---

## 🔒 **SECURITY BEST PRACTICES**

### ✅ **DO**
- Use environment variables for all sensitive data
- Generate a strong, random encryption key
- Use HTTPS for webhook URLs in production
- Rotate access tokens periodically
- Enable webhook signature validation
- Store access tokens encrypted in the database
- Use different tokens for development and production

### ❌ **DON'T**
- Commit `.env.local` or `.env` to version control
- Share access tokens publicly
- Use weak webhook verify tokens
- Disable signature validation in production
- Store tokens in plain text
- Use test credentials in production

---

## 🐛 **TROUBLESHOOTING**

### Problem: Webhook Verification Fails

**Solution:**
```typescript
// Check your webhook route returns the challenge
export async function GET(request: NextRequest) {
  const challenge = request.nextUrl.searchParams.get('hub.challenge');
  const verifyToken = request.nextUrl.searchParams.get('hub.verify_token');
  
  if (verifyToken === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge);
  }
  return new NextResponse('Forbidden', { status: 403 });
}
```

### Problem: Messages Not Sending

**Checklist:**
- [ ] Verify `WHATSAPP_ACCESS_TOKEN` is correct
- [ ] Check `WHATSAPP_PHONE_NUMBER_ID` matches your phone
- [ ] Ensure phone number is in international format (+country code)
- [ ] Check Meta Developer Console for error logs
- [ ] Verify your app is not rate-limited

### Problem: Access Token Expired

**Solution:**
Generate a permanent System User token:
1. Go to Meta Business Suite
2. Settings > System Users
3. Create new system user
4. Assign WhatsApp permissions
5. Generate permanent token (never expires)

### Problem: Webhook Not Receiving Messages

**Checklist:**
- [ ] Webhook URL is publicly accessible (HTTPS)
- [ ] Webhook fields are subscribed (messages, message_status)
- [ ] Signature validation is working
- [ ] Check server logs for errors
- [ ] Verify webhook in Meta Developer Console

---

## 📊 **MONITORING & LOGS**

### Enable Debug Mode
```bash
WHATSAPP_DEBUG_MODE=true
```

This will log:
- All API requests to Meta
- Webhook payloads received
- Message sending attempts
- Error details

### Check Logs
```bash
# Development
npm run dev
# Look for [WhatsApp] prefixed logs

# Production (example with PM2)
pm2 logs your-app-name | grep WhatsApp
```

---

## 🔄 **PRODUCTION DEPLOYMENT CHECKLIST**

Before deploying to production:

- [ ] Set all required environment variables in production
- [ ] Use permanent access token (not temporary)
- [ ] Set `WHATSAPP_DEBUG_MODE=false`
- [ ] Set `WHATSAPP_ENABLED=true`
- [ ] Update webhook URL to production domain (HTTPS)
- [ ] Re-verify webhook in Meta Dashboard
- [ ] Test sending and receiving messages
- [ ] Enable signature validation (`WHATSAPP_APP_SECRET` set)
- [ ] Set up monitoring and alerts
- [ ] Configure rate limiting (if using Redis)
- [ ] Review error handling and logging
- [ ] Test all notification triggers (appointments, payments, etc.)

---

## 📞 **GET HELP**

### Official Documentation
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Getting Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Webhook Setup Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)

### Common Resources
- [Meta Business Help Center](https://www.facebook.com/business/help)
- [Developer Community](https://developers.facebook.com/community/)
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)

---

## ✅ **VERIFICATION CHECKLIST**

After setup, verify everything works:

- [ ] Environment variables are set correctly
- [ ] Webhook verification succeeds
- [ ] Can send text messages
- [ ] Can send media messages (images, videos)
- [ ] Receive incoming messages via webhook
- [ ] Message status updates work (delivered, read)
- [ ] Templates are approved and working
- [ ] Notifications trigger correctly
- [ ] Encryption/decryption works
- [ ] Database stores messages correctly
- [ ] Admin dashboard displays conversations
- [ ] Rate limiting is configured (if applicable)

---

**🎉 Setup Complete!**

If all checks pass, your WhatsApp integration is ready to use. For any issues, refer to the troubleshooting section or check the official documentation.

---

**Last Updated:** December 15, 2025  
**Version:** 1.0


