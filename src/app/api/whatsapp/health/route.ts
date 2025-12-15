/**
 * WhatsApp Health Check Endpoint
 * Simple endpoint to verify WhatsApp routes are deployed and accessible
 * @route /api/whatsapp/health
 */

import { NextResponse } from 'next/server';

/**
 * GET - Health check
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'WhatsApp Webhook',
    timestamp: new Date().toISOString(),
    routes: {
      webhook: '/api/whatsapp/webhook',
      send: '/api/whatsapp/send',
      status: '/api/whatsapp/status',
      conversations: '/api/whatsapp/conversations',
    },
  });
}

