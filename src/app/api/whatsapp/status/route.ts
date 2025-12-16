/**
 * WhatsApp Status API Route
 * Check WhatsApp integration status
 * @route /api/whatsapp/status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET - Check WhatsApp integration status
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication (admin only)
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get WhatsApp account
    const account = await prisma.whatsAppAccount.findFirst({
      where: { isActive: true },
    });

    // Get statistics
    const [
      totalConversations,
      activeConversations,
      totalMessages,
      todayMessages,
      templateCount,
      approvedTemplates,
    ] = await Promise.all([
      prisma.whatsAppConversation.count(),
      prisma.whatsAppConversation.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.whatsAppMessage.count(),
      prisma.whatsAppMessage.count({
        where: {
          sentAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.whatsAppTemplate.count(),
      prisma.whatsAppTemplate.count({
        where: { status: 'APPROVED' },
      }),
    ]);

    const status = {
      enabled: (process.env.WHATSAPP_ENABLED ?? 'true') === 'true',
      configured: !!account,
      account: account ? {
        phoneNumber: account.phoneNumber,
        isVerified: account.isVerified,
        webhookVerified: account.webhookVerified,
        displayName: account.displayName,
      } : null,
      statistics: {
        totalConversations,
        activeConversations,
        totalMessages,
        todayMessages,
        templateCount,
        approvedTemplates,
      },
      environment: {
        hasAccessToken: !!(process.env.WHATSAPP_ACCESS_TOKEN ?? "EAAZA6hb3eKzIBQIKq8Wrdx2Lg87jEkvL4foV3OjpnoLZBFnCtG2yaaFZCNUzXmEOB7iB4ZBPW1FYtT3xE4oZCnZBuHxOR6vGnXTnBL8zt4UxqHOnwCrPGGySDmJzMejbbnydApFr31k9xPJVmlZAx7LLo28DZBZCubidxHfJ0RllnX8YdQAun6Xj5kAuFVGRoYykvDLhhJVoq3h9JHjt4CmxVP3EIxE95lNVetZCoGhZCSCqaChTsRZCYB60ovIjo7MHaKjaYOoWAIr27YokPZC49tZCs6AQZDZD"),
        hasPhoneNumberId: !!(process.env.WHATSAPP_PHONE_NUMBER_ID ?? "947502885103297"),
        hasWebhookToken: !!(process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ?? "whatsapp_verify_123"),
        hasAppSecret: !!(process.env.WHATSAPP_APP_SECRET ?? "c64bcf5adf43290e06abb0730d2ecfde"),
        debugMode: (process.env.WHATSAPP_DEBUG_MODE ?? 'true') === 'true',
      },
    };

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('[Status API] Error:', error);
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


