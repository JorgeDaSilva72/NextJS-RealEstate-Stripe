import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getStoredTokens, getValidAccessToken } from "@/lib/google-analytics/oauth";
import { prisma } from "@/lib/prisma";

/**
 * Debug endpoint to check token status
 * GET /api/analytics/debug
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

    // Get raw token record from database
    const tokenRecord = await prisma.googleAnalyticsToken.findUnique({
      where: { userId: user.id },
    });

    // Get tokens using the helper function
    const storedTokens = await getStoredTokens(user.id);
    
    // Try to get valid access token
    const validToken = await getValidAccessToken(user.id);

    return NextResponse.json({
      userId: user.id,
      email: user.email,
      tokenRecord: tokenRecord ? {
        id: tokenRecord.id,
        userId: tokenRecord.userId,
        hasAccessToken: !!tokenRecord.accessToken,
        accessTokenLength: tokenRecord.accessToken?.length || 0,
        hasRefreshToken: !!tokenRecord.refreshToken,
        refreshTokenLength: tokenRecord.refreshToken?.length || 0,
        expiryDate: tokenRecord.expiryDate.toISOString(),
        createdAt: tokenRecord.createdAt.toISOString(),
        updatedAt: tokenRecord.updatedAt.toISOString(),
      } : null,
      storedTokens: storedTokens ? {
        hasAccessToken: !!storedTokens.accessToken,
        accessTokenLength: storedTokens.accessToken?.length || 0,
        hasRefreshToken: !!storedTokens.refreshToken,
        refreshTokenLength: storedTokens.refreshToken?.length || 0,
        expiryDate: storedTokens.expiryDate.toISOString(),
        isExpired: new Date() >= storedTokens.expiryDate,
      } : null,
      validToken: validToken ? {
        present: true,
        length: validToken.length,
      } : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

