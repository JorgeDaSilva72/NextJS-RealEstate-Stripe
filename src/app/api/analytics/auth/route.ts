import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getAuthUrl } from "@/lib/google-analytics/oauth";

/**
 * Initiate OAuth2 flow
 * GET /api/analytics/auth
 */
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    if (!user || !user.id) {
      // Redirect to Kinde login with return URL
      // Get the current URL to redirect back after login
      const currentUrl = new URL(req.url);
      const returnUrl = encodeURIComponent(currentUrl.toString());
      const loginUrl = new URL("/api/auth/login", currentUrl.origin);
      loginUrl.searchParams.set("post_login_redirect_url", returnUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Generate OAuth2 URL with userId in state for security
    const authUrl = getAuthUrl(user.id);
    
    // Log the redirect URI being used for debugging
    const { getRedirectUri } = await import("@/lib/google-analytics/env-validation");
    const redirectUri = getRedirectUri();
    console.log("[Analytics Auth] Redirect URI being used:", redirectUri);
    console.log("[Analytics Auth] Full OAuth URL:", authUrl.substring(0, 200) + "...");

    // Store state in session/cookie for security (optional but recommended)
    // For now, we'll redirect directly
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error initiating OAuth flow:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 }
    );
  }
}

