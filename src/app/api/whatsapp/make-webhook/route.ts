/**
 * Make.com Webhook Endpoint
 * Receives webhook from Meta WhatsApp Cloud API and forwards to Make.com
 * @route /api/whatsapp/make-webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateSignature } from '@/lib/whatsapp/webhook-handler';
import { createBotService, LeadType } from '@/lib/whatsapp/bot-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST - Receive webhook from Meta and forward to Make.com
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature validation
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';

    // Validate signature in production
    if (process.env.NODE_ENV === 'production') {
      const isValid = validateSignature(signature, body);
      
      if (!isValid) {
        console.error('[Make Webhook] Invalid signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse webhook data
    const data = JSON.parse(body);

    // Process webhook
    const result = await processMakeWebhook(data);

    // Return 200 immediately to acknowledge receipt
    return NextResponse.json({ success: true, processed: result }, { status: 200 });
  } catch (error) {
    console.error('[Make Webhook] Error:', error);
    
    // Still return 200 to prevent Meta from retrying
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

/**
 * Process webhook and prepare data for Make.com
 */
async function processMakeWebhook(data: any): Promise<{
  forwarded: boolean;
  leadType?: LeadType;
  propertyId?: number;
  priority?: boolean;
}> {
  try {
    if (data.object !== 'whatsapp_business_account') {
      console.warn('[Make Webhook] Unknown webhook object type:', data.object);
      return { forwarded: false };
    }

    for (const entry of data.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          const value = change.value;
          const { metadata, messages, contacts } = value;

          // Get WhatsApp account
          const account = await prisma.whatsAppAccount.findUnique({
            where: {
              phoneNumberId: metadata.phone_number_id,
            },
          });

          if (!account) {
            console.error('[Make Webhook] WhatsApp account not found:', metadata.phone_number_id);
            continue;
          }

          // Process incoming messages
          if (messages && messages.length > 0) {
            for (const message of messages) {
              const result = await processIncomingMessage(
                account.id,
                message,
                contacts?.[0]
              );

              // Forward to Make.com webhook
              if (result.shouldForward) {
                await forwardToMakeCom(result.makeComData);
                return {
                  forwarded: true,
                  leadType: result.leadType,
                  propertyId: result.propertyId,
                  priority: result.priority,
                };
              }
            }
          }
        }
      }
    }

    return { forwarded: false };
  } catch (error) {
    console.error('[Make Webhook] Process error:', error);
    throw error;
  }
}

/**
 * Process incoming message and prepare Make.com data
 */
async function processIncomingMessage(
  accountId: string,
  message: any,
  contact?: any
): Promise<{
  shouldForward: boolean;
  leadType?: LeadType;
  propertyId?: number;
  priority?: boolean;
  makeComData: any;
}> {
  try {
    const botService = createBotService(accountId);
    const phoneNumber = message.from;
    const messageText = message.text?.body || '';
    const messageType = message.type;

    // Get or create conversation
    let conversation = await prisma.whatsAppConversation.findFirst({
      where: {
        accountId,
        userPhone: phoneNumber,
        status: 'ACTIVE',
      },
    });

    if (!conversation) {
      conversation = await prisma.whatsAppConversation.create({
        data: {
          accountId,
          userPhone: phoneNumber,
          userName: contact?.profile?.name,
          status: 'ACTIVE',
        },
      });

      // Send welcome message for new conversations
      await botService.sendWelcomeMessage(phoneNumber, conversation.id);
      
      // Don't forward welcome message trigger
      return { shouldForward: false, makeComData: {} };
    }

    // Process user response for lead qualification
    const leadType = await botService.processUserResponse(
      phoneNumber,
      messageText,
      conversation.id
    );

    // Extract property reference
    const { propertyId, propertyTitle } = botService.extractPropertyReference(messageText);

    // Detect priority keywords
    const priority = botService.detectPriorityKeywords(messageText);

    // Only forward if lead is qualified (Buyer or Seller)
    if (!leadType || leadType === LeadType.UNQUALIFIED) {
      return { shouldForward: false, makeComData: {} };
    }

    // Prepare data for Make.com
    const makeComData = {
      phone_number: phoneNumber,
      message_content: messageText,
      message_type: messageType,
      timestamp: message.timestamp,
      lead_type: leadType,
      property_id: propertyId,
      property_title: propertyTitle,
      priority: priority,
      contact_name: contact?.profile?.name,
      wa_id: contact?.wa_id,
      conversation_id: conversation.id,
      account_id: accountId,
    };

    return {
      shouldForward: true,
      leadType,
      propertyId,
      priority,
      makeComData,
    };
  } catch (error) {
    console.error('[Make Webhook] Process incoming message error:', error);
    throw error;
  }
}

/**
 * Forward data to Make.com webhook
 */
async function forwardToMakeCom(data: any): Promise<boolean> {
  try {
    const makeComWebhookUrl = process.env.MAKE_COM_WEBHOOK_URL;

    if (!makeComWebhookUrl) {
      console.warn('[Make Webhook] MAKE_COM_WEBHOOK_URL not configured');
      return false;
    }

    const response = await fetch(makeComWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Source': 'whatsapp-cloud-api',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('[Make Webhook] Failed to forward to Make.com:', {
        status: response.status,
        statusText: response.statusText,
      });
      return false;
    }

    console.log('[Make Webhook] Successfully forwarded to Make.com');
    return true;
  } catch (error) {
    console.error('[Make Webhook] Forward to Make.com error:', error);
    return false;
  }
}












