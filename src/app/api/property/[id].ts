import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const property = await prisma.property.findUnique({
      where: { id: +id }, // Convertir en entier
      include: {
        status: true,
        type: true,
        feature: true,
        location: true,
        contact: true,
        images: true,
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
