import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStoredTokens, isTokenExpired } from "@/lib/google-analytics/oauth";

/**
 * Check if user has connected Google Analytics
 * GET /api/analytics/status
 */
export async function GET(req: NextRequest) {
  try {
    console.log("[Analytics Status] Checking connection status...");
    
    // Check if user is authenticated
    let user;
    try {
      const session = await getKindeServerSession();
      const { getUser } = session;
      user = await getUser();
    } catch (error: any) {
      console.error("[Analytics Status] Authentication check failed:", error);
      return NextResponse.json({
        connected: false,
        authenticated: false,
        message: "Authentication check failed",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    if (!user || !user.id) {
      console.log("[Analytics Status] User not authenticated");
      return NextResponse.json({
        connected: false,
        authenticated: false,
        message: "Please log in to connect Google Analytics",
      });
    }

    console.log("[Analytics Status] User authenticated, checking tokens...");
    
    let tokens;
    try {
      tokens = await getStoredTokens(user.id);
    } catch (error: any) {
      console.error("[Analytics Status] Error getting stored tokens:", error);
      return NextResponse.json({
        connected: false,
        authenticated: true,
        message: "Error checking connection status",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    if (!tokens) {
      console.log("[Analytics Status] No tokens found for user");
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
      console.log("[Analytics Status] Token expired:", expired);
    } catch (error: any) {
      console.error("[Analytics Status] Error checking token expiry:", error);
      expired = true;
    }

    return NextResponse.json({
      connected: true,
      authenticated: true,
      expired,
      expiryDate: tokens.expiryDate,
    });
  } catch (error: any) {
    console.error("[Analytics Status] Unexpected error:", error);
    console.error("[Analytics Status] Error details:", {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    
    // Return 200 with error info instead of 500 to prevent client crashes
    return NextResponse.json(
      { 
        connected: false,
        authenticated: false,
        error: error?.message || "Failed to check analytics status",
        message: "Unable to verify Google Analytics connection",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 200 }
    );
  }
}

