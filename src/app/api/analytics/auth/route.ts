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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate OAuth2 URL
    const authUrl = getAuthUrl();

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

