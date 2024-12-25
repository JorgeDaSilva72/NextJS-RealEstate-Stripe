import { City, Countries, CountryData, LanguageCode } from "../types/country";
import { CM } from "./countries/cameroun";
import { CI } from "./countries/cotedivoire";
import { MA } from "./countries/maroc";
import { SN } from "./countries/senegal";

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
