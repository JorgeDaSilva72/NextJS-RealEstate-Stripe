import { NextResponse } from "next/server";
import { getCityDetailsByStatus } from "@/lib/db/queries/property";
import { topMoroccanCitiesForExclusiveRentals } from "@/data/cities";

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
export async function GET() {
  try {
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
