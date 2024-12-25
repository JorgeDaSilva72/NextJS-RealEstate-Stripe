import { Countries } from "@/types/country";

export const NG: Countries = {
  NG: {
    code: "NG",
    name: {
      fr: "Nigeria",
      en: "Nigeria",
    },
    currency: {
      code: "NGN",
      symbol: "₦",
      name: {
        fr: "Naira",
        en: "Naira",
      },
    },
    languages: ["en"],
    defaultLanguage: "en",
    cities: [
      {
        name: "Lagos",
        regions: ["Ikeja", "Victoria Island", "Lekki", "Ikoyi"],
        coordinates: {
          lat: 6.5244,
          lng: 3.3792,
        },
      },
      {
        name: "Abuja",
        regions: ["Central", "Garki", "Wuse", "Maitama"],
        coordinates: {
          lat: 9.0765,
          lng: 7.3986,
        },
      },
    ],
    phoneCode: "+234",
    domains: [".ng"],
    timezone: "GMT+1",
  },
};
