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
  } catch (error: any) {
    console.error("Error checking analytics status:", error);
    
    // In production, don't expose internal error details
    const isProduction = process.env.NODE_ENV === "production";
    const errorMessage = error?.message || "Unknown error";
    
    // Check if it's a database error (table doesn't exist)
    if (errorMessage.includes("does not exist") || errorMessage.includes("P2021")) {
      console.error("[Analytics Status] Database table missing - this should be fixed by running migrations");
      return NextResponse.json({
        connected: false,
        authenticated: true,
        error: isProduction 
          ? "Database configuration error" 
          : "GoogleAnalyticsToken table does not exist. Please run database migrations.",
      });
    }
    
    return NextResponse.json(
      { 
        connected: false,
        authenticated: false,
        error: isProduction 
          ? "Failed to check analytics status" 
          : errorMessage
      },
      { status: 500 }
    );
  }
}

