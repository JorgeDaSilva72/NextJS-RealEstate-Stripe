import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ce Route Handler répondra à GET /api/searchCities?lang=fr&countryId=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langCode = searchParams.get("lang");
    const countryIdStr = searchParams.get("countryId");

    if (!langCode) {
      return NextResponse.json(
        { message: "Language code ('lang') is required." },
        { status: 400 }
      );
    }

    // 🚨 AMÉLIORATION : Ne convertir en nombre que si la chaîne n'est pas "none" ou vide
    let countryId: number | null = null;
    if (
      countryIdStr &&
      countryIdStr !== "" &&
      countryIdStr.toLowerCase() !== "none"
    ) {
      const parsedId = parseInt(countryIdStr, 10);
      if (!isNaN(parsedId)) {
        countryId = parsedId;
      }
    }

    // const countryId = countryIdStr ? parseInt(countryIdStr, 10) : null;

    // 1. Trouver l'ID de la langue active
    const language = await prisma.language.findUnique({
      where: { code: langCode },
    });

    if (!language) {
      return NextResponse.json(
        { message: `Language with code '${langCode}' not found.` },
        { status: 404 }
      );
    }

    // 2. Construire la clause WHERE pour filtrer les villes
    const cityWhereClause: any = {
      isActive: true,
    };
    if (countryId) {
      // Cas 1: Un pays est sélectionné, on filtre.
      cityWhereClause.countryId = countryId;
    } else {
      // Cas 2: AUCUN pays sélectionné (pour permettre le filtrage Ville seul).
      // Pour éviter de charger des milliers de villes au démarrage, on filtre
      // par défaut sur les villes mises en avant (isFeatured).
      // C'est ce qui permet de sélectionner une ville rapidement sans choisir un pays.
      cityWhereClause.isFeatured = true;
    }

    // 3. This section is now handled in step 4 below

    // 4. Récupérer les villes avec leur countryId
    const citiesWithCountry = await prisma.city.findMany({
      where: cityWhereClause,
      select: {
        id: true,
        countryId: true, // Include countryId
        translations: {
          where: { languageId: language.id },
          select: { name: true },
        },
      },
      orderBy: {
        isFeatured: "desc",
      },
    });

    // 5. Formater la réponse
    const formattedCities = citiesWithCountry
      .map((city) => {
        const translation = city.translations[0]?.name;
        if (!translation) return null;

        return {
          id: city.id,
          value: translation,
          countryId: city.countryId, // Include countryId in response
        };
      })
      .filter((item) => item !== null) as { id: number; value: string; countryId: number }[];

    return NextResponse.json(formattedCities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { message: "Internal Server Error during city fetch." },
      { status: 500 }
    );
  }
}
