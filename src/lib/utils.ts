// Fonction pour capitaliser la première lettre
export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

type QueryStatus = "Vente" | "Location";
// fonction pour construire l'URL
export const buildUrl = (city: string, queryStatus: QueryStatus) => {
  const formattedCity = capitalizeFirstLetter(city);
  return `/result?city=${formattedCity}&queryStatus=${queryStatus}`;
};
