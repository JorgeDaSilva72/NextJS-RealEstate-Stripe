/**
 * WhatsApp Bot Service
 * Handles automated welcome messages and lead qualification
 * @module whatsapp/bot-service
 */

import { PrismaClient } from '@prisma/client';
import { createMessageService } from './message-service';
import { MessageType } from './types';

const prisma = new PrismaClient();

export enum LeadType {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  UNQUALIFIED = 'UNQUALIFIED',
}

export interface BotContext {
  phoneNumber: string;
  accountId: string;
  conversationId: string;
  leadType?: LeadType;
  propertyId?: number;
  propertyTitle?: string;
  lastInteraction?: Date;
}

/**
 * WhatsApp Bot Service
 * Manages automated conversations and lead qualification
 */
export class WhatsAppBotService {
  private accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  /**
   * Send welcome message with interactive buttons
   * Triggered when a new WhatsApp message is received
   */
  async sendWelcomeMessage(phoneNumber: string, conversationId: string): Promise<boolean> {
    try {
      const messageService = createMessageService(this.accountId);

      // Welcome message
      const welcomeMessage = `Hello! Welcome to Afrique Avenir Immobilier.
To better assist you, what is the nature of your inquiry?`;

      // Send welcome message
      const result = await messageService.sendText(conversationId, {
        to: phoneNumber,
        message: welcomeMessage,
      });

      if (!result.success) {
        console.error('[Bot] Failed to send welcome message:', result.error);
        return false;
      }

      // Send interactive buttons
      // Note: WhatsApp Cloud API requires templates for interactive buttons
      // For now, we'll send text-based options that users can reply to
      // In production, you would use WhatsApp Template Messages with buttons
      
      const optionsMessage = `Please reply with:
🏠 *1* - Buy or Rent a property
🔑 *2* - Sell or List a property`;

      const optionsResult = await messageService.sendText(conversationId, {
        to: phoneNumber,
        message: optionsMessage,
      });

      // Store bot context
      await this.storeBotContext(phoneNumber, conversationId, {
        lastInteraction: new Date(),
      });

      return optionsResult.success;
    } catch (error) {
      console.error('[Bot] Send welcome message error:', error);
      return false;
    }
  }

  /**
   * Process user response and qualify lead
   */
  async processUserResponse(
    phoneNumber: string,
    messageText: string,
    conversationId: string
  ): Promise<LeadType | null> {
    try {
      const normalizedMessage = messageText.toLowerCase().trim();

      // Check for button responses or keywords
      const isBuyer = 
        normalizedMessage === '1' ||
        normalizedMessage.includes('buy') ||
        normalizedMessage.includes('rent') ||
        normalizedMessage.includes('acheter') ||
        normalizedMessage.includes('louer') ||
        normalizedMessage.includes('purchase') ||
        normalizedMessage.includes('interested');

      const isSeller =
        normalizedMessage === '2' ||
        normalizedMessage.includes('sell') ||
        normalizedMessage.includes('list') ||
        normalizedMessage.includes('vendre') ||
        normalizedMessage.includes('mettre en vente');

      let leadType: LeadType | null = null;

      if (isBuyer) {
        leadType = LeadType.BUYER;
      } else if (isSeller) {
        leadType = LeadType.SELLER;
      }

      // Update bot context
      if (leadType) {
        await this.storeBotContext(phoneNumber, conversationId, {
          leadType,
          lastInteraction: new Date(),
        });
      }

      return leadType;
    } catch (error) {
      console.error('[Bot] Process user response error:', error);
      return null;
    }
  }

  /**
   * Extract property reference from message
   */
  extractPropertyReference(messageText: string): {
    propertyId?: number;
    propertyTitle?: string;
  } {
    try {
      // Look for patterns like "reference 123" or "référence 123" or "property ID 123"
      const referencePattern = /(?:reference|référence|property\s*id|id\s*propriété)\s*:?\s*(\d+)/i;
      const match = messageText.match(referencePattern);
      
      if (match && match[1]) {
        const propertyId = parseInt(match[1], 10);
        
        // Try to extract property title from parentheses
        const titlePattern = /\(([^)]+)\)/;
        const titleMatch = messageText.match(titlePattern);
        const propertyTitle = titleMatch ? titleMatch[1] : undefined;

        return { propertyId, propertyTitle };
      }

      return {};
    } catch (error) {
      console.error('[Bot] Extract property reference error:', error);
      return {};
    }
  }

  /**
   * Detect priority keywords
   */
  detectPriorityKeywords(messageText: string): boolean {
    const priorityKeywords = [
      'buy',
      'purchase',
      'visit',
      'interested',
      'acheter',
      'visite',
      'intéressé',
      'urgent',
      'urgent',
    ];

    const normalizedMessage = messageText.toLowerCase();
    return priorityKeywords.some((keyword) => normalizedMessage.includes(keyword));
  }

  /**
   * Store bot context in database
   */
  private async storeBotContext(
    phoneNumber: string,
    conversationId: string,
    context: Partial<BotContext>
  ): Promise<void> {
    try {
      // Store in conversation metadata or create a separate bot context table
      // For now, we'll use the conversation's context field if available
      await prisma.whatsAppConversation.update({
        where: { id: conversationId },
        data: {
          // Store context in metadata if your schema supports it
          // context: JSON.stringify(context),
        },
      });
    } catch (error) {
      console.error('[Bot] Store bot context error:', error);
    }
  }

  /**
   * Get bot context for a conversation
   */
  async getBotContext(conversationId: string): Promise<BotContext | null> {
    try {
      const conversation = await prisma.whatsAppConversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return null;
      }

      // Parse context from conversation metadata if available
      // For now, return basic context
      return {
        phoneNumber: conversation.userPhone,
        accountId: conversation.accountId,
        conversationId: conversation.id,
        lastInteraction: conversation.lastMessageAt,
      };
    } catch (error) {
      console.error('[Bot] Get bot context error:', error);
      return null;
    }
  }

  /**
   * Check if welcome message was already sent
   */
  async hasWelcomeBeenSent(conversationId: string): Promise<boolean> {
    try {
      const messages = await prisma.whatsAppMessage.findMany({
        where: {
          conversationId,
          direction: 'OUTBOUND',
          type: MessageType.TEXT,
        },
        orderBy: { sentAt: 'asc' },
        take: 5,
      });

      // Check if any of the recent messages contain the welcome text
      const welcomeKeywords = ['welcome', 'bienvenue', 'nature of your inquiry'];
      return messages.some((msg) => {
        const content = typeof msg.content === 'string' 
          ? msg.content 
          : JSON.stringify(msg.content);
        return welcomeKeywords.some((keyword) => 
          content.toLowerCase().includes(keyword)
        );
      });
    } catch (error) {
      console.error('[Bot] Check welcome sent error:', error);
      return false;
    }
  }
}

/**
 * Create bot service instance
 */
export function createBotService(accountId: string): WhatsAppBotService {
  return new WhatsAppBotService(accountId);
}

