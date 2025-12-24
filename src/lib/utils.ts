import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma from "@/lib/prisma"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get language ID by language code (e.g., 'fr', 'en', 'ar', 'pt')
 * @param localeCode - The language code (e.g., 'fr', 'en')
 * @returns The language ID or undefined if not found
 */
export async function getLanguageIdByCode(
  localeCode: string
): Promise<number | undefined> {
  const language = await prisma.language.findUnique({
    where: { code: localeCode },
    select: { id: true },
  });
  return language?.id;
}

/**
 * Build a search URL for city and property type
 * @param cityName - The name of the city
 * @param propertyType - The property type (e.g., "Vente", "Location")
 * @returns A URL string for search results
 */
export function buildUrl(cityName: string, propertyType: string): string {
  const encodedCity = encodeURIComponent(cityName);
  const encodedType = encodeURIComponent(propertyType);
  return `/search-results?city=${encodedCity}&type=${encodedType}`;
}

/**
 * Check if a date string is valid
 * @param date - The date string to validate
 * @returns true if the date is valid, false otherwise
 */
export function isValidDate(date: string | Date | null | undefined): boolean {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
}
