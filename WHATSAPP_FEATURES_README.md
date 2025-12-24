# WhatsApp Features Documentation

## Table of Contents
- [Overview](#overview)
- [Features List](#features-list)
- [Component Details](#component-details)
- [API Routes](#api-routes)
- [Services & Libraries](#services--libraries)
- [How It Works](#how-it-works)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

---

## Overview

This real estate website integrates comprehensive WhatsApp Business API functionality to enable seamless communication between property seekers, property owners, and real estate agents. The integration includes floating widgets, contact buttons, automated messaging, webhook handling, and conversation management.

### Key Technologies
- **WhatsApp Business Cloud API** (Meta Graph API v18.0)
- **Next.js 14+** (App Router with Server Components)
- **Prisma ORM** for database operations
- **TypeScript** for type safety
- **NextUI** for UI components

---

## Features List

### 1. **Floating WhatsApp Widget**
- Persistent floating button on all pages
- Appears after 5 seconds with smooth animation
- Opens a chat modal for quick messaging
- Fully responsive and customizable

### 2. **WhatsApp Contact Button**
- Multiple variants: button, icon, link, floating
- Property-aware messaging with auto-populated details
- GDPR consent checkbox support
- Fallback to wa.me links if API fails

### 3. **Quick Actions Component**
- Send property link via WhatsApp
- Schedule property visit
- Request property information
- Quick access to common actions

### 4. **Conversation Management**
- User dashboard to view all WhatsApp conversations
- Message history with read/unread status
- Property-linked conversations
- Real-time message status updates

### 5. **Automated Bot Service**
- Welcome messages for new conversations
- Lead qualification (Buyer/Seller detection)
- Property reference extraction
- Priority keyword detection

### 6. **Notification Service**
- Appointment confirmations
- Payment confirmations
- Property alerts
- Subscription expiry reminders
- Appointment reminders (24h before)
- Owner notifications

### 7. **Webhook Integration**
- Receives incoming messages from Meta
- Status updates (sent, delivered, read, failed)
- Signature validation for security
- Automatic conversation creation

### 8. **Message Types Support**
- Text messages
- Images (with captions)
- Videos (with captions)
- Documents (with filenames)
- Audio messages
- Location sharing
- Template messages

---

## Component Details

### WhatsAppFloatingWidget

**Location:** `src/app/[locale]/components/WhatsAppFloatingWidget.tsx`

**Description:** A floating WhatsApp button that appears on all pages with a chat interface.

**Features:**
- Customizable position (bottom-right, bottom-left)
- Delayed appearance (default: 5 seconds)
- Chat modal with message input
- Direct message sending via API
- Fallback to wa.me if API token expired
- Google Analytics tracking integration

**Usage:**
```tsx
<WhatsAppFloatingWidget
  phoneNumber="+212612345678"
  companyName="Afrique Avenir Immobilier"
  greeting="Besoin d'aide? Contactez-nous!"
  position="bottom-right"
  showAfter={5000}
/>
```

**How It Works:**
1. Renders a floating button with WhatsApp icon
2. On click, opens a modal with message input
3. Sends message via `/api/whatsapp/send` endpoint
4. Tracks user interaction with GA4
5. Falls back to `wa.me` link if API fails

---

### WhatsAppContactButton

**Location:** `src/app/[locale]/components/WhatsAppContactButton.tsx`

**Description:** Versatile button component for initiating WhatsApp conversations with property context.

**Features:**
- 4 variants: `button`, `icon`, `link`, `floating`
- 3 sizes: `sm`, `md`, `lg`
- Property-aware messaging (includes property ID, name, price, URL)
- GDPR consent checkbox
- Business API integration with wa.me fallback
- Multilingual property name support

**Usage:**
```tsx
<WhatsAppContactButton
  phoneNumber="+212612345678"
  propertyId={123}
  propertyName="Villa à Rabat"
  propertyPrice="500,000 MAD"
  propertyUrl="https://example.com/property/123"
  message="Bonjour, je souhaite des informations..."
  variant="button"
  size="md"
  useBusinessAPI={true}
  buttonType="contact_agent"
  requireGDPRConsent={true}
/>
```

**Message Format:**
When `propertyId` and `propertyName` are provided, the message automatically formats as:
```
"Bonjour, je souhaite des informations concernant la référence [ID_BIEN] ([TITRE_BIEN])."
```

**How It Works:**
1. User clicks the button
2. Checks GDPR consent if required
3. Builds message with property details
4. Attempts to send via Business API (`/api/whatsapp/send`)
5. If token expired (error 190), falls back to `wa.me` link
6. Tracks click event in Google Analytics

---

### WhatsAppQuickActions

**Location:** `src/app/[locale]/components/WhatsAppQuickActions.tsx`

**Description:** Quick action buttons for common WhatsApp interactions related to properties.

**Actions Available:**
1. **Send Property Link** - Sends property URL via WhatsApp
2. **Schedule Visit** - Requests a property visit appointment
3. **Request Information** - Asks for property details

**Usage:**
```tsx
<WhatsAppQuickActions
  phoneNumber="+212612345678"
  propertyId={123}
  propertyName="Villa à Rabat"
  propertyUrl="https://example.com/property/123"
  propertyPrice="500,000 MAD"
/>
```

**How It Works:**
1. Displays a card with 3 quick action buttons
2. Each button sends a pre-formatted message via API
3. Includes property details in the message
4. Tracks actions with GA4
5. Falls back to wa.me if API unavailable

---

### WhatsAppConversationsClient

**Location:** `src/app/[locale]/user/whatsapp/_components/WhatsAppConversationsClient.tsx`

**Description:** User-facing dashboard to view and manage WhatsApp conversations.

**Features:**
- List all user conversations
- Show last message preview
- Display unread count
- Property-linked conversations
- Account status display

**How It Works:**
1. Fetches conversations from database (server component)
2. Displays in a conversation list UI
3. Links to individual conversation details
4. Shows property information when available

---

### WhatsAppWidgetProvider

**Location:** `src/app/[locale]/components/WhatsAppWidgetProvider.tsx`

**Description:** Server component that fetches WhatsApp account configuration and provides it to the floating widget.

**How It Works:**
1. Queries database for active WhatsApp account
2. Passes phone number and display name to client component
3. Returns `null` if no active account found
4. Used in root layout for global availability

---

## API Routes

### POST /api/whatsapp/send

**Purpose:** Send messages via WhatsApp Business API

**Authentication:** Required (Kinde auth)

**Request Body:**
```json
{
  "to": "+212612345678",
  "message": "Hello, I'm interested in this property",
  "type": "text",
  "propertyId": 123,
  "conversationId": "optional-existing-conversation-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [{ "id": "wamid.xxx" }],
    "conversationId": "conv-id"
  }
}
```

**How It Works:**
1. Validates user authentication
2. Normalizes phone number (adds country prefix if missing)
3. Validates phone number format
4. Gets or creates conversation
5. Sends message via MessageService
6. Stores message in database
7. Returns success/error response

**Error Handling:**
- If token expired (error 190), returns `isTokenExpired: true` flag
- Client components handle fallback to wa.me link

---

### GET/POST /api/whatsapp/webhook

**Purpose:** Receive webhooks from Meta Cloud API

**GET Request (Verification):**
- Used by Meta to verify webhook during setup
- Parameters: `hub.mode`, `hub.verify_token`, `hub.challenge`
- Returns challenge string if verified

**POST Request (Events):**
- Receives message events and status updates
- Validates webhook signature (production only)
- Processes asynchronously
- Always returns 200 OK to Meta

**Webhook Events Handled:**
1. **Incoming Messages:**
   - Stores message in database
   - Creates conversation if needed
   - Triggers bot service (welcome message)
   - Updates conversation unread count

2. **Status Updates:**
   - Updates message status (sent → delivered → read)
   - Stores delivery timestamps
   - Handles failed messages with error codes

**How It Works:**
1. Meta sends POST request with webhook payload
2. Validates signature using `x-hub-signature-256` header
3. Parses webhook entry
4. Processes messages and statuses
5. Updates database accordingly
6. Returns 200 OK immediately (async processing)

---

### GET /api/whatsapp/conversations

**Purpose:** Get user's WhatsApp conversations

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "conv-id",
      "userPhone": "+212612345678",
      "propertyId": 123,
      "lastMessageAt": "2024-01-01T00:00:00Z",
      "unreadCount": 2,
      "messages": [...]
    }
  ]
}
```

---

## Services & Libraries

### WhatsAppClient (`src/lib/whatsapp/client.ts`)

**Purpose:** Low-level API client for Meta Graph API

**Key Methods:**
- `sendTextMessage()` - Send text messages
- `sendImageMessage()` - Send images with captions
- `sendVideoMessage()` - Send videos with captions
- `sendDocumentMessage()` - Send documents
- `sendTemplateMessage()` - Send template messages
- `sendLocationMessage()` - Send location coordinates
- `markAsRead()` - Mark messages as read
- `getMediaUrl()` - Get media URL from media ID
- `downloadMedia()` - Download media files

**Error Handling:**
- Detects token expiration (error code 190)
- Formats errors consistently
- Includes `isTokenExpired` flag in error responses

---

### WhatsAppMessageService (`src/lib/whatsapp/message-service.ts`)

**Purpose:** High-level service for sending messages with database integration

**Key Methods:**
- `sendText()` - Send text and store in DB
- `sendImage()` - Send image and store in DB
- `sendVideo()` - Send video and store in DB
- `sendDocument()` - Send document and store in DB
- `sendTemplate()` - Send template and store in DB
- `sendLocation()` - Send location and store in DB
- `getOrCreateConversation()` - Manage conversations
- `markAsRead()` - Mark message as read
- `getMessages()` - Retrieve conversation messages

**How It Works:**
1. Uses WhatsAppClient to send via API
2. Stores message in database with metadata
3. Updates conversation timestamps
4. Tracks template usage statistics
5. Handles token expiration gracefully

---

### WhatsAppWebhookHandler (`src/lib/whatsapp/webhook-handler.ts`)

**Purpose:** Process incoming webhooks from Meta

**Key Methods:**
- `verifyWebhook()` - Verify webhook during setup
- `validateSignature()` - Validate webhook signature
- `processWebhook()` - Process webhook payload

**How It Works:**
1. Verifies webhook token during Meta setup
2. Validates signature for POST requests
3. Processes incoming messages:
   - Stores in database
   - Creates/finds conversation
   - Triggers bot service
4. Processes status updates:
   - Updates message status
   - Stores timestamps
   - Handles errors

---

### WhatsAppBotService (`src/lib/whatsapp/bot-service.ts`)

**Purpose:** Automated conversation handling and lead qualification

**Key Methods:**
- `sendWelcomeMessage()` - Send welcome with options
- `processUserResponse()` - Qualify lead (Buyer/Seller)
- `extractPropertyReference()` - Extract property ID from message
- `detectPriorityKeywords()` - Detect urgent messages
- `hasWelcomeBeenSent()` - Check if welcome already sent

**Lead Qualification:**
- Detects buyer keywords: "buy", "rent", "acheter", "louer"
- Detects seller keywords: "sell", "list", "vendre"
- Stores lead type in conversation context

**Welcome Message Flow:**
1. User sends first message
2. Bot checks if welcome already sent
3. If not, sends welcome with options:
   ```
   "Hello! Welcome to Afrique Avenir Immobilier.
   To better assist you, what is the nature of your inquiry?
   
   Please reply with:
   🏠 1 - Buy or Rent a property
   🔑 2 - Sell or List a property"
   ```
4. Processes user response to qualify lead

---

### WhatsAppNotificationService (`src/lib/whatsapp/notifications.ts`)

**Purpose:** Send automated notifications for various events

**Notification Types:**
1. **Appointment Confirmation**
   - Sent when appointment is confirmed
   - Includes date, time, property details, address

2. **Payment Confirmation**
   - Sent after successful payment
   - Includes amount, plan name, transaction ID

3. **New Property Alert**
   - Sent to subscribed users
   - Includes property name, location, price, URL

4. **Subscription Expiry Reminder**
   - Sent before subscription expires
   - Shows days remaining and expiry date

5. **Owner Appointment Notification**
   - Sent to property owner about new visit request
   - Includes visitor name, date, time, property

6. **Appointment Reminder**
   - Sent 24 hours before appointment
   - Reminds user of upcoming visit

**Usage Example:**
```typescript
const notificationService = createNotificationService(accountId);
await notificationService.sendAppointmentConfirmation(appointmentId, 'fr');
```

---

### Validators (`src/lib/whatsapp/validators.ts`)

**Purpose:** Validation utilities for phone numbers, messages, URLs

**Functions:**
- `isValidPhoneNumber()` - Validate phone format
- `formatPhoneNumber()` - Format to E.164 format
- `normalizePhoneNumber()` - Add country prefix if missing
- `validateMessageContent()` - Validate message length/content
- `isValidUrl()` - Validate URL format
- `isValidCoordinates()` - Validate latitude/longitude
- `validateWebhookSignature()` - Validate Meta webhook signature

---

## How It Works

### Message Sending Flow

```
User clicks WhatsApp button
    ↓
Component calls /api/whatsapp/send
    ↓
API validates authentication & phone number
    ↓
Gets/creates conversation in database
    ↓
MessageService.sendText() called
    ↓
WhatsAppClient sends to Meta API
    ↓
Meta API sends message
    ↓
Response stored in database
    ↓
Success response to user
```

### Incoming Message Flow

```
User sends WhatsApp message
    ↓
Meta sends webhook to /api/whatsapp/webhook
    ↓
WebhookHandler validates signature
    ↓
Processes incoming message
    ↓
Stores message in database
    ↓
Creates/finds conversation
    ↓
Checks if welcome message needed
    ↓
BotService sends welcome if first message
    ↓
Updates conversation unread count
    ↓
Returns 200 OK to Meta
```

### Token Expiration Handling

```
Business API call fails with error 190
    ↓
Error includes isTokenExpired: true
    ↓
Client component detects token expired
    ↓
Falls back to wa.me link
    ↓
Opens WhatsApp web/app directly
    ↓
User can still contact via WhatsApp
```

---

## Usage Examples

### Basic Contact Button

```tsx
import WhatsAppContactButton from '@/app/[locale]/components/WhatsAppContactButton';

export default function PropertyPage({ property }) {
  return (
    <WhatsAppContactButton
      phoneNumber={property.contact?.phone}
      propertyId={property.id}
      propertyName={property.name}
      propertyPrice={property.price}
      variant="button"
    />
  );
}
```

### Floating Widget in Layout

```tsx
import WhatsAppWidgetProvider from '@/app/[locale]/components/WhatsAppWidgetProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <WhatsAppWidgetProvider />
      </body>
    </html>
  );
}
```

### Quick Actions on Property Page

```tsx
import WhatsAppQuickActions from '@/app/[locale]/components/WhatsAppQuickActions';

export default function PropertyDetails({ property }) {
  return (
    <div>
      <PropertyInfo property={property} />
      <WhatsAppQuickActions
        phoneNumber={property.contact?.phone}
        propertyId={property.id}
        propertyName={property.name}
        propertyUrl={`https://example.com/property/${property.id}`}
        propertyPrice={property.price}
      />
    </div>
  );
}
```

### Sending Notification

```typescript
import { createNotificationService } from '@/lib/whatsapp/notifications';

// In your appointment booking handler
const notificationService = createNotificationService(accountId);
await notificationService.sendAppointmentConfirmation(appointmentId, locale);
```

### Sending Message Programmatically

```typescript
import { createMessageService } from '@/lib/whatsapp/message-service';
import prisma from '@/lib/prisma';

const account = await prisma.whatsAppAccount.findFirst({ 
  where: { isActive: true } 
});
const messageService = createMessageService(account.id);

const conversationId = await messageService.getOrCreateConversation(
  '+212612345678',
  propertyId
);

await messageService.sendText(conversationId, {
  to: '+212612345678',
  message: 'Hello, your appointment is confirmed!',
});
```

---

## Configuration

### Environment Variables

```env
# WhatsApp Business API Configuration
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_API_VERSION=v18.0
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_verify_token
WHATSAPP_APP_SECRET=your_app_secret

# Optional
WHATSAPP_DEBUG_MODE=true
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Database Schema (Prisma)

```prisma
model WhatsAppAccount {
  id            String   @id @default(cuid())
  phoneNumberId String   @unique
  phoneNumber   String
  displayName   String?
  accessToken   String   @db.Text
  isActive      Boolean  @default(true)
  isVerified    Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  conversations WhatsAppConversation[]
  messages      WhatsAppMessage[]
  templates     WhatsAppTemplate[]
}

model WhatsAppConversation {
  id             String   @id @default(cuid())
  accountId      String
  userPhone      String
  userName       String?
  propertyId     Int?
  status         String   @default("ACTIVE")
  unreadCount    Int      @default(0)
  lastMessageAt  DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  account  WhatsAppAccount @relation(fields: [accountId], references: [id])
  property Property?       @relation(fields: [propertyId], references: [id])
  messages WhatsAppMessage[]
}

model WhatsAppMessage {
  id            String   @id @default(cuid())
  waMessageId   String   @unique
  accountId     String
  conversationId String
  direction     String   // INBOUND | OUTBOUND
  type          String   // TEXT | IMAGE | VIDEO | DOCUMENT | AUDIO | LOCATION | TEMPLATE
  content       Json
  fromPhone     String
  toPhone       String
  status        String   // SENT | DELIVERED | READ | FAILED
  sentAt        DateTime?
  deliveredAt   DateTime?
  readAt        DateTime?
  errorCode     String?
  errorMessage  String?
  replyToId     String?
  templateId    String?
  templateName  String?
  createdAt     DateTime @default(now())
  
  account      WhatsAppAccount     @relation(fields: [accountId], references: [id])
  conversation WhatsAppConversation @relation(fields: [conversationId], references: [id])
  template     WhatsAppTemplate?   @relation(fields: [templateId], references: [id])
}
```

---

## Database Schema

### Tables Overview

1. **WhatsAppAccount**
   - Stores WhatsApp Business API credentials
   - One active account at a time
   - Links to conversations and messages

2. **WhatsAppConversation**
   - Represents a conversation thread
   - Linked to user phone number
   - Can be linked to a property
   - Tracks unread count and last message time

3. **WhatsAppMessage**
   - Stores all messages (inbound and outbound)
   - Includes content (JSON), status, timestamps
   - Links to conversation and account
   - Supports reply chains via `replyToId`

4. **WhatsAppTemplate** (optional)
   - Stores approved message templates
   - Tracks usage statistics

---

## Troubleshooting

### Token Expired Error

**Symptom:** Error 190 or `isTokenExpired: true`

**Solution:**
- The system automatically falls back to `wa.me` links
- Update `WHATSAPP_ACCESS_TOKEN` in environment variables
- Generate new token from Meta Business Suite

### Webhook Not Receiving Messages

**Checklist:**
1. Verify webhook URL is correct in Meta Business Suite
2. Ensure `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches Meta settings
3. Check webhook is subscribed to "messages" field
4. Verify webhook URL is publicly accessible (not localhost)
5. Check server logs for webhook verification errors

### Messages Not Sending

**Common Causes:**
1. Invalid phone number format (must include country code)
2. Phone number not registered on WhatsApp
3. Token expired (check error code 190)
4. Rate limiting (check Meta API limits)
5. Phone number not verified in Meta Business Suite

### Database Errors

**Check:**
1. Prisma schema is up to date
2. Database migrations are applied
3. Foreign key constraints are satisfied
4. Required fields are provided

### Debug Mode

Enable debug logging:
```env
WHATSAPP_DEBUG_MODE=true
```

This will log:
- All API requests/responses
- Webhook payloads
- Error details
- Message processing steps

---

## Best Practices

1. **Phone Number Format**
   - Always use E.164 format: `+[country code][number]`
   - Example: `+212612345678` (Morocco)

2. **Error Handling**
   - Always check `isTokenExpired` flag
   - Provide fallback to wa.me links
   - Log errors for debugging

3. **Rate Limiting**
   - Respect Meta API rate limits
   - Implement queuing for bulk messages
   - Cache conversation IDs

4. **Security**
   - Never expose access tokens in client code
   - Validate webhook signatures in production
   - Use environment variables for secrets

5. **User Experience**
   - Show loading states during API calls
   - Provide clear error messages
   - Track user interactions with analytics

---

## Future Enhancements

Potential improvements:
- [ ] Rich media message templates
- [ ] Automated response templates
- [ ] Conversation search and filtering
- [ ] Message scheduling
- [ ] Bulk message sending
- [ ] Analytics dashboard
- [ ] Template message management UI
- [ ] Multi-account support
- [ ] Message encryption at rest
- [ ] Admin conversation management interface

---

## Support

For issues or questions:
1. Check server logs for error messages
2. Review Meta Business Suite webhook logs
3. Verify environment variables are set correctly
4. Test webhook endpoint manually
5. Check WhatsApp Business API documentation

---

**Last Updated:** January 2024
**Version:** 1.0.0










