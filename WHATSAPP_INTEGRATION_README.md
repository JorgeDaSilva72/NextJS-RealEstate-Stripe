# 📱 WhatsApp Business API Integration - Complete Package

## 🎯 Overview

This package provides a **complete, production-ready WhatsApp Business API integration** for your Next.js Real Estate platform. It includes:

- ✅ **Full Meta Cloud API Integration** - Send and receive WhatsApp messages
- ✅ **Webhook Handler** - Process incoming messages and status updates
- ✅ **Database Models** - Store conversations, messages, and templates
- ✅ **Message Service** - High-level API for sending messages
- ✅ **Notification System** - Automated notifications for appointments, payments, etc.
- ✅ **UI Components** - Ready-to-use WhatsApp buttons and widgets
- ✅ **Admin Dashboard** - Manage conversations and view analytics
- ✅ **Security Features** - Encryption, signature validation, rate limiting
- ✅ **TypeScript Support** - Full type safety throughout

---

## 📂 What's Included

### **📄 Documentation** (3 files)
1. **WHATSAPP_INTEGRATION_PLAN.md** - Comprehensive integration plan with architecture, phases, and best practices
2. **WHATSAPP_ENV_SETUP.md** - Detailed environment variables setup guide
3. **WHATSAPP_SETUP_INSTRUCTIONS.md** - Step-by-step implementation instructions

### **🗄️ Database Schema**
- `WhatsAppAccount` - WhatsApp Business account configuration
- `WhatsAppConversation` - User conversations with metadata
- `WhatsAppMessage` - All messages (inbound/outbound)
- `WhatsAppTemplate` - Message templates management

### **📚 Service Layer** (7 files)
```
src/lib/whatsapp/
├── types.ts              - TypeScript type definitions
├── encryption.ts         - Token encryption utilities
├── validators.ts         - Input validation functions
├── client.ts             - WhatsApp API client
├── message-service.ts    - Message sending and storage
├── webhook-handler.ts    - Webhook processing
├── template-service.ts   - Template management
└── notifications.ts      - Automated notifications
```

### **🌐 API Routes** (4 files)
```
src/app/api/whatsapp/
├── webhook/route.ts      - Webhook receiver (GET/POST)
├── send/route.ts         - Send messages
├── conversations/route.ts - Manage conversations
└── status/route.ts       - Integration status
```

### **🎨 UI Components** (3 files)
```
src/app/[locale]/components/
├── WhatsAppButton.tsx    - Contact button for property pages
├── WhatsAppChat.tsx      - Floating chat widget
└── (Admin Dashboard)
```

### **🔧 Admin Dashboard**
```
src/app/[locale]/admin/whatsapp/page.tsx - Full conversation management
```

---

## 🚀 Quick Start

### **1. Install Dependencies**

```bash
npm install
```

New packages added:
- `axios` - HTTP client
- `crypto-js` - Encryption
- `qrcode` - QR code generation
- TypeScript type definitions

### **2. Run Database Migration**

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npx prisma migrate dev --name add_whatsapp_integration

# Or reset database (development only)
npm run prisma:reset
```

### **3. Configure Environment Variables**

Add to your `.env.local`:

```bash
# WhatsApp Business API
WHATSAPP_API_VERSION=v18.0
WHATSAPP_BUSINESS_ACCOUNT_ID=your_id_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_id_here
WHATSAPP_ACCESS_TOKEN=your_token_here
WHATSAPP_APP_ID=your_app_id_here
WHATSAPP_APP_SECRET=your_secret_here

# Webhook
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_token_here
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp/webhook

# Security
WHATSAPP_ENCRYPTION_KEY=your_32_char_key_here

# Features
WHATSAPP_ENABLED=true
WHATSAPP_DEBUG_MODE=true
```

📖 **See `WHATSAPP_ENV_SETUP.md` for detailed setup instructions.**

### **4. Set Up Webhook**

**Development (Local):**
```bash
# Terminal 1: Start your app
npm run dev

# Terminal 2: Start ngrok
ngrok http 3000

# Use ngrok URL in Meta Developer Console
# Example: https://abc123.ngrok.io/api/whatsapp/webhook
```

**Production:**
- Deploy your app
- Update webhook URL in Meta Developer Console
- Verify webhook connection

### **5. Test the Integration**

```bash
# Test webhook verification
curl "https://yourdomain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"

# Test sending a message
curl -X POST https://yourdomain.com/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"to": "+221771234567", "message": "Test", "type": "text"}'
```

---

## 💡 Usage Examples

### **1. Add WhatsApp Button to Property Page**

```tsx
import WhatsAppButton from '@/app/[locale]/components/WhatsAppButton';

export default function PropertyPage({ property }) {
  return (
    <div>
      {/* ... property details ... */}
      
      <WhatsAppButton
        phoneNumber={property.contact?.phone}
        propertyId={property.id}
        propertyName={property.name}
        propertyPrice={`${property.price} ${property.currency}`}
        variant="button"
        size="lg"
      />
    </div>
  );
}
```

### **2. Add Floating WhatsApp Widget**

```tsx
// In your root layout.tsx
import WhatsAppChat from '@/app/[locale]/components/WhatsAppChat';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        
        <WhatsAppChat
          phoneNumber="+221771234567"
          companyName="Afrique Avenir Immo"
          greeting="Besoin d'aide? Contactez-nous!"
          position="bottom-right"
        />
      </body>
    </html>
  );
}
```

### **3. Send Appointment Confirmation**

```typescript
import { createNotificationService } from '@/lib/whatsapp/notifications';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// After creating an appointment
export async function createAppointment(data: AppointmentData) {
  const appointment = await prisma.appointment.create({ data });
  
  // Send WhatsApp confirmation
  const account = await prisma.whatsAppAccount.findFirst({
    where: { isActive: true }
  });
  
  if (account) {
    const notificationService = createNotificationService(account.id);
    await notificationService.sendAppointmentConfirmation(
      appointment.id,
      'fr' // locale
    );
  }
  
  return appointment;
}
```

### **4. Send Payment Confirmation**

```typescript
// After successful payment
export async function handlePaymentSuccess(subscriptionId: number) {
  const account = await prisma.whatsAppAccount.findFirst({
    where: { isActive: true }
  });
  
  if (account) {
    const notificationService = createNotificationService(account.id);
    await notificationService.sendPaymentConfirmation(
      subscriptionId,
      'fr'
    );
  }
}
```

### **5. Send New Property Alert**

```typescript
// When publishing a new property
export async function publishProperty(propertyId: number) {
  // ... publish logic ...
  
  // Notify interested users
  const interestedUsers = await getInterestedUsers(propertyId);
  const account = await prisma.whatsAppAccount.findFirst({
    where: { isActive: true }
  });
  
  if (account) {
    const notificationService = createNotificationService(account.id);
    
    for (const user of interestedUsers) {
      await notificationService.sendNewPropertyAlert(
        propertyId,
        user.phone,
        user.locale
      );
    }
  }
}
```

---

## 🎨 Features

### **✅ Message Types Supported**
- 📝 Text messages
- 🖼️ Image messages
- 🎥 Video messages
- 📄 Document messages
- 🎵 Audio messages
- 📍 Location messages
- 📋 Template messages
- 🔘 Interactive buttons

### **✅ Automated Notifications**
- 📅 Appointment confirmations
- 🔔 Appointment reminders (24h before)
- 💳 Payment confirmations
- 🏠 New property alerts
- ⚠️ Subscription expiry reminders

### **✅ Admin Dashboard**
- 💬 View all conversations
- 🔍 Filter by status (Active, Archived, Blocked)
- 📊 View statistics (messages, templates, etc.)
- 📱 See message history
- 👤 Manage conversation assignments
- 🏷️ Add tags and notes

### **✅ Security Features**
- 🔐 Token encryption
- ✅ Webhook signature validation
- 🚫 Input validation and sanitization
- 🔒 Rate limiting ready
- 🛡️ XSS protection

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  - WhatsApp buttons on property pages                   │
│  - Floating chat widget                                 │
│  - Admin dashboard                                      │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    API LAYER                             │
│  /api/whatsapp/send       - Send messages               │
│  /api/whatsapp/webhook    - Receive webhooks            │
│  /api/whatsapp/conversations - Manage conversations     │
│  /api/whatsapp/status     - Integration status          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 SERVICE LAYER                            │
│  - WhatsAppClient (API communication)                   │
│  - MessageService (business logic)                      │
│  - NotificationService (automated messages)             │
│  - TemplateService (template management)                │
│  - WebhookHandler (incoming messages)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 DATABASE LAYER                           │
│  - WhatsAppAccount                                      │
│  - WhatsAppConversation                                 │
│  - WhatsAppMessage                                      │
│  - WhatsAppTemplate                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Best Practices

### ✅ Implemented
- Token encryption in database
- Webhook signature validation
- Input validation and sanitization
- Rate limiting support (Redis ready)
- Environment variable protection
- HTTPS webhook enforcement
- XSS protection

### 📋 Recommended
- Use permanent System User tokens
- Rotate access tokens periodically
- Monitor API usage and set alerts
- Implement GDPR compliance features
- Add user opt-out mechanisms
- Set up error monitoring (Sentry, etc.)

---

## 📈 Monitoring

### **View Statistics**

Access admin dashboard:
```
https://yourdomain.com/{locale}/admin/whatsapp
```

### **Check Integration Status**

```bash
curl https://yourdomain.com/api/whatsapp/status
```

### **Database Queries**

```sql
-- Total messages
SELECT COUNT(*) FROM "WhatsAppMessage";

-- Messages by direction
SELECT direction, COUNT(*) 
FROM "WhatsAppMessage" 
GROUP BY direction;

-- Active conversations
SELECT COUNT(*) 
FROM "WhatsAppConversation" 
WHERE status = 'ACTIVE';

-- Messages today
SELECT COUNT(*) 
FROM "WhatsAppMessage" 
WHERE "sentAt" >= CURRENT_DATE;
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Webhook not receiving messages**
- Check URL is publicly accessible (HTTPS)
- Verify token matches environment variable
- Ensure webhook fields are subscribed
- Check server logs for errors

**Issue: Messages not sending**
- Verify access token is valid
- Check phone number format (+country code)
- Ensure recipient has WhatsApp
- Check Meta Developer Console for errors

**Issue: Database errors**
- Run `npm run prisma:generate`
- Run `npm run prisma:migrate`
- Check database connection

📖 **See `WHATSAPP_SETUP_INSTRUCTIONS.md` for detailed troubleshooting.**

---

## 📚 Documentation Index

1. **WHATSAPP_INTEGRATION_PLAN.md**
   - Complete integration plan
   - Architecture diagrams
   - Implementation phases
   - Best practices
   - Success criteria

2. **WHATSAPP_ENV_SETUP.md**
   - Environment variables guide
   - Step-by-step Meta account setup
   - Webhook configuration
   - Security setup
   - Production checklist

3. **WHATSAPP_SETUP_INSTRUCTIONS.md**
   - Installation steps
   - Testing procedures
   - Usage examples
   - Customization guide
   - Monitoring setup

4. **WHATSAPP_INTEGRATION_README.md** (This file)
   - Quick start guide
   - Feature overview
   - Code examples
   - Architecture overview

---

## 📞 Support & Resources

### Official Documentation
- [Meta WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Getting Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Webhook Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)

### Meta Support
- [Business Help Center](https://www.facebook.com/business/help)
- [Developer Community](https://developers.facebook.com/community/)
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)

---

## 🎉 What's Next?

After completing the setup:

1. ✅ Test all features thoroughly
2. ✅ Create message templates in Meta Business Suite
3. ✅ Set up monitoring and alerts
4. ✅ Train your team on the admin dashboard
5. ✅ Configure automated notifications
6. ✅ Monitor API usage and costs
7. ✅ Gather user feedback
8. ✅ Iterate and improve

---

## 📄 License

This integration is part of your Next.js Real Estate application. Use according to your project license.

---

## 👥 Credits

**Developed by:** Development Team  
**Date:** December 15, 2025  
**Version:** 1.0

**Built with:**
- Next.js 14
- Prisma ORM
- Meta WhatsApp Business API
- TypeScript
- Tailwind CSS

---

## ⭐ Features Highlight

### For Property Owners
- 📱 Instant communication with potential buyers
- 🔔 Automated appointment confirmations
- 📊 Track all conversations in dashboard
- 🏷️ Organize conversations with tags

### For Buyers
- 💬 Easy WhatsApp contact on property pages
- 📅 Receive appointment confirmations
- 🏠 Get alerts for new properties
- ✅ Quick responses to inquiries

### For Administrators
- 📊 Comprehensive analytics dashboard
- 💬 Manage all conversations in one place
- 🔍 Filter and search conversations
- 📈 Monitor message volumes and delivery rates

---

**🚀 Ready to transform your real estate platform with WhatsApp Business API!**

For questions or issues, refer to the documentation files or Meta's official support resources.

**Happy Messaging! 💬🏠**


