/**
 * WhatsApp Webhook Handler
 * Processes incoming webhooks from Meta Cloud API
 * @module whatsapp/webhook-handler
 */

import { PrismaClient } from '@prisma/client';
import {
  WebhookEntry,
  WebhookMessage,
  WebhookStatus,
  MessageDirection,
  MessageType,
  MessageStatus,
} from './types';
import { validateWebhookSignature } from './validators';

const prisma = new PrismaClient();

export class WhatsAppWebhookHandler {
  /**
   * Verify webhook challenge (for initial setup)
   */
  static verifyWebhook(params: {
    mode: string;
    token: string;
    challenge: string;
  }): { verified: boolean; challenge?: string } {
    const verifyToken =
      process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "whatsapp_verify_123";

    if (!verifyToken) {
      console.error('[Webhook] WHATSAPP_WEBHOOK_VERIFY_TOKEN not set');
      return { verified: false };
    }

    if (params.mode === 'subscribe' && params.token === verifyToken) {
      console.log('[Webhook] Webhook verified successfully');
      return {
        verified: true,
        challenge: params.challenge,
      };
    }

    console.error('[Webhook] Verification failed');
    return { verified: false };
  }

  /**
   * Validate webhook signature
   */
  static validateSignature(signature: string, payload: string): boolean {
    const appSecret =
      process.env.WHATSAPP_APP_SECRET ?? "c64bcf5adf43290e06abb0730d2ecfde";

    if (!appSecret) {
      console.warn('[Webhook] WHATSAPP_APP_SECRET not set. Signature validation skipped.');
      return true; // Allow in development
    }

    return validateWebhookSignature(signature, payload, appSecret);
  }

  /**
   * Process webhook payload
   */
  static async processWebhook(body: { object: string; entry: WebhookEntry[] }): Promise<void> {
    try {
      if (body.object !== 'whatsapp_business_account') {
        console.warn('[Webhook] Unknown webhook object type:', body.object);
        return;
      }

      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await this.handleMessagesChange(change.value);
          }
        }
      }
    } catch (error) {
      console.error('[Webhook] Process webhook error:', error);
      throw error;
    }
  }

  /**
   * Handle messages webhook change
   */
  private static async handleMessagesChange(value: any): Promise<void> {
    try {
      const { metadata, messages, statuses } = value;

      // Get WhatsApp account
      const account = await prisma.whatsAppAccount.findUnique({
        where: {
          phoneNumberId: metadata.phone_number_id,
        },
      });

      if (!account) {
        console.error('[Webhook] WhatsApp account not found:', metadata.phone_number_id);
        return;
      }

      // Process incoming messages
      if (messages && messages.length > 0) {
        for (const message of messages) {
          await this.handleIncomingMessage(account.id, message, value.contacts);
        }
      }

      // Process status updates
      if (statuses && statuses.length > 0) {
        for (const status of statuses) {
          await this.handleStatusUpdate(account.id, status);
        }
      }
    } catch (error) {
      console.error('[Webhook] Handle messages change error:', error);
      throw error;
    }
  }

  /**
   * Handle incoming message
   */
  private static async handleIncomingMessage(
    accountId: string,
    message: WebhookMessage,
    contacts?: Array<{ profile: { name: string }; wa_id: string }>
  ): Promise<void> {
    try {
      // Check if message already exists (prevent duplicates)
      const existingMessage = await prisma.whatsAppMessage.findUnique({
        where: {
          waMessageId: message.id,
        },
      });

      if (existingMessage) {
        console.log('[Webhook] Message already processed:', message.id);
        return;
      }

      // Get or create conversation
      const conversation = await this.getOrCreateConversation(
        accountId,
        message.from,
        contacts?.find((c) => c.wa_id === message.from)?.profile?.name
      );

      // Parse message content based on type
      const messageType = this.mapMessageType(message.type);
      const content = this.extractMessageContent(message);

      // Store message in database
      const account = await prisma.whatsAppAccount.findUnique({
        where: { id: accountId },
      });

      await prisma.whatsAppMessage.create({
        data: {
          waMessageId: message.id,
          accountId,
          conversationId: conversation.id,
          direction: MessageDirection.INBOUND,
          type: messageType,
          content,
          fromPhone: message.from,
          toPhone: account!.phoneNumber,
          status: MessageStatus.DELIVERED,
          sentAt: new Date(parseInt(message.timestamp) * 1000),
          deliveredAt: new Date(),
          context: message.context,
        },
      });

      // Update conversation
      await prisma.whatsAppConversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
          unreadCount: {
            increment: 1,
          },
        },
      });

      console.log('[Webhook] Incoming message processed:', message.id);

      // TODO: Trigger notification to admin/agent
      // TODO: Auto-reply logic (if configured)
    } catch (error) {
      console.error('[Webhook] Handle incoming message error:', error);
      throw error;
    }
  }

  /**
   * Handle status update
   */
  private static async handleStatusUpdate(
    accountId: string,
    status: WebhookStatus
  ): Promise<void> {
    try {
      const message = await prisma.whatsAppMessage.findUnique({
        where: {
          waMessageId: status.id,
        },
      });

      if (!message) {
        console.warn('[Webhook] Message not found for status update:', status.id);
        return;
      }

      const messageStatus = this.mapMessageStatus(status.status);
      const updateData: any = {
        status: messageStatus,
      };

      if (status.status === 'delivered') {
        updateData.deliveredAt = new Date(parseInt(status.timestamp) * 1000);
      } else if (status.status === 'read') {
        updateData.readAt = new Date(parseInt(status.timestamp) * 1000);
      } else if (status.status === 'failed') {
        updateData.errorCode = status.errors?.[0]?.code?.toString();
        updateData.errorMessage = status.errors?.[0]?.message;
      }

      await prisma.whatsAppMessage.update({
        where: { id: message.id },
        data: updateData,
      });

      console.log('[Webhook] Status updated:', {
        messageId: status.id,
        status: status.status,
      });
    } catch (error) {
      console.error('[Webhook] Handle status update error:', error);
      throw error;
    }
  }

  /**
   * Get or create conversation
   */
  private static async getOrCreateConversation(
    accountId: string,
    userPhone: string,
    userName?: string
  ) {
    try {
      // Try to find existing active conversation
      let conversation = await prisma.whatsAppConversation.findFirst({
        where: {
          accountId,
          userPhone,
          status: 'ACTIVE',
        },
      });

      // Create new conversation if not found
      if (!conversation) {
        conversation = await prisma.whatsAppConversation.create({
          data: {
            accountId,
            userPhone,
            userName,
            status: 'ACTIVE',
          },
        });

        console.log('[Webhook] New conversation created:', conversation.id);
      } else if (userName && !conversation.userName) {
        // Update conversation with user name if we have it
        conversation = await prisma.whatsAppConversation.update({
          where: { id: conversation.id },
          data: { userName },
        });
      }

      return conversation;
    } catch (error) {
      console.error('[Webhook] Get or create conversation error:', error);
      throw error;
    }
  }

  /**
   * Map WhatsApp message type to database enum
   */
  private static mapMessageType(type: string): MessageType {
    const typeMap: Record<string, MessageType> = {
      text: MessageType.TEXT,
      image: MessageType.IMAGE,
      video: MessageType.VIDEO,
      document: MessageType.DOCUMENT,
      audio: MessageType.AUDIO,
      location: MessageType.LOCATION,
      contacts: MessageType.CONTACTS,
      interactive: MessageType.INTERACTIVE,
    };

    return typeMap[type] || MessageType.TEXT;
  }

  /**
   * Map WhatsApp message status to database enum
   */
  private static mapMessageStatus(status: string): MessageStatus {
    const statusMap: Record<string, MessageStatus> = {
      sent: MessageStatus.SENT,
      delivered: MessageStatus.DELIVERED,
      read: MessageStatus.READ,
      failed: MessageStatus.FAILED,
      deleted: MessageStatus.DELETED,
    };

    return statusMap[status] || MessageStatus.SENT;
  }

  /**
   * Extract message content from webhook message
   */
  private static extractMessageContent(message: WebhookMessage): any {
    switch (message.type) {
      case 'text':
        return {
          text: message.text?.body,
        };

      case 'image':
        return {
          id: message.image?.id,
          mimeType: message.image?.mime_type,
          sha256: message.image?.sha256,
          caption: message.image?.caption,
        };

      case 'video':
        return {
          id: message.video?.id,
          mimeType: message.video?.mime_type,
          sha256: message.video?.sha256,
          caption: message.video?.caption,
        };

      case 'document':
        return {
          id: message.document?.id,
          mimeType: message.document?.mime_type,
          sha256: message.document?.sha256,
          filename: message.document?.filename,
          caption: message.document?.caption,
        };

      case 'audio':
        return {
          id: message.audio?.id,
          mimeType: message.audio?.mime_type,
          sha256: message.audio?.sha256,
          voice: message.audio?.voice,
        };

      case 'location':
        return {
          latitude: message.location?.latitude,
          longitude: message.location?.longitude,
          name: message.location?.name,
          address: message.location?.address,
        };

      case 'contacts':
        return {
          contacts: message.contacts,
        };

      case 'interactive':
        return {
          type: message.interactive?.type,
          buttonReply: message.interactive?.button_reply,
          listReply: message.interactive?.list_reply,
        };

      case 'button':
        return {
          payload: message.button?.payload,
          text: message.button?.text,
        };

      default:
        return {
          type: message.type,
          raw: message,
        };
    }
  }
}

/**
 * Export webhook handler functions
 */
export const verifyWebhook = WhatsAppWebhookHandler.verifyWebhook;
export const validateSignature = WhatsAppWebhookHandler.validateSignature;
export const processWebhook = WhatsAppWebhookHandler.processWebhook;


