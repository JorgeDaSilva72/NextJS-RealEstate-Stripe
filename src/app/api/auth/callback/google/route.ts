import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import prisma from "@/lib/prisma";
import { getRedirectUri } from "@/lib/google-analytics/env-validation";

/**
 * Google OAuth callback handler
 * GET /api/auth/callback/google
 * 
 * This is the canonical OAuth callback route that Google redirects to after OAuth
 */
export async function GET(req: NextRequest) {
  try {
    console.log("[Google OAuth Callback] Processing callback...");

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const userId = url.searchParams.get("state"); // userId passed in state parameter
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    // Handle OAuth errors from Google
    if (error) {
      const errorMsg = errorDescription || error;
      console.error("[Google OAuth Callback] OAuth error from Google:", errorMsg);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        console.error("[Google OAuth Callback] CRITICAL: NEXT_PUBLIC_BASE_URL not set!");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent(errorMsg)}`
      );
    }

    if (!code) {
      console.error("[Google OAuth Callback] No authorization code provided");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent("No authorization code received")}`
      );
    }

    if (!userId) {
      console.error("[Google OAuth Callback] No userId in state parameter");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent("Missing user ID")}`
      );
    }

    console.log("[Google OAuth Callback] Code received, userId:", userId);

    // Initialize OAuth2 client
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Get redirect URI from centralized validation
    const redirectUri = getRedirectUri();

    if (!clientId || !clientSecret) {
      console.error("[Google OAuth Callback] Missing OAuth credentials");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent("OAuth configuration error")}`
      );
    }

    console.log("[Google OAuth Callback] Using redirect URI:", redirectUri);

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Exchange code for tokens
    console.log("[Google OAuth Callback] Exchanging code for tokens...");
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token) {
      console.error("[Google OAuth Callback] No access token received");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent("Failed to obtain access token")}`
      );
    }

    if (!tokens.refresh_token) {
      console.error("[Google OAuth Callback] No refresh token received");
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent(
          "No refresh token received. Please remove Test Users in Google Console → OAuth consent screen and try again."
        )}`
      );
    }

    // Calculate expiry date
    // Google returns expiry_date in milliseconds (not seconds)
    const expiryDate = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // Default to 1 hour

    console.log("[Google OAuth Callback] Tokens received, storing in database...");
    console.log("[Google OAuth Callback] Token details:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiryDate: expiryDate.toISOString(),
    });

    // Store tokens in database
    try {
      const tokenData = {
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate,
      };

      const result = await prisma.googleAnalyticsToken.upsert({
        where: { userId },
        update: tokenData,
        create: tokenData,
      });

      console.log("[Google OAuth Callback] Tokens stored successfully:", {
        userId: result.userId,
        hasAccessToken: !!result.accessToken,
        hasRefreshToken: !!result.refreshToken,
      });

      // Verify storage
      const verification = await prisma.googleAnalyticsToken.findUnique({
        where: { userId },
      });

      if (!verification) {
        console.error("[Google OAuth Callback] CRITICAL: Token verification failed!");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!baseUrl) {
          return NextResponse.json({ error: "Configuration error" }, { status: 500 });
        }
        return NextResponse.redirect(
          `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent("Token storage verification failed")}`
        );
      }

      console.log("[Google OAuth Callback] Token verification successful - redirecting to dashboard");
    } catch (error: any) {
      console.error("[Google OAuth Callback] Failed to store tokens:", error);
      console.error("[Google OAuth Callback] Error details:", {
        message: error.message,
        code: error.code,
        meta: error.meta,
      });
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      if (!baseUrl) {
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
      }
      return NextResponse.redirect(
        `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent(
          `Failed to store tokens: ${error.message || "Database error"}`
        )}`
      );
    }

    // Redirect to dashboard with success
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }
    return NextResponse.redirect(
      `${baseUrl}/en/analytics/dashboard?connected=1&success=true`
    );
  } catch (error: any) {
    console.error("[Google OAuth Callback] Unexpected error:", error);
    console.error("[Google OAuth Callback] Error stack:", error.stack);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json({ error: "Configuration error - NEXT_PUBLIC_BASE_URL not set" }, { status: 500 });
    }
    return NextResponse.redirect(
      `${baseUrl}/en/analytics/dashboard?error=${encodeURIComponent(
        error.message || "An unexpected error occurred"
      )}`
    );
  }
}

