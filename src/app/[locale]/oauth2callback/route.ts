import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getTokensFromCode, storeTokens } from "@/lib/google-analytics/oauth";
import prisma from "@/lib/prisma";

// Generate avatar URL
function generateAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${userId}`;
}

/**
 * OAuth2 callback handler
 * GET /[locale]/oauth2callback
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { locale: string } }
) {
  try {
    // Check if user is authenticated
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
          firstname: user.given_name ?? null, //  Kinde est string | null. Prisma est String?. Ça marche.
          lastname: user.family_name ?? null, //  Kinde est string | null. Prisma est String?. Ça marche.
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

    const locale = params.locale || "fr";

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/${locale}/analytics/dashboard?error=${encodeURIComponent(error)}`,
          req.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/${locale}/analytics/dashboard?error=no_code`, req.url)
      );
    }

    // Exchange code for tokens
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token) {
      return NextResponse.redirect(
        new URL(`/${locale}/analytics/dashboard?error=no_token`, req.url)
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

    // Redirect to dashboard with locale
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(
      new URL(`/${locale}/analytics/dashboard?success=true`, baseUrl)
    );
  } catch (error) {
    console.error("Error in OAuth callback:", error);
    const locale = params.locale || "fr";
    return NextResponse.redirect(
      new URL(
        `/${locale}/analytics/dashboard?error=${encodeURIComponent(
          (error as Error).message
        )}`,
        req.url
      )
    );
  }
}
