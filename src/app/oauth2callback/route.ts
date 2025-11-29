import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  getTokensFromCode,
  storeTokens,
} from "@/lib/google-analytics/oauth";
import prisma from "@/lib/prisma";

// Generate avatar URL
function generateAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${userId}`;
}

/**
 * OAuth2 callback handler
 * GET /oauth2callback
 * This matches the redirect URI: http://localhost:3000/oauth2callback
 * This route is at root level to avoid locale routing issues
 */
export async function GET(req: NextRequest) {
  const defaultLocale = "fr";
  let origin: string;
  
  try {
    origin = new URL(req.url).origin;
  } catch (error) {
    console.error("[OAuth Callback] Failed to parse request URL:", error);
    return NextResponse.json(
      { error: "Invalid request URL" },
      { status: 400 }
    );
  }

  try {
    console.log("[OAuth Callback] Processing OAuth callback (root route)...");
    
    // Check if user is authenticated
    let user;
    try {
      const session = await getKindeServerSession();
      const { getUser } = session;
      user = await getUser();
    } catch (error: any) {
      console.error("[OAuth Callback] Authentication error:", error);
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent("Authentication failed")}`
      );
    }

    if (!user || !user.id) {
      console.warn("[OAuth Callback] User not authenticated");
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent("User not authenticated")}`
      );
    }

    // Ensure user exists in database before storing tokens
    try {
      let dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });

      if (!dbUser) {
        const now = new Date();
        await prisma.user.create({
          data: {
            id: user.id,
            firstName: user.given_name ?? "",
            lastName: user.family_name ?? "",
            email: user.email ?? "",
            avatarUrl: generateAvatarUrl(user.id),
            updatedAt: now,
          },
        });
        console.log("[OAuth Callback] User created during OAuth callback:", user.id);
      }
    } catch (error: any) {
      console.error("[OAuth Callback] Database error:", error);
      // Continue anyway, user might already exist
    }

    // Get authorization code from query params
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error) {
      const errorMsg = errorDescription || error;
      console.error("[OAuth Callback] OAuth error from Google:", errorMsg);
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(errorMsg)}`
      );
    }

    if (!code) {
      console.error("[OAuth Callback] No authorization code provided");
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent("No authorization code received")}`
      );
    }

    // Exchange code for tokens
    let tokens;
    try {
      tokens = await getTokensFromCode(code);
    } catch (error: any) {
      console.error("[OAuth Callback] Token exchange failed:", error);
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(
          `Token exchange failed: ${error.message || "Unknown error"}`
        )}`
      );
    }

    if (!tokens || !tokens.access_token) {
      console.error("[OAuth Callback] No access token in response");
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent("Failed to obtain access token")}`
      );
    }

    // Calculate expiry date
    let expiryDate: Date;
    try {
      expiryDate = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : new Date(Date.now() + 3600 * 1000);
    } catch (error) {
      console.error("[OAuth Callback] Error parsing expiry date:", error);
      expiryDate = new Date(Date.now() + 3600 * 1000);
    }

    // Store tokens in database
    try {
      console.log("[OAuth Callback] Storing tokens for user:", user.id);
      const storedResult = await storeTokens(
        user.id,
        tokens.access_token,
        tokens.refresh_token || null,
        expiryDate
      );
      console.log("[OAuth Callback] Tokens stored successfully:", {
        userId: storedResult.userId,
        hasAccessToken: !!storedResult.accessToken,
      });

      // Verify tokens were stored by reading them back
      console.log("[OAuth Callback] Verifying token storage...");
      const verification = await prisma.googleAnalyticsToken.findUnique({
        where: { userId: user.id },
      });

      if (!verification) {
        console.error("[OAuth Callback] CRITICAL: Token verification failed - tokens not found after storage!");
        return NextResponse.redirect(
          `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(
            "Token storage verification failed"
          )}`
        );
      }

      console.log("[OAuth Callback] Token verification successful - redirecting to dashboard");
    } catch (error: any) {
      console.error("[OAuth Callback] Failed to store tokens:", error);
      console.error("[OAuth Callback] Storage error details:", {
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(
          `Failed to store tokens: ${error.message || "Database error"}`
        )}`
      );
    }

    return NextResponse.redirect(
      `${origin}/${defaultLocale}/analytics/dashboard?success=true`
    );
  } catch (error: any) {
    console.error("[OAuth Callback] Unexpected error:", error);
    console.error("[OAuth Callback] Error stack:", error.stack);
    const errorMessage = error.message || "An unexpected error occurred during OAuth callback";
    return NextResponse.redirect(
      `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(errorMessage)}`
    );
  }
}

