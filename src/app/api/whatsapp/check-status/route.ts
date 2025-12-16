/**
 * Check WhatsApp Message Status
 * Check if a message was delivered/failed
 * @route /api/whatsapp/check-status
 */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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

    const {
      WHATSAPP_PHONE_NUMBER_ID = '947502885103297',
      WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || '',
      WHATSAPP_API_VERSION = 'v18.0',
    } = process.env;

    if (!WHATSAPP_ACCESS_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 500,
            message: 'WhatsApp access token not configured',
          },
        },
        { status: 500 }
      );
    }

    // Check message status via Meta API
    const response = await axios.get(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        },
        params: {
          fields: 'status,errors',
        },
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        messageId,
        status: response.data.status,
        errors: response.data.errors || null,
        note: response.data.status === 'sent' 
          ? 'Message sent but may not be delivered if outside 24-hour window. Use template for first message.'
          : response.data.status === 'delivered'
          ? 'Message delivered successfully!'
          : response.data.status === 'failed'
          ? 'Message failed. Check errors field for details.'
          : 'Status unknown',
      },
    });
  } catch (error: any) {
    console.error('[Check Status API] Error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 500,
          message: error.response?.data?.error?.message || error.message || 'Failed to check message status',
          details: error.response?.data?.error,
        },
      },
      { status: 500 }
    );
  }
}

