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
