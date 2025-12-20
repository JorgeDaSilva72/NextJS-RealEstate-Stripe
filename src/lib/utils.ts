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
