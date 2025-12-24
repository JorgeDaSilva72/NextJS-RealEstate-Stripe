# WhatsApp Business Cloud API - Complete Meta Developer Setup Guide

## Table of Contents
1. [Overview](#overview)
2. [Meta App Setup](#1-meta-app-setup)
3. [WhatsApp Business Account Requirements](#2-whatsapp-business-account-requirements)
4. [Authentication & Security](#3-authentication--security)
5. [Environment Variables](#4-environment-variables)
6. [Webhook Configuration](#5-webhook-configuration)
7. [Message Templates](#6-message-templates)
8. [Testing & Sandbox](#7-testing--sandbox)
9. [Common Errors & Solutions](#8-common-errors--solutions)
10. [Production Checklist](#9-production-checklist)

---

## Quick Reference Card

### 🔑 Required Credentials (All from Meta Developer Dashboard)

| Credential | Where to Find | Example Format | Required? |
|------------|---------------|----------------|-----------|
| **Phone Number ID** | WhatsApp → API Setup → Phone number ID | `947502885103297` | ✅ Required |
| **Access Token** | System User → Generate Token (permanent) | `EAA...` (starts with EAA) | ✅ Required |
| **Business Account ID (WABA)** | WhatsApp → API Setup → WhatsApp Business Account ID | `1203289797803197` | ✅ Required |
| **App Secret** | Settings → Basic → App Secret | `abc123def456...` | ✅ Required (Prod) |
| **Webhook Verify Token** | You create this | `whatsapp_verify_abc123` | ✅ Required |
| **API Version** | Usually `v18.0` | `v18.0` | ✅ Required |
| **App ID** | Settings → Basic → App ID | `123456789012345` | Optional |

### 📝 Environment Variables Template

```env
# REQUIRED - From Meta Developer Dashboard
WHATSAPP_PHONE_NUMBER_ID=947502885103297
WHATSAPP_ACCESS_TOKEN=EAA...
WHATSAPP_BUSINESS_ACCOUNT_ID=1203289797803197
WHATSAPP_API_VERSION=v18.0
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_verify_abc123
WHATSAPP_APP_SECRET=your_app_secret

# OPTIONAL
WHATSAPP_DEBUG_MODE=true
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### ⚠️ Security Notes

- 🔴 **NEVER expose** these to client-side: `ACCESS_TOKEN`, `APP_SECRET`, `PHONE_NUMBER_ID`
- ✅ Use **System User tokens** (permanent) for production, not temporary tokens
- ✅ Enable **webhook signature validation** in production
- ✅ Use **HTTPS** for webhook URLs

---

## Overview

This guide provides **EXACT** steps and credentials needed from `developer.facebook.com` to configure WhatsApp Business Cloud API integration for your real estate application.

### What This Integration Enables:
- ✅ Sending messages via WhatsApp Business Cloud API
- ✅ Receiving messages via Webhooks
- ✅ Automated bot replies
- ✅ Message templates
- ✅ Media messages (image, video, document)
- ✅ Conversation tracking

---

## 1. Meta App Setup

### Step 1.1: Create a Meta App

1. Go to **https://developers.facebook.com/apps/**
2. Click **"Create App"**
3. Select **App Type**: **"Business"**
   - ⚠️ **DO NOT** choose "Consumer" or "None"
   - Business type is required for WhatsApp Business API
4. Fill in:
   - **App Name**: `Your App Name` (e.g., "Real Estate WhatsApp API")
   - **App Contact Email**: Your business email
   - **Business Account**: Select or create a Meta Business Account
5. Click **"Create App"**

### Step 1.2: Add WhatsApp Product

1. In your app dashboard, go to **"Add Products"**
2. Find **"WhatsApp"** product
3. Click **"Set Up"**
4. This will automatically:
   - Add WhatsApp to your app
   - Create a WhatsApp Business Account (WABA)
   - Link it to your Meta Business Account

### Step 1.3: Required App Permissions & Scopes

Navigate to **App Dashboard → Settings → Basic**:

**Required Information:**
- ✅ App ID (You'll need this)
- ✅ App Secret (CRITICAL - Generate this)
- ✅ App Domain (Your production domain)
- ✅ Privacy Policy URL (Required for production)
- ✅ Terms of Service URL (Required for production)
- ✅ Data Deletion Instructions URL (Required for GDPR compliance)

**To get App Secret:**
1. Go to **Settings → Basic**
2. Find **"App Secret"**
3. Click **"Show"** and enter your password
4. Copy the secret (starts with something like `abc123def456...`)
5. ⚠️ **NEVER expose this to client-side code**

### Step 1.4: App Type Configuration

**For Development:**
- App Mode: **Development**
- No business verification required
- Limited to test phone numbers (up to 5)
- 24-hour messaging window only

**For Production:**
- App Mode: **Live**
- Business verification **REQUIRED**
- Can message any phone number
- Requires approved message templates for outbound messages

---

## 2. WhatsApp Business Account Requirements

### Step 2.1: Get WhatsApp Business Account ID (WABA ID)

1. Go to **https://business.facebook.com/settings/whatsapp-business-accounts**
2. Or navigate: **Meta App Dashboard → WhatsApp → API Setup**
3. You'll see **"WhatsApp Business Account ID"**
4. Format: `1203289797803197` (numeric string)

**Where it's used in code:**
```typescript
// src/lib/whatsapp/client.ts
businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
```

### Step 2.2: Get Phone Number ID

1. In **WhatsApp → API Setup**
2. Scroll to **"Phone number"** section
3. If you haven't added a phone number:
   - Click **"Add phone number"**
   - Follow the verification steps
   - You'll need a phone number you can receive SMS on
4. Once added, you'll see **"Phone number ID"**
5. Format: `947502885103297` (numeric string)

**Where it's used in code:**
```typescript
// src/lib/whatsapp/client.ts
phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID

// Used in API calls:
POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages
```

### Step 2.3: Business Verification (Production Only)

**⚠️ REQUIRED for Production:**

1. Go to **Meta Business Settings → Security Center**
2. Start **Business Verification**
3. Required documents:
   - Business registration documents
   - Proof of address
   - Business phone number
   - Business website
4. Verification process takes **1-3 business days**

**Benefits after verification:**
- ✅ Send messages to any phone number
- ✅ No 24-hour messaging window limit
- ✅ Higher messaging limits
- ✅ Access to advanced features

---

## 3. Authentication & Security

### Step 3.1: Generate Permanent Access Token

**IMPORTANT:** Use System User tokens for production (they don't expire).

#### Option A: System User Token (Recommended for Production)

1. Go to **Meta Business Settings → Users → System Users**
2. Click **"Add"** to create a system user
3. Name: `WhatsApp API System User`
4. Assign role: **"Admin"** or **"Employee"**
5. Click **"Create System User"**
6. Click on the system user you just created
7. Click **"Generate New Token"**
8. Select your app
9. Select permissions:
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_management`
   - ✅ `business_management`
10. Token duration: **"Never"** (permanent token)
11. Copy the token (starts with `EAA...`)
12. ⚠️ **NEVER expose this to client-side code**

**Where it's used in code:**
```typescript
// src/lib/whatsapp/client.ts
accessToken: process.env.WHATSAPP_ACCESS_TOKEN

// Used in API headers:
Authorization: Bearer {ACCESS_TOKEN}
```

#### Option B: Temporary Access Token (Development Only)

1. Go to **WhatsApp → API Setup**
2. Scroll to **"Temporary access token"**
3. Click **"Generate Token"**
4. Copy the token (expires in 24 hours)

⚠️ **Note:** Temporary tokens expire after 24 hours and will cause error 190.

### Step 3.2: App Secret

**Location:** **Settings → Basic → App Secret**

1. Click **"Show"** next to App Secret
2. Enter your password
3. Copy the secret

**Where it's used in code:**
```typescript
// src/lib/whatsapp/webhook-handler.ts
const appSecret = process.env.WHATSAPP_APP_SECRET;

// Used to validate webhook signatures:
validateWebhookSignature(signature, payload, appSecret)
```

**Security:** Used to validate that webhooks are actually from Meta, not attackers.

### Step 3.3: Webhook Verify Token

**This is a token YOU create** (not generated by Meta).

1. Create a random, secure token (e.g., `whatsapp_verify_abc123xyz789`)
2. Store it securely (you'll use it twice - once here, once in code)

**Where it's used:**
- ✅ In Meta webhook configuration (Step 5.2)
- ✅ In your code environment variable

**Where it's used in code:**
```typescript
// src/lib/whatsapp/webhook-handler.ts
const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

// Used during webhook verification:
if (params.token === verifyToken) {
  return { verified: true, challenge: params.challenge };
}
```

### Step 3.4: Webhook Signature Validation

Meta signs all webhook requests with `x-hub-signature-256` header.

**How it works:**
1. Meta creates HMAC-SHA256 signature using your App Secret
2. Sends it in header: `x-hub-signature-256=sha256=<signature>`
3. Your code validates it matches expected signature

**Code implementation:**
```typescript
// Already implemented in src/lib/whatsapp/webhook-handler.ts
static validateSignature(signature: string, payload: string): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  return validateWebhookSignature(signature, payload, appSecret);
}
```

---

## 4. Environment Variables

### Complete List of Required Environment Variables

```env
# ============================================
# WHATSAPP BUSINESS API - REQUIRED
# ============================================

# Phone Number ID (from WhatsApp → API Setup)
# Format: Numeric string like "947502885103297"
WHATSAPP_PHONE_NUMBER_ID=947502885103297

# Access Token (System User token recommended)
# Format: String starting with "EAA..."
# ⚠️ NEVER expose to client-side
WHATSAPP_ACCESS_TOKEN=EAAZA6hb3eKzIBQIKq8Wrdx2Lg87jEkvL4foV3OjpnoLZBFnCtG2yaaFZCNUzXmEOB7iB4ZBPW1FYtT3xE4oZCnZBuHxOR6vGnXTnBL8zt4UxqHOnwCrPGGySDmJzMejbbnydApFr31k9xPJVmlZAx7LLo28DZBZCubidxHfJ0RllnX8YdQAun6Xj5kAuFVGRoYykvDLhhJVoq3h9JHjt4CmxVP3EIxE95lNVetZCoGhZCSCqaChTsRZCYB60ovIjo7MHaKjaYOoWAIr27YokPZC49tZCs6AQZDZD

# WhatsApp Business Account ID (WABA ID)
# Format: Numeric string like "1203289797803197"
WHATSAPP_BUSINESS_ACCOUNT_ID=1203289797803197

# API Version (usually v18.0, check Meta docs for latest)
WHATSAPP_API_VERSION=v18.0

# ============================================
# WEBHOOK SECURITY - REQUIRED
# ============================================

# Webhook Verify Token (YOU create this)
# Format: Any secure random string
# ⚠️ Must match the token you enter in Meta webhook settings
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_verify_abc123xyz789

# App Secret (from Settings → Basic)
# Format: String from Meta
# ⚠️ NEVER expose to client-side
# Used to validate webhook signatures
WHATSAPP_APP_SECRET=your_app_secret_from_meta

# ============================================
# OPTIONAL CONFIGURATION
# ============================================

# Enable debug logging (true/false)
# Default: "true"
WHATSAPP_DEBUG_MODE=true

# Encryption key for storing tokens in database (optional)
# Format: 32-character string minimum
WHATSAPP_ENCRYPTION_KEY=your-32-character-encryption-key

# ============================================
# APPLICATION URL (for notifications)
# ============================================

# Your production domain (used in notification URLs)
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Classification

#### 🔴 NEVER Expose to Client-Side (Server-Only):

These **MUST** only be used in:
- Server-side API routes (`src/app/api/**`)
- Server Components
- Server-side utilities (`src/lib/whatsapp/**`)

```env
WHATSAPP_ACCESS_TOKEN          # ⚠️ CRITICAL - Allows full API access
WHATSAPP_APP_SECRET            # ⚠️ CRITICAL - Validates webhooks
WHATSAPP_PHONE_NUMBER_ID       # ⚠️ Sensitive - Identifies your business
WHATSAPP_BUSINESS_ACCOUNT_ID   # ⚠️ Sensitive - Business identifier
WHATSAPP_WEBHOOK_VERIFY_TOKEN  # ⚠️ Sensitive - Webhook security
WHATSAPP_ENCRYPTION_KEY        # ⚠️ Sensitive - Encryption key
```

#### 🟢 Safe for Client-Side:

These can be used in client components:

```env
NEXT_PUBLIC_APP_URL            # ✅ Public domain
WHATSAPP_DEBUG_MODE            # ✅ Debug flag (harmless)
```

### Where Each Variable is Used in Code

| Variable | Used In | Purpose |
|----------|---------|---------|
| `WHATSAPP_PHONE_NUMBER_ID` | `src/lib/whatsapp/client.ts:484` | API endpoint: `/v18.0/{PHONE_NUMBER_ID}/messages` |
| `WHATSAPP_ACCESS_TOKEN` | `src/lib/whatsapp/client.ts:486` | Authorization header: `Bearer {token}` |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | `src/lib/whatsapp/client.ts:493` | Business account identification |
| `WHATSAPP_API_VERSION` | `src/lib/whatsapp/client.ts:488` | API version in base URL |
| `WHATSAPP_WEBHOOK_VERIFY_TOKEN` | `src/lib/whatsapp/webhook-handler.ts:33` | Webhook verification during setup |
| `WHATSAPP_APP_SECRET` | `src/lib/whatsapp/webhook-handler.ts:70` | Webhook signature validation |
| `WHATSAPP_DEBUG_MODE` | `src/lib/whatsapp/client.ts:50,70` | Enable/disable debug logging |
| `NEXT_PUBLIC_APP_URL` | `src/lib/whatsapp/notifications.ts:200` | Generate property URLs in notifications |

---

## 5. Webhook Configuration

### Step 5.1: Prepare Your Webhook URL

**Format:**
```
https://your-domain.com/api/whatsapp/webhook
```

**Requirements:**
- ✅ Must be HTTPS (not HTTP)
- ✅ Must be publicly accessible (not localhost)
- ✅ Must respond within 20 seconds
- ✅ Must return 200 OK for POST requests
- ✅ Must return challenge string for GET verification

**For Local Development:**
Use a tunneling service:
- **ngrok**: `ngrok http 3000` → Use the HTTPS URL
- **Cloudflare Tunnel**: Free alternative
- **localhost.run**: Simple SSH tunnel

**Your webhook endpoint:** `src/app/api/whatsapp/webhook/route.ts`

### Step 5.2: Configure Webhook in Meta

1. Go to **WhatsApp → Configuration → Webhooks**
2. Click **"Edit"** or **"Add"** webhook
3. **Callback URL**: Enter your webhook URL
   ```
   https://your-domain.com/api/whatsapp/webhook
   ```
4. **Verify Token**: Enter the same token from `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
   ```
   whatsapp_verify_abc123xyz789
   ```
5. Click **"Verify and Save"**
   - Meta will send a GET request to verify
   - Your code should return the challenge string
6. **Subscribe to fields**: Select the following:
   - ✅ `messages` - Incoming messages
   - ✅ `message_status` - Delivery/read status updates

### Step 5.3: Webhook Verification Flow

**What happens during verification:**

1. Meta sends GET request:
   ```
   GET /api/whatsapp/webhook?
     hub.mode=subscribe&
     hub.verify_token=whatsapp_verify_abc123xyz789&
     hub.challenge=RANDOM_CHALLENGE_STRING
   ```

2. Your code checks:
   ```typescript
   // src/lib/whatsapp/webhook-handler.ts
   if (mode === 'subscribe' && token === verifyToken) {
     return challenge; // Return the challenge string
   }
   ```

3. Meta verifies the response matches the challenge
4. Webhook is activated ✅

### Step 5.4: Webhook Fields Explained

**`messages` field:**
- Triggers on: Incoming messages from users
- Contains: Message content, sender info, message ID
- Your code processes: `src/lib/whatsapp/webhook-handler.ts:handleIncomingMessage()`

**`message_status` field:**
- Triggers on: Status changes (sent → delivered → read)
- Contains: Message ID, status, timestamps
- Your code processes: `src/lib/whatsapp/webhook-handler.ts:handleStatusUpdate()`

### Step 5.5: Webhook Security (Production)

**Enable signature validation:**

Your code already validates signatures in production:
```typescript
// src/app/api/whatsapp/webhook/route.ts:127
if (process.env.NODE_ENV === 'production') {
  const isValid = validateSignature(signature, body);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
}
```

**How it works:**
1. Meta creates HMAC-SHA256 signature using your App Secret
2. Sends in header: `x-hub-signature-256=sha256=<signature>`
3. Your code recreates the signature and compares

---

## 6. Message Templates

### Step 6.1: When Templates are Required

**Templates are MANDATORY for:**
- ✅ First message to a user (outside 24-hour window)
- ✅ Promotional messages
- ✅ Marketing messages
- ✅ Automated notifications (if outside 24-hour window)

**Templates are NOT required for:**
- ✅ Responses within 24-hour window (user-initiated conversation)
- ✅ Customer service messages within active conversation

### Step 6.2: Create a Message Template

1. Go to **WhatsApp → Message Templates**
2. Click **"Create Template"**
3. Fill in:
   - **Name**: `property_inquiry` (lowercase, underscores only)
   - **Category**: Choose one:
     - `MARKETING` - Promotional content
     - `UTILITY` - Transactional/functional
     - `AUTHENTICATION` - OTP/verification codes
   - **Language**: Select (e.g., `en_US`, `fr`, `ar`)
4. **Format**: Choose one:
   - **Text**: Plain text message
   - **Media**: Image/video/document with text
   - **Interactive**: Buttons or list
5. **Content**: Write your message
   - Use variables: `{{1}}`, `{{2}}`, etc.
   - Example:
     ```
     Hello {{1}}, thank you for your interest in property {{2}}.
     Reference: {{3}}
     ```
6. Click **"Submit"**
7. Wait for approval (usually 24-48 hours)

### Step 6.3: Template Approval Process

**Statuses:**
- ⏳ **Pending** - Under review (24-48 hours)
- ✅ **Approved** - Ready to use
- ❌ **Rejected** - Check feedback, fix, resubmit

**Common rejection reasons:**
- Spelling/grammar errors
- Missing required fields
- Violates WhatsApp policies
- Unclear variable usage

### Step 6.4: Using Templates in Code

**Example:**
```typescript
await messageService.sendTemplate(conversationId, phoneNumber, {
  templateName: 'property_inquiry',
  languageCode: 'en',
  components: [
    {
      type: 'body',
      parameters: [
        { type: 'text', text: 'John' },      // {{1}}
        { type: 'text', text: 'Villa Rabat' }, // {{2}}
        { type: 'text', text: '123' }        // {{3}}
      ]
    }
  ]
});
```

**Code location:** `src/lib/whatsapp/message-service.ts:sendTemplate()`

### Step 6.5: Template Naming Conventions

**Rules:**
- ✅ Lowercase only
- ✅ Underscores allowed
- ✅ No spaces or special characters
- ✅ Must be unique per WABA
- ✅ Cannot be changed after approval

**Good examples:**
- `property_inquiry`
- `appointment_reminder`
- `payment_confirmation`

**Bad examples:**
- `Property Inquiry` (uppercase, space)
- `property-inquiry` (hyphen)
- `property.inquiry` (period)

---

## 7. Testing & Sandbox

### Step 7.1: Test Phone Numbers

**Add test numbers:**

1. Go to **WhatsApp → API Setup → Phone number**
2. Scroll to **"To"** section
3. Click **"Manage phone number list"**
4. Add up to 5 phone numbers (format: `+212612345678`)
5. These numbers can receive messages without templates
6. These numbers can send messages to your business number

**Test number format:**
- Must include country code: `+212` (Morocco), `+221` (Senegal), etc.
- No spaces or dashes: `+212612345678` ✅
- With spaces: `+212 612 345 678` ❌

### Step 7.2: Testing Message Sending

**Test via API:**
```bash
curl -X POST "https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages" \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "recipient_type": "individual",
    "to": "+212612345678",
    "type": "text",
    "text": {
      "body": "Hello, this is a test message!"
    }
  }'
```

**Test via your app:**
1. Use WhatsApp Contact Button component
2. Enter a test phone number
3. Click to send message
4. Check WhatsApp app on test device

### Step 7.3: Testing Webhook Receiving

**Simulate incoming message:**

1. Send a WhatsApp message to your business number from test phone
2. Check your server logs for webhook POST request
3. Verify message is stored in database
4. Check conversation is created

**Check webhook logs in Meta:**
1. Go to **WhatsApp → Configuration → Webhooks**
2. Click **"Test"** or view webhook delivery logs
3. See successful/failed deliveries

### Step 7.4: Sandbox Mode Limitations

**Development mode restrictions:**
- ⏱️ 24-hour messaging window only
- 👥 Maximum 5 test phone numbers
- 📱 Can only message test numbers
- ❌ Cannot send to any phone number
- ❌ No production templates

**To remove limitations:**
1. Complete Business Verification
2. Switch app to **Live** mode
3. Get approved message templates

---

## 8. Common Errors & Solutions

### Error 190: Invalid OAuth 2.0 Access Token

**Meaning:** Access token expired or invalid

**Causes:**
- Token expired (temporary tokens last 24 hours)
- Token was revoked
- Wrong token used

**Solution:**
1. Generate new System User token (permanent)
2. Update `WHATSAPP_ACCESS_TOKEN` environment variable
3. Restart your application

**Code handling:** Already implemented fallback to `wa.me` links in `WhatsAppContactButton.tsx:185`

### Error 131047: Message template not found

**Meaning:** Template name doesn't exist or isn't approved

**Causes:**
- Template name typo
- Template not approved yet
- Template in different language

**Solution:**
1. Check template name matches exactly
2. Verify template is approved in Meta dashboard
3. Ensure language code matches template language

### Error 131026: Parameter value can't be empty

**Meaning:** Required template variable is missing or empty

**Causes:**
- Not providing all required variables
- Empty string passed as variable

**Solution:**
1. Check template requires N variables
2. Provide all N variables in components array
3. Ensure variables are non-empty strings

### Error 131051: Message template language mismatch

**Meaning:** Language code doesn't match template language

**Causes:**
- Template created in `en` but sending with `fr`
- Wrong language code format

**Solution:**
1. Check template language in Meta dashboard
2. Use exact language code: `en`, `en_US`, `fr`, `ar`, etc.

### Error 100: Invalid parameter

**Meaning:** General validation error

**Common causes:**
- Invalid phone number format
- Missing required fields
- Invalid media URL

**Solution:**
1. Verify phone number: Must be `+[country][number]`
2. Check all required fields are provided
3. Validate media URLs are accessible

### Error 132000: Rate limit exceeded

**Meaning:** Too many API requests

**Causes:**
- Exceeded rate limits (varies by tier)
- Sending too fast

**Solution:**
1. Implement rate limiting/queuing
2. Wait before retrying
3. Check rate limits in Meta dashboard

### Webhook Verification Failed

**Error:** Webhook not verifying during setup

**Causes:**
- Verify token mismatch
- Webhook URL not accessible
- Wrong response format

**Solution:**
1. Ensure `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches Meta settings
2. Check webhook URL is publicly accessible
3. Verify GET endpoint returns challenge string (plain text, not JSON)

### Webhook Not Receiving Messages

**Causes:**
- Webhook not subscribed to `messages` field
- Webhook URL returning errors
- Firewall blocking Meta IPs

**Solution:**
1. Check webhook subscriptions in Meta dashboard
2. Review webhook delivery logs
3. Ensure webhook returns 200 OK quickly (< 20 seconds)
4. Check server logs for errors

---

## 9. Production Checklist

### Pre-Production Setup

- [ ] **Meta App created** with "Business" type
- [ ] **WhatsApp product added** to app
- [ ] **Business verification completed** (required for production)
- [ ] **System User token generated** (permanent, not temporary)
- [ ] **Phone number verified** and phone number ID saved
- [ ] **WABA ID saved** to environment variables
- [ ] **App Secret saved** securely (never expose)
- [ ] **Webhook verify token created** and saved
- [ ] **Webhook configured** with production URL (HTTPS)
- [ ] **Webhook subscribed** to `messages` and `message_status`
- [ ] **Message templates created and approved** (if needed)
- [ ] **Environment variables set** in production (Vercel, etc.)
- [ ] **Webhook signature validation enabled** (production only)

### Environment Variables Checklist

- [ ] `WHATSAPP_PHONE_NUMBER_ID` - ✅ Set
- [ ] `WHATSAPP_ACCESS_TOKEN` - ✅ Permanent System User token
- [ ] `WHATSAPP_BUSINESS_ACCOUNT_ID` - ✅ Set
- [ ] `WHATSAPP_API_VERSION` - ✅ Set (usually `v18.0`)
- [ ] `WHATSAPP_WEBHOOK_VERIFY_TOKEN` - ✅ Set and matches Meta
- [ ] `WHATSAPP_APP_SECRET` - ✅ Set
- [ ] `NEXT_PUBLIC_APP_URL` - ✅ Production domain
- [ ] `WHATSAPP_DEBUG_MODE` - ✅ Set to `false` for production

### Security Checklist

- [ ] ✅ All sensitive env vars are **server-only** (no `NEXT_PUBLIC_` prefix)
- [ ] ✅ Access token is **System User token** (permanent)
- [ ] ✅ App Secret is **never** logged or exposed
- [ ] ✅ Webhook signature validation is **enabled**
- [ ] ✅ Webhook URL uses **HTTPS** (not HTTP)
- [ ] ✅ Environment variables are **encrypted** in hosting platform
- [ ] ✅ Database tokens are **encrypted** (if stored)

### Testing Checklist

- [ ] ✅ Can send messages to test numbers
- [ ] ✅ Can receive messages via webhook
- [ ] ✅ Message status updates work (delivered, read)
- [ ] ✅ Templates work correctly (if used)
- [ ] ✅ Fallback to `wa.me` works if API fails
- [ ] ✅ Webhook verification passes
- [ ] ✅ Error handling works (token expired, etc.)

### Monitoring Checklist

- [ ] ✅ Webhook delivery logs monitored
- [ ] ✅ API error rates tracked
- [ ] ✅ Token expiration alerts set up
- [ ] ✅ Rate limit monitoring in place

---

## Quick Reference: Where to Find Each Value

| Value | Location in Meta Dashboard |
|-------|----------------------------|
| **App ID** | Settings → Basic → App ID |
| **App Secret** | Settings → Basic → App Secret (click "Show") |
| **Phone Number ID** | WhatsApp → API Setup → Phone number → Phone number ID |
| **WABA ID** | WhatsApp → API Setup → WhatsApp Business Account ID |
| **Access Token** | Meta Business Settings → System Users → Generate Token |
| **Webhook Verify Token** | You create this (not from Meta) |
| **Templates** | WhatsApp → Message Templates |
| **Test Numbers** | WhatsApp → API Setup → Phone number → To |

---

## Summary: Required Credentials from Meta

### Minimum Required (Development):

1. ✅ **Phone Number ID** - From WhatsApp → API Setup
2. ✅ **Access Token** - Temporary token from WhatsApp → API Setup (expires in 24h)
3. ✅ **Business Account ID** - From WhatsApp → API Setup
4. ✅ **Webhook Verify Token** - You create this
5. ✅ **App Secret** - From Settings → Basic (for webhook validation)

### Additional Required (Production):

6. ✅ **Permanent Access Token** - System User token (doesn't expire)
7. ✅ **Business Verification** - Completed and approved
8. ✅ **Approved Message Templates** - If sending outside 24h window
9. ✅ **Production Webhook URL** - HTTPS, publicly accessible

---

**Last Updated:** January 2024  
**Meta API Version:** v18.0  
**Documentation:** https://developers.facebook.com/docs/whatsapp/cloud-api

