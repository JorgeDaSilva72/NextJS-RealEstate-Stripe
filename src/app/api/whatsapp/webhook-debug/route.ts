/**
 * WhatsApp Webhook Debug Endpoint
 * Diagnostic endpoint to verify webhook route is accessible
 * @route /api/whatsapp/webhook-debug
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook debug endpoint is accessible',
    timestamp: new Date().toISOString(),
    url: request.url,
    method: 'GET',
    routes: {
      webhook: '/api/whatsapp/webhook',
      health: '/api/whatsapp/health',
      debug: '/api/whatsapp/webhook-debug',
    },
    instructions: {
      testWebhook: 'GET /api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=whatsapp_verify_123&hub.challenge=test123',
      expectedResponse: 'Plain text: test123',
    },
  });
}

