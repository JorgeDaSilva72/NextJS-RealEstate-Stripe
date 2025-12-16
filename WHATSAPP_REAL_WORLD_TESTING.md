# 🧪 WhatsApp Integration - Real-World Testing Guide

Complete guide to test WhatsApp integration in your **Afrique Avenir Immobilier** application.

---

## 📋 **Prerequisites**

Before testing, ensure:
- ✅ Webhook is verified in Facebook Developer Console
- ✅ Environment variables are set in production
- ✅ WhatsApp Business API is active
- ✅ You have a test phone number to receive messages

---

## 🚀 **Test 1: Send a WhatsApp Message (API Test)**

### **Quick Test (No Authentication Required)**

Use the test endpoint to send a message directly:

```bash
curl -X POST https://afriqueavenirimmobilier.com/api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+221771234567",
    "message": "Bonjour! Ceci est un test depuis Afrique Avenir Immobilier 🏠"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "messageId": "wamid.xxx",
    "status": "sent"
  }
}
```

**What to Check:**
- ✅ Message appears in your WhatsApp Business account
- ✅ Message is delivered to the recipient
- ✅ Check server logs for `[WhatsApp Test API]` entries

---

## 🚀 **Test 2: Send Message via App (Authenticated)**

### **Using the Send API Endpoint**

```bash
# First, get your auth token (login to your app)
# Then use it to send a message:

curl -X POST https://afriqueavenirimmobilier.com/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "to": "+221771234567",
    "message": "Bonjour! Je vous contacte concernant une propriété.",
    "type": "text",
    "propertyId": 123
  }'
```

**What Happens:**
- ✅ Message is sent via WhatsApp Business API
- ✅ Message is saved to database
- ✅ Conversation is created/updated
- ✅ Message status is tracked

---

## 🚀 **Test 3: Receive Messages (Webhook)**

### **Step 1: Send a Message TO Your Business Number**

From your personal WhatsApp, send a message to your WhatsApp Business number:

```
"Bonjour, je cherche une propriété à louer"
```

### **Step 2: Check Server Logs**

Look for these log entries in your deployment platform:

```
[Webhook API] Received webhook: {...}
[Webhook] Incoming message processed: wamid.xxx
```

### **Step 3: Verify in Database**

Check if the message was saved:

```sql
-- Check recent messages
SELECT * FROM "WhatsAppMessage" 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- Check conversations
SELECT * FROM "WhatsAppConversation" 
ORDER BY "lastMessageAt" DESC 
LIMIT 10;
```

**What Should Happen:**
- ✅ Webhook receives the message
- ✅ Message is saved to database
- ✅ Conversation is created/updated
- ✅ Message status is tracked

---

## 🎨 **Test 4: Add WhatsApp Button to Property Page**

### **Step 1: Add WhatsApp Button Component**

Edit your property page (`src/app/[locale]/property/[id]/page.tsx`):

```tsx
import WhatsAppButton from '@/app/[locale]/components/WhatsAppButton';

// Inside your property page component:
<WhatsAppButton
  phoneNumber="+221771234567" // Your WhatsApp Business number
  propertyId={property.id}
  propertyName={property.title}
  propertyPrice={`${property.price} ${property.currency}`}
  propertyUrl={`https://afriqueavenirimmobilier.com/${locale}/property/${property.id}`}
  variant="button"
  size="lg"
/>
```

### **Step 2: Test on Property Page**

1. Visit: `https://afriqueavenirimmobilier.com/fr/property/123`
2. Click the WhatsApp button
3. WhatsApp should open with pre-filled message
4. Send the message
5. Check your WhatsApp Business account for the message

**Expected Behavior:**
- ✅ Button appears on property page
- ✅ Clicking opens WhatsApp with pre-filled message
- ✅ Message includes property details
- ✅ Interaction is logged (if API call succeeds)

---

## 🎨 **Test 5: Add Floating WhatsApp Chat Widget**

### **Step 1: Add to Layout**

Edit `src/app/[locale]/layout.tsx`:

```tsx
import WhatsAppChat from '@/app/[locale]/components/WhatsAppChat';

// Inside your RootLayout component, before closing </body>:
<WhatsAppChat
  phoneNumber="+221771234567"
  message="Bonjour! Comment puis-je vous aider?"
  position="bottom-right"
  showPopup={true}
  companyName="Afrique Avenir Immobilier"
  greeting="Besoin d'aide? Contactez-nous!"
/>
```

### **Step 2: Test the Widget**

1. Visit any page on your site
2. Wait 3 seconds - popup should appear
3. Click the floating WhatsApp button
4. WhatsApp should open with your message

**Expected Behavior:**
- ✅ Floating button appears bottom-right
- ✅ Popup greeting appears after 3 seconds
- ✅ Clicking opens WhatsApp
- ✅ Works on all pages

---

## 📊 **Test 6: Check Integration Status**

### **Check Status Endpoint**

```bash
curl https://afriqueavenirimmobilier.com/api/whatsapp/status \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "enabled": true,
    "configured": true,
    "account": {
      "phoneNumber": "+221771234567",
      "isVerified": true,
      "webhookVerified": true
    },
    "statistics": {
      "totalConversations": 5,
      "activeConversations": 3,
      "totalMessages": 25,
      "todayMessages": 2
    }
  }
}
```

---

## 🔍 **Test 7: View Conversations (Admin Dashboard)**

If you have an admin dashboard, check:

1. Navigate to: `/admin/whatsapp` (or your admin route)
2. View conversations list
3. Click on a conversation to see messages
4. Reply to messages directly from the dashboard

---

## 📱 **Real-World Test Scenarios**

### **Scenario 1: Property Inquiry Flow**

1. **User visits property page**
   - URL: `https://afriqueavenirimmobilier.com/fr/property/123`
   - Sees WhatsApp button

2. **User clicks WhatsApp button**
   - WhatsApp opens with message: "Bonjour! Je suis intéressé(e) par cette propriété: [Property Name]"

3. **User sends message**
   - Message arrives in your WhatsApp Business account
   - Webhook receives and processes message
   - Message saved to database

4. **You reply from WhatsApp Business**
   - User receives your reply
   - Status updates tracked in database

### **Scenario 2: Customer Support Flow**

1. **User visits homepage**
   - Sees floating WhatsApp widget
   - Clicks after 3 seconds

2. **User sends support question**
   - "Bonjour, j'ai une question sur les locations"
   - Message received via webhook

3. **You respond**
   - Reply from WhatsApp Business
   - User receives answer
   - Conversation tracked

---

## 🐛 **Troubleshooting**

### **Issue: Messages Not Sending**

**Check:**
```bash
# Test endpoint directly
curl -X POST https://afriqueavenirimmobilier.com/api/whatsapp/test \
  -H "Content-Type: application/json" \
  -d '{"to": "+221771234567", "message": "Test"}'

# Check status
curl https://afriqueavenirimmobilier.com/api/whatsapp/status
```

**Common Issues:**
- ❌ Invalid phone number format (use +221771234567)
- ❌ Access token expired
- ❌ Phone number not verified
- ❌ Rate limit exceeded

### **Issue: Webhook Not Receiving Messages**

**Check:**
1. Verify webhook in Facebook Developer Console
2. Check server logs for webhook events
3. Test webhook manually:

```bash
curl "https://afriqueavenirimmobilier.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123"
```

**Should return:** `test123` (plain text)

### **Issue: WhatsApp Button Not Appearing**

**Check:**
1. Component imported correctly
2. Phone number prop provided
3. Check browser console for errors
4. Verify component renders:

```tsx
// Test component directly
<WhatsAppButton phoneNumber="+221771234567" />
```

---

## 📝 **Testing Checklist**

- [ ] **Send Test Message** - `/api/whatsapp/test` works
- [ ] **Webhook Verification** - Returns challenge correctly
- [ ] **Receive Message** - Webhook processes incoming messages
- [ ] **WhatsApp Button** - Appears on property pages
- [ ] **Floating Widget** - Appears on all pages
- [ ] **Database Storage** - Messages saved correctly
- [ ] **Status Endpoint** - Returns correct status
- [ ] **Real Conversation** - End-to-end flow works

---

## 🎯 **Next Steps**

1. ✅ **Add WhatsApp buttons to all property pages**
2. ✅ **Add floating widget to main layout**
3. ✅ **Set up admin dashboard** (if not done)
4. ✅ **Configure auto-replies** (optional)
5. ✅ **Set up message templates** (for common responses)
6. ✅ **Monitor conversations** regularly

---

## 📞 **Quick Reference**

### **API Endpoints**

- **Test Send:** `POST /api/whatsapp/test`
- **Send Message:** `POST /api/whatsapp/send` (auth required)
- **Webhook:** `GET/POST /api/whatsapp/webhook`
- **Status:** `GET /api/whatsapp/status` (auth required)
- **Health:** `GET /api/whatsapp/health`

### **Components**

- **WhatsAppButton** - Property page button
- **WhatsAppChat** - Floating chat widget

### **Environment Variables**

```env
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_id
WHATSAPP_WEBHOOK_VERIFY_TOKEN=whatsapp_verify_123
WHATSAPP_APP_SECRET=your_secret
```

---

**Happy Testing! 🚀**

