import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAuthUrl, getRedirectUri } from "@/lib/google-analytics/oauth";
import { validateGoogleAnalyticsEnv } from "@/lib/google-analytics/env-validation";
import prisma from "@/lib/prisma";

/**
 * Debug endpoint to test OAuth flow setup
 * GET /api/debug-oauth-flow
 * 
 * This helps verify:
 * - OAuth URL generation
 * - Redirect URI configuration
 * - User authentication
 * - Token storage readiness
 */
export async function GET(req: NextRequest) {
  try {
    console.log("[DEBUG-OAUTH-FLOW] Starting OAuth flow debug...");
    
    // Check environment
    const envError = validateGoogleAnalyticsEnv();
    const redirectUri = getRedirectUri();
    
    // Check authentication
    let user;
    try {
      const session = await getKindeServerSession();
      const { getUser } = session;
      user = await getUser();
    } catch (error: any) {
      return NextResponse.json({
        ok: false,
        step: "authentication",
        error: error.message || "Authentication failed",
        env: {
          valid: !envError,
          error: envError,
          redirectUri,
        },
      }, { status: 401 });
    }

    if (!user || !user.id) {
      return NextResponse.json({
        ok: false,
        step: "authentication",
        error: "User not authenticated",
        env: {
          valid: !envError,
          error: envError,
          redirectUri,
        },
      }, { status: 401 });
    }

    // Check if user exists in database
    let dbUser;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
    } catch (error: any) {
      return NextResponse.json({
        ok: false,
        step: "database_check",
        error: error.message || "Database error",
        userId: user.id,
        env: {
          valid: !envError,
          error: envError,
          redirectUri,
        },
      }, { status: 500 });
    }

    // Generate OAuth URL
    let authUrl: string;
    try {
      authUrl = getAuthUrl();
    } catch (error: any) {
      return NextResponse.json({
        ok: false,
        step: "generate_auth_url",
        error: error.message || "Failed to generate OAuth URL",
        userId: user.id,
        env: {
          valid: !envError,
          error: envError,
          redirectUri,
        },
      }, { status: 500 });
    }

    // Check existing tokens
    let existingTokens;
    try {
      existingTokens = await prisma.googleAnalyticsToken.findUnique({
        where: { userId: user.id },
      });
    } catch (error: any) {
      // Ignore - just for info
    }

    return NextResponse.json({
      ok: true,
      userId: user.id,
      userInDb: !!dbUser,
      hasExistingTokens: !!existingTokens,
      oauthUrl: authUrl,
      redirectUri,
      env: {
        valid: !envError,
        error: envError,
      },
      instructions: {
        step1: "Click the oauthUrl to start OAuth flow",
        step2: "Google will redirect to: " + redirectUri,
        step3: "Callback should store tokens in database",
        step4: "Then call /api/debug-analytics to verify tokens",
      },
    });
  } catch (error: any) {
    console.error("[DEBUG-OAUTH-FLOW] Error:", error);
    return NextResponse.json({
      ok: false,
      step: "unexpected_error",
      error: error.message || String(error),
      stack: error.stack,
    }, { status: 500 });
  }
}

