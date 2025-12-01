import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getValidAccessToken, setOAuth2Credentials } from "@/lib/google-analytics/oauth";
import { google } from "googleapis";
import { getTrafficOverview } from "@/lib/google-analytics/ga4-client";

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
        
        // If we got a fresh token, update the client credentials
        if (freshToken) {
          const updatedCredentials: any = {
            ...clientCredentials,
            access_token: freshToken,
          };
          // Ensure expiry_date is in seconds if present
          if (updatedCredentials.expiry_date) {
            updatedCredentials.expiry_date = Math.floor(updatedCredentials.expiry_date / 1000);
          }
          oauth2Client.setCredentials(updatedCredentials);
        }
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
      const finalCredentials = oauth2Client.credentials;
      if (!finalCredentials.access_token) {
        return NextResponse.json({
          error: "No access token available after getAccessToken() call",
          hasToken: true,
          hasOAuthClient: true,
          finalCredentials: {
            hasAccessToken: !!finalCredentials.access_token,
            hasRefreshToken: !!finalCredentials.refresh_token,
          },
          suggestion: "Token may be expired. Try reconnecting your Google Analytics account.",
        }, { status: 401 });
      }
      
      // Create OAuth2 API client with the authenticated OAuth2 client
      const oauth2 = google.oauth2({
        version: "v2",
        auth: oauth2Client,
      });

      // Test 1: Get user info from Google OAuth2 API
      const userInfo = await oauth2.userinfo.get();
      console.log(`[Test Token] Successfully retrieved user info from Google`);

      // Test 2: Try a minimal GA4 API call
      let ga4TestResult: any = null;
      let ga4Error: any = null;
      
      try {
        console.log(`[Test Token] Testing GA4 API call...`);
        const ga4Data = await getTrafficOverview(user.id, "7daysAgo", "today");
        
        if (ga4Data) {
          ga4TestResult = {
            success: true,
            hasData: true,
            rowCount: ga4Data.rows?.length || 0,
          };
          console.log(`[Test Token] GA4 API call successful, rows: ${ga4Data.rows?.length || 0}`);
        } else {
          ga4TestResult = {
            success: false,
            hasData: false,
            message: "GA4 API returned null (likely authentication issue)",
          };
          console.warn(`[Test Token] GA4 API returned null`);
        }
      } catch (ga4Err: any) {
        ga4Error = {
          message: ga4Err?.message,
          code: ga4Err?.code,
          response: ga4Err?.response?.data,
        };
        console.error(`[Test Token] GA4 API call failed:`, ga4Err?.message);
      }

      return NextResponse.json({
        success: true,
        hasToken: true,
        hasOAuthClient: true,
        googleUserInfo: {
          email: userInfo.data.email,
          name: userInfo.data.name,
        },
        ga4Test: ga4TestResult,
        ga4Error: ga4Error || undefined,
        message: ga4TestResult?.success 
          ? "Token is valid and working with both OAuth2 and GA4 APIs"
          : "Token works with OAuth2 API but GA4 API test failed",
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

