import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAuthUrl } from "@/lib/google-analytics/oauth";
import { validateGoogleAnalyticsEnv } from "@/lib/google-analytics/env-validation";

/**
 * Initiate OAuth2 flow
 * GET /api/analytics/auth
 */
export async function GET(req: NextRequest) {
  try {
    console.log("[OAuth Auth] Initiating OAuth flow...");
    
    // Check if user is authenticated
    let user;
    try {
      const session = await getKindeServerSession();
      const { getUser } = session;
      user = await getUser();
    } catch (error: any) {
      console.error("[OAuth Auth] Authentication check failed:", error);
      // Still redirect to login, don't fail completely
    }

    if (!user || !user.id) {
      console.log("[OAuth Auth] User not authenticated, redirecting to login");
      // Redirect to Kinde login with return URL
      try {
        const currentUrl = new URL(req.url);
        const returnUrl = encodeURIComponent(currentUrl.toString());
        const loginUrl = new URL("/api/auth/login", currentUrl.origin);
        loginUrl.searchParams.set("post_login_redirect_url", returnUrl);
        return NextResponse.redirect(loginUrl);
      } catch (error: any) {
        console.error("[OAuth Auth] Failed to construct login URL:", error);
        return NextResponse.json(
          { error: "Failed to redirect to login" },
          { status: 500 }
        );
      }
    }

    // Validate environment variables first
    const envError = validateGoogleAnalyticsEnv();
    if (envError) {
      console.error("[OAuth Auth] Environment validation failed:", envError);
      return NextResponse.json(
        { 
          error: "OAuth configuration error",
          details: envError,
          hint: "Please check your production environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI (or NEXT_PUBLIC_BASE_URL)"
        },
        { status: 500 }
      );
    }

    // Generate OAuth2 URL
    let authUrl: string;
    try {
      console.log("[OAuth Auth] Generating OAuth URL...");
      authUrl = getAuthUrl();
      console.log("[OAuth Auth] OAuth URL generated successfully");
    } catch (error: any) {
      console.error("[OAuth Auth] Failed to generate OAuth URL:", error);
      console.error("[OAuth Auth] Error details:", {
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
      return NextResponse.json(
        { 
          error: "Failed to initiate OAuth flow",
          details: error.message || "Check environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)"
        },
        { status: 500 }
      );
    }

    // Redirect to Google OAuth
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("[OAuth Auth] Unexpected error:", error);
    console.error("[OAuth Auth] Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Failed to initiate OAuth flow",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

