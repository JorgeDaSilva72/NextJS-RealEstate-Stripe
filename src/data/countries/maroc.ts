import { CountryData } from "@/types/country";

export const MA: CountryData = {
  code: "MA",
  name: { fr: "Maroc", en: "Morocco", ar: "المغرب" },
  currency: {
    code: "MAD",
    symbol: "د.م.",
    name: { fr: "Dirham marocain", en: "Moroccan Dirham" },
  },
  languages: ["fr", "ar"],
  cities: [
    {
      name: "Casablanca",
      regions: ["Grand Casablanca"],
      coordinates: { lat: 33.5731, lng: -7.5898 },
    },
  ],
  phoneCode: "+212",
  domains: [".ma"],
  timezone: "Africa/Casablanca",
  defaultLanguage: "fr",
};
