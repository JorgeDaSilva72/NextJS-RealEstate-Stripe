// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { PropertyStatus } from "@prisma/client";

// export async function GET() {
//   try {
//     const statuses = await prisma.propertyStatus.findMany();
//     return NextResponse.json(statuses, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch statuses" },
//       { status: 500 }
//     );
//   }
// }

// 07/12 code modifié pour s adapter au nouveau prisma feature/multilingual-countries

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Ce Route Handler répondra à GET /api/searchStatuses?lang=fr
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
      // Si la langue n'existe pas, on pourrait retourner un fallback ou une erreur
      return NextResponse.json(
        { message: `Language with code '${langCode}' not found.` },
        { status: 404 }
      );
    }

    // 2. Récupérer tous les statuts actifs et inclure la traduction
    const statuses = await prisma.propertyStatus.findMany({
      where: { isActive: true },
      select: {
        id: true, // L'ID du statut (pour la valeur du filtre)
        code: true, // Include code for filtering
        translations: {
          where: { languageId: language.id }, // Filtrer par la langue trouvée
          select: { value: true }, // Sélectionner uniquement le nom traduit
        },
      },
      orderBy: {
        displayOrder: "asc", // Trier selon l'ordre défini
      },
    });

    // 3. Formater la réponse pour le hook useFilterDatas
    const formattedStatuses = statuses
      .map((status) => {
        const translation = status.translations[0]?.value;

        // S'il manque une traduction (ce qui ne devrait pas arriver en production)
        if (!translation) return null;

        return {
          id: status.id,
          code: status.code, // Include code
          value: translation,
        };
      })
      .filter((item) => item !== null) as { id: number; code: string; value: string }[];

    return NextResponse.json(formattedStatuses);
  } catch (error) {
    console.error("Error fetching property statuses:", error);
    return NextResponse.json(
      { message: "Internal Server Error during status fetch." },
      { status: 500 }
    );
  }
}
