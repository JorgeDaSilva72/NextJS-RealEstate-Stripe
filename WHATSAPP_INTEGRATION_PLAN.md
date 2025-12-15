# 📱 WhatsApp Business API Integration Plan
## Meta Cloud API Integration for Real Estate Platform

---

## 🎯 **OVERVIEW**

This document outlines the professional integration of WhatsApp Business API (Meta Cloud) into the NextJS Real Estate platform, enabling automated property inquiries, appointment notifications, and customer communications.

---

## 📋 **INTEGRATION OBJECTIVES**

### Primary Goals
1. ✅ **Property Inquiries**: Allow users to contact property owners via WhatsApp
2. ✅ **Appointment Notifications**: Send automatic appointment confirmations
3. ✅ **Property Alerts**: Notify users about new properties matching their criteria
4. ✅ **Status Updates**: Send booking/subscription status updates
5. ✅ **Admin Dashboard**: Manage WhatsApp conversations from admin panel

### Use Cases
- 🏠 Users click "Contact via WhatsApp" on property listings
- 📅 Automatic appointment confirmations sent to users
- 🔔 Property owners receive inquiry notifications
- 💳 Payment confirmations via WhatsApp
- 📊 Admin can view and manage all WhatsApp conversations

---

## 🏗️ **TECHNICAL ARCHITECTURE**

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
│  - WhatsApp contact buttons on property pages           │
│  - Admin WhatsApp conversation dashboard                │
│  - User notification preferences                        │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    API LAYER (Next.js)                   │
│  /api/whatsapp/send       - Send messages               │
│  /api/whatsapp/webhook    - Receive webhooks            │
│  /api/whatsapp/status     - Check delivery status       │
│  /api/whatsapp/templates  - Manage message templates    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                 SERVICE LAYER                            │
│  - WhatsAppService (business logic)                     │
│  - MessageQueue (rate limiting)                         │
│  - TemplateManager (message templates)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│               META CLOUD API                             │
│  - WhatsApp Business API                                │
│  - Message sending/receiving                            │
│  - Media handling                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 **DATABASE SCHEMA UPDATES**

### New Models Required

#### 1. WhatsAppAccount
```prisma
model WhatsAppAccount {
  id                String    @id @default(cuid())
  phoneNumberId     String    @unique // WhatsApp Business Phone Number ID
  phoneNumber       String    // Display phone number
  businessAccountId String    // WhatsApp Business Account ID
  isActive          Boolean   @default(true)
  isVerified        Boolean   @default(false)
  webhookVerified   Boolean   @default(false)
  
  // API Configuration
  accessToken       String    // Encrypted access token
  tokenExpiresAt    DateTime?
  
  // Metadata
  displayName       String?
  profilePictureUrl String?
  timezone          String    @default("UTC")
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  messages          WhatsAppMessage[]
  conversations     WhatsAppConversation[]
  templates         WhatsAppTemplate[]
}
```

#### 2. WhatsAppConversation
```prisma
model WhatsAppConversation {
  id              String    @id @default(cuid())
  accountId       String
  account         WhatsAppAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  // Participant Information
  userPhone       String    // User's WhatsApp number
  userName        String?   // User's name from WhatsApp profile
  
  // Associated Records
  userId          String?
  user            User?     @relation(fields: [userId], references: [id])
  propertyId      Int?
  property        Property? @relation(fields: [propertyId], references: [id])
  
  // Conversation Status
  status          ConversationStatus @default(ACTIVE)
  lastMessageAt   DateTime  @default(now())
  unreadCount     Int       @default(0)
  
  // Assignment
  assignedToUserId String?  // Admin/Agent assigned
  assignedTo       User?    @relation("AssignedConversations", fields: [assignedToUserId], references: [id])
  
  // Metadata
  tags            String[]  // Tags for categorization
  notes           String?   @db.Text
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  messages        WhatsAppMessage[]
  
  @@index([accountId])
  @@index([userId])
  @@index([propertyId])
  @@index([status])
  @@index([lastMessageAt(sort: Desc)])
}

enum ConversationStatus {
  ACTIVE
  ARCHIVED
  BLOCKED
  SPAM
}
```

#### 3. WhatsAppMessage
```prisma
model WhatsAppMessage {
  id              String    @id @default(cuid())
  
  // WhatsApp IDs
  waMessageId     String    @unique // WhatsApp message ID
  accountId       String
  account         WhatsAppAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  conversationId  String
  conversation    WhatsAppConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  // Message Content
  direction       MessageDirection // INBOUND or OUTBOUND
  type            MessageType // TEXT, IMAGE, VIDEO, DOCUMENT, etc.
  content         Json      // Message content (text, media URLs, etc.)
  
  // Sender/Recipient
  fromPhone       String
  toPhone         String
  
  // Status Tracking
  status          MessageStatus @default(SENT)
  errorCode       String?
  errorMessage    String?
  
  // Timing
  sentAt          DateTime  @default(now())
  deliveredAt     DateTime?
  readAt          DateTime?
  
  // Template (if applicable)
  templateName    String?
  templateId      String?
  template        WhatsAppTemplate? @relation(fields: [templateId], references: [id])
  
  // Context (reply/forwarded)
  replyToId       String?
  context         Json?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([accountId])
  @@index([conversationId])
  @@index([waMessageId])
  @@index([direction])
  @@index([status])
  @@index([sentAt(sort: Desc)])
}

enum MessageDirection {
  INBOUND
  OUTBOUND
}

enum MessageType {
  TEXT
  IMAGE
  VIDEO
  DOCUMENT
  AUDIO
  LOCATION
  CONTACTS
  TEMPLATE
  INTERACTIVE
}

enum MessageStatus {
  SENT
  DELIVERED
  READ
  FAILED
  DELETED
}
```

#### 4. WhatsAppTemplate
```prisma
model WhatsAppTemplate {
  id              String    @id @default(cuid())
  accountId       String
  account         WhatsAppAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  // Template Information
  name            String    // Template name
  category        TemplateCategory
  language        String    // Language code (e.g., "en", "fr", "ar")
  status          TemplateStatus @default(PENDING)
  
  // Template Content
  headerType      String?   // TEXT, IMAGE, VIDEO, DOCUMENT
  headerContent   String?
  bodyText        String    @db.Text
  footerText      String?
  
  // Template Variables
  variables       Json?     // Variable mappings
  
  // WhatsApp Template ID
  waTemplateId    String?   @unique
  
  // Usage Statistics
  sentCount       Int       @default(0)
  lastUsedAt      DateTime?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  messages        WhatsAppMessage[]
  
  @@unique([accountId, name, language])
  @@index([accountId])
  @@index([status])
}

enum TemplateCategory {
  MARKETING
  UTILITY
  AUTHENTICATION
}

enum TemplateStatus {
  PENDING
  APPROVED
  REJECTED
  DISABLED
}
```

---

## 🔧 **NPM PACKAGES REQUIRED**

```json
{
  "dependencies": {
    "axios": "^1.6.0",                    // HTTP requests to Meta API
    "whatsapp-web.js": "^1.23.0",         // Alternative WhatsApp client (optional)
    "@whiskeysockets/baileys": "^6.5.0",  // Alternative (optional)
    "qrcode": "^1.5.3",                   // QR code generation
    "crypto-js": "^4.2.0",                // Encryption for tokens
    "ioredis": "^5.3.2",                  // Redis for rate limiting & caching (optional)
    "bull": "^4.12.0"                     // Job queue for message processing (optional)
  },
  "devDependencies": {
    "@types/crypto-js": "^4.2.1"
  }
}
```

---

## 🔐 **ENVIRONMENT VARIABLES**

Create/update `.env.local`:

```bash
# ============================================
# WHATSAPP BUSINESS API (META CLOUD)
# ============================================
WHATSAPP_API_VERSION=v18.0
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_APP_ID=your_app_id
WHATSAPP_APP_SECRET=your_app_secret

# Webhook Configuration
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_random_secure_token_here
WHATSAPP_WEBHOOK_URL=https://yourdomain.com/api/whatsapp/webhook

# Encryption Key for storing sensitive data
WHATSAPP_ENCRYPTION_KEY=your_32_char_encryption_key_here

# Rate Limiting (optional)
REDIS_URL=redis://localhost:6379

# Feature Flags
WHATSAPP_ENABLED=true
WHATSAPP_DEBUG_MODE=false
```

---

## 📁 **FILE STRUCTURE**

```
src/
├── lib/
│   ├── whatsapp/
│   │   ├── client.ts                 # WhatsApp API client
│   │   ├── webhook-handler.ts       # Webhook processing
│   │   ├── message-service.ts       # Message sending logic
│   │   ├── template-service.ts      # Template management
│   │   ├── encryption.ts            # Token encryption
│   │   ├── rate-limiter.ts          # Rate limiting
│   │   ├── validators.ts            # Input validation
│   │   └── types.ts                 # TypeScript types
│   └── actions/
│       └── whatsapp.ts              # Server actions
│
├── app/
│   ├── api/
│   │   └── whatsapp/
│   │       ├── send/
│   │       │   └── route.ts         # Send message endpoint
│   │       ├── webhook/
│   │       │   └── route.ts         # Webhook receiver
│   │       ├── status/
│   │       │   └── route.ts         # Message status
│   │       ├── templates/
│   │       │   └── route.ts         # Template CRUD
│   │       └── conversations/
│   │           └── route.ts         # List conversations
│   │
│   └── [locale]/
│       ├── components/
│       │   ├── WhatsAppButton.tsx       # Contact button
│       │   ├── WhatsAppChat.tsx         # Chat interface
│       │   └── WhatsAppBadge.tsx        # Status badge
│       │
│       └── admin/
│           └── whatsapp/
│               ├── page.tsx             # Main dashboard
│               ├── conversations/
│               │   └── [id]/
│               │       └── page.tsx     # Conversation view
│               └── templates/
│                   └── page.tsx         # Template management
│
└── hooks/
    └── useWhatsApp.ts               # Custom React hook
```

---

## 🚀 **IMPLEMENTATION PHASES**

### **Phase 1: Setup & Configuration** (Day 1)
- [ ] Install required npm packages
- [ ] Update Prisma schema with new models
- [ ] Run database migrations
- [ ] Set up environment variables
- [ ] Create encryption utilities

### **Phase 2: Core API Integration** (Day 2-3)
- [ ] Create WhatsApp API client
- [ ] Implement message sending service
- [ ] Set up webhook endpoint
- [ ] Implement webhook signature verification
- [ ] Add error handling and logging

### **Phase 3: Database & Business Logic** (Day 3-4)
- [ ] Implement conversation management
- [ ] Add message storage logic
- [ ] Create template management system
- [ ] Implement rate limiting
- [ ] Add message queue (optional)

### **Phase 4: Frontend Components** (Day 4-5)
- [ ] Create WhatsApp contact button
- [ ] Add property inquiry modal
- [ ] Implement admin conversation dashboard
- [ ] Create message templates UI
- [ ] Add notification preferences

### **Phase 5: Automation & Notifications** (Day 5-6)
- [ ] Appointment confirmation messages
- [ ] Property inquiry auto-responses
- [ ] Payment confirmation notifications
- [ ] New property alerts
- [ ] Subscription expiry reminders

### **Phase 6: Testing & Optimization** (Day 6-7)
- [ ] Unit tests for services
- [ ] Integration tests for webhooks
- [ ] Load testing for rate limits
- [ ] Security audit
- [ ] Performance optimization

### **Phase 7: Documentation & Deployment** (Day 7)
- [ ] API documentation
- [ ] User guide for admin panel
- [ ] Deployment checklist
- [ ] Monitoring setup
- [ ] Final review

---

## 🔒 **SECURITY BEST PRACTICES**

### 1. **Token Management**
- ✅ Encrypt access tokens in database
- ✅ Use environment variables for sensitive data
- ✅ Implement token rotation
- ✅ Never expose tokens in client-side code

### 2. **Webhook Security**
- ✅ Verify webhook signatures
- ✅ Use HTTPS only
- ✅ Implement replay attack prevention
- ✅ Validate all incoming data

### 3. **Rate Limiting**
- ✅ Respect Meta's API rate limits
- ✅ Implement exponential backoff
- ✅ Queue messages during high traffic
- ✅ Monitor API usage

### 4. **Data Privacy**
- ✅ Comply with GDPR/CCPA
- ✅ Allow users to opt-out
- ✅ Encrypt sensitive user data
- ✅ Implement data retention policies

### 5. **Input Validation**
- ✅ Sanitize all user inputs
- ✅ Validate phone numbers
- ✅ Check message content length
- ✅ Prevent XSS and injection attacks

---

## 📊 **MONITORING & ANALYTICS**

### Metrics to Track
1. **Message Delivery Rate**: % of successfully delivered messages
2. **Response Time**: Time to send message after trigger
3. **Conversation Volume**: Number of active conversations
4. **Template Performance**: Usage and success rates
5. **Error Rate**: Failed messages and reasons
6. **API Usage**: Calls per day/month

### Logging Strategy
```typescript
// Log levels
- ERROR: Failed messages, API errors
- WARN: Rate limit approaching, token expiring
- INFO: Messages sent, webhooks received
- DEBUG: Detailed request/response logs
```

---

## 💰 **COST ESTIMATION**

### WhatsApp Business API Pricing (Approximate)
- **Utility Conversations**: $0.005 - $0.01 per message
- **Marketing Conversations**: $0.03 - $0.06 per message
- **Authentication Conversations**: Free (limited)
- **Service Conversations**: $0.01 - $0.02 per message

### Monthly Estimate (Example)
- 1,000 property inquiries: ~$10
- 500 appointment confirmations: ~$5
- 200 marketing messages: ~$10
**Total**: ~$25/month for moderate usage

---

## 🎨 **UI/UX MOCKUPS**

### Property Page - WhatsApp Button
```
┌────────────────────────────────────┐
│  Property Details                  │
│  --------------------------------  │
│                                    │
│  Price: 500,000 XOF               │
│  Location: Dakar, Senegal         │
│                                    │
│  ┌──────────────┐  ┌────────────┐│
│  │ 📞 Call Now  │  │ 💬 WhatsApp││
│  └──────────────┘  └────────────┘│
└────────────────────────────────────┘
```

### Admin Dashboard
```
┌────────────────────────────────────────────┐
│  WhatsApp Conversations                    │
│  ────────────────────────────────────────  │
│                                            │
│  🟢 Active (23)  ⚪ Archived (45)          │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ +221 77 123 4567    [2 unread]       │ │
│  │ Property: Villa in Dakar              │ │
│  │ Last: "Is it still available?"        │ │
│  │ 2 minutes ago                         │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ +225 07 890 1234    [0 unread]       │ │
│  │ Property: Apartment in Abidjan        │ │
│  │ Last: "Thank you!"                    │ │
│  │ 1 hour ago                            │ │
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

---

## ✅ **SUCCESS CRITERIA**

### Technical Requirements
- ✅ 99% message delivery rate
- ✅ <2 second response time for sending messages
- ✅ 100% webhook processing success
- ✅ Zero security vulnerabilities
- ✅ Full API error handling

### Business Requirements
- ✅ Increase property inquiries by 30%
- ✅ Reduce response time to inquiries by 50%
- ✅ Improve appointment confirmation rate to 95%
- ✅ Provide admin visibility into all conversations
- ✅ Support multi-language templates

---

## 📚 **RESOURCES & DOCUMENTATION**

### Meta Cloud API Documentation
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Cloud API Getting Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Webhooks Guide](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)

### Best Practices
- [WhatsApp Business Policy](https://www.whatsapp.com/legal/business-policy)
- [Commerce Policy](https://www.whatsapp.com/legal/commerce-policy)
- [Rate Limits](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)

---

## 🚨 **TROUBLESHOOTING GUIDE**

### Common Issues

#### 1. Webhook Not Receiving Messages
- ✅ Verify webhook URL is publicly accessible
- ✅ Check HTTPS certificate is valid
- ✅ Confirm webhook verification token matches
- ✅ Check webhook subscription in Meta dashboard

#### 2. Messages Not Sending
- ✅ Verify phone number is valid WhatsApp number
- ✅ Check access token is valid
- ✅ Confirm message template is approved
- ✅ Verify rate limits not exceeded

#### 3. Template Rejection
- ✅ Follow template guidelines strictly
- ✅ Avoid promotional content in utility templates
- ✅ Use proper variable formatting
- ✅ Include required opt-out language for marketing

---

## 🎯 **NEXT STEPS**

1. **Review this plan** with stakeholders
2. **Get WhatsApp Business API access** from Meta
3. **Set up development environment** and test account
4. **Begin Phase 1** implementation
5. **Schedule regular check-ins** for progress tracking

---

## 📞 **SUPPORT CONTACTS**

- **Meta Business Support**: https://business.facebook.com/business/help
- **WhatsApp Business API Support**: Via Meta Business Suite
- **Developer Community**: https://developers.facebook.com/community/

---

**Document Version**: 1.0  
**Last Updated**: December 15, 2025  
**Maintained By**: Development Team  
**Review Cycle**: Monthly

---

## 🎉 **END OF PLAN**

This integration will transform your real estate platform into a modern, WhatsApp-enabled communication hub, providing seamless user experience and improved engagement rates.

**Let's build something amazing! 🚀**


