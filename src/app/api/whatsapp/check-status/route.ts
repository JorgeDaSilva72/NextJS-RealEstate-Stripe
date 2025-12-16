/**
 * Check WhatsApp Message Status
 * Check message status from database (status updates come via webhook)
 * Note: WhatsApp message IDs cannot be queried directly via Graph API
 * @route /api/whatsapp/check-status
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.warn('[Check Status] Prisma client initialization failed:', error);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const messageId = searchParams.get('messageId');

    if (!messageId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 400,
            message: 'Missing messageId parameter. Example: /api/whatsapp/check-status?messageId=wamid.HBg...',
          },
        },
        { status: 400 }
      );
    }

    // Check if database is available
    if (!prisma) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 503,
            message: 'Database not available',
            note: 'WhatsApp status tracking requires database setup. For now, check if you received the message on your phone.',
          },
          messageId,
          info: {
            apiResponse: 'Message was sent successfully (you got success: true)',
            statusTracking: 'Status updates come via webhook and require database',
            quickCheck: 'Check your phone - if you received the message, it was delivered!',
          },
        },
        { status: 503 }
      );
    }

    // Check message status from database (updated via webhook)
    let message;
    try {
      message = await prisma.whatsAppMessage.findUnique({
        where: {
          waMessageId: messageId,
        },
        include: {
          conversation: {
            select: {
              userPhone: true,
              userName: true,
            },
          },
        },
      });
    } catch (dbError: any) {
      // Handle case where tables don't exist yet
      if (dbError.code === 'P2021' || dbError.message?.includes('does not exist')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 503,
              message: 'WhatsApp database tables not created yet',
              note: 'You need to run Prisma migrations first to enable status tracking.',
            },
            messageId,
            info: {
              apiResponse: 'Message was sent successfully (you got success: true)',
              quickCheck: 'Check your phone - if you received the message, it was delivered!',
              setupRequired: 'To track status: Run migrations on your production database',
            },
            instructions: [
              '1. Connect to your production database',
              '2. Run: npx prisma migrate deploy (for production)',
              '3. Or: npx prisma migrate dev (for development)',
              '4. This creates WhatsApp tables for status tracking',
            ],
          },
          { status: 503 }
        );
      }
      throw dbError;
    }

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 404,
            message: 'Message not found in database',
            note: 'Message was sent successfully, but status not tracked yet.',
          },
          messageId,
          info: {
            apiResponse: 'Message was sent successfully (you got success: true)',
            quickCheck: 'Check your phone - if you received the message, it was delivered!',
            whyNotTracked: [
              'Message sent via /api/whatsapp/test (does not store in DB)',
              'OR webhook not received status update yet',
              'OR message_status webhook field not subscribed',
            ],
          },
        },
        { status: 404 }
      );
    }

    // Determine status explanation
    let statusNote = '';
    switch (message.status) {
      case 'SENT':
        statusNote = 'Message sent to WhatsApp. May not be delivered if outside 24-hour window or first message (requires template).';
        break;
      case 'DELIVERED':
        statusNote = 'Message delivered successfully to user\'s phone! ✅';
        break;
      case 'READ':
        statusNote = 'Message delivered and read by user! ✅';
        break;
      case 'FAILED':
        statusNote = `Message failed to deliver. Error: ${message.errorMessage || message.errorCode || 'Unknown error'}`;
        break;
      default:
        statusNote = 'Status unknown';
    }

    return NextResponse.json({
      success: true,
      data: {
        messageId: message.waMessageId,
        status: message.status,
        direction: message.direction,
        type: message.type,
        sentAt: message.sentAt,
        deliveredAt: message.deliveredAt,
        readAt: message.readAt,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        to: message.toPhone,
        from: message.fromPhone,
        conversation: message.conversation,
        note: statusNote,
        webhookInfo: {
          subscribed: 'Make sure message_status webhook field is subscribed in Meta Developer Console',
          howItWorks: 'Status updates come automatically via webhook when message_status field is subscribed',
        },
      },
    });
  } catch (error: any) {
    console.error('[Check Status API] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 500,
          message: error.message || 'Failed to check message status',
          note: 'WhatsApp message IDs cannot be queried directly via Graph API. Status updates come via webhook and are stored in database.',
        },
      },
      { status: 500 }
    );
  }
}

