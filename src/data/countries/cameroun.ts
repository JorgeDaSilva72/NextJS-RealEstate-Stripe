import { CountryData } from "@/types/country";

export const CM: CountryData = {
  code: "CM",
  name: {
    fr: "Cameroun",
    en: "Cameroon",
  },
  currency: {
    code: "XAF",
    symbol: "FCFA",
    name: {
      fr: "Franc CFA",
      en: "CFA Franc",
    },
  },
  languages: ["fr", "en"],
  defaultLanguage: "fr",
  cities: [
    {
      name: "Douala",
      regions: ["Akwa", "Bonapriso", "Bonanjo", "Deido"],
      coordinates: {
        lat: 4.0511,
        lng: 9.7679,
      },
    },
    {
      name: "Yaoundé",
      regions: ["Centre", "Bastos", "Nlongkak"],
      coordinates: {
        lat: 3.848,
        lng: 11.5021,
      },
    },
  ],
  phoneCode: "+237",
  domains: [".cm"],
  timezone: "GMT+1",
};
