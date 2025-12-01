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
    
    // Verify credentials are set on the client
    const clientCredentials = oauth2Client.credentials;
    console.log(`[Test Token] Client credentials:`, {
      hasAccessToken: !!clientCredentials.access_token,
      accessTokenLength: clientCredentials.access_token?.length || 0,
      accessTokenPreview: clientCredentials.access_token?.substring(0, 20) + "...",
      hasRefreshToken: !!clientCredentials.refresh_token,
      expiryDate: clientCredentials.expiry_date ? new Date(clientCredentials.expiry_date).toISOString() : null,
    });

    // Try to get user info from Google to verify token works
    try {
      // First, try to get a fresh access token from the client
      // This ensures the client is properly authenticated
      let freshToken: string | null | undefined;
      try {
        const tokenResponse = await oauth2Client.getAccessToken();
        freshToken = tokenResponse.token || undefined;
        console.log(`[Test Token] Successfully obtained access token from client`);
      } catch (tokenError: any) {
        console.error(`[Test Token] Error getting access token:`, tokenError);
        return NextResponse.json({
          error: "Failed to get access token from OAuth2 client",
          hasToken: true,
          hasOAuthClient: true,
          tokenError: {
            message: tokenError?.message,
            code: tokenError?.code,
            response: tokenError?.response?.data,
          },
          suggestion: "Token may be expired or invalid. Try reconnecting your Google Analytics account.",
        }, { status: 401 });
      }
      
      // Verify we have a token
      if (!freshToken && !clientCredentials.access_token) {
        return NextResponse.json({
          error: "No access token available after getAccessToken() call",
          hasToken: true,
          hasOAuthClient: true,
          suggestion: "Token may be expired. Try reconnecting your Google Analytics account.",
        }, { status: 401 });
      }
      
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
      
      // Check if it's a token expiration issue
      const isTokenError = googleError?.code === 401 || 
                          googleError?.message?.includes("authentication") ||
                          googleError?.message?.includes("credential");
      
      return NextResponse.json({
        error: "Token exists but Google API call failed",
        hasToken: true,
        hasOAuthClient: true,
        isTokenError,
        googleError: {
          message: googleError?.message,
          code: googleError?.code,
          response: googleError?.response?.data,
        },
        suggestion: isTokenError 
          ? "Your Google Analytics token appears to be expired or invalid. Please disconnect and reconnect your Google Analytics account."
          : "There was an error communicating with Google's API. Please try again later.",
        debug: {
          clientHasAccessToken: !!clientCredentials.access_token,
          clientAccessTokenLength: clientCredentials.access_token?.length || 0,
          clientHasRefreshToken: !!clientCredentials.refresh_token,
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

