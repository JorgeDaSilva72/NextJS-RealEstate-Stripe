import { NextResponse } from "next/server";

/**
 * Debug endpoint to check environment variables in production
 * GET /api/debug-env-check
 * 
 * This will help diagnose what's causing the 500 error
 */
export async function GET() {
    try {
        const envCheck = {
            nodeEnv: process.env.NODE_ENV,
            hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
            hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
            hasGoogleRedirectUri: !!process.env.GOOGLE_REDIRECT_URI,
            hasNextPublicBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
            hasGoogleAnalyticsPropertyId: !!process.env.GOOGLE_ANALYTICS_PROPERTY_ID,
            // Safe to show these since they're public or non-sensitive
            googleClientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...",
            googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "NOT SET (using fallback)",
            nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || "NOT SET (using hardcoded fallback)",
            googleAnalyticsPropertyId: process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "NOT SET",
        };

        return NextResponse.json({
            success: true,
            environment: envCheck,
            message: "Environment variables check completed",
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}
