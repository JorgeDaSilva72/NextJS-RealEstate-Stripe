import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  getTokensFromCode,
  storeTokens,
} from "@/lib/google-analytics/oauth";

/**
 * OAuth2 callback handler (DEPRECATED)
 * GET /api/analytics/oauth2callback
 * 
 * ⚠️ DEPRECATED: This route is maintained for backward compatibility only.
 * The canonical OAuth callback route is: /api/auth/callback/google
 */
export async function GET(req: NextRequest) {
  console.warn("[DEPRECATED] /api/analytics/oauth2callback route used. Please update to /api/auth/callback/google");

  try {
    // Check if user is authenticated
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get authorization code from query params
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Get default locale from routing config
    const defaultLocale = "fr"; // Default locale from routing.ts

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(error)}`,
          req.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/analytics/dashboard?error=no_code`, req.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/analytics/dashboard?error=no_token`, req.url)
      );
    }

    // Calculate expiry date
    const expiryDate = tokens.expiry_date
      ? new Date(tokens.expiry_date)
      : new Date(Date.now() + 3600 * 1000); // Default to 1 hour if not provided

    // Store tokens in database
    await storeTokens(
      user.id,
      tokens.access_token,
      tokens.refresh_token || null,
      expiryDate
    );

    // Redirect to dashboard with default locale
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error("[OAuth2 Callback] CRITICAL: NEXT_PUBLIC_BASE_URL not set!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }
    return NextResponse.redirect(
      new URL(`/${defaultLocale}/analytics/dashboard?success=true`, baseUrl)
    );
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    const defaultLocale = "fr";
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}/analytics/dashboard?error=${encodeURIComponent(
          (error as Error).message
        )}`,
        req.url
      )
    );
  }
}

