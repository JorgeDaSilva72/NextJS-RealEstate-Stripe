import { NextResponse } from "next/server";
import { getCityDetailsByStatus } from "@/lib/db/queries/property";
import { topMoroccanCitiesForFurnishedRental } from "@/data/cities";

interface CityDetails {
  name: string;
  image: string;
  description: string;
  propertyCount: number;
  averagePrice: string;
  features: string;
}

export async function GET() {
  try {
    const cityDetails = await Promise.all(
      topMoroccanCitiesForFurnishedRental.map(async (city) => {
        const details = await getCityDetailsByStatus(city.name, 4);
        return {
          name: city.name,
          image: city.image,
          description: city.description,
          propertyCount: details.propertyCount || 0,
          averagePrice: details.averagePrice || "Non spécifié",
          features: city.features,
        };
      })
    );

    return NextResponse.json(cityDetails);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails des villes pour la location meublée.",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
