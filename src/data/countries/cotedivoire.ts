import { CountryData } from "@/types/country";

export const CI: CountryData = {
  code: "CI",
  name: {
    fr: "Côte d'Ivoire",
    en: "Ivory Coast",
  },
  currency: {
    code: "XOF",
    symbol: "FCFA",
    name: {
      fr: "Franc CFA",
      en: "CFA Franc",
    },
  },
  languages: ["fr"],
  defaultLanguage: "fr",
  cities: [
    {
      name: "Abidjan",
      regions: ["Cocody", "Plateau", "Marcory", "Yopougon"],
      coordinates: {
        lat: 5.36,
        lng: -4.0083,
      },
    },
    {
      name: "Yamoussoukro",
      coordinates: {
        lat: 6.8276,
        lng: -5.2893,
      },
    },
  ],
  phoneCode: "+225",
  domains: [".ci"],
  timezone: "GMT+0",
};
