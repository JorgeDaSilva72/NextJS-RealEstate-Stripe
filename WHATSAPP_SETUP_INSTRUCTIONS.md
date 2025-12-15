# 🚀 WhatsApp Integration - Setup Instructions

Complete guide to set up and run the WhatsApp Business API integration.

---

## 📋 **PREREQUISITES**

Before starting, ensure you have:

- ✅ Node.js 18+ installed
- ✅ PostgreSQL database running
- ✅ Meta Developer account
- ✅ WhatsApp Business Account
- ✅ Domain with HTTPS (for production webhooks)

---

## 🔧 **INSTALLATION STEPS**

### **Step 1: Install Dependencies**

```bash
# Install new packages
npm install
```

The following packages have been added:
- `axios` - HTTP client for API requests
- `crypto-js` - Encryption utilities
- `qrcode` - QR code generation
- `@types/crypto-js` - TypeScript types
- `@types/qrcode` - TypeScript types

### **Step 2: Update Prisma Schema**

The database schema has been updated with WhatsApp models. Generate the Prisma client:

```bash
# Generate Prisma Client
npm run prisma:generate
```

### **Step 3: Run Database Migration**

Create the new WhatsApp tables in your database:

```bash
# Development (SQLite/PostgreSQL)
npm run prisma:migrate

# Or manually create migration
npx prisma migrate dev --name add_whatsapp_integration
```

### **Step 4: Set Up Environment Variables**

1. **Copy the environment template:**

```bash
cp .env.local .env.local.backup
```

2. **Add WhatsApp variables to `.env.local`:**

```bash
# WhatsApp Business API
WHATSAPP_API_VERSION=v18.0
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_APP_ID=your_app_id
WHATSAPP_APP_SECRET=your_app_secret

# Webhook Configuration
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_secure_token
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp/webhook

# Security
WHATSAPP_ENCRYPTION_KEY=your_32_character_encryption_key

# Features
WHATSAPP_ENABLED=true
WHATSAPP_DEBUG_MODE=true
```

📖 **Detailed instructions:** See `WHATSAPP_ENV_SETUP.md` for step-by-step guidance.

### **Step 5: Seed WhatsApp Account (Optional)**

Create a seed script to initialize your WhatsApp account:

```typescript
// prisma/seed/03_whatsapp.ts
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../../src/lib/whatsapp/encryption';

const prisma = new PrismaClient();

async function seedWhatsApp() {
  // Create WhatsApp account
  await prisma.whatsAppAccount.create({
    data: {
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
      phoneNumber: '+221771234567', // Your WhatsApp Business number
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!,
      accessToken: encrypt(process.env.WHATSAPP_ACCESS_TOKEN!),
      isActive: true,
      isVerified: true,
      displayName: 'Afrique Avenir Immo',
    },
  });

  console.log('✅ WhatsApp account seeded');
}

seedWhatsApp()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run the seed:
```bash
npm run db:seed
```

---

## 🌐 **WEBHOOK SETUP**

### **Development (Local Testing)**

1. **Install ngrok:**

```bash
npm install -g ngrok
```

2. **Start your Next.js app:**

```bash
npm run dev
```

3. **In another terminal, start ngrok:**

```bash
ngrok http 3000
```

4. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

5. **Configure in Meta Developer Console:**
   - Go to your app > WhatsApp > Configuration
   - Webhook URL: `https://abc123.ngrok.io/api/whatsapp/webhook`
   - Verify Token: (use the value from `WHATSAPP_WEBHOOK_VERIFY_TOKEN`)
   - Click "Verify and Save"
   - Subscribe to: `messages` and `message_status`

### **Production**

1. Deploy your Next.js app to production (Vercel, etc.)
2. Update webhook URL to: `https://yourdomain.com/api/whatsapp/webhook`
3. Verify webhook in Meta Developer Console
4. Test by sending a message to your WhatsApp Business number

---

## 🧪 **TESTING THE INTEGRATION**

### **Test 1: Check Integration Status**

```bash
curl https://yourdomain.com/api/whatsapp/status \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

Expected response:
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
    }
  }
}
```

### **Test 2: Send a Test Message**

```bash
curl -X POST https://yourdomain.com/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "to": "+221771234567",
    "message": "Test message from WhatsApp API 🎉",
    "type": "text"
  }'
```

### **Test 3: Verify Webhook Reception**

1. Send a WhatsApp message to your business number from your phone
2. Check your application logs for webhook events
3. Verify message appears in database:

```sql
SELECT * FROM "WhatsAppMessage" ORDER BY "createdAt" DESC LIMIT 5;
```

### **Test 4: Test UI Components**

1. Navigate to a property page
2. Click the WhatsApp contact button
3. Verify WhatsApp opens with pre-filled message
4. Check that interaction is logged in database

---

## 📱 **USING THE INTEGRATION**

### **1. Property Page Integration**

Add the WhatsApp button to your property page:

```tsx
import WhatsAppButton from '@/app/[locale]/components/WhatsAppButton';

// In your property page component
<WhatsAppButton
  phoneNumber="+221771234567"
  propertyId={property.id}
  propertyName={property.name}
  propertyPrice={`${property.price} ${property.currency}`}
  propertyUrl={`https://yourdomain.com/property/${property.id}`}
  variant="button"
  size="lg"
/>
```

### **2. Floating WhatsApp Widget**

Add a floating WhatsApp button to your layout:

```tsx
import WhatsAppChat from '@/app/[locale]/components/WhatsAppChat';

// In your root layout
<WhatsAppChat
  phoneNumber="+221771234567"
  companyName="Afrique Avenir Immo"
  greeting="Besoin d'aide? Contactez-nous!"
  position="bottom-right"
/>
```

### **3. Send Appointment Notifications**

```typescript
import { createNotificationService } from '@/lib/whatsapp/notifications';

// After creating an appointment
const notificationService = createNotificationService(accountId);
await notificationService.sendAppointmentConfirmation(
  appointmentId,
  'fr' // locale
);
```

### **4. Admin Dashboard**

Access the WhatsApp admin dashboard:
```
https://yourdomain.com/{locale}/admin/whatsapp
```

Features:
- View all conversations
- Filter by status (Active, Archived, Blocked)
- See message history
- Monitor statistics

---

## 🎨 **CUSTOMIZATION**

### **Templates**

Create message templates in `src/lib/whatsapp/template-service.ts`:

```typescript
export const CUSTOM_TEMPLATES = {
  welcome: {
    fr: 'Bienvenue sur Afrique Avenir Immo! 🏠',
    en: 'Welcome to Afrique Avenir Immo! 🏠',
  },
  // Add more templates...
};
```

### **Notification Triggers**

Add custom notification triggers in your business logic:

```typescript
// Example: Send notification when property is published
async function publishProperty(propertyId: number) {
  // ... publish logic ...
  
  // Notify interested users
  const interestedUsers = await getInterestedUsers(propertyId);
  for (const user of interestedUsers) {
    await notificationService.sendNewPropertyAlert(
      propertyId,
      user.phone,
      user.preferredLocale
    );
  }
}
```

---

## 📊 **MONITORING**

### **View Logs**

```bash
# Development
npm run dev
# Watch for [WhatsApp] prefixed logs

# Production (PM2 example)
pm2 logs your-app | grep WhatsApp
```

### **Database Queries**

```sql
-- Total messages sent
SELECT COUNT(*) FROM "WhatsAppMessage" WHERE direction = 'OUTBOUND';

-- Messages by status
SELECT status, COUNT(*) FROM "WhatsAppMessage" GROUP BY status;

-- Active conversations
SELECT COUNT(*) FROM "WhatsAppConversation" WHERE status = 'ACTIVE';

-- Messages today
SELECT COUNT(*) FROM "WhatsAppMessage" 
WHERE "sentAt" >= CURRENT_DATE;
```

### **API Monitoring**

Monitor Meta's API usage:
- Go to Meta Developer Console
- Your App > WhatsApp > Insights
- Track message volumes and error rates

---

## 🐛 **TROUBLESHOOTING**

### Issue: Webhook Not Working

**Check:**
1. URL is publicly accessible (HTTPS)
2. Verify token matches environment variable
3. Webhook fields are subscribed
4. Check server logs for errors

**Solution:**
```bash
# Test webhook manually
curl -X GET "https://yourdomain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
# Should return: test
```

### Issue: Messages Not Sending

**Check:**
1. Access token is valid
2. Phone number format is correct (+country code)
3. Recipient has WhatsApp
4. Not rate limited

**Solution:** Enable debug mode and check logs

### Issue: Database Errors

**Check:**
1. Migrations have run
2. Database is accessible
3. Prisma client is generated

**Solution:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

---

## 🔄 **UPDATING THE INTEGRATION**

When updating the integration:

1. **Pull latest changes**
2. **Install dependencies:** `npm install`
3. **Generate Prisma client:** `npm run prisma:generate`
4. **Run migrations:** `npm run prisma:migrate`
5. **Restart application**

---

## 📚 **ADDITIONAL RESOURCES**

- 📖 [Integration Plan](./WHATSAPP_INTEGRATION_PLAN.md)
- 🔐 [Environment Setup Guide](./WHATSAPP_ENV_SETUP.md)
- 🌐 [Meta WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp)
- 💬 [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)

---

## ✅ **POST-SETUP CHECKLIST**

After completing setup:

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Webhook verified and working
- [ ] Test message sent successfully
- [ ] Webhook receives messages
- [ ] UI components display correctly
- [ ] Admin dashboard accessible
- [ ] Notifications triggering correctly
- [ ] Logs showing proper activity
- [ ] Production deployment configured

---

## 🎉 **CONGRATULATIONS!**

Your WhatsApp Business API integration is now complete! You can:

- ✅ Send and receive WhatsApp messages
- ✅ Manage conversations from admin dashboard
- ✅ Send automated notifications
- ✅ Contact property owners via WhatsApp
- ✅ Track all interactions in database

For support or questions, refer to the documentation files or Meta's support resources.

**Happy Messaging! 💬**

---

**Version:** 1.0  
**Last Updated:** December 15, 2025  
**Author:** Development Team


