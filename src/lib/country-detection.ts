/**
 * Country Detection Utilities
 * 
 * Detects user's country via IP geolocation or user selection
 */

import { Currency, getCurrencyByCountry } from "./currencies";

export interface CountryInfo {
  code: string;
  name: string;
  currency: Currency;
}

/**
 * Detect country from IP address using a geolocation service
 */
export async function detectCountryFromIP(): Promise<CountryInfo | null> {
  try {
    // Use ipapi.co (free tier: 1000 requests/day)
    const response = await fetch("https://ipapi.co/json/", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to detect country from IP");
    }

    const data = await response.json();
    
    if (data.country_code && data.country_name) {
      const currency = getCurrencyByCountry(data.country_code);
      
      return {
        code: data.country_code,
        name: data.country_name,
        currency,
      };
    }

    return null;
  } catch (error) {
    console.error("Error detecting country from IP:", error);
    return null;
  }
}

/**
 * Get country info from country code
 */
export function getCountryInfo(countryCode: string): CountryInfo {
  const currency = getCurrencyByCountry(countryCode);
  
  // Map of country codes to names
  const countryNames: Record<string, string> = {
    SN: "Senegal",
    CI: "Côte d'Ivoire",
    BJ: "Benin",
    TG: "Togo",
    CM: "Cameroon",
    GA: "Gabon",
    MA: "Morocco",
    ZA: "South Africa",
    NA: "Namibia",
    NG: "Nigeria",
    KE: "Kenya",
    GH: "Ghana",
    EG: "Egypt",
    RW: "Rwanda",
    MU: "Mauritius",
    TZ: "Tanzania",
    CD: "DR Congo",
    GN: "Guinea",
    ET: "Ethiopia",
    UG: "Uganda",
  };

  return {
    code: countryCode.toUpperCase(),
    name: countryNames[countryCode.toUpperCase()] || countryCode,
    currency,
  };
}

/**
 * Get default country (for fallback)
 */
export function getDefaultCountry(): CountryInfo {
  return {
    code: "SN",
    name: "Senegal",
    currency: getCurrencyByCountry("SN"),
  };
}




