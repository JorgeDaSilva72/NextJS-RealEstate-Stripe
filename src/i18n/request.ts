import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale: "fr" | "en" | "pt" | "ar" = routing.defaultLocale;
  let messages = {};

  try {
    // This typically corresponds to the `[locale]` segment
    const requestedLocale = await requestLocale;

    // Ensure that a valid locale is used
    if (requestedLocale && routing.locales.includes(requestedLocale as any)) {
      locale = requestedLocale as "fr" | "en" | "pt" | "ar";
    } else {
      locale = routing.defaultLocale;
    }
  } catch (error) {
    console.error("Error getting request locale:", error);
    locale = routing.defaultLocale;
  }

  // Try to load messages with multiple fallback strategies
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Error loading messages for locale ${locale}:`, error);
    // Fallback to default locale messages if current locale fails
    if (locale !== routing.defaultLocale) {
      try {
        messages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;
        locale = routing.defaultLocale;
      } catch (fallbackError) {
        console.error(`Error loading default locale messages:`, fallbackError);
        // Return empty messages object as last resort
        messages = {};
      }
    } else {
      // If we're already on default locale and it failed, return empty
      messages = {};
    }
  }

  return {
    locale,
    messages,
  };
});
