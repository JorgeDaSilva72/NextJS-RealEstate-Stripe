import { google } from "googleapis";
import { setOAuth2Credentials } from "./oauth";

/**
 * GA4 property ID - hardcoded for production
 */
const PROPERTY_ID = "514683326";

/**
 * Initialize GA4 client with user credentials
 * Returns null if credentials are not available
 */
async function getGA4Client(userId: string): Promise<{ analyticsData: any; propertyId: string; error?: any } | null> {
  console.log(`[getGA4Client] Getting GA4 client for user: ${userId}`);
  console.log(`[getGA4Client] Property ID: ${PROPERTY_ID} (hardcoded)`);
  
  const auth = await setOAuth2Credentials(userId);
  
  if (!auth) {
    console.warn(`[getGA4Client] No valid credentials for user: ${userId}`);
    return null;
  }
  
  console.log(`[getGA4Client] OAuth2 credentials obtained, creating analytics client`);
  
  // Ensure we have a valid access token before creating the client
  try {
    const tokenResponse = await auth.getAccessToken();
    if (!tokenResponse.token) {
      console.error(`[getGA4Client] Failed to get access token for user: ${userId}`);
      return null;
    }
    console.log(`[getGA4Client] Access token obtained, length: ${tokenResponse.token.length}`);
    
    // Verify token has the right scopes by checking credentials
    const credentials = auth.credentials;
    console.log(`[getGA4Client] Token scopes:`, credentials.scope || 'not specified');
  } catch (tokenError: any) {
    console.error(`[getGA4Client] Error getting access token:`, tokenError?.message);
    return null;
  }
  
  // Create a new client instance with auth
  const client = google.analyticsdata({
    version: "v1beta",
    auth: auth,
  });
  // Ensure propertyId is a string
  const propertyId = String(PROPERTY_ID);
  console.log(`[getGA4Client] GA4 client created successfully`);
  return { analyticsData: client, propertyId };
}

/**
 * Get real-time report (active users)
 */
export async function getRealtimeReport(userId: string) {
  try {
    console.log(`[getRealtimeReport] Starting for user: ${userId}`);
    const client = await getGA4Client(userId);
    
    if (!client) {
      console.error(`[getRealtimeReport] No GA4 client available for user: ${userId}`);
      return null; // Return null instead of throwing
    }
    
    const { analyticsData, propertyId } = client;
    console.log(`[getRealtimeReport] Making API call to property: ${propertyId}`);

    const response = await analyticsData.properties.runRealtimeReport({
      property: `properties/${String(propertyId)}`,
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    console.log(`[getRealtimeReport] Successfully fetched realtime data`);
    return response.data;
  } catch (error: any) {
    console.error(`[getRealtimeReport] Error fetching realtime report for user ${userId}:`, error);
    console.error(`[getRealtimeReport] Error message:`, error?.message);
    console.error(`[getRealtimeReport] Error code:`, error?.code);
    console.error(`[getRealtimeReport] Error response:`, error?.response?.data);
    // Return null instead of throwing to prevent SSR crashes
    return null;
  }
}

/**
 * Get traffic overview (users, sessions, page views)
 */
export async function getTrafficOverview(
  userId: string,
  startDate: string,
  endDate: string
): Promise<any> {
  try {
    console.log(`[getTrafficOverview] Starting for user: ${userId}, dates: ${startDate} to ${endDate}`);
    const client = await getGA4Client(userId);
    
    if (!client) {
      console.error(`[getTrafficOverview] No GA4 client available for user: ${userId}`);
      // Return error object instead of null for better debugging
      return { error: "No GA4 client available", code: "NO_CLIENT" };
    }
    
    const { analyticsData, propertyId } = client;
    console.log(`[getTrafficOverview] Making API call to property: ${propertyId}`);

    const response = await analyticsData.properties.runReport({
      property: `properties/${String(propertyId)}`,
      requestBody: {
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
      },
    });

    console.log(`[getTrafficOverview] Successfully fetched traffic overview data`);
    return response.data;
  } catch (error: any) {
    const errorDetails = {
      message: error?.message,
      code: error?.code,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
    };
    
    console.error(`[getTrafficOverview] Error fetching traffic overview for user ${userId}:`, error);
    console.error(`[getTrafficOverview] Error details:`, JSON.stringify(errorDetails, null, 2));
    
    // Check for specific error types
    if (error?.response?.status === 403) {
      console.error(`[getTrafficOverview] 403 Forbidden - User may not have access to GA4 property or missing scopes`);
    } else if (error?.response?.status === 401) {
      console.error(`[getTrafficOverview] 401 Unauthorized - Token may be invalid or expired`);
    } else if (error?.response?.status === 404) {
      console.error(`[getTrafficOverview] 404 Not Found - Property ID may be incorrect: ${PROPERTY_ID}`);
    }
    
    // Return error object instead of null for better debugging
    return { error: "GA4 API call failed", ...errorDetails };
  }
}

/**
 * Get top pages
 */
export async function getTopPages(
  userId: string,
  startDate: string,
  endDate: string,
  limit: number = 10
) {
  try {
    const client = await getGA4Client(userId);
    
    if (!client) {
      return null; // Return null instead of throwing
    }
    
    const { analyticsData, propertyId } = client;

    // Build request body without limit first
    const requestBody: {
      dateRanges: Array<{ startDate: string; endDate: string }>;
      dimensions: Array<{ name: string }>;
      metrics: Array<{ name: string }>;
      orderBys: Array<{
        metric: { metricName: string };
        desc: boolean;
      }>;
      limit?: string;
    } = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" },
        { name: "averageSessionDuration" },
      ],
      orderBys: [
        {
          metric: {
            metricName: "screenPageViews",
          },
          desc: true,
        },
      ],
    };

    // Add limit if provided (API expects string)
    if (limit > 0) {
      requestBody.limit = String(limit);
    }

    const response = await analyticsData.properties.runReport({
      property: `properties/${String(propertyId)}`,
      requestBody,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching top pages:", error);
    // Return null instead of throwing to prevent SSR crashes
    return null;
  }
}

/**
 * Get user behavior metrics
 */
export async function getUserBehavior(
  userId: string,
  startDate: string,
  endDate: string
) {
  try {
    const client = await getGA4Client(userId);
    
    if (!client) {
      return null; // Return null instead of throwing
    }
    
    const { analyticsData, propertyId } = client;

    const response = await analyticsData.properties.runReport({
      property: `properties/${String(propertyId)}`,
      requestBody: {
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [
          { name: "deviceCategory" },
          { name: "country" },
          { name: "city" },
        ],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
        ],
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching user behavior:", error);
    // Return null instead of throwing to prevent SSR crashes
    return null;
  }
}

/**
 * Get traffic sources
 */
export async function getTrafficSources(
  userId: string,
  startDate: string,
  endDate: string
) {
  try {
    const client = await getGA4Client(userId);
    
    if (!client) {
      return null; // Return null instead of throwing
    }
    
    const { analyticsData, propertyId } = client;

    const response = await analyticsData.properties.runReport({
      property: `properties/${String(propertyId)}`,
      requestBody: {
        dateRanges: [
          {
            startDate,
            endDate,
          },
        ],
        dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
          { name: "screenPageViews" },
        ],
        orderBys: [
          {
            metric: {
              metricName: "sessions",
            },
            desc: true,
          },
        ],
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching traffic sources:", error);
    // Return null instead of throwing to prevent SSR crashes
    return null;
  }
}

