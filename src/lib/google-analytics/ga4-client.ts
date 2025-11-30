import { google } from "googleapis";
import { setOAuth2Credentials } from "./oauth";

/**
 * Get GA4 property ID from environment or use default
 * You should set this in your .env file
 */
const PROPERTY_ID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "";

/**
 * Initialize GA4 client with user credentials
 * Returns null if credentials are not available
 */
async function getGA4Client(userId: string): Promise<{ analyticsData: any; propertyId: string } | null> {
  if (!PROPERTY_ID) {
    console.error("[getGA4Client] GOOGLE_ANALYTICS_PROPERTY_ID is not set");
    return null;
  }
  
  const auth = await setOAuth2Credentials(userId);
  
  if (!auth) {
    console.warn(`[getGA4Client] No valid credentials for user: ${userId}`);
    return null;
  }
  
  // Create a new client instance with auth
  const client = google.analyticsdata({
    version: "v1beta",
    auth: auth,
  });
  // Ensure propertyId is a string
  const propertyId = String(PROPERTY_ID);
  return { analyticsData: client, propertyId };
}

/**
 * Get real-time report (active users)
 */
export async function getRealtimeReport(userId: string) {
  try {
    const client = await getGA4Client(userId);
    
    if (!client) {
      return null; // Return null instead of throwing
    }
    
    const { analyticsData, propertyId } = client;

    const response = await analyticsData.properties.runRealtimeReport({
      property: `properties/${String(propertyId)}`,
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching realtime report:", error);
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

    return response.data;
  } catch (error: any) {
    console.error("Error fetching traffic overview:", error);
    // Return null instead of throwing to prevent SSR crashes
    return null;
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

