import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Validate ID parameter
  if (!id || id === 'undefined' || id === 'null') {
    return NextResponse.json(
      { message: "ID de propriété requis" },
      { status: 400 }
    );
  }

  // Convert to number and validate
  const propertyId = parseInt(id, 10);
  if (isNaN(propertyId) || propertyId <= 0) {
    return NextResponse.json(
      { message: "ID de propriété invalide" },
      { status: 400 }
    );
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        status: true,
        type: true,
        feature: true,
        location: true,
        contact: true,
        images: {
          orderBy: [
            { isMain: "desc" },
            { displayOrder: "asc" },
          ],
        },
        videos: true,
      },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Propriété non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la propriété :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
