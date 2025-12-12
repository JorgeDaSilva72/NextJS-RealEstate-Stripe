// import { getPropertyStatsByCity } from "@/lib/db/queries/property";
// import { topMoroccanCitiesFR } from "@/data/cities/fr";
// import { topMoroccanCitiesEN } from "@/data/cities/en";
// import { getLocale } from "next-intl/server"; // Utilisez next-intl pour récupérer la locale

// export async function getCityStatsData() {
//   const locale = await getLocale(); // Récupère la locale active (ex: "fr" ou "en")
//   const cityStats = await getPropertyStatsByCity();

//   // Sélectionnez le tableau de données en fonction de la locale
//   const topMoroccanCities =
//     locale === "fr" ? topMoroccanCitiesFR : topMoroccanCitiesEN;

//   return topMoroccanCities.map((city) => {
//     const stats = cityStats.find((stat) => stat.city === city.name);
//     return {
//       ...city,
//       propertyCount: stats?.propertyCount || 0,
//       averagePrice: stats?.averagePrice || "N/A",
//     };
//   });
// }

// 12-12-2025

"use server";

// Déclaration de type pour le résultat (minimaliste)
type ActionResponse = {
  success: boolean;
  message: string;
};

// Fonction d'action minimale et autonome
export async function minimalAction(
  formData: FormData
): Promise<ActionResponse> {
  // Simuler la logique (traitement de données ou appel à la BDD)
  const data = formData.get("fieldName") as string;

  console.log("Action minimale exécutée avec succès.");

  // Retourner un succès minimal
  return {
    success: true,
    message: `Action traitée. Donnée: ${data || "aucune"}`,
  };
}
