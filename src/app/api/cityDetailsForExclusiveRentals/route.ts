import { NextResponse } from "next/server";
import { getCityDetailsByStatus } from "@/lib/db/queries/property";
import { topMoroccanCitiesForExclusiveRentalsFR } from "@/data/cities/fr";
import { topMoroccanCitiesForExclusiveRentalsEN } from "@/data/cities/en";

interface CityDetails {
  name: string;
  image: string;
  description: string;
  propertyCount: number;
  peakSeason: string;
  avgPriceHigh: string;
  avgPriceLow: string;
  highlights: string;
}
export async function GET(request: Request) {
  try {
    // Récupérez la locale depuis les paramètres de requête
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "fr"; // Par défaut, utilisez le français

    // Sélectionnez le tableau de données en fonction de la locale
    const topMoroccanCitiesForExclusiveRentals =
      locale === "fr"
        ? topMoroccanCitiesForExclusiveRentalsFR
        : topMoroccanCitiesForExclusiveRentalsEN;
    const cityDetails = await Promise.all(
      topMoroccanCitiesForExclusiveRentals.map(async (city) => {
        const details = await getCityDetailsByStatus(city.name, 5);
        return {
          name: city.name,
          image: city.image,
          description: city.description,
          propertyCount: details.propertyCount || 0,
          peakSeason: city.peakSeason,
          avgPriceHigh: city.avgPriceHigh,
          avgPriceLow: city.avgPriceLow,
          highlights: city.highlights,
          //   averagePrice: details.averagePrice || "Non spécifié",
        };
      })
    );

    return NextResponse.json(cityDetails);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails des villes pour la location saisonnière.",
      error
    );
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
