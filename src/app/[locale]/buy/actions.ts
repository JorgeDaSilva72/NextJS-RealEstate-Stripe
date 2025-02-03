import { getPropertyStatsByCity } from "@/lib/db/queries/property";
import { topMoroccanCitiesFR } from "@/data/cities/fr";
import { topMoroccanCitiesEN } from "@/data/cities/en";
import { getLocale } from "next-intl/server"; // Utilisez next-intl pour récupérer la locale

export async function getCityStatsData() {
  const locale = await getLocale(); // Récupère la locale active (ex: "fr" ou "en")
  const cityStats = await getPropertyStatsByCity();

  // Sélectionnez le tableau de données en fonction de la locale
  const topMoroccanCities =
    locale === "fr" ? topMoroccanCitiesFR : topMoroccanCitiesEN;

  return topMoroccanCities.map((city) => {
    const stats = cityStats.find((stat) => stat.city === city.name);
    return {
      ...city,
      propertyCount: stats?.propertyCount || 0,
      averagePrice: stats?.averagePrice || "N/A",
    };
  });
}
