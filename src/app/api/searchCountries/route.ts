import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ce Route Handler répondra à GET /api/searchCountries?lang=fr
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const langCode = searchParams.get("lang");

    if (!langCode) {
      return NextResponse.json(
        { message: "Language code ('lang') is required." },
        { status: 400 }
      );
    }

    // 1. Trouver l'ID de la langue active
    const language = await prisma.language.findUnique({
      where: { code: langCode },
      select: { id: true },
    });

    if (!language) {
      return NextResponse.json(
        { message: `Language with code '${langCode}' not found.` },
        { status: 404 }
      );
    }

    // 2. Récupérer tous les pays actifs et inclure la traduction
    const countries = await prisma.country.findMany({
      where: { isActive: true },
      select: {
        id: true, // L'ID du pays (pour la valeur du filtre)
        translations: {
          where: { languageId: language.id }, // Filtrer par la langue trouvée
          select: { name: true }, // Sélectionner uniquement le nom traduit
        },
      },
      orderBy: {
        displayOrder: "asc", // Trier selon l'ordre défini dans votre modèle
      },
    });

    // 3. Formater la réponse pour le hook useFilterDatas
    const formattedCountries = countries
      .map((country) => {
        const translation = country.translations[0]?.name;

        // Si aucune traduction n'est trouvée, utiliser un fallback ou ignorer
        if (!translation) return null;

        return {
          id: country.id,
          value: translation,
        };
      })
      .filter((item) => item !== null) as { id: number; value: string }[];

    return NextResponse.json(formattedCountries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { message: "Internal Server Error during country fetch." },
      { status: 500 }
    );
  }
}
