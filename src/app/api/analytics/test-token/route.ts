import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getValidAccessToken, setOAuth2Credentials } from "@/lib/google-analytics/oauth";
import { google } from "googleapis";

/**
 * Test endpoint to verify token works with Google API
 * GET /api/analytics/test-token
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

    console.log(`[Test Token] Testing token for user: ${user.id}`);

    // Get valid access token
    const accessToken = await getValidAccessToken(user.id);
    if (!accessToken) {
      return NextResponse.json({
        error: "No valid access token found",
        hasToken: false,
      }, { status: 401 });
    }

    console.log(`[Test Token] Access token retrieved, length: ${accessToken.length}`);

    // Try to set OAuth2 credentials
    const oauth2Client = await setOAuth2Credentials(user.id);
    if (!oauth2Client) {
      return NextResponse.json({
        error: "Failed to set OAuth2 credentials",
        hasToken: true,
        hasOAuthClient: false,
      }, { status: 401 });
    }

    console.log(`[Test Token] OAuth2 client created`);

    // Try to get user info from Google to verify token works
    try {
      const oauth2 = google.oauth2({
        version: "v2",
        auth: oauth2Client,
      });

      const userInfo = await oauth2.userinfo.get();
      console.log(`[Test Token] Successfully retrieved user info from Google`);

      return NextResponse.json({
        success: true,
        hasToken: true,
        hasOAuthClient: true,
        googleUserInfo: {
          email: userInfo.data.email,
          name: userInfo.data.name,
        },
        message: "Token is valid and working",
      });
    } catch (googleError: any) {
      console.error(`[Test Token] Error calling Google API:`, googleError);
      return NextResponse.json({
        error: "Token exists but Google API call failed",
        hasToken: true,
        hasOAuthClient: true,
        googleError: {
          message: googleError?.message,
          code: googleError?.code,
          response: googleError?.response?.data,
        },
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error in test token endpoint:", error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

