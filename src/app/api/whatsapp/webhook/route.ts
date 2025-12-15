/**
 * WhatsApp Webhook API Route
 * Handles incoming webhooks from Meta Cloud API
 * @route /api/whatsapp/webhook
 * Updated: 2024 - Force rebuild to fix 404 in production
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhook,
  validateSignature,
  processWebhook,
} from '@/lib/whatsapp/webhook-handler';

// Explicitly set runtime to ensure compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Ensure route segment config is properly set
export const fetchCache = 'force-no-store';

/**
 * GET - Webhook verification
 * Called by Meta when setting up the webhook
 * MUST return plain text challenge (not JSON) for Facebook verification
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Log for debugging
    console.log('[Webhook API] GET request received:', {
      mode,
      token: token ? '***' : null,
      challenge,
    });

    // Facebook requires all three parameters
    if (!mode || !token || !challenge) {
      console.error('[Webhook API] Missing required parameters:', {
        hasMode: !!mode,
        hasToken: !!token,
        hasChallenge: !!challenge,
        url: request.url,
        searchParams: Object.fromEntries(searchParams.entries()),
      });
      // Return plain text error (Facebook expects plain text)
      return new NextResponse('Missing required parameters', { 
        status: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // Verify webhook
    const result = verifyWebhook({
      mode,
      token,
      challenge,
    });

    if (result.verified && result.challenge) {
      console.log('[Webhook API] ✅ Webhook verified successfully');
      // CRITICAL: Facebook requires plain text response (not JSON)
      // Content-Type should be text/plain
      return new NextResponse(result.challenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    } else {
      console.error('[Webhook API] ❌ Webhook verification failed', {
        mode,
        expectedToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'whatsapp_verify_123',
        receivedToken: token,
      });
      // Return plain text error for Facebook
      return new NextResponse('Verification failed', { 
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error) {
    console.error('[Webhook API] GET error:', error);
    return new NextResponse('Internal server error', { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}

/**
 * OPTIONS - Handle CORS preflight requests
 * Some deployments may require this
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-hub-signature-256',
    },
  });
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


