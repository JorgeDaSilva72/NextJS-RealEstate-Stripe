# 🧪 WhatsApp Integration - Complete Testing Guide

## ✅ **Step 1: Subscribe to Webhook Fields**

In Facebook Developer Console → WhatsApp → Configuration → Webhooks:

**Subscribe to these fields:**

1. ✅ **`messages`** - Click "S'abonner" (Subscribe)
   - This receives all incoming WhatsApp messages

2. ✅ **`message_status`** - Click "S'abonner" (Subscribe)  
   - This receives delivery/read status updates

**Optional (for later):**
- `message_template_status_update` - Template approval notifications
- `account_update` - Account changes

---

## 🧪 **Step 2: Test Sending Messages (OUTGOING)**

### **Test 1: Send a Simple Text Message**

**Using Postman / Insomnia / Thunder Client:**

```http
POST https://afriqueavenirimmobilier.com/api/whatsapp/test
Content-Type: application/json

{
  "to": "+21697991266",
  "message": "Bonjour! Test depuis Afrique Avenir Immobilier 🏠"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "messaging_product": "whatsapp",
    "contacts": [{
      "input": "21697991266",
      "wa_id": "21697991266"
    }],
    "messages": [{
      "id": "wamid.HBg..."
    }]
  }
}
```

**✅ Success Criteria:**
- You receive the WhatsApp message on your phone
- Response shows `success: true` with message ID

---

### **Test 2: Send Property Inquiry Message**

**Example for your real estate app:**

```http
POST https://afriqueavenirimmobilier.com/api/whatsapp/test
Content-Type: application/json

{
  "to": "+21697991266",
  "message": "🏠 Nouvelle propriété disponible!\n\n📍 Villa à Dakar\n💰 Prix: 500,000 XOF\n\nIntéressé(e)? Répondez pour plus d'informations!"
}
```

---

## 📥 **Step 3: Test Receiving Messages (INCOMING)**

### **Test 3: Send Message to Your Business Number**

1. **From your personal WhatsApp**, send a message to your **WhatsApp Business number**:
   - Example: "Bonjour, je cherche une villa à Dakar"

2. **Check your server logs** (Vercel logs or hosting provider):
   - You should see logs like:
     ```
     [Webhook API] Received webhook: ...
     [Webhook] Incoming message processed: wamid...
     ```

3. **Check your database** (if migrations are done):
   ```sql
   SELECT * FROM "WhatsAppMessage" ORDER BY "createdAt" DESC LIMIT 5;
   SELECT * FROM "WhatsAppConversation" ORDER BY "lastMessageAt" DESC LIMIT 5;
   ```

**✅ Success Criteria:**
- Message appears in your database
- Conversation is created/updated
- No errors in logs

---

## 🔄 **Step 4: Test Complete Flow (End-to-End)**

### **Test 4: Property Inquiry Flow**

**Scenario:** User clicks "Contact via WhatsApp" on a property page

1. **User clicks WhatsApp button** on property page
   - Button opens WhatsApp with pre-filled message
   - Message sent to property owner

2. **Property owner receives message** via WhatsApp

3. **Owner replies** from WhatsApp

4. **Your webhook receives the reply**
   - Message stored in database
   - Conversation updated
   - Admin can see it in dashboard

**Test this manually:**
- Go to a property page on your site
- Click WhatsApp contact button
- Send a test inquiry
- Reply from your business WhatsApp
- Check admin dashboard: `/fr/admin/whatsapp` (or `/en/admin/whatsapp`)

---

## 🎯 **Step 5: Real-World Use Cases**

### **Use Case 1: Property Inquiry**

**When:** User views a property and clicks "Contact via WhatsApp"

**What happens:**
1. WhatsApp opens with pre-filled message
2. User sends inquiry
3. Property owner receives notification
4. Conversation stored in database

**Test:**
```javascript
// In browser console on property page
fetch('/api/whatsapp/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+21697991266',
    message: 'Je suis intéressé par cette propriété',
    type: 'text',
    propertyId: 123
  })
})
.then(r => r.json())
.then(console.log);
```

---

### **Use Case 2: Appointment Confirmation**

**When:** User books a property viewing appointment

**What happens:**
1. Appointment created in database
2. WhatsApp notification sent automatically
3. User receives confirmation message

**Test:**
```http
POST https://afriqueavenirimmobilier.com/api/whatsapp/send
Content-Type: application/json

{
  "to": "+21697991266",
  "message": "✅ Votre rendez-vous est confirmé!\n\n📅 Date: 15/12/2025\n🕐 Heure: 14:00\n🏠 Propriété: Villa à Dakar\n\nNous avons hâte de vous voir!",
  "type": "text"
}
```

---

### **Use Case 3: Payment Confirmation**

**When:** User completes subscription payment

**What happens:**
1. Payment processed
2. WhatsApp confirmation sent
3. User receives receipt

**Test:**
```http
POST https://afriqueavenirimmobilier.com/api/whatsapp/send
Content-Type: application/json

{
  "to": "+21697991266",
  "message": "✅ Paiement confirmé!\n\n💰 Montant: 50,000 XOF\n📦 Plan: Premium\n\nMerci pour votre confiance!",
  "type": "text"
}
```

---

## 🔍 **Step 6: Verify Everything Works**

### **Checklist:**

- [ ] ✅ Webhook verified in Facebook (you already did this!)
- [ ] ✅ `messages` field subscribed
- [ ] ✅ `message_status` field subscribed
- [ ] ✅ Can send messages via `/api/whatsapp/test`
- [ ] ✅ Receive messages on your phone
- [ ] ✅ Incoming messages trigger webhook
- [ ] ✅ Messages stored in database (if migrations done)
- [ ] ✅ Admin dashboard shows conversations
- [ ] ✅ WhatsApp button works on property pages

---

## 🐛 **Troubleshooting**

### **Problem: Messages not sending**

**Check:**
1. Access token is valid (not expired)
2. Phone number format is correct (+country code)
3. Recipient has WhatsApp installed
4. Check Meta Developer Console for errors

**Solution:**
```bash
# Test token validity
curl -X GET "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID?access_token=YOUR_TOKEN"
```

---

### **Problem: Webhook not receiving messages**

**Check:**
1. Webhook fields are subscribed (`messages`, `message_status`)
2. Webhook URL is correct: `https://afriqueavenirimmobilier.com/api/whatsapp/webhook`
3. Server logs show webhook requests
4. No errors in webhook handler

**Solution:**
- Check Vercel/hosting logs
- Test webhook manually: `https://afriqueavenirimmobilier.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test`
- Should return: `test`

---

### **Problem: Database errors**

**Check:**
1. Prisma migrations are run: `npm run prisma:migrate`
2. Database connection is working
3. WhatsAppAccount record exists

**Solution:**
```bash
# Run migrations
npm run prisma:migrate

# Create WhatsAppAccount (if needed)
# Use Prisma Studio or seed script
```

---

## 📊 **Step 7: Monitor & Analytics**

### **Check Integration Status:**

```http
GET https://afriqueavenirimmobilier.com/api/whatsapp/status
```

**Response shows:**
- Integration enabled/disabled
- Account configuration
- Statistics (messages, conversations, etc.)
- Environment variables status

---

### **View Conversations:**

Access admin dashboard:
```
https://afriqueavenirimmobilier.com/fr/admin/whatsapp
```

**Features:**
- View all conversations
- Filter by status
- See message history
- View statistics

---

## 🎉 **Success Indicators**

You'll know everything works when:

1. ✅ **Sending works:** You receive test messages on your phone
2. ✅ **Receiving works:** Messages sent to business number appear in database/logs
3. ✅ **Webhook works:** No errors when receiving messages
4. ✅ **UI works:** WhatsApp buttons on property pages function correctly
5. ✅ **Admin works:** Dashboard shows conversations and messages

---

## 🚀 **Next Steps After Testing**

1. **Create WhatsApp Account in Database:**
   ```sql
   INSERT INTO "WhatsAppAccount" (
     id, "phoneNumberId", "phoneNumber", "businessAccountId",
     "accessToken", "isActive", "isVerified", "webhookVerified"
   ) VALUES (
     'clx...', '947502885103297', '+21697991266', '1203289797803197',
     'encrypted_token_here', true, true, true
   );
   ```

2. **Add WhatsApp Button to Property Pages:**
   ```tsx
   import WhatsAppButton from '@/app/[locale]/components/WhatsAppButton';
   
   <WhatsAppButton
     phoneNumber={property.contact?.phone}
     propertyId={property.id}
     propertyName={property.name}
   />
   ```

3. **Set Up Automated Notifications:**
   - Appointment confirmations
   - Payment confirmations
   - New property alerts

4. **Monitor Usage:**
   - Check Meta Developer Console for API usage
   - Monitor costs (WhatsApp charges per message)
   - Review conversation quality

---

## 📞 **Support**

If you encounter issues:

1. Check server logs (Vercel/hosting provider)
2. Check Meta Developer Console → WhatsApp → Insights
3. Review webhook delivery logs in Meta
4. Test endpoints manually with Postman/curl

**Common Issues:**
- Token expired → Regenerate in Meta
- Rate limit → Wait and retry
- Invalid phone → Check format (+country code)
- Webhook not working → Verify subscription fields

---

**🎉 Congratulations! Your WhatsApp integration is ready for production!**

