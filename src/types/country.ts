export type LanguageCode = "fr" | "en" | "ar";

export interface CountryName {
  fr: string;
  en: string;
  ar?: string;
}

export type Currency = {
  code: string;
  symbol: string;
  name: {
    fr: string;
    en: string;
  };
};

export interface City {
  name: string;
  regions?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface CountryData {
  code: string; // Code ISO (2 lettres)
  name: CountryName;
  currency: Currency;
  languages: LanguageCode[];
  cities: City[];
  phoneCode: string;
  domains: string[]; // Domaines internet (.sn, .ng etc.)
  timezone: string;
  defaultLanguage: LanguageCode;
}

export type Countries = {
  [key: string]: CountryData;
};
