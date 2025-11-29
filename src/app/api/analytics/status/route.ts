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

    // Safely check if token is expired
    let expired = false;
    try {
      expired = isTokenExpired(tokens.expiryDate);
    } catch (error) {
      console.error("Error checking token expiry:", error);
      // If we can't check expiry, assume it's expired for safety
      expired = true;
    }

    return NextResponse.json({
      connected: true,
      authenticated: true,
      expired,
      expiryDate: tokens.expiryDate,
    });
  } catch (error: any) {
    console.error("Error checking analytics status:", error);
    // Return 200 with error info instead of 500 to prevent client crashes
    return NextResponse.json(
      { 
        connected: false,
        authenticated: false,
        error: error?.message || "Failed to check analytics status",
        message: "Unable to verify Google Analytics connection"
      },
      { status: 200 }
    );
  }
}

