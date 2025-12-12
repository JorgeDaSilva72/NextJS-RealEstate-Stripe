import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStoredTokens, getValidAccessToken } from "@/lib/google-analytics/oauth";
import { getRealtimeReport } from "@/lib/google-analytics/ga4-client";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

/**
 * Debug API route to test analytics functions and return real errors
 * GET /api/debug-analytics
 * 
 * WARNING: Remove this route after debugging!
 */
export async function GET(req: NextRequest) {
  const logFile = path.join(process.cwd(), "debug-analytics.log");
  
  const logError = (message: string, error: any) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n${error?.stack || String(error)}\n\n`;
    
    console.error(`DEBUG-ANALYTICS-ERROR: ${message}`, error);
    
    // Try to write to file
    try {
      fs.appendFileSync(logFile, logMessage);
    } catch (e) {
      // Ignore file write errors
      console.error("Failed to write to log file:", e);
    }
  };

  try {
    console.log("[DEBUG-ANALYTICS] Starting debug check...");
    
    // Check authentication
    let user;
    try {
      const session = await getKindeServerSession();
      const { getUser } = session;
      user = await getUser();
      console.log("[DEBUG-ANALYTICS] User authenticated:", !!user);
    } catch (error: any) {
      logError("Authentication check failed", error);
      return NextResponse.json({
        ok: false,
        step: "authentication",
        error: error.message || String(error),
        stack: error.stack,
      }, { status: 500 });
    }

    if (!user || !user.id) {
      return NextResponse.json({
        ok: false,
        step: "authentication",
        error: "User not authenticated",
      }, { status: 401 });
    }

    // Check environment variables
    const envCheck = {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI: !!process.env.GOOGLE_REDIRECT_URI,
      NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
      GOOGLE_ANALYTICS_PROPERTY_ID: !!process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
      NODE_ENV: process.env.NODE_ENV,
    };
    console.log("[DEBUG-ANALYTICS] Environment check:", envCheck);

    // Check stored tokens
    let tokens;
    try {
      console.log("[DEBUG-ANALYTICS] Checking stored tokens for user:", user.id);
      
      // First, check directly in database
      let dbCheck;
      try {
        dbCheck = await prisma.googleAnalyticsToken.findUnique({
          where: { userId: user.id },
        });
        console.log("[DEBUG-ANALYTICS] Direct DB check:", {
          found: !!dbCheck,
          hasAccessToken: !!dbCheck?.accessToken,
          hasRefreshToken: !!dbCheck?.refreshToken,
        });
      } catch (dbError: any) {
        console.error("[DEBUG-ANALYTICS] Database check failed:", dbError);
        logError("Database check failed", dbError);
      }
      
      tokens = await getStoredTokens(user.id);
      console.log("[DEBUG-ANALYTICS] Tokens found via getStoredTokens:", !!tokens);
    } catch (error: any) {
      logError("Error getting stored tokens", error);
      return NextResponse.json({
        ok: false,
        step: "get_stored_tokens",
        error: error.message || String(error),
        stack: error.stack,
        envCheck,
        userId: user.id,
      }, { status: 500 });
    }

    if (!tokens) {
      // Check if there are ANY tokens in the database
      let allTokens: any[] = [];
      try {
        allTokens = await prisma.googleAnalyticsToken.findMany({
          take: 5,
          select: {
            userId: true,
            accessToken: true, // Just check if it exists
          },
        });
        console.log("[DEBUG-ANALYTICS] Sample tokens in DB:", allTokens.length);
      } catch (e) {
        console.error("[DEBUG-ANALYTICS] Error checking all tokens:", e);
        // Ignore
      }

      return NextResponse.json({
        ok: false,
        step: "no_tokens",
        message: "No tokens found. User needs to connect Google Analytics.",
        userId: user.id,
        envCheck,
        dbCheck: {
          hasTokensTable: true, // If we got here, table exists
          sampleCount: allTokens.length,
        },
      }, { status: 200 });
    }

    // Check valid access token
    let accessToken;
    try {
      console.log("[DEBUG-ANALYTICS] Getting valid access token...");
      accessToken = await getValidAccessToken(user.id);
      console.log("[DEBUG-ANALYTICS] Access token found:", !!accessToken);
    } catch (error: any) {
      logError("Error getting valid access token", error);
      return NextResponse.json({
        ok: false,
        step: "get_valid_token",
        error: error.message || String(error),
        stack: error.stack,
        envCheck,
        hasTokens: !!tokens,
      }, { status: 500 });
    }

    if (!accessToken) {
      return NextResponse.json({
        ok: false,
        step: "no_valid_token",
        message: "No valid access token. Token may be expired.",
        envCheck,
        hasTokens: !!tokens,
      }, { status: 200 });
    }

    // Try to call GA4 API
    let analyticsData;
    try {
      console.log("[DEBUG-ANALYTICS] Calling GA4 API...");
      analyticsData = await getRealtimeReport(user.id);
      console.log("[DEBUG-ANALYTICS] GA4 API call successful");
    } catch (error: any) {
      logError("Error calling GA4 API", error);
      return NextResponse.json({
        ok: false,
        step: "ga4_api_call",
        error: error.message || String(error),
        stack: error.stack,
        errorCode: error.code,
        errorResponse: error.response?.data || error.response,
        envCheck,
        hasTokens: !!tokens,
        hasAccessToken: !!accessToken,
      }, { status: 500 });
    }

    // Success
    return NextResponse.json({
      ok: true,
      message: "All checks passed",
      envCheck,
      hasTokens: !!tokens,
      hasAccessToken: !!accessToken,
      analyticsDataReceived: !!analyticsData,
    });
  } catch (error: any) {
    logError("Unexpected error in debug-analytics", error);
    return NextResponse.json({
      ok: false,
      step: "unexpected_error",
      error: error.message || String(error),
      stack: error.stack,
      errorName: error.name,
      errorCode: error.code,
    }, { status: 500 });
  }
}

/**
 * Get all tokens count (for debugging)
 * POST /api/debug-analytics
 */
export async function POST(req: NextRequest) {
  try {
    const tokens = await prisma.googleAnalyticsToken.findMany({
      select: {
        userId: true,
        accessToken: true,
        refreshToken: true,
        expiryDate: true,
      },
    });

    return NextResponse.json({
      ok: true,
      count: tokens.length,
      tokens: tokens.map(t => ({
        userId: t.userId,
        hasAccessToken: !!t.accessToken,
        hasRefreshToken: !!t.refreshToken,
        expiryDate: t.expiryDate.toISOString(),
      })),
      env: {
        GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
        GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      },
    });
  } catch (error: any) {
    console.error("[DEBUG-ANALYTICS] Error getting all tokens:", error);
    return NextResponse.json({
      ok: false,
      error: error.message || String(error),
    }, { status: 500 });
  }
}

