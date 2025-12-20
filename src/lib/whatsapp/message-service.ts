/**
 * WhatsApp Message Service
 * Handles business logic for sending messages and storing them in the database
 * @module whatsapp/message-service
 */

import { PrismaClient } from '@prisma/client';
import { createWhatsAppClient } from './client';
import {
  SendTextMessageOptions,
  SendMediaMessageOptions,
  SendTemplateMessageOptions,
  SendLocationMessageOptions,
  ApiResponse,
  SendMessageResponse,
  MessageDirection,
  MessageType,
  MessageStatus,
} from './types';

const prisma = new PrismaClient();

export class WhatsAppMessageService {
  private client: ReturnType<typeof createWhatsAppClient>;
  private accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
    this.client = createWhatsAppClient();
  }

  /**
   * Send text message and store in database
   */
  async sendText(
    conversationId: string,
    options: SendTextMessageOptions
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      // Send message via WhatsApp API
      const result = await this.client.sendTextMessage(options);

      // If token expired, return immediately without storing
      if (!result.success && result.error?.isTokenExpired) {
        return result;
      }

      if (result.success && result.data) {
        // Store message in database
        await this.storeOutboundMessage({
          conversationId,
          waMessageId: result.data.messages[0].id,
          toPhone: options.to,
          type: MessageType.TEXT,
          content: { text: options.message },
          replyToId: options.replyToMessageId,
        });

        // Update conversation last message time
        await this.updateConversationTimestamp(conversationId);
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Send text error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send message',
        },
      };
    }
  }

  /**
   * Send image message and store in database
   */
  async sendImage(
    conversationId: string,
    options: SendMediaMessageOptions
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const result = await this.client.sendImageMessage(options);

      // If token expired, return immediately without storing
      if (!result.success && result.error?.isTokenExpired) {
        return result;
      }

      if (result.success && result.data) {
        await this.storeOutboundMessage({
          conversationId,
          waMessageId: result.data.messages[0].id,
          toPhone: options.to,
          type: MessageType.IMAGE,
          content: {
            url: options.mediaUrl,
            id: options.mediaId,
            caption: options.caption,
          },
          replyToId: options.replyToMessageId,
        });

        await this.updateConversationTimestamp(conversationId);
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Send image error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send image',
        },
      };
    }
  }

  /**
   * Send video message and store in database
   */
  async sendVideo(
    conversationId: string,
    options: SendMediaMessageOptions
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const result = await this.client.sendVideoMessage(options);

      // If token expired, return immediately without storing
      if (!result.success && result.error?.isTokenExpired) {
        return result;
      }

      if (result.success && result.data) {
        await this.storeOutboundMessage({
          conversationId,
          waMessageId: result.data.messages[0].id,
          toPhone: options.to,
          type: MessageType.VIDEO,
          content: {
            url: options.mediaUrl,
            id: options.mediaId,
            caption: options.caption,
          },
          replyToId: options.replyToMessageId,
        });

        await this.updateConversationTimestamp(conversationId);
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Send video error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send video',
        },
      };
    }
  }

  /**
   * Send document message and store in database
   */
  async sendDocument(
    conversationId: string,
    options: SendMediaMessageOptions
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const result = await this.client.sendDocumentMessage(options);

      // If token expired, return immediately without storing
      if (!result.success && result.error?.isTokenExpired) {
        return result;
      }

      if (result.success && result.data) {
        await this.storeOutboundMessage({
          conversationId,
          waMessageId: result.data.messages[0].id,
          toPhone: options.to,
          type: MessageType.DOCUMENT,
          content: {
            url: options.mediaUrl,
            id: options.mediaId,
            filename: options.filename,
            caption: options.caption,
          },
          replyToId: options.replyToMessageId,
        });

        await this.updateConversationTimestamp(conversationId);
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Send document error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send document',
        },
      };
    }
  }

  /**
   * Send template message and store in database
   */
  async sendTemplate(
    conversationId: string,
    toPhone: string,
    options: SendTemplateMessageOptions
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const result = await this.client.sendTemplateMessage({
        ...options,
        to: toPhone,
      });

      // If token expired, return immediately without storing
      if (!result.success && result.error?.isTokenExpired) {
        return result;
      }

      if (result.success && result.data) {
        // Get template from database
        const template = await prisma.whatsAppTemplate.findFirst({
          where: {
            accountId: this.accountId,
            name: options.templateName,
            language: options.languageCode,
          },
        });

        await this.storeOutboundMessage({
          conversationId,
          waMessageId: result.data.messages[0].id,
          toPhone,
          type: MessageType.TEMPLATE,
          content: {
            templateName: options.templateName,
            languageCode: options.languageCode,
            components: options.components,
          },
          templateId: template?.id,
          templateName: options.templateName,
        });

        // Update template usage stats
        if (template) {
          await prisma.whatsAppTemplate.update({
            where: { id: template.id },
            data: {
              sentCount: { increment: 1 },
              lastUsedAt: new Date(),
            },
          });
        }

        await this.updateConversationTimestamp(conversationId);
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Send template error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send template',
        },
      };
    }
  }

  /**
   * Send location message and store in database
   */
  async sendLocation(
    conversationId: string,
    options: SendLocationMessageOptions
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const result = await this.client.sendLocationMessage(options);

      if (result.success && result.data) {
        await this.storeOutboundMessage({
          conversationId,
          waMessageId: result.data.messages[0].id,
          toPhone: options.to,
          type: MessageType.LOCATION,
          content: {
            latitude: options.latitude,
            longitude: options.longitude,
            name: options.name,
            address: options.address,
          },
        });

        await this.updateConversationTimestamp(conversationId);
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Send location error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to send location',
        },
      };
    }
  }

  /**
   * Store outbound message in database
   */
  private async storeOutboundMessage(data: {
    conversationId: string;
    waMessageId: string;
    toPhone: string;
    type: MessageType;
    content: any;
    replyToId?: string;
    templateId?: string;
    templateName?: string;
  }) {
    try {
      // Get conversation to get fromPhone
      const conversation = await prisma.whatsAppConversation.findUnique({
        where: { id: data.conversationId },
        include: { account: true },
      });

      if (!conversation) {
        throw new Error('Conversation not found');
      }

      await prisma.whatsAppMessage.create({
        data: {
          waMessageId: data.waMessageId,
          accountId: this.accountId,
          conversationId: data.conversationId,
          direction: MessageDirection.OUTBOUND,
          type: data.type,
          content: data.content,
          fromPhone: conversation.account.phoneNumber,
          toPhone: data.toPhone,
          status: MessageStatus.SENT,
          replyToId: data.replyToId,
          templateId: data.templateId,
          templateName: data.templateName,
          sentAt: new Date(),
        },
      });
    } catch (error) {
      console.error('[Message Service] Store message error:', error);
      throw error;
    }
  }

  /**
   * Update conversation last message timestamp
   */
  private async updateConversationTimestamp(conversationId: string) {
    try {
      await prisma.whatsAppConversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: new Date(),
        },
      });
    } catch (error) {
      console.error('[Message Service] Update conversation timestamp error:', error);
    }
  }

  /**
   * Get conversation by user phone
   * Create new conversation if not exists
   */
  async getOrCreateConversation(
    userPhone: string,
    propertyId?: number
  ): Promise<string> {
    try {
      // Try to find existing conversation
      let conversation = await prisma.whatsAppConversation.findFirst({
        where: {
          accountId: this.accountId,
          userPhone,
          status: 'ACTIVE',
        },
      });

      // Create new conversation if not found
      if (!conversation) {
        conversation = await prisma.whatsAppConversation.create({
          data: {
            accountId: this.accountId,
            userPhone,
            propertyId,
            status: 'ACTIVE',
          },
        });
      }

      return conversation.id;
    } catch (error) {
      console.error('[Message Service] Get or create conversation error:', error);
      throw error;
    }
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: string): Promise<ApiResponse<void>> {
    try {
      // Get message
      const message = await prisma.whatsAppMessage.findUnique({
        where: { id: messageId },
      });

      if (!message) {
        return {
          success: false,
          error: {
            code: 404,
            message: 'Message not found',
          },
        };
      }

      // Mark as read in WhatsApp
      const result = await this.client.markAsRead({
        messageId: message.waMessageId,
      });

      if (result.success) {
        // Update in database
        await prisma.whatsAppMessage.update({
          where: { id: messageId },
          data: {
            status: MessageStatus.READ,
            readAt: new Date(),
          },
        });

        // Decrement unread count
        await prisma.whatsAppConversation.update({
          where: { id: message.conversationId },
          data: {
            unreadCount: {
              decrement: 1,
            },
          },
        });
      }

      return result;
    } catch (error) {
      console.error('[Message Service] Mark as read error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to mark as read',
        },
      };
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string, limit: number = 50, offset: number = 0) {
    try {
      const messages = await prisma.whatsAppMessage.findMany({
        where: {
          conversationId,
        },
        orderBy: {
          sentAt: 'desc',
        },
        take: limit,
        skip: offset,
        include: {
          template: true,
        },
      });

      return {
        success: true,
        data: messages,
      };
    } catch (error) {
      console.error('[Message Service] Get messages error:', error);
      return {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Failed to get messages',
        },
      };
    }
  }
}

/**
 * Create message service instance
 */
export function createMessageService(accountId: string): WhatsAppMessageService {
  return new WhatsAppMessageService(accountId);
}


