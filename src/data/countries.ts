import { City, Countries, CountryData, LanguageCode } from "../types/country";
import { CM } from "./countries/cameroun";
import { CI } from "./countries/cotedivoire";
import { MA } from "./countries/maroc";
import { SN } from "./countries/senegal";

export const AFRICAN_COUNTRIES_SUPPORTED_FOR_GOOGLE_MAPS = [
  // Pays francophones en Afrique du Nord
  "MA", // Maroc
  "DZ", // Algérie
  "TN", // Tunisie
  "MR", // Mauritanie
  // Pays francophones en Afrique de l'Ouest :
  "BJ", // Bénin
  "BF", // Burkina Faso
  "CI", // Côte d'Ivoire
  "GN", // Guinée
  "ML", // Mali
  "NE", // Niger
  "SN", // Sénégal
  "TG", // Togo
  // Pays francophones en Afrique centrale :
  "CM", // Cameroun
  "CF", // République centrafricaine
  "CG", // Congo
  "TD", // Tchad
  "GA", // Gabon
  "GQ", // Guinée équatoriale
  "CD", // République démocratique du Congo
  // Pays francophones en Afrique de l'Est :
  "BI", // Burundi
  "DJ", // Djibouti
  "RW", // Rwanda
  "SC", // Seychelles
  "KM", // Comores
  // Pays francophones en Afrique australe :
  "MG", // Madagascar
  "MU", // Maurice
  // "AO", // Angola
  // "BW", // Botswana
  // "CV", // Cap-Vert
  // "EG", // Égypte
  // "ER", // Érythrée
  // "ET", // Éthiopie
  // "GM", // Gambie
  // "GH", // Ghana
  // "GW", // Guinée-Bissau
  // "KE", // Kenya
  // "LS", // Lesotho
  // "LR", // Libéria
  // "LY", // Libye
  // "MW", // Malawi
  // "MU", // Maurice
  // "MZ", // Mozambique
  // "NA", // Namibie
  // "NG", // Nigéria
  // "ST", // Sao Tomé-et-Principe
  // "SN", // Sénégal
  // "SL", // Sierra Leone
  // "SO", // Somalie
  // "ZA", // Afrique du Sud
  // "SS", // Soudan du Sud
  // "SD", // Soudan
  // "SZ", // Eswatini (anciennement Swaziland)
  // "TZ", // Tanzanie
  // "UG", // Ouganda
  // "ZM", // Zambie
  // "ZW", // Zimbabwe
];
// Liste des pays africains francophones
export const AFRICAN_FRANCOPHONE_COUNTRIES = [
  { code: "DZ", name: "Algérie" },
  { code: "BJ", name: "Bénin" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CM", name: "Cameroun" },
  { code: "CF", name: "République centrafricaine" },
  { code: "KM", name: "Comores" },
  { code: "CG", name: "Congo-Brazzaville" },
  { code: "CD", name: "Congo-Kinshasa (RDC)" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "DJ", name: "Djibouti" },
  { code: "EG", name: "Égypte" },
  { code: "GA", name: "Gabon" },
  { code: "GN", name: "Guinée" },
  { code: "GQ", name: "Guinée équatoriale" },
  { code: "GW", name: "Guinée-Bissau" },
  { code: "MG", name: "Madagascar" },
  { code: "ML", name: "Mali" },
  { code: "MA", name: "Maroc" },
  { code: "MR", name: "Mauritanie" },
  { code: "MU", name: "Maurice" },
  { code: "NE", name: "Niger" },
  { code: "RE", name: "Réunion" },
  { code: "RW", name: "Rwanda" },
  { code: "SN", name: "Sénégal" },
  { code: "SC", name: "Seychelles" },
  { code: "TD", name: "Tchad" },
  { code: "TG", name: "Togo" },
  { code: "TN", name: "Tunisie" },
];
export const countries = [{ id: "Maroc", value: "Maroc" }];

export const SUPPORTED_COUNTRIES: Countries = { MA, SN, CI, CM };

// Fonctions utilitaires
export function getCountryByCode(code: string): CountryData | undefined {
  return Object.values(SUPPORTED_COUNTRIES).find(
    (country) => country.code.toLowerCase() === code.toLowerCase()
  );
}

export function getCountryByDomain(domain: string): CountryData | undefined {
  return Object.values(SUPPORTED_COUNTRIES).find((country) =>
    country.domains.includes(domain)
  );
}

export function getCountriesByLanguage(lang: LanguageCode): CountryData[] {
  return Object.values(SUPPORTED_COUNTRIES).filter((country) =>
    country.languages.includes(lang)
  );
}

export function getCitiesByCountry(countryCode: string): City[] {
  const country = getCountryByCode(countryCode);
  return country ? country.cities : [];
}

export function formatCurrency(amount: number, countryCode: string): string {
  const country = getCountryByCode(countryCode);
  if (!country) return amount.toString();

  return new Intl.NumberFormat(country.defaultLanguage, {
    style: "currency",
    currency: country.currency.code,
  }).format(amount);
}
