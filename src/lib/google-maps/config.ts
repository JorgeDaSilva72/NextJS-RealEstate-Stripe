/**
 * Shared Google Maps API configuration
 * 
 * This file ensures all Google Maps components use the same library configuration
 * to prevent "Loader must not be called again with different options" errors.
 * 
 * IMPORTANT: All components using useJsApiLoader must use GOOGLE_MAPS_LIBRARIES
 * from this file to maintain consistency.
 */

export const GOOGLE_MAPS_LIBRARIES: ("places" | "marker")[] = ["places", "marker"];

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";




