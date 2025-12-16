# 🔑 WhatsApp Access Token - Renewal Guide

## ⚠️ **Your Token Expired**

Your WhatsApp access token expired on **December 15, 2025**. You need to generate a new one.

---

## 🚀 **Quick Fix: Get a New Temporary Token**

### **Option 1: Quick Temporary Token (Fast, but expires in ~1 hour)**

1. Go to **Meta Business Suite**: https://business.facebook.com
2. Navigate to **WhatsApp Manager** → **API Setup**
3. Find **"Temporary access token"** section
4. Click **"Generate token"** or **"Copy token"**
5. Copy the token immediately (you won't see it again!)

**Update your environment variable:**
```bash
WHATSAPP_ACCESS_TOKEN=your_new_token_here
```

**⚠️ Warning:** This token expires quickly (usually 1-2 hours). Use only for testing.

---

## ✅ **Permanent Solution: System User Token (Recommended for Production)**

### **Step-by-Step: Create Permanent Token**

#### **Step 1: Create System User**

1. Go to **Meta Business Suite**: https://business.facebook.com
2. Click **Settings** (gear icon) → **Business Settings**
3. In left menu, click **Users** → **System Users**
4. Click **"Add"** → **"Create New System User"**
5. Enter name: `WhatsApp Server` (or any name)
6. Click **"Create System User"**

#### **Step 2: Assign Permissions**

1. Click on your newly created **System User**
2. Click **"Assign Assets"** button
3. Select:
   - **App**: Your WhatsApp app (the one with App ID: `1823564694956850`)
   - **WhatsApp Business Account**: Your business account
4. Assign permissions:
   - ✅ `whatsapp_business_messaging`
   - ✅ `whatsapp_business_management`
5. Click **"Save Changes"**

#### **Step 3: Generate Permanent Token**

1. Still in **System User** page, click **"Generate New Token"**
2. Select:
   - **App**: Your WhatsApp app
   - **Expiration**: **Never** (or longest available)
   - **Permissions**: Select WhatsApp permissions
3. Click **"Generate Token"**
4. **⚠️ IMPORTANT:** Copy the token immediately! You won't see it again.
5. Save it securely

#### **Step 4: Update Your Environment**

**In Vercel (or your hosting):**

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Update `WHATSAPP_ACCESS_TOKEN` with the new permanent token
4. **Redeploy** your application

**Or hardcode temporarily** (if you can't access Vercel env):

Update `src/app/api/whatsapp/test/route.ts` line 21:
```typescript
WHATSAPP_ACCESS_TOKEN = "YOUR_NEW_PERMANENT_TOKEN_HERE",
```

---

## 🔍 **Verify Token Works**

After updating the token, test it:

```bash
POST https://afriqueavenirimmobilier.com/api/whatsapp/test
Content-Type: application/json

{
  "to": "+21697991266",
  "message": "Test avec nouveau token ✅"
}
```

**Expected:** `success: true` and you receive the message.

---

## 📋 **Token Types Comparison**

| Type | Duration | Use Case |
|------|----------|----------|
| **Temporary Token** | 1-2 hours | Quick testing only |
| **Short-lived Token** | 60 days | Development |
| **Long-lived Token** | 60 days (refreshable) | Production (with refresh) |
| **System User Token** | Never expires | **Production (recommended)** |

---

## 🔄 **Token Refresh (If Using Long-lived Token)**

If you're using a long-lived token, you can refresh it:

```bash
GET https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id=YOUR_APP_ID&
  client_secret=YOUR_APP_SECRET&
  fb_exchange_token=YOUR_EXPIRED_TOKEN
```

**Response:**
```json
{
  "access_token": "NEW_TOKEN",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

---

## 🛡️ **Security Best Practices**

1. ✅ **Never commit tokens to Git**
2. ✅ **Use environment variables** (not hardcoded)
3. ✅ **Use System User tokens** for production
4. ✅ **Rotate tokens periodically** (every 90 days recommended)
5. ✅ **Store tokens encrypted** in database (if storing)

---

## 🐛 **Troubleshooting**

### **Error: "Invalid access token"**

**Causes:**
- Token expired
- Token revoked
- Wrong token format

**Solution:**
- Generate a new token
- Verify token format (should be long string starting with `EAA...`)

### **Error: "Insufficient permissions"**

**Causes:**
- System User doesn't have WhatsApp permissions
- Wrong app selected

**Solution:**
- Re-assign permissions to System User
- Verify app is linked to WhatsApp Business Account

### **Error: "Token not found"**

**Causes:**
- Token was deleted
- Wrong environment variable name

**Solution:**
- Generate new token
- Verify env variable name: `WHATSAPP_ACCESS_TOKEN`

---

## 📞 **Need Help?**

1. **Meta Business Help**: https://business.facebook.com/help
2. **WhatsApp API Docs**: https://developers.facebook.com/docs/whatsapp
3. **System User Guide**: https://developers.facebook.com/docs/marketing-api/system-users

---

## ✅ **Checklist**

After getting new token:

- [ ] Token generated (System User recommended)
- [ ] Token copied and saved securely
- [ ] Environment variable updated
- [ ] Application redeployed (if using env vars)
- [ ] Test endpoint works: `/api/whatsapp/test`
- [ ] Can send messages successfully
- [ ] Webhook still works (token change doesn't affect webhook)

---

**🎉 Once you have a new token, your WhatsApp integration will work again!**

