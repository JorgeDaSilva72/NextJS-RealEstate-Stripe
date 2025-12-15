/**
 * WhatsApp Webhook API Route
 * Handles incoming webhooks from Meta Cloud API
 * @route /api/whatsapp/webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhook,
  validateSignature,
  processWebhook,
} from '@/lib/whatsapp/webhook-handler';

/**
 * GET - Webhook verification
 * Called by Meta when setting up the webhook
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    if (!mode || !token || !challenge) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const result = verifyWebhook({
      mode,
      token,
      challenge,
    });

    if (result.verified) {
      console.log('[Webhook API] Webhook verified successfully');
      return new NextResponse(result.challenge, { status: 200 });
    } else {
      console.error('[Webhook API] Webhook verification failed');
      return NextResponse.json(
        { error: 'Verification failed' },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error('[Webhook API] GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Receive webhook events
 * Called by Meta when messages are sent/received
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature validation
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';

    // Validate signature
    if (process.env.NODE_ENV === 'production') {
      const isValid = validateSignature(signature, body);
      
      if (!isValid) {
        console.error('[Webhook API] Invalid signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // Parse body
    const data = JSON.parse(body);

    // Log webhook for debugging
    const debugMode =
      process.env.WHATSAPP_DEBUG_MODE ?? "true";
    if (debugMode === "true") {
      console.log('[Webhook API] Received webhook:', JSON.stringify(data, null, 2));
    }

    // Process webhook asynchronously
    // Don't await to return 200 immediately to Meta
    processWebhook(data).catch((error) => {
      console.error('[Webhook API] Process webhook error:', error);
    });

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[Webhook API] POST error:', error);
    
    // Still return 200 to prevent Meta from retrying
    return NextResponse.json({ success: true }, { status: 200 });
  }
}


