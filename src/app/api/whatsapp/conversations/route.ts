/**
 * WhatsApp Conversations API Route
 * Manages WhatsApp conversations
 * @route /api/whatsapp/conversations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET - List conversations
 */
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'ACTIVE';
    const propertyId = searchParams.get('propertyId');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (propertyId) {
      where.propertyId = parseInt(propertyId);
    }

    if (userId) {
      where.userId = userId;
    }

    // Get conversations
    const conversations = await prisma.whatsAppConversation.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              take: 1,
              where: { isMain: true },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            sentAt: 'desc',
          },
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // Get total count
    const total = await prisma.whatsAppConversation.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        conversations,
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('[Conversations API] GET error:', error);
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

/**
 * PATCH - Update conversation
 */
export async function PATCH(request: NextRequest) {
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

    const body = await request.json();
    const {
      conversationId,
      status,
      assignedToUserId,
      tags,
      notes,
    } = body;

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (assignedToUserId !== undefined) {
      updateData.assignedToUserId = assignedToUserId;
    }

    if (tags) {
      updateData.tags = tags;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update conversation
    const conversation = await prisma.whatsAppConversation.update({
      where: { id: conversationId },
      data: updateData,
      include: {
        property: true,
        user: true,
        assignedTo: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('[Conversations API] PATCH error:', error);
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


