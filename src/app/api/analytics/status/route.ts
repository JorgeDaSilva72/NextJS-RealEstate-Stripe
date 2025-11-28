import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStoredTokens, isTokenExpired } from "@/lib/google-analytics/oauth";

/**
 * Check if user has connected Google Analytics
 * GET /api/analytics/status
 */
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    if (!user || !user.id) {
      // Return not connected instead of error for better UX
      return NextResponse.json({
        connected: false,
        authenticated: false,
        message: "Please log in to connect Google Analytics",
      });
    }

    const tokens = await getStoredTokens(user.id);

    if (!tokens) {
      return NextResponse.json({
        connected: false,
        authenticated: true,
        message: "Google Analytics not connected",
      });
    }

    const expired = isTokenExpired(tokens.expiryDate);

    return NextResponse.json({
      connected: true,
      authenticated: true,
      expired,
      expiryDate: tokens.expiryDate,
    });
  } catch (error) {
    console.error("Error checking analytics status:", error);
    return NextResponse.json(
      { 
        connected: false,
        authenticated: false,
        error: "Failed to check analytics status" 
      },
      { status: 500 }
    );
  }
}

