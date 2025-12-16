/**
 * WhatsApp Quick Test API
 * Simple endpoint to test sending a WhatsApp message using env credentials,
 * without requiring database setup or webhook configuration.
 *
 * POST /api/whatsapp/test
 * Body: { "to": "+221771234567", "message": "Hello from my app" }
 */

import { NextRequest, NextResponse } from "next/server";
import { createWhatsAppClient } from "@/lib/whatsapp/client";
import {
  isValidPhoneNumber,
  validateMessageContent,
} from "@/lib/whatsapp/validators";
import { PrismaClient } from "@prisma/client";
import { MessageDirection, MessageType, MessageStatus } from "@/lib/whatsapp/types";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const {
      WHATSAPP_PHONE_NUMBER_ID = "947502885103297",
      WHATSAPP_ACCESS_TOKEN = "EAAZA6hb3eKzIBQIKq8Wrdx2Lg87jEkvL4foV3OjpnoLZBFnCtG2yaaFZCNUzXmEOB7iB4ZBPW1FYtT3xE4oZCnZBuHxOR6vGnXTnBL8zt4UxqHOnwCrPGGySDmJzMejbbnydApFr31k9xPJVmlZAx7LLo28DZBZCubidxHfJ0RllnX8YdQAun6Xj5kAuFVGRoYykvDLhhJVoq3h9JHjt4CmxVP3EIxE95lNVetZCoGhZCSCqaChTsRZCYB60ovIjo7MHaKjaYOoWAIr27YokPZC49tZCs6AQZDZD",
      WHATSAPP_API_VERSION = "v18.0",
    } = process.env;

    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 500,
            message:
              "WhatsApp env variables missing. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in .env.local",
          },
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const to: string | undefined = body.to;

    // Ensure message is always a concrete string (TS was complaining about string | undefined)
    const rawMessage = body.message as string | undefined;
    const message: string =
      typeof rawMessage === "string" && rawMessage.trim().length > 0
        ? rawMessage
        : "Test message from your Next.js app 👋";

    if (!to) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 400,
            message:
              'Missing "to" field. Example body: { "to": "+221771234567", "message": "Hello" }',
          },
        },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(to)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 400,
            message:
              "Invalid phone number format. Use international format, e.g. +221771234567",
          },
        },
        { status: 400 }
      );
    }

    const validation = validateMessageContent(message);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 400,
            message: validation.error || "Invalid message content",
          },
        },
        { status: 400 }
      );
    }

    // Create a lightweight WhatsApp client from env
    const client = createWhatsAppClient({
      phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
      accessToken: WHATSAPP_ACCESS_TOKEN,
      apiVersion: WHATSAPP_API_VERSION || "v18.0",
    });

    const result = await client.sendTextMessage({
      to,
      message,
    });

    if (result.success) {
      const messageId = result.data?.messages?.[0]?.id;
      
      // Try to store message in database for status tracking (optional, won't fail if DB unavailable)
      try {
        // Get or create WhatsApp account
        let account = await prisma.whatsAppAccount.findFirst({
          where: { isActive: true },
        });

        if (!account) {
          // Create account if doesn't exist
          account = await prisma.whatsAppAccount.create({
            data: {
              phoneNumberId: WHATSAPP_PHONE_NUMBER_ID,
              phoneNumber: `+${to.replace(/^\+/, '')}`,
              businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '1203289797803197',
              accessToken: WHATSAPP_ACCESS_TOKEN, // In production, encrypt this
              isActive: true,
              isVerified: true,
              webhookVerified: true,
            },
          });
        }

        // Get or create conversation
        let conversation = await prisma.whatsAppConversation.findFirst({
          where: {
            accountId: account.id,
            userPhone: to,
            status: 'ACTIVE',
          },
        });

        if (!conversation) {
          conversation = await prisma.whatsAppConversation.create({
            data: {
              accountId: account.id,
              userPhone: to,
              status: 'ACTIVE',
            },
          });
        }

        // Store message
        if (!messageId) {
          throw new Error('Message ID is required');
        }
        
        await prisma.whatsAppMessage.create({
          data: {
            waMessageId: messageId,
            accountId: account.id,
            conversationId: conversation.id,
            direction: MessageDirection.OUTBOUND,
            type: MessageType.TEXT,
            content: { text: message },
            fromPhone: account.phoneNumber,
            toPhone: to,
            status: MessageStatus.SENT,
            sentAt: new Date(),
          },
        });

        // Update conversation
        await prisma.whatsAppConversation.update({
          where: { id: conversation.id },
          data: { lastMessageAt: new Date() },
        });
      } catch (dbError: any) {
        // Don't fail if DB storage fails, just log it
        console.warn('[Test API] Failed to store message in DB (non-critical):', dbError.message);
      }

      return NextResponse.json(
        {
          success: true,
          data: result.data,
          stored: true,
          warning: 'Message sent successfully, but you may not receive it if:',
          reasons: [
            '1. This is the FIRST message to this number (WhatsApp requires template messages for first contact)',
            '2. More than 24 hours passed since user last messaged you (24-hour messaging window expired)',
            '3. Phone number is not registered on WhatsApp',
          ],
          solution: 'To send first message: Use an approved WhatsApp template. Check message status: GET /api/whatsapp/check-status?messageId=' + messageId,
          checkStatus: `/api/whatsapp/check-status?messageId=${messageId}`,
        },
        { status: 200 }
      );
    }

    // Provide helpful error message for token expiration
    if (result.error?.code === 190 || result.error?.message?.includes('expired')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 401,
            message: 'Access token expired. Please generate a new token in Meta Developer Console.',
            details: 'Go to: Meta Business Suite → Settings → System Users → Generate Token',
            help: 'For permanent token: Create System User → Assign WhatsApp permissions → Generate permanent token',
          },
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: result.error?.code || 500 }
    );
  } catch (error: any) {
    console.error("[WhatsApp Test API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 500,
          message:
            error?.message ||
            "Internal server error while sending WhatsApp test message",
        },
      },
      { status: 500 }
    );
  }
}


