import { getPropertyStatsByCity } from "@/lib/db/queries/property";
import { topMoroccanCities } from "@/data/cities";

export async function getCityStatsData() {
  const cityStats = await getPropertyStatsByCity();

  return topMoroccanCities.map((city) => {
    const stats = cityStats.find((stat) => stat.city === city.name);
    return {
      ...city,
      propertyCount: stats?.propertyCount || 0,
      averagePrice: stats?.averagePrice || "N/A",
    };
  });
}
