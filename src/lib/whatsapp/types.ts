/**
 * WhatsApp Business API - TypeScript Type Definitions
 * @module whatsapp/types
 */

// ============================================
// ENUMS
// ============================================

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
  LOCATION = 'LOCATION',
  CONTACTS = 'CONTACTS',
  TEMPLATE = 'TEMPLATE',
  INTERACTIVE = 'INTERACTIVE',
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  DELETED = 'DELETED',
}

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  BLOCKED = 'BLOCKED',
  SPAM = 'SPAM',
}

export enum TemplateCategory {
  MARKETING = 'MARKETING',
  UTILITY = 'UTILITY',
  AUTHENTICATION = 'AUTHENTICATION',
}

export enum TemplateStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISABLED = 'DISABLED',
}

// ============================================
// MESSAGE INTERFACES
// ============================================

export interface TextMessage {
  body: string;
  preview_url?: boolean;
}

export interface MediaMessage {
  link?: string;
  id?: string;
  caption?: string;
  filename?: string;
}

export interface LocationMessage {
  longitude: number;
  latitude: number;
  name?: string;
  address?: string;
}

export interface ContactMessage {
  addresses?: ContactAddress[];
  birthday?: string;
  emails?: ContactEmail[];
  name: ContactName;
  org?: ContactOrg;
  phones?: ContactPhone[];
  urls?: ContactUrl[];
}

export interface ContactAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  country_code?: string;
  type?: 'HOME' | 'WORK';
}

export interface ContactEmail {
  email?: string;
  type?: 'HOME' | 'WORK';
}

export interface ContactName {
  formatted_name: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  suffix?: string;
  prefix?: string;
}

export interface ContactOrg {
  company?: string;
  department?: string;
  title?: string;
}

export interface ContactPhone {
  phone?: string;
  wa_id?: string;
  type?: 'CELL' | 'MAIN' | 'IPHONE' | 'HOME' | 'WORK';
}

export interface ContactUrl {
  url?: string;
  type?: 'HOME' | 'WORK';
}

export interface InteractiveMessage {
  type: 'button' | 'list' | 'product' | 'product_list';
  header?: {
    type: 'text' | 'video' | 'image' | 'document';
    text?: string;
    video?: MediaMessage;
    image?: MediaMessage;
    document?: MediaMessage;
  };
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: InteractiveAction;
}

export interface InteractiveAction {
  button?: string;
  buttons?: InteractiveButton[];
  sections?: InteractiveSection[];
  catalog_id?: string;
  product_retailer_id?: string;
}

export interface InteractiveButton {
  type: 'reply';
  reply: {
    id: string;
    title: string;
  };
}

export interface InteractiveSection {
  title?: string;
  rows: InteractiveRow[];
}

export interface InteractiveRow {
  id: string;
  title: string;
  description?: string;
}

export interface TemplateMessage {
  name: string;
  language: {
    code: string;
  };
  components?: TemplateComponent[];
}

export interface TemplateComponent {
  type: 'header' | 'body' | 'button';
  parameters: TemplateParameter[];
  sub_type?: string;
  index?: number;
}

export interface TemplateParameter {
  type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video';
  text?: string;
  currency?: {
    fallback_value: string;
    code: string;
    amount_1000: number;
  };
  date_time?: {
    fallback_value: string;
  };
  image?: MediaMessage;
  document?: MediaMessage;
  video?: MediaMessage;
}

// ============================================
// API REQUEST/RESPONSE INTERFACES
// ============================================

export interface SendMessageRequest {
  messaging_product: 'whatsapp';
  recipient_type?: 'individual';
  to: string;
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'location' | 'contacts' | 'template' | 'interactive';
  text?: TextMessage;
  image?: MediaMessage;
  video?: MediaMessage;
  document?: MediaMessage;
  audio?: MediaMessage;
  location?: LocationMessage;
  contacts?: ContactMessage[];
  template?: TemplateMessage;
  interactive?: InteractiveMessage;
  context?: {
    message_id: string;
  };
}

export interface SendMessageResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
    message_status?: string;
  }>;
}

export interface WebhookEntry {
  id: string;
  changes: WebhookChange[];
}

export interface WebhookChange {
  value: {
    messaging_product: string;
    metadata: {
      display_phone_number: string;
      phone_number_id: string;
    };
    contacts?: Array<{
      profile: {
        name: string;
      };
      wa_id: string;
    }>;
    messages?: WebhookMessage[];
    statuses?: WebhookStatus[];
    errors?: WebhookError[];
  };
  field: string;
}

export interface WebhookMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
  image?: {
    caption?: string;
    mime_type: string;
    sha256: string;
    id: string;
  };
  video?: {
    caption?: string;
    mime_type: string;
    sha256: string;
    id: string;
  };
  document?: {
    caption?: string;
    filename: string;
    mime_type: string;
    sha256: string;
    id: string;
  };
  audio?: {
    mime_type: string;
    sha256: string;
    id: string;
    voice: boolean;
  };
  location?: LocationMessage;
  contacts?: ContactMessage[];
  interactive?: {
    type: string;
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
  button?: {
    payload: string;
    text: string;
  };
  context?: {
    from: string;
    id: string;
  };
}

export interface WebhookStatus {
  id: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'deleted';
  timestamp: string;
  recipient_id: string;
  conversation?: {
    id: string;
    origin: {
      type: string;
    };
  };
  pricing?: {
    billable: boolean;
    pricing_model: string;
    category: string;
  };
  errors?: WebhookError[];
}

export interface WebhookError {
  code: number;
  title: string;
  message: string;
  error_data?: {
    details: string;
  };
}

// ============================================
// SERVICE INTERFACES
// ============================================

export interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  apiVersion: string;
  webhookVerifyToken?: string;
  businessAccountId?: string;
}

export interface SendTextMessageOptions {
  to: string;
  message: string;
  previewUrl?: boolean;
  replyToMessageId?: string;
}

export interface SendMediaMessageOptions {
  to: string;
  mediaUrl?: string;
  mediaId?: string;
  caption?: string;
  filename?: string;
  replyToMessageId?: string;
}

export interface SendTemplateMessageOptions {
  to: string;
  templateName: string;
  languageCode: string;
  components?: TemplateComponent[];
}

export interface SendLocationMessageOptions {
  to: string;
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface MarkMessageAsReadOptions {
  messageId: string;
}

export interface GetMediaUrlOptions {
  mediaId: string;
}

export interface UploadMediaOptions {
  file: Buffer | Blob;
  mimeType: string;
}

// ============================================
// DATABASE MODELS (matching Prisma schema)
// ============================================

export interface WhatsAppAccount {
  id: string;
  phoneNumberId: string;
  phoneNumber: string;
  businessAccountId: string;
  isActive: boolean;
  isVerified: boolean;
  webhookVerified: boolean;
  accessToken: string;
  tokenExpiresAt?: Date;
  displayName?: string;
  profilePictureUrl?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppConversation {
  id: string;
  accountId: string;
  userPhone: string;
  userName?: string;
  userId?: string;
  propertyId?: number;
  status: ConversationStatus;
  lastMessageAt: Date;
  unreadCount: number;
  assignedToUserId?: string;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppMessage {
  id: string;
  waMessageId: string;
  accountId: string;
  conversationId: string;
  direction: MessageDirection;
  type: MessageType;
  content: any; // JSON
  fromPhone: string;
  toPhone: string;
  status: MessageStatus;
  errorCode?: string;
  errorMessage?: string;
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  templateName?: string;
  templateId?: string;
  replyToId?: string;
  context?: any; // JSON
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppTemplate {
  id: string;
  accountId: string;
  name: string;
  category: TemplateCategory;
  language: string;
  status: TemplateStatus;
  headerType?: string;
  headerContent?: string;
  bodyText: string;
  footerText?: string;
  variables?: any; // JSON
  waTemplateId?: string;
  sentCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// UTILITY TYPES
// ============================================

export interface ApiError {
  code: number;
  message: string;
  details?: any;
  isTokenExpired?: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

export interface WebhookVerification {
  'hub.mode': string;
  'hub.challenge': string;
  'hub.verify_token': string;
}


