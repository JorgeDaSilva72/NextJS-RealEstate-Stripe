import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  try {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    if (!locale || !routing.locales.includes(locale as any)) {
      locale = routing.defaultLocale;
    }

    let messages;
    try {
      messages = (await import(`../../messages/${locale}.json`)).default;
    } catch (error) {
      console.error(`Error loading messages for locale ${locale}:`, error);
      // Fallback to default locale messages if current locale fails
      try {
        messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
      } catch (fallbackError) {
        console.error(`Error loading default locale messages:`, fallbackError);
        // Return empty messages object as last resort
        messages = {};
      }
    }

    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error("Error in getRequestConfig:", error);
    // Return default configuration on error
    return {
      locale: routing.defaultLocale,
      messages: {},
    };
  }
});
