import { CountryData } from "@/types/country";

export const SN: CountryData = {
  code: "SN",
  name: {
    fr: "Sénégal",
    en: "Senegal",
    ar: "السنغال",
  },
  currency: {
    code: "XOF",
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
      name: "Dakar",
      regions: ["Plateau", "Almadies", "Ouakam", "Yoff"],
      coordinates: {
        lat: 14.7167,
        lng: -17.4677,
      },
    },
    {
      name: "Thiès",
      regions: ["Centre", "Nord", "Sud"],
      coordinates: {
        lat: 14.791,
        lng: -16.9359,
      },
    },
  ],
  phoneCode: "+221",
  domains: [".sn"],
  timezone: "GMT+0",
};
