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

    // 3. Récupérer les villes et les traductions
    const cities = await prisma.city.findMany({
      where: cityWhereClause,
      select: {
        id: true, // L'ID de la ville
        translations: {
          where: { languageId: language.id }, // Filtrer par la langue trouvée
          select: { name: true }, // Sélectionner uniquement le nom traduit
        },
      },
      orderBy: {
        isFeatured: "desc", // Mettre les villes 'featured' en haut
      },
    });

    // 4. Formater la réponse pour le hook useFilterDatas
    const formattedCities = cities
      .map((city) => {
        const translation = city.translations[0]?.name;
        // Si aucune traduction n'est trouvée, utiliser un fallback ou ignorer
        if (!translation) return null;

        return {
          id: city.id,
          value: translation,
        };
      })
      .filter((item) => item !== null) as { id: number; value: string }[];

    return NextResponse.json(formattedCities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { message: "Internal Server Error during city fetch." },
      { status: 500 }
    );
  }
}
