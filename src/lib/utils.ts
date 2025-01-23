// Fonction pour capitaliser la première lettre
export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

type QueryStatus =
  | "Vente"
  | "Location"
  | "Location+meublée"
  | "Location+saisonnière"
  | "Location+exclusive";

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

// Transformation du tableau de pays francophones
export function transformCountries(
  countries: Array<{ code: string; name: string }>
): Array<{ id: string; value: string }> {
  return countries.map((country) => ({
    id: country.code,
    value: country.name,
  }));
}
