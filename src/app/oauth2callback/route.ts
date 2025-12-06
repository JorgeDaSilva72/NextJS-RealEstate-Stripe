import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  getTokensFromCode,
  storeTokens,
} from "@/lib/google-analytics/oauth";
import { getRedirectUri } from "@/lib/google-analytics/env-validation";
import prisma from "@/lib/prisma";

// Generate avatar URL
function generateAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${userId}`;
}

/**
 * OAuth2 callback handler
 * GET /oauth2callback
 * 
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
      await prisma.user.create({
        data: {
          id: user.id,
          firstname: user.given_name ?? "",
          lastname: user.family_name ?? "",
          email: user.email ?? "",
          avatarUrl: generateAvatarUrl(user.id),
        },
      });
      console.log("User created during OAuth callback:", user.id);
    }

    // Get authorization code from query params
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const state = searchParams.get("state"); // userId passed in state parameter (if used)

    // Log for debugging
    console.log("[OAuth2Callback] Received code:", !!code);
    console.log("[OAuth2Callback] State parameter:", state || "none");

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

    // Get redirect URI for token exchange - use centralized function to ensure consistency
    const redirectUri = getRedirectUri();

    console.log("[OAuth2Callback] Using redirect URI:", redirectUri);
    console.log("[OAuth2Callback] User ID:", user.id);

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code, redirectUri);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL(`/${defaultLocale}/analytics/dashboard?error=no_token`, req.url)
      );
    }

    // Calculate expiry date
    // Google returns expiry_date in seconds (timestamp), convert to Date
    let expiryDate: Date;
    if (tokens.expiry_date) {
      const expiryValue: unknown = tokens.expiry_date;
      // Check if it's already a Date object
      if (expiryValue instanceof Date) {
        expiryDate = expiryValue;
      } else if (typeof expiryValue === 'number') {
        // If it's a number, check if it's in seconds (< year 2000) or milliseconds
        // Timestamps in seconds are typically < 10000000000 (year 2001)
        expiryDate = expiryValue < 10000000000
          ? new Date(expiryValue * 1000) // seconds to milliseconds
          : new Date(expiryValue); // already milliseconds
      } else {
        // Fallback if it's an unexpected type
        expiryDate = new Date(Date.now() + 3600 * 1000); // 1 hour from now
      }
    } else {
      expiryDate = new Date(Date.now() + 3600 * 1000); // Default to 1 hour if not provided
    }

    console.log("[OAuth2Callback] Token expiry date:", expiryDate.toISOString());

    // Store tokens in database
    await storeTokens(
      user.id,
      tokens.access_token,
      tokens.refresh_token || null,
      expiryDate
    );

    // Redirect to dashboard with default locale
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "production" ? "https://afriqueavenirimmobilier.com" : "http://localhost:3000");
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

