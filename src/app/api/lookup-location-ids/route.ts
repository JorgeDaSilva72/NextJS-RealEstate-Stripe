import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryName = searchParams.get("countryName");
    const cityName = searchParams.get("cityName");
    const langCode = searchParams.get("lang") || "fr";

    // Get language ID
    const language = await prisma.language.findUnique({
      where: { code: langCode },
    });

    if (!language) {
      return NextResponse.json(
        { error: "Language not found" },
        { status: 404 }
      );
    }

    const result: { countryId?: number; cityId?: number } = {};

    // Look up country ID by name
    if (countryName) {
      const country = await prisma.country.findFirst({
        where: {
          translations: {
            some: {
              languageId: language.id,
              name: {
                contains: countryName,
                mode: "insensitive",
              },
            },
          },
          isActive: true,
        },
        select: { id: true },
      });

      if (country) {
        result.countryId = country.id;
      }
    }

    // Look up city ID by name
    if (cityName) {
      const city = await prisma.city.findFirst({
        where: {
          translations: {
            some: {
              languageId: language.id,
              name: {
                contains: cityName,
                mode: "insensitive",
              },
            },
          },
          isActive: true,
          ...(result.countryId && {
            countryId: result.countryId,
          }),
        },
        select: { id: true },
        orderBy: {
          id: "asc", // Get the first match
        },
      });

      if (city) {
        result.cityId = city.id;
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error looking up location IDs:", error);
    return NextResponse.json(
      { error: "Failed to look up location IDs" },
      { status: 500 }
    );
  }
}





