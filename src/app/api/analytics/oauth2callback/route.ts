import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  getTokensFromCode,
  storeTokens,
} from "@/lib/google-analytics/oauth";

/**
 * OAuth2 callback handler
 * GET /api/analytics/oauth2callback
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
    console.log("[OAuth Callback] Processing OAuth callback...");
    
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
      console.log("[OAuth Callback] Exchanging code for tokens...");
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
        : new Date(Date.now() + 3600 * 1000); // Default to 1 hour if not provided
    } catch (error) {
      console.error("[OAuth Callback] Error parsing expiry date:", error);
      expiryDate = new Date(Date.now() + 3600 * 1000);
    }

    // Store tokens in database
    try {
      console.log("[OAuth Callback] Storing tokens in database...");
      await storeTokens(
        user.id,
        tokens.access_token,
        tokens.refresh_token || null,
        expiryDate
      );
      console.log("[OAuth Callback] Tokens stored successfully");
    } catch (error: any) {
      console.error("[OAuth Callback] Failed to store tokens:", error);
      return NextResponse.redirect(
        `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(
          `Failed to store tokens: ${error.message || "Database error"}`
        )}`
      );
    }

    // Redirect to dashboard with success
    console.log("[OAuth Callback] Redirecting to dashboard...");
    return NextResponse.redirect(
      `${origin}/${defaultLocale}/analytics/dashboard?success=true`
    );
  } catch (error: any) {
    console.error("[OAuth Callback] Unexpected error:", error);
    console.error("[OAuth Callback] Error stack:", error.stack);
    console.error("[OAuth Callback] Error details:", {
      message: error.message,
      name: error.name,
      code: error.code,
    });
    
    const errorMessage = error.message || "An unexpected error occurred during OAuth callback";
    return NextResponse.redirect(
      `${origin}/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(errorMessage)}`
    );
  }
}

