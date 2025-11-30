import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {
  getRealtimeReport,
  getTrafficOverview,
  getTopPages,
  getUserBehavior,
  getTrafficSources,
} from "@/lib/google-analytics/ga4-client";

/**
 * Get analytics data
 * GET /api/analytics/data?type=overview&startDate=2024-01-01&endDate=2024-01-31
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

    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get("type") || "overview";
    const startDate = searchParams.get("startDate") || "30daysAgo";
    const endDate = searchParams.get("endDate") || "today";

    let data;

    switch (type) {
      case "realtime":
        data = await getRealtimeReport(user.id);
        break;

      case "overview":
        data = await getTrafficOverview(user.id, startDate, endDate);
        break;

      case "topPages":
        const limit = parseInt(searchParams.get("limit") || "10");
        data = await getTopPages(user.id, startDate, endDate, limit);
        break;

      case "behavior":
        data = await getUserBehavior(user.id, startDate, endDate);
        break;

      case "sources":
        data = await getTrafficSources(user.id, startDate, endDate);
        break;

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    // If data is null, it means authentication failed or no token available
    if (data === null) {
      return NextResponse.json(
        { 
          error: "Authentication required. Please reconnect your Google Analytics account.",
          requiresReconnect: true,
          data: null
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    
    // In production, don't expose internal error details
    const isProduction = process.env.NODE_ENV === "production";
    const errorMessage = error?.message || "Unknown error";
    
    // Check if it's a property ID error
    if (errorMessage.includes("GOOGLE_ANALYTICS_PROPERTY_ID")) {
      return NextResponse.json(
        { 
          error: isProduction 
            ? "Google Analytics configuration error. Please contact support."
            : errorMessage,
          hint: isProduction ? undefined : "Please add GOOGLE_ANALYTICS_PROPERTY_ID to your .env.local file."
        },
        { status: 400 }
      );
    }
    
    // Check if it's an authentication error
    if (errorMessage.includes("token") || errorMessage.includes("auth") || 
        errorMessage.includes("401") || errorMessage.includes("403") ||
        errorMessage.includes("No valid access token")) {
      return NextResponse.json(
        { 
          error: "Authentication required. Please reconnect your Google Analytics account.",
          requiresReconnect: true
        },
        { status: 401 }
      );
    }

    // Check if it's a property not found error
    if (errorMessage.includes("404") || errorMessage.includes("not found") || 
        errorMessage.includes("runReport") || errorMessage.includes("P2021")) {
      return NextResponse.json(
        { 
          error: isProduction
            ? "Google Analytics property not found. Please verify your configuration."
            : "Google Analytics property not found. Please verify your GOOGLE_ANALYTICS_PROPERTY_ID is correct.",
        },
        { status: 404 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: isProduction 
          ? "Failed to fetch analytics data. Please try again later."
          : errorMessage,
        success: false
      },
      { status: 500 }
    );
  }
}

