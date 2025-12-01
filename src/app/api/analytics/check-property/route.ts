import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

/**
 * Check GA4 property ID configuration
 * GET /api/analytics/check-property
 * 
 * This endpoint helps verify the property ID is set correctly
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

    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const hasClientSecret = !!process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    return NextResponse.json({
      success: true,
      propertyId: propertyId || null,
      propertyIdSet: !!propertyId,
      propertyIdLength: propertyId?.length || 0,
      clientIdSet: !!clientId,
      clientIdPreview: clientId ? `${clientId.substring(0, 20)}...` : null,
      clientSecretSet: hasClientSecret,
      redirectUri: redirectUri || null,
      redirectUriSet: !!redirectUri,
      environment: process.env.NODE_ENV,
      message: propertyId 
        ? `Property ID is set: ${propertyId}`
        : "Property ID is NOT set in environment variables",
      suggestion: !propertyId 
        ? "Please set GOOGLE_ANALYTICS_PROPERTY_ID in your environment variables"
        : "Property ID is configured. If you're getting 403 errors, make sure the Google account has access to this property in Google Analytics.",
    });
  } catch (error: any) {
    console.error("Error checking property configuration:", error);
    return NextResponse.json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

