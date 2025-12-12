import { NextRequest, NextResponse } from "next/server";

/**
 * Google OAuth entry point
 * GET /api/auth/google
 * 
 * This route redirects to the analytics auth endpoint
 * for backward compatibility and cleaner URLs
 */
export async function GET(req: NextRequest) {
  try {
    // Redirect to the analytics auth endpoint
    const url = new URL("/api/analytics/auth", req.url);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error in /api/auth/google:", error);
    return NextResponse.json(
      { error: "Failed to redirect to OAuth" },
      { status: 500 }
    );
  }
}

