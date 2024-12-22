// Fonction pour capitaliser la première lettre
export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

type QueryStatus =
  | "Vente"
  | "Location"
  | "Location+meublée"
  | "Location+saisonnière";

// todo:  utiliser les types générés automatiquement par Prisma
// Prisma génère un type pour les valeurs possibles de PropertyStatus
// type QueryStatus = Prisma.PropertyStatus["value"];

// fonction pour construire l'URL
export const buildUrl = (city: string, queryStatus: QueryStatus) => {
  if (!city.trim()) {
    throw new Error("La ville ne peut pas être vide");
  }
  const formattedCity = capitalizeFirstLetter(city);
  return `/result?city=${formattedCity}&queryStatus=${queryStatus}`;
};
