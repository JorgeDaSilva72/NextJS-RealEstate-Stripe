// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const statuses = await prisma.propertyType.findMany();
//     return NextResponse.json(statuses, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch types" },
//       { status: 500 }
//     );
//   }
// }

// 07/12 code modifié pour s adapter au nouveau prisma feature/multilingual-countries

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ce Route Handler répondra à GET /api/searchTypes?lang=fr
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

    // 2. Récupérer tous les types de propriété actifs et inclure la traduction
    const propertyTypes = await prisma.propertyType.findMany({
      where: { isActive: true },
      select: {
        id: true, // L'ID du type (pour la valeur du filtre)
        translations: {
          where: { languageId: language.id }, // Filtrer par la langue trouvée
          select: { value: true }, // Sélectionner uniquement la traduction
        },
      },
      orderBy: {
        displayOrder: "asc", // Trier selon l'ordre défini
      },
    });

    // 3. Formater la réponse pour le hook useFilterDatas
    const formattedTypes = propertyTypes
      .map((type) => {
        const translation = type.translations[0]?.value;

        // Si aucune traduction n'est trouvée pour une raison quelconque
        if (!translation) return null;

        return {
          id: type.id,
          value: translation,
        };
      })
      .filter((item) => item !== null) as { id: number; value: string }[];

    return NextResponse.json(formattedTypes);
  } catch (error) {
    console.error("Error fetching property types:", error);
    return NextResponse.json(
      { message: "Internal Server Error during property type fetch." },
      { status: 500 }
    );
  }
}
