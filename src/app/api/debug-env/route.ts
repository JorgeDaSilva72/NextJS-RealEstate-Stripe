import { NextResponse } from "next/server";
import { validateGoogleAnalyticsEnv, getRedirectUri } from "@/lib/google-analytics/env-validation";

/**
 * Debug API route to check environment variables
 * GET /api/debug-env
 * 
 * WARNING: Remove this route after debugging!
 */
export async function GET() {
  try {
    const envs = {
      GOOGLE_CLIENT_ID: {
        present: !!process.env.GOOGLE_CLIENT_ID,
        length: process.env.GOOGLE_CLIENT_ID?.length || 0,
        preview: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + "..." || "not set",
      },
      GOOGLE_CLIENT_SECRET: {
        present: !!process.env.GOOGLE_CLIENT_SECRET,
        length: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
        preview: "***" + (process.env.GOOGLE_CLIENT_SECRET?.substring(process.env.GOOGLE_CLIENT_SECRET.length - 4) || ""),
      },
      GOOGLE_REDIRECT_URI: {
        present: !!process.env.GOOGLE_REDIRECT_URI,
        value: process.env.GOOGLE_REDIRECT_URI || "not set",
      },
      NEXT_PUBLIC_BASE_URL: {
        present: !!process.env.NEXT_PUBLIC_BASE_URL,
        value: process.env.NEXT_PUBLIC_BASE_URL || "not set",
      },
      GOOGLE_ANALYTICS_PROPERTY_ID: {
        present: !!process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
        value: process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "not set",
      },
      NODE_ENV: process.env.NODE_ENV,
    };

    // Validate environment
    const validationError = validateGoogleAnalyticsEnv();
    const redirectUri = getRedirectUri();

    return NextResponse.json({
      ok: true,
      envs,
      validation: {
        valid: !validationError,
        error: validationError || null,
      },
      redirectUri,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[DEBUG-ENV] Error:", error);
    return NextResponse.json({
      ok: false,
      error: error.message || String(error),
      stack: error.stack,
    }, { status: 500 });
  }
}

