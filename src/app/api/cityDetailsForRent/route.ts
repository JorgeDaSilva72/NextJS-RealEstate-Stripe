import { NextResponse } from "next/server";
import { getCityDetailsByStatus } from "@/lib/db/queries/property";
import { topMoroccanCitiesForRentFR } from "@/data/cities/fr";
import { topMoroccanCitiesForRentEN } from "@/data/cities/en";

export async function GET(request: Request) {
  try {
    // Récupérez la locale depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr"; // Par défaut, utilisez le français

    // Sélectionnez le tableau de données en fonction de la locale
    const topMoroccanCitiesForRent =
      locale === "fr" ? topMoroccanCitiesForRentFR : topMoroccanCitiesForRentEN;

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
