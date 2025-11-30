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

    // Ensure user exists in database before storing tokens
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      // Create user if they don't exist
      // Note: updatedAt should be handled by Prisma @updatedAt, but we set it explicitly
      // to avoid null constraint violations if the database requires it
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
      console.log("User created during OAuth callback:", user.id);
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

    // Get redirect URI for token exchange - use oauth2callback for backward compatibility
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.NODE_ENV === "production" ? "https://afriqueavenirimmobilier.com" : "http://localhost:3000");
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/oauth2callback`;
    
    console.log("[OAuth2Callback] Using redirect URI:", redirectUri);
    
    // Exchange code for tokens
    const tokens = await getTokensFromCode(code, redirectUri);

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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

