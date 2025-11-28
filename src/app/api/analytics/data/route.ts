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

    return NextResponse.json({ data, success: true });
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    
    // Check if it's an authentication error
    if (error.message?.includes("token") || error.message?.includes("auth")) {
      return NextResponse.json(
        { error: "Authentication required. Please reconnect your Google Analytics account." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

