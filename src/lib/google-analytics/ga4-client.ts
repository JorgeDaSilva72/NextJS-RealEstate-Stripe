import { google } from "googleapis";
import { setOAuth2Credentials } from "./oauth";

const analyticsData = google.analyticsdata("v1beta");

/**
 * Get GA4 property ID from environment or use default
 * You should set this in your .env file
 */
const PROPERTY_ID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "";

/**
 * Initialize GA4 client with user credentials
 */
async function getGA4Client(userId: string) {
  if (!PROPERTY_ID) {
    throw new Error(
      "GOOGLE_ANALYTICS_PROPERTY_ID is not set. Please add it to your .env.local file. " +
      "You can find your Property ID in Google Analytics: Admin > Property Settings"
    );
  }
  
  const auth = await setOAuth2Credentials(userId);
  return { analyticsData, auth, propertyId: PROPERTY_ID };
}

/**
 * Get real-time report (active users)
 */
export async function getRealtimeReport(userId: string) {
  try {
    const { analyticsData, auth, propertyId } = await getGA4Client(userId);

    const response = await analyticsData.properties.runRealtimeReport({
      auth,
      property: `properties/${propertyId}`,
      requestBody: {
        dimensions: [{ name: "country" }],
        metrics: [{ name: "activeUsers" }],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching realtime report:", error);
    throw error;
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
    const { analyticsData, auth, propertyId } = await getGA4Client(userId);

    const response = await analyticsData.properties.runReport({
      auth,
      property: `properties/${propertyId}`,
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
  } catch (error) {
    console.error("Error fetching traffic overview:", error);
    throw error;
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
    const { analyticsData, auth, propertyId } = await getGA4Client(userId);

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
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
        limit: String(limit),
      },
      auth,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching top pages:", error);
    throw error;
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
    const { analyticsData, auth, propertyId } = await getGA4Client(userId);

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
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
      auth,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user behavior:", error);
    throw error;
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
    const { analyticsData, auth, propertyId } = await getGA4Client(userId);

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
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
      auth,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching traffic sources:", error);
    throw error;
  }
}

