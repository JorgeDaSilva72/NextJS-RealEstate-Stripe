import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Clear/delete Google Analytics tokens for the current user
 * GET /api/analytics/clear
 * 
 * This endpoint allows users to delete their stored tokens so they can reauthorize
 * with fresh tokens that have the correct scopes.
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

    console.log(`[Clear Tokens] Deleting tokens for user: ${user.id}`);

    // Delete the token record
    const deleted = await prisma.googleAnalyticsToken.deleteMany({
      where: { userId: user.id },
    });

    console.log(`[Clear Tokens] Deleted ${deleted.count} token record(s) for user: ${user.id}`);

    return NextResponse.json({
      success: true,
      message: "Tokens cleared successfully. Please reconnect your Google Analytics account.",
      deletedCount: deleted.count,
    });
  } catch (error: any) {
    console.error("Error clearing tokens:", error);
    
    // If token doesn't exist, that's okay
    if (error?.code === "P2025" || error?.message?.includes("Record to delete does not exist")) {
      return NextResponse.json({
        success: true,
        message: "No tokens found to delete.",
        deletedCount: 0,
      });
    }

    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

