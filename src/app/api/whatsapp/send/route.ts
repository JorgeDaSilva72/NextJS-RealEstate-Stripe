/**
 * WhatsApp Send Message API Route
 * Handles sending messages via WhatsApp Business API
 * @route /api/whatsapp/send
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClient } from '@prisma/client';
import { createMessageService } from '@/lib/whatsapp/message-service';
import { isValidPhoneNumber, validateMessageContent, normalizePhoneNumber } from '@/lib/whatsapp/validators';

const prisma = new PrismaClient();

/**
 * Helper function to handle token expired errors
 */
function handleTokenExpiredError(to: string, message?: string) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 190,
        message: 'WhatsApp access token has expired. Please use wa.me link instead.',
        isTokenExpired: true,
        fallbackUrl: `https://wa.me/${to.replace(/[^0-9]/g, '')}${message ? `?text=${encodeURIComponent(message)}` : ''}`,
      },
    },
    { status: 401 }
  );
}

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

    // Normalize phone number: if propertyId is provided, get country code from property
    let normalizedPhone = to;
    if (propertyId && !to.startsWith('+')) {
      try {
        const property = await prisma.property.findUnique({
          where: { id: propertyId },
          select: {
            countryId: true,
            country: {
              select: {
                phonePrefix: true,
              },
            },
          },
        });

        if (property?.country?.phonePrefix) {
          normalizedPhone = normalizePhoneNumber(to, property.country.phonePrefix);
        } else if (property?.countryId) {
          // Fallback: try to get country from countryId if direct relation failed
          const country = await prisma.country.findUnique({
            where: { id: property.countryId },
            select: { phonePrefix: true },
          });
          if (country?.phonePrefix) {
            normalizedPhone = normalizePhoneNumber(to, country.phonePrefix);
          }
        }
      } catch (error) {
        console.error('[Send API] Error fetching property for phone normalization:', error);
        // Continue with original phone number
      }
    }

    // Validate phone number format
    if (!isValidPhoneNumber(normalizedPhone)) {
      return NextResponse.json(
        { 
          error: 'Invalid phone number format. Phone number must include country code (e.g., +212 for Morocco, +221 for Senegal)',
          received: to,
          normalized: normalizedPhone !== to ? normalizedPhone : undefined
        },
        { status: 400 }
      );
    }

    // Use normalized phone number for the rest of the process
    const phoneToUse = normalizedPhone;

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
        phoneToUse,
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
          to: phoneToUse,
          message,
        });

        // If token expired, return specific error for fallback handling
        if (!result.success && result.error?.isTokenExpired) {
          return handleTokenExpiredError(phoneToUse, message);
        }
        break;

      case 'image':
        if (!mediaUrl && !mediaId) {
          return NextResponse.json(
            { error: 'Media URL or ID is required for image messages' },
            { status: 400 }
          );
        }

        result = await messageService.sendImage(conversationIdToUse, {
          to: phoneToUse,
          mediaUrl,
          mediaId,
          caption,
        });

        // If token expired, return specific error for fallback handling
        if (!result.success && result.error?.isTokenExpired) {
          return handleTokenExpiredError(phoneToUse, caption || 'Image');
        }
        break;

      case 'video':
        if (!mediaUrl && !mediaId) {
          return NextResponse.json(
            { error: 'Media URL or ID is required for video messages' },
            { status: 400 }
          );
        }

        result = await messageService.sendVideo(conversationIdToUse, {
          to: phoneToUse,
          mediaUrl,
          mediaId,
          caption,
        });

        // If token expired, return specific error for fallback handling
        if (!result.success && result.error?.isTokenExpired) {
          return handleTokenExpiredError(phoneToUse, caption || 'Video');
        }
        break;

      case 'document':
        if (!mediaUrl && !mediaId) {
          return NextResponse.json(
            { error: 'Media URL or ID is required for document messages' },
            { status: 400 }
          );
        }

        result = await messageService.sendDocument(conversationIdToUse, {
          to: phoneToUse,
          mediaUrl,
          mediaId,
          caption,
        });

        // If token expired, return specific error for fallback handling
        if (!result.success && result.error?.isTokenExpired) {
          return handleTokenExpiredError(phoneToUse, caption || 'Document');
        }
        break;

      case 'template':
        if (!templateName || !languageCode) {
          return NextResponse.json(
            { error: 'Template name and language code are required' },
            { status: 400 }
          );
        }

        result = await messageService.sendTemplate(conversationIdToUse, phoneToUse, {
          to: phoneToUse,
          templateName,
          languageCode,
          components: templateComponents,
        });

        // If token expired, return specific error for fallback handling
        if (!result.success && result.error?.isTokenExpired) {
          return handleTokenExpiredError(phoneToUse);
        }
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


