import { NextResponse } from "next/server";
import { getCityDetailsByStatus } from "@/lib/db/queries/property";
import { topMoroccanCitiesForRent } from "@/data/cities";

export async function GET() {
  try {
    const cityDetails = await Promise.all(
      topMoroccanCitiesForRent.map(async (city) => {
        const details = await getCityDetailsByStatus(city.name, 2);
        return {
          name: city.name,
          image: city.image,
          description: city.description,
          propertyCount: details.propertyCount || 0,
          averagePrice: details.averagePrice || "Non spécifié",
        };
      })
    );

    return NextResponse.json(cityDetails);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails des villes pour la location:",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
