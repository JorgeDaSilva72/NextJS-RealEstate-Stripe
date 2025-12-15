/**
 * WhatsApp Send Message API Route
 * Handles sending messages via WhatsApp Business API
 * @route /api/whatsapp/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClient } from '@prisma/client';
import { createMessageService } from '@/lib/whatsapp/message-service';
import { isValidPhoneNumber, validateMessageContent } from '@/lib/whatsapp/validators';

const prisma = new PrismaClient();

/**
 * POST - Send a WhatsApp message
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      to,
      message,
      type = 'text',
      conversationId,
      propertyId,
      mediaUrl,
      mediaId,
      caption,
      templateName,
      languageCode,
      templateComponents,
    } = body;

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: 'Recipient phone number is required' },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(to)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Get WhatsApp account
    const account = await prisma.whatsAppAccount.findFirst({
      where: { isActive: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'WhatsApp account not configured' },
        { status: 500 }
      );
    }

    // Create message service
    const messageService = createMessageService(account.id);

    // Get or create conversation
    let conversationIdToUse = conversationId;
    if (!conversationIdToUse) {
      conversationIdToUse = await messageService.getOrCreateConversation(
        to,
        propertyId
      );
    }

    // Send message based on type
    let result;

    switch (type) {
      case 'text':
        if (!message) {
          return NextResponse.json(
            { error: 'Message content is required' },
            { status: 400 }
          );
        }

        const validation = validateMessageContent(message);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 }
          );
        }

        result = await messageService.sendText(conversationIdToUse, {
          to,
          message,
        });
        break;

      case 'image':
        if (!mediaUrl && !mediaId) {
          return NextResponse.json(
            { error: 'Media URL or ID is required for image messages' },
            { status: 400 }
          );
        }

        result = await messageService.sendImage(conversationIdToUse, {
          to,
          mediaUrl,
          mediaId,
          caption,
        });
        break;

      case 'video':
        if (!mediaUrl && !mediaId) {
          return NextResponse.json(
            { error: 'Media URL or ID is required for video messages' },
            { status: 400 }
          );
        }

        result = await messageService.sendVideo(conversationIdToUse, {
          to,
          mediaUrl,
          mediaId,
          caption,
        });
        break;

      case 'document':
        if (!mediaUrl && !mediaId) {
          return NextResponse.json(
            { error: 'Media URL or ID is required for document messages' },
            { status: 400 }
          );
        }

        result = await messageService.sendDocument(conversationIdToUse, {
          to,
          mediaUrl,
          mediaId,
          caption,
        });
        break;

      case 'template':
        if (!templateName || !languageCode) {
          return NextResponse.json(
            { error: 'Template name and language code are required' },
            { status: 400 }
          );
        }

        result = await messageService.sendTemplate(conversationIdToUse, to, {
          to,
          templateName,
          languageCode,
          components: templateComponents,
        });
        break;

      default:
        return NextResponse.json(
          { error: `Unsupported message type: ${type}` },
          { status: 400 }
        );
    }

    // Return result
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          data: {
            ...result.data,
            conversationId: conversationIdToUse,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: result.error?.code || 500 }
      );
    }
  } catch (error) {
    console.error('[Send API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 500,
          message: error instanceof Error ? error.message : 'Internal server error',
        },
      },
      { status: 500 }
    );
  }
}


