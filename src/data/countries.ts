import { City, Countries, CountryData, LanguageCode } from "../types/country";
import { CM } from "./countries/cameroun";
import { CI } from "./countries/cotedivoire";
import { MA } from "./countries/maroc";
import { SN } from "./countries/senegal";

export const AFRICAN_COUNTRIES_SUPPORTED_FOR_GOOGLE_MAPS = [
  "MA", // Maroc
  // "DZ", // Algérie
  // "AO", // Angola
  // "BJ", // Bénin
  // "BW", // Botswana
  // "BF", // Burkina Faso
  // "BI", // Burundi
  // "CM", // Cameroun
  // "CV", // Cap-Vert
  // "CF", // République centrafricaine
  // "TD", // Tchad
  // "KM", // Comores
  // "CG", // Congo
  // "CD", // République démocratique du Congo
  // "DJ", // Djibouti
  // "EG", // Égypte
  // "GQ", // Guinée équatoriale
  // "ER", // Érythrée
  // "ET", // Éthiopie
  // "GA", // Gabon
  // "GM", // Gambie
  // "GH", // Ghana
  // "GN", // Guinée
  // "GW", // Guinée-Bissau
  // "CI", // Côte d'Ivoire
  // "KE", // Kenya
  // "LS", // Lesotho
  // "LR", // Libéria
  // "LY", // Libye
  // "MG", // Madagascar
  // "MW", // Malawi
  // "ML", // Mali
  // "MR", // Mauritanie
  // "MU", // Maurice
  // "MA", // Maroc
  // "MZ", // Mozambique
  // "NA", // Namibie
  // "NE", // Niger
  // "NG", // Nigéria
  // "RW", // Rwanda
  // "ST", // Sao Tomé-et-Principe
  // "SN", // Sénégal
  // "SC", // Seychelles
  // "SL", // Sierra Leone
  // "SO", // Somalie
  // "ZA", // Afrique du Sud
  // "SS", // Soudan du Sud
  // "SD", // Soudan
  // "SZ", // Eswatini (anciennement Swaziland)
  // "TZ", // Tanzanie
  // "TG", // Togo
  // "TN", // Tunisie
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
