import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { refreshAccessToken, getStoredTokens } from "@/lib/google-analytics/oauth";

/**
 * Force refresh the access token
 * GET /api/analytics/force-refresh
 */
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({
        error: "Unauthorized",
        authenticated: false,
      }, { status: 401 });
    }

    // Check if tokens exist
    const tokens = await getStoredTokens(user.id);
    if (!tokens) {
      return NextResponse.json({
        error: "No tokens found. Please connect your Google Analytics account first.",
        hasTokens: false,
      }, { status: 404 });
    }

    // Try to refresh the token
    const refreshed = await refreshAccessToken(user.id);

    if (refreshed) {
      return NextResponse.json({
        success: true,
        message: "Token refreshed successfully",
        newExpiryDate: refreshed.expiryDate.toISOString(),
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Failed to refresh token. The refresh token may be invalid or expired.",
        suggestion: "Please disconnect and reconnect your Google Analytics account.",
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error in force refresh endpoint:", error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

