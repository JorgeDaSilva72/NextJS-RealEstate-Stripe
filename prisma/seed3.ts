import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================
// DONNÉES DE SEED
// ============================================

const languages = [
  { code: "fr", name: "Français", isDefault: true },
  { code: "en", name: "English" },
];

const propertyTypes = [
  { code: "apartment", translations: { fr: "Appartement", en: "Apartment" } },
  { code: "house", translations: { fr: "Maison", en: "House" } },
  { code: "villa", translations: { fr: "Villa", en: "Villa" } },
  { code: "commercial", translations: { fr: "Commerce", en: "Commercial" } },
  { code: "riad", translations: { fr: "Riad", en: "Riad" } },
  { code: "office", translations: { fr: "Bureau", en: "Office" } },
  { code: "land", translations: { fr: "Terrain", en: "Land" } },
  { code: "farm", translations: { fr: "Ferme", en: "Farm" } },
  { code: "warehouse", translations: { fr: "Entrepôt", en: "Warehouse" } },
  { code: "hotel", translations: { fr: "Hôtel", en: "Hotel" } },
  // {
  //   code: "new_development",
  //   translations: { fr: "Programme neuf", en: "New Development" },
  // },
];

const propertyStatuses = [
  { code: "for_sale", translations: { fr: "Vente", en: "For Sale" } },
  { code: "for_rent", translations: { fr: "Location", en: "For Rent" } },
  {
    code: "seasonal_rent",
    translations: { fr: "Location saisonnière", en: "Seasonal Rental" },
  },
  {
    code: "furnished_rent",
    translations: { fr: "Location meublée", en: "Furnished Rental" },
  },
];

const countries = [
  // 1.Angola

  {
    code: "AO",
    phonePrefix: "+244",
    currency: "AOA",
    currencySymbol: "Kz",
    flagEmoji: "🇦🇴",
    latitude: -11.2027,
    longitude: 17.8739,
    displayOrder: 1,
    translations: {
      fr: { name: "Angola" },
      en: { name: "Angola" },
    },
    regions: [
      {
        name: { fr: "Luanda", en: "Luanda" },
        cities: [
          {
            name: { fr: "Luanda", en: "Luanda" },
            lat: -8.8383,
            lng: 13.2344,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 2.Burkina Faso

  {
    code: "BF",
    phonePrefix: "+226",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇧🇫",
    latitude: 12.2383,
    longitude: -1.5616,
    displayOrder: 2,
    translations: {
      fr: { name: "Burkina Faso" },
      en: { name: "Burkina Faso" },
    },
    regions: [
      {
        name: { fr: "Centre", en: "Centre" },
        cities: [
          {
            name: { fr: "Ouagadougou", en: "Ouagadougou" },
            lat: 12.3714,
            lng: -1.5197,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Hauts-Bassins", en: "Hauts-Bassins" },
        cities: [
          {
            name: { fr: "Bobo-Dioulasso", en: "Bobo-Dioulasso" },
            lat: 11.1773,
            lng: -4.2979,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 3.Burundi

  {
    code: "BI",
    phonePrefix: "+257",
    currency: "BIF",
    currencySymbol: "FBu",
    flagEmoji: "🇧🇮",
    latitude: -3.3731,
    longitude: 29.9189,
    displayOrder: 3,
    translations: {
      fr: { name: "Burundi" },
      en: { name: "Burundi" },
    },
    regions: [
      {
        name: { fr: "Bujumbura Mairie", en: "Bujumbura Mairie" },
        cities: [
          {
            name: { fr: "Bujumbura", en: "Bujumbura" },
            lat: -3.3761,
            lng: 29.3603,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 4.Bénin
  {
    code: "BJ",
    phonePrefix: "+229",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇧🇯",
    latitude: 9.3077,
    longitude: 2.3158,
    displayOrder: 4,
    translations: {
      fr: { name: "Bénin" },
      en: { name: "Benin" },
    },
    regions: [
      {
        name: { fr: "Littoral", en: "Littoral" },
        cities: [
          {
            name: { fr: "Cotonou", en: "Cotonou" },
            lat: 6.3654,
            lng: 2.4183,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Atlantique", en: "Atlantique" },
        cities: [
          {
            name: { fr: "Porto-Novo", en: "Porto-Novo" },
            lat: 6.4969,
            lng: 2.6289,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 5.Botswana

  {
    code: "BW",
    phonePrefix: "+267",
    currency: "BWP",
    currencySymbol: "P",
    flagEmoji: "🇧🇼",
    latitude: -22.3285,
    longitude: 24.6849,
    displayOrder: 5,
    translations: {
      fr: { name: "Botswana" },
      en: { name: "Botswana" },
    },
    regions: [
      {
        name: { fr: "Sud-Est", en: "South-East" },
        cities: [
          {
            name: { fr: "Gaborone", en: "Gaborone" },
            lat: -24.6282,
            lng: 25.9231,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 6.Congo (République démocratique du Congo)

  {
    code: "CD",
    phonePrefix: "+243",
    currency: "CDF",
    currencySymbol: "FC",
    flagEmoji: "🇨🇩",
    latitude: -4.0383,
    longitude: 21.7587,
    displayOrder: 6,
    translations: {
      fr: { name: "Congo (République démocratique du Congo)" },
      en: { name: "Congo (Democratic Republic of the Congo)" },
    },
    regions: [
      {
        name: { fr: "Kinshasa", en: "Kinshasa" },
        cities: [
          {
            name: { fr: "Kinshasa", en: "Kinshasa" },
            lat: -4.4419,
            lng: 15.2663,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Haut-Katanga", en: "Haut-Katanga" },
        cities: [
          {
            name: { fr: "Lubumbashi", en: "Lubumbashi" },
            lat: -11.6796,
            lng: 27.4869,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 7. République centrafricaine
  {
    code: "CF",
    phonePrefix: "+236",
    currency: "XAF",
    currencySymbol: "FCFA",
    flagEmoji: "🇨🇫",
    latitude: 6.6111,
    longitude: 20.9394,
    displayOrder: 7,
    translations: {
      fr: { name: "République centrafricaine" },
      en: { name: "Central African Republic" },
    },
    regions: [
      {
        name: { fr: "Bangui", en: "Bangui" },
        cities: [
          {
            name: { fr: "Bangui", en: "Bangui" },
            lat: 4.3947,
            lng: 18.5582,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 8.Congo (République du Congo)

  {
    code: "CG",
    phonePrefix: "+242",
    currency: "XAF",
    currencySymbol: "FCFA",
    flagEmoji: "🇨🇬",
    latitude: -0.228,
    longitude: 15.8277,
    displayOrder: 8,
    translations: {
      fr: { name: "Congo (République du Congo)" },
      en: { name: "Congo (Republic of the Congo)" },
    },
    regions: [
      {
        name: { fr: "Brazzaville", en: "Brazzaville" },
        cities: [
          {
            name: { fr: "Brazzaville", en: "Brazzaville" },
            lat: -4.2634,
            lng: 15.2429,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Pointe-Noire", en: "Pointe-Noire" },
        cities: [
          {
            name: { fr: "Pointe-Noire", en: "Pointe-Noire" },
            lat: -4.7692,
            lng: 11.8636,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 9.Côte d'Ivoire

  {
    code: "CI",
    phonePrefix: "+225",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇨🇮",
    latitude: 7.54,
    longitude: -5.5471,
    displayOrder: 9,
    translations: {
      fr: { name: "Côte d'Ivoire" },
      en: { name: "Ivory Coast" },
    },
    regions: [
      {
        name: { fr: "Abidjan", en: "Abidjan" },
        cities: [
          {
            name: { fr: "Abidjan", en: "Abidjan" },
            lat: 5.36,
            lng: -4.0083,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Yamoussoukro", en: "Yamoussoukro" },
        cities: [
          {
            name: { fr: "Yamoussoukro", en: "Yamoussoukro" },
            lat: 6.8276,
            lng: -5.2893,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 10.Cameroun

  {
    code: "CM",
    phonePrefix: "+237",
    currency: "XAF",
    currencySymbol: "FCFA",
    flagEmoji: "🇨🇲",
    latitude: 7.3697,
    longitude: 12.3547,
    displayOrder: 10,
    translations: {
      fr: { name: "Cameroun" },
      en: { name: "Cameroon" },
    },
    regions: [
      {
        name: { fr: "Centre", en: "Centre" },
        cities: [
          {
            name: { fr: "Yaoundé", en: "Yaoundé" },
            lat: 3.848,
            lng: 11.5021,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 11.Cap-Vert
  {
    code: "CV",
    phonePrefix: "+238",
    currency: "CVE",
    currencySymbol: "$",
    flagEmoji: "🇨🇻",
    latitude: 16.5388,
    longitude: -23.0418,
    displayOrder: 11,
    translations: {
      fr: { name: "Cap-Vert" },
      en: { name: "Cape Verde" },
    },
    regions: [
      {
        name: { fr: "Praia", en: "Praia" },
        cities: [
          {
            name: { fr: "Praia", en: "Praia" },
            lat: 14.9331,
            lng: -23.5133,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 12.Djibouti
  {
    code: "DJ",
    phonePrefix: "+253",
    currency: "DJF",
    currencySymbol: "Fdj",
    flagEmoji: "🇩🇯",
    latitude: 11.8251,
    longitude: 42.5903,
    displayOrder: 12,
    translations: {
      fr: { name: "Djibouti" },
      en: { name: "Djibouti" },
    },
    regions: [
      {
        name: { fr: "Djibouti", en: "Djibouti" },
        cities: [
          {
            name: { fr: "Djibouti", en: "Djibouti" },
            lat: 11.8251,
            lng: 42.5903,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 13.Algérie

  {
    code: "DZ",
    phonePrefix: "+213",
    currency: "DZD",
    currencySymbol: "د.ج",
    flagEmoji: "🇩🇿",
    latitude: 28.0339,
    longitude: 1.6596,
    displayOrder: 13,
    translations: {
      fr: { name: "Algérie" },
      en: { name: "Algeria" },
    },
    regions: [
      {
        name: { fr: "Alger", en: "Algiers" },
        cities: [
          {
            name: { fr: "Alger", en: "Algiers" },
            lat: 36.7538,
            lng: 3.0588,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Oran", en: "Oran" },
        cities: [
          {
            name: { fr: "Oran", en: "Oran" },
            lat: 35.6976,
            lng: -0.6337,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 14.Égypte
  {
    code: "EG",
    phonePrefix: "+20",
    currency: "EGP",
    currencySymbol: "£",
    flagEmoji: "🇪🇬",
    latitude: 26.8206,
    longitude: 30.8025,
    displayOrder: 14,
    translations: {
      fr: { name: "Égypte" },
      en: { name: "Egypt" },
    },
    regions: [
      {
        name: { fr: "Le Caire", en: "Cairo" },
        cities: [
          {
            name: { fr: "Le Caire", en: "Cairo" },
            lat: 30.0444,
            lng: 31.2357,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Alexandrie", en: "Alexandria" },
        cities: [
          {
            name: { fr: "Alexandrie", en: "Alexandria" },
            lat: 31.2001,
            lng: 29.9187,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 15.Érythrée

  {
    code: "ER",
    phonePrefix: "+291",
    currency: "ERN",
    currencySymbol: "Nfk",
    flagEmoji: "🇪🇷",
    latitude: 15.1794,
    longitude: 39.7823,
    displayOrder: 15,
    translations: {
      fr: { name: "Érythrée" },
      en: { name: "Eritrea" },
    },
    regions: [
      {
        name: { fr: "Maekel", en: "Maekel" },
        cities: [
          {
            name: { fr: "Asmara", en: "Asmara" },
            lat: 15.3229,
            lng: 38.9251,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 16.Éthiopie

  {
    code: "ET",
    phonePrefix: "+251",
    currency: "ETB",
    currencySymbol: "Br",
    flagEmoji: "🇪🇹",
    latitude: 9.145,
    longitude: 40.4897,
    displayOrder: 16,
    translations: {
      fr: { name: "Éthiopie" },
      en: { name: "Ethiopia" },
    },
    regions: [
      {
        name: { fr: "Addis-Abeba", en: "Addis Ababa" },
        cities: [
          {
            name: { fr: "Addis-Abeba", en: "Addis Ababa" },
            lat: 9.032,
            lng: 38.7469,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 17. Gabon
  {
    code: "GA",
    phonePrefix: "+241",
    currency: "XAF",
    currencySymbol: "FCFA",
    flagEmoji: "🇬🇦",
    latitude: -0.8037,
    longitude: 11.6094,
    displayOrder: 17,
    translations: {
      fr: { name: "Gabon" },
      en: { name: "Gabon" },
    },
    regions: [
      {
        name: { fr: "Estuaire", en: "Estuaire" },
        cities: [
          {
            name: { fr: "Libreville", en: "Libreville" },
            lat: 0.4162,
            lng: 9.4673,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 18. Ghana
  {
    code: "GH",
    phonePrefix: "+233",
    currency: "GHS",
    currencySymbol: "₵",
    flagEmoji: "🇬🇭",
    latitude: 7.9465,
    longitude: -1.0232,
    displayOrder: 18,
    translations: {
      fr: { name: "Ghana" },
      en: { name: "Ghana" },
    },
    regions: [
      {
        name: { fr: "Grand Accra", en: "Greater Accra" },
        cities: [
          {
            name: { fr: "Accra", en: "Accra" },
            lat: 5.6037,
            lng: -0.187,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 19. Gambie
  {
    code: "GM",
    phonePrefix: "+220",
    currency: "GMD",
    currencySymbol: "D",
    flagEmoji: "🇬🇲",
    latitude: 13.4432,
    longitude: -15.3101,
    displayOrder: 19,
    translations: {
      fr: { name: "Gambie" },
      en: { name: "Gambia" },
    },
    regions: [
      {
        name: { fr: "Banjul", en: "Banjul" },
        cities: [
          {
            name: { fr: "Banjul", en: "Banjul" },
            lat: 13.4549,
            lng: -16.579,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 20. Guinée
  {
    code: "GN",
    phonePrefix: "+224",
    currency: "GNF",
    currencySymbol: "FG",
    flagEmoji: "🇬🇳",
    latitude: 9.9456,
    longitude: -9.6966,
    displayOrder: 20,
    translations: {
      fr: { name: "Guinée" },
      en: { name: "Guinea" },
    },
    regions: [
      {
        name: { fr: "Conakry", en: "Conakry" },
        cities: [
          {
            name: { fr: "Conakry", en: "Conakry" },
            lat: 9.6412,
            lng: -13.5784,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 21. Guinée équatoriale
  {
    code: "GQ",
    phonePrefix: "+240",
    currency: "XAF",
    currencySymbol: "FCFA",
    flagEmoji: "🇬🇶",
    latitude: 1.6508,
    longitude: 10.2679,
    displayOrder: 21,
    translations: {
      fr: { name: "Guinée équatoriale" },
      en: { name: "Equatorial Guinea" },
    },
    regions: [
      {
        name: { fr: "Bioko Nord", en: "Bioko Norte" },
        cities: [
          {
            name: { fr: "Malabo", en: "Malabo" },
            lat: 3.75,
            lng: 8.7833,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 22. Guinée-Bissau
  {
    code: "GW",
    phonePrefix: "+245",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇬🇼",
    latitude: 11.8037,
    longitude: -15.1804,
    displayOrder: 22,
    translations: {
      fr: { name: "Guinée-Bissau" },
      en: { name: "Guinea-Bissau" },
    },
    regions: [
      {
        name: { fr: "Bissau", en: "Bissau" },
        cities: [
          {
            name: { fr: "Bissau", en: "Bissau" },
            lat: 11.8636,
            lng: -15.5977,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 23. Kenya
  {
    code: "KE",
    phonePrefix: "+254",
    currency: "KES",
    currencySymbol: "KSh",
    flagEmoji: "🇰🇪",
    latitude: -0.0236,
    longitude: 37.9062,
    displayOrder: 23,
    translations: {
      fr: { name: "Kenya" },
      en: { name: "Kenya" },
    },
    regions: [
      {
        name: { fr: "Nairobi", en: "Nairobi" },
        cities: [
          {
            name: { fr: "Nairobi", en: "Nairobi" },
            lat: -1.2864,
            lng: 36.8172,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 24.Comores

  {
    code: "KM",
    phonePrefix: "+269",
    currency: "KMF",
    currencySymbol: "CF",
    flagEmoji: "🇰🇲",
    latitude: -11.6455,
    longitude: 43.3333,
    displayOrder: 24,
    translations: {
      fr: { name: "Comores" },
      en: { name: "Comoros" },
    },
    regions: [
      {
        name: { fr: "Grande Comore", en: "Grande Comore" },
        cities: [
          {
            name: { fr: "Moroni", en: "Moroni" },
            lat: -11.7172,
            lng: 43.2473,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 25. Liberia
  {
    code: "LR",
    phonePrefix: "+231",
    currency: "LRD",
    currencySymbol: "$",
    flagEmoji: "🇱🇷",
    latitude: 6.4281,
    longitude: -9.4295,
    displayOrder: 25,
    translations: {
      fr: { name: "Liberia" },
      en: { name: "Liberia" },
    },
    regions: [
      {
        name: { fr: "Montserrado", en: "Montserrado" },
        cities: [
          {
            name: { fr: "Monrovia", en: "Monrovia" },
            lat: 6.3006,
            lng: -10.7969,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 26. Lesotho
  {
    code: "LS",
    phonePrefix: "+266",
    currency: "LSL",
    currencySymbol: "L",
    flagEmoji: "🇱🇸",
    latitude: -29.61,
    longitude: 28.2336,
    displayOrder: 26,
    translations: {
      fr: { name: "Lesotho" },
      en: { name: "Lesotho" },
    },
    regions: [
      {
        name: { fr: "Maseru", en: "Maseru" },
        cities: [
          {
            name: { fr: "Maseru", en: "Maseru" },
            lat: -29.3158,
            lng: 27.4869,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 27. Libye
  {
    code: "LY",
    phonePrefix: "+218",
    currency: "LYD",
    currencySymbol: "LD",
    flagEmoji: "🇱🇾",
    latitude: 26.3351,
    longitude: 17.2283,
    displayOrder: 27,
    translations: {
      fr: { name: "Libye" },
      en: { name: "Libya" },
    },
    regions: [
      {
        name: { fr: "Tripoli", en: "Tripoli" },
        cities: [
          {
            name: { fr: "Tripoli", en: "Tripoli" },
            lat: 32.8872,
            lng: 13.1913,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 28. Maroc
  {
    code: "MA",
    phonePrefix: "+212",
    currency: "MAD",
    currencySymbol: "DH",
    flagEmoji: "🇲🇦",
    latitude: 31.7917,
    longitude: -7.0926,
    displayOrder: 28,
    translations: { fr: { name: "Maroc" }, en: { name: "Morocco" } },
    regions: [
      {
        name: { fr: "Rabat-Salé-Kénitra", en: "Rabat-Salé-Kénitra" },
        cities: [
          {
            name: { fr: "Rabat", en: "Rabat" },
            lat: 34.0209,
            lng: -6.8416,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 29. Madagascar
  {
    code: "MG",
    phonePrefix: "+261",
    currency: "MGA",
    currencySymbol: "Ar",
    flagEmoji: "🇲🇬",
    latitude: -18.7669,
    longitude: 46.8691,
    displayOrder: 29,
    translations: { fr: { name: "Madagascar" }, en: { name: "Madagascar" } },
    regions: [
      {
        name: { fr: "Antananarivo", en: "Antananarivo" },
        cities: [
          {
            name: { fr: "Antananarivo", en: "Antananarivo" },
            lat: -18.8792,
            lng: 47.5079,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 30. Mali
  {
    code: "ML",
    phonePrefix: "+223",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇲🇱",
    latitude: 17.5707,
    longitude: -3.9962,
    displayOrder: 30,
    translations: { fr: { name: "Mali" }, en: { name: "Mali" } },
    regions: [
      {
        name: { fr: "Bamako", en: "Bamako" },
        cities: [
          {
            name: { fr: "Bamako", en: "Bamako" },
            lat: 12.6392,
            lng: -8.0029,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 31. Mauritanie
  {
    code: "MR",
    phonePrefix: "+222",
    currency: "MRU",
    currencySymbol: "UM",
    flagEmoji: "🇲🇷",
    latitude: 21.0079,
    longitude: -10.9408,
    displayOrder: 31,
    translations: { fr: { name: "Mauritanie" }, en: { name: "Mauritania" } },
    regions: [
      {
        name: { fr: "Nouakchott", en: "Nouakchott" },
        cities: [
          {
            name: { fr: "Nouakchott", en: "Nouakchott" },
            lat: 18.0735,
            lng: -15.9582,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 32. Maurice
  {
    code: "MU",
    phonePrefix: "+230",
    currency: "MUR",
    currencySymbol: "₨",
    flagEmoji: "🇲🇺",
    latitude: -20.3484,
    longitude: 57.5522,
    displayOrder: 32,
    translations: { fr: { name: "Maurice" }, en: { name: "Mauritius" } },
    regions: [
      {
        name: { fr: "Port-Louis", en: "Port Louis" },
        cities: [
          {
            name: { fr: "Port-Louis", en: "Port Louis" },
            lat: -20.1619,
            lng: 57.4989,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 33. Malawi
  {
    code: "MW",
    phonePrefix: "+265",
    currency: "MWK",
    currencySymbol: "MK",
    flagEmoji: "🇲🇼",
    latitude: -13.2543,
    longitude: 34.3015,
    displayOrder: 33,
    translations: { fr: { name: "Malawi" }, en: { name: "Malawi" } },
    regions: [
      {
        name: { fr: "Lilongwe", en: "Lilongwe" },
        cities: [
          {
            name: { fr: "Lilongwe", en: "Lilongwe" },
            lat: -13.9626,
            lng: 33.7741,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 34. Mozambique
  {
    code: "MZ",
    phonePrefix: "+258",
    currency: "MZN",
    currencySymbol: "MT",
    flagEmoji: "🇲🇿",
    latitude: -18.6657,
    longitude: 35.5296,
    displayOrder: 34,
    translations: { fr: { name: "Mozambique" }, en: { name: "Mozambique" } },
    regions: [
      {
        name: { fr: "Maputo", en: "Maputo" },
        cities: [
          {
            name: { fr: "Maputo", en: "Maputo" },
            lat: -25.9692,
            lng: 32.5732,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 35. Namibie
  {
    code: "NA",
    phonePrefix: "+264",
    currency: "NAD",
    currencySymbol: "$",
    flagEmoji: "🇳🇦",
    latitude: -22.9576,
    longitude: 18.4904,
    displayOrder: 35,
    translations: { fr: { name: "Namibie" }, en: { name: "Namibia" } },
    regions: [
      {
        name: { fr: "Khomas", en: "Khomas" },
        cities: [
          {
            name: { fr: "Windhoek", en: "Windhoek" },
            lat: -22.57,
            lng: 17.0832,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 36. Niger
  {
    code: "NE",
    phonePrefix: "+227",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇳🇪",
    latitude: 17.6078,
    longitude: 8.0817,
    displayOrder: 36,
    translations: { fr: { name: "Niger" }, en: { name: "Niger" } },
    regions: [
      {
        name: { fr: "Niamey", en: "Niamey" },
        cities: [
          {
            name: { fr: "Niamey", en: "Niamey" },
            lat: 13.5116,
            lng: 2.1254,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 37. Nigeria
  {
    code: "NG",
    phonePrefix: "+234",
    currency: "NGN",
    currencySymbol: "₦",
    flagEmoji: "🇳🇬",
    latitude: 9.082,
    longitude: 8.6753,
    displayOrder: 37,
    translations: { fr: { name: "Nigeria" }, en: { name: "Nigeria" } },
    regions: [
      {
        name: { fr: "Lagos", en: "Lagos" },
        cities: [
          {
            name: { fr: "Lagos", en: "Lagos" },
            lat: 6.5244,
            lng: 3.3792,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 38. Rwanda
  {
    code: "RW",
    phonePrefix: "+250",
    currency: "RWF",
    currencySymbol: "FRw",
    flagEmoji: "🇷🇼",
    latitude: -1.9403,
    longitude: 29.8739,
    displayOrder: 38,
    translations: { fr: { name: "Rwanda" }, en: { name: "Rwanda" } },
    regions: [
      {
        name: { fr: "Kigali", en: "Kigali" },
        cities: [
          {
            name: { fr: "Kigali", en: "Kigali" },
            lat: -1.9441,
            lng: 30.0619,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 39. Seychelles

  {
    code: "SC",
    phonePrefix: "+248",
    currency: "SCR",
    currencySymbol: "₨",
    flagEmoji: "🇸🇨",
    latitude: -4.6796,
    longitude: 55.492,
    displayOrder: 39,
    translations: { fr: { name: "Seychelles" }, en: { name: "Seychelles" } },
    regions: [
      {
        name: { fr: "Mahé", en: "Mahé" },
        cities: [
          {
            name: { fr: "Victoria", en: "Victoria" },
            lat: -4.6167,
            lng: 55.45,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 40. Soudan

  {
    code: "SD",
    phonePrefix: "+249",
    currency: "SDG",
    currencySymbol: "ج.س",
    flagEmoji: "🇸🇩",
    latitude: 15.5007,
    longitude: 32.5599,
    displayOrder: 40,
    translations: { fr: { name: "Soudan" }, en: { name: "Sudan" } },
    regions: [
      {
        name: { fr: "Khartoum", en: "Khartoum" },
        cities: [
          {
            name: { fr: "Khartoum", en: "Khartoum" },
            lat: 15.5007,
            lng: 32.5599,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 41. Sierra Leone

  {
    code: "SL",
    phonePrefix: "+232",
    currency: "SLL",
    currencySymbol: "Le",
    flagEmoji: "🇸🇱",
    latitude: 8.4606,
    longitude: -11.7799,
    displayOrder: 41,
    translations: {
      fr: { name: "Sierra Leone" },
      en: { name: "Sierra Leone" },
    },
    regions: [
      {
        name: { fr: "Ouest", en: "Western Area" },
        cities: [
          {
            name: { fr: "Freetown", en: "Freetown" },
            lat: 8.4657,
            lng: -13.2317,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 42. Sénégal

  {
    code: "SN",
    phonePrefix: "+221",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇸🇳",
    latitude: 14.4974,
    longitude: -14.4524,
    displayOrder: 42,
    translations: { fr: { name: "Sénégal" }, en: { name: "Senegal" } },
    regions: [
      {
        name: { fr: "Dakar", en: "Dakar" },
        cities: [
          {
            name: { fr: "Dakar", en: "Dakar" },
            lat: 14.7167,
            lng: -17.4677,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 43. Somalie

  {
    code: "SO",
    phonePrefix: "+252",
    currency: "SOS",
    currencySymbol: "Sh",
    flagEmoji: "🇸🇴",
    latitude: 5.1521,
    longitude: 46.1996,
    displayOrder: 43,
    translations: { fr: { name: "Somalie" }, en: { name: "Somalia" } },
    regions: [
      {
        name: { fr: "Banaadir", en: "Banaadir" },
        cities: [
          {
            name: { fr: "Mogadiscio", en: "Mogadishu" },
            lat: 2.0469,
            lng: 45.3182,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 44. Soudan du Sud

  {
    code: "SS",
    phonePrefix: "+211",
    currency: "SSP",
    currencySymbol: "£",
    flagEmoji: "🇸🇸",
    latitude: 6.877,
    longitude: 31.307,
    displayOrder: 44,
    translations: {
      fr: { name: "Soudan du Sud" },
      en: { name: "South Sudan" },
    },
    regions: [
      {
        name: { fr: "État du Nil Supérieur", en: "Upper Nile" },
        cities: [
          {
            name: { fr: "Juba", en: "Juba" },
            lat: 4.8517,
            lng: 31.5825,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 45. Sao Tomé-et-Principe
  {
    code: "ST",
    phonePrefix: "+239",
    currency: "STN",
    currencySymbol: "Db",
    flagEmoji: "🇸🇹",
    latitude: 0.1864,
    longitude: 6.6131,
    displayOrder: 45,
    translations: {
      fr: { name: "Sao Tomé-et-Principe" },
      en: { name: "São Tomé and Príncipe" },
    },
    regions: [
      {
        name: { fr: "São Tomé", en: "São Tomé" },
        cities: [
          {
            name: { fr: "São Tomé", en: "São Tomé" },
            lat: 0.3365,
            lng: 6.7273,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 46.Eswatini (anciennement Swaziland)

  {
    code: "SZ",
    phonePrefix: "+268",
    currency: "SZL",
    currencySymbol: "E",
    flagEmoji: "🇸🇿",
    latitude: -26.5225,
    longitude: 31.4659,
    displayOrder: 46,
    translations: {
      fr: { name: "Eswatini" },
      en: { name: "Eswatini" },
    },
    regions: [
      {
        name: { fr: "Hhohho", en: "Hhohho" },
        cities: [
          {
            name: { fr: "Mbabane", en: "Mbabane" },
            lat: -26.3208,
            lng: 31.1617,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 47. Tchad

  {
    code: "TD",
    phonePrefix: "+235",
    currency: "XAF",
    currencySymbol: "FCFA",
    flagEmoji: "🇹🇩",
    latitude: 15.4542,
    longitude: 18.7322,
    displayOrder: 47,
    translations: { fr: { name: "Tchad" }, en: { name: "Chad" } },
    regions: [
      {
        name: { fr: "N'Djamena", en: "N'Djamena" },
        cities: [
          {
            name: { fr: "N'Djamena", en: "N'Djamena" },
            lat: 12.1348,
            lng: 15.0557,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 48. Togo
  {
    code: "TG",
    phonePrefix: "+228",
    currency: "XOF",
    currencySymbol: "FCFA",
    flagEmoji: "🇹🇬",
    latitude: 8.6195,
    longitude: 0.8248,
    displayOrder: 48,
    translations: {
      fr: { name: "Togo" },
      en: { name: "Togo" },
    },
    regions: [
      {
        name: { fr: "Région Maritime", en: "Maritime Region" },
        cities: [
          {
            name: { fr: "Lomé", en: "Lomé" },
            lat: 6.1375,
            lng: 1.2123,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 49. Tunisie

  {
    code: "TN",
    phonePrefix: "+216",
    currency: "TND",
    currencySymbol: "د.ت",
    flagEmoji: "🇹🇳",
    latitude: 33.8869,
    longitude: 9.5375,
    displayOrder: 49,
    translations: {
      fr: { name: "Tunisie" },
      en: { name: "Tunisia" },
    },
    regions: [
      {
        name: { fr: "Tunis", en: "Tunis" },
        cities: [
          {
            name: { fr: "Tunis", en: "Tunis" },
            lat: 36.8065,
            lng: 10.1815,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 50. Tanzanie

  {
    code: "TZ",
    phonePrefix: "+255",
    currency: "TZS",
    currencySymbol: "Sh",
    flagEmoji: "🇹🇿",
    latitude: -6.369,
    longitude: 34.8888,
    displayOrder: 50,
    translations: { fr: { name: "Tanzanie" }, en: { name: "Tanzania" } },
    regions: [
      {
        name: { fr: "Dar es Salaam", en: "Dar es Salaam" },
        cities: [
          {
            name: { fr: "Dar es Salaam", en: "Dar es Salaam" },
            lat: -6.7924,
            lng: 39.2083,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 51. Ouganda
  {
    code: "UG",
    phonePrefix: "+256",
    currency: "UGX",
    currencySymbol: "USh",
    flagEmoji: "🇺🇬",
    latitude: 1.3733,
    longitude: 32.2903,
    displayOrder: 51,
    translations: {
      fr: { name: "Ouganda" },
      en: { name: "Uganda" },
    },
    regions: [
      {
        name: { fr: "Région Centrale", en: "Central Region" },
        cities: [
          {
            name: { fr: "Kampala", en: "Kampala" },
            lat: 0.3476,
            lng: 32.5825,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 52.Afrique du Sud
  {
    code: "ZA",
    phonePrefix: "+27",
    currency: "ZAR",
    currencySymbol: "R",
    flagEmoji: "🇿🇦",
    latitude: -30.5595,
    longitude: 22.9375,
    displayOrder: 52,
    translations: {
      fr: { name: "Afrique du Sud" },
      en: { name: "South Africa" },
    },
    regions: [
      {
        name: { fr: "Gauteng", en: "Gauteng" },
        cities: [
          {
            name: { fr: "Johannesburg", en: "Johannesburg" },
            lat: -26.2041,
            lng: 28.0473,
            isFeatured: true,
          },
          {
            name: { fr: "Pretoria", en: "Pretoria" },
            lat: -25.7479,
            lng: 28.2293,
            isFeatured: true,
          },
        ],
      },
      {
        name: { fr: "Cap-Occidental", en: "Western Cape" },
        cities: [
          {
            name: { fr: "Le Cap", en: "Cape Town" },
            lat: -33.9249,
            lng: 18.4241,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 53. Zambie

  {
    code: "ZM",
    phonePrefix: "+260",
    currency: "ZMW",
    currencySymbol: "ZK",
    flagEmoji: "🇿🇲",
    latitude: -13.1339,
    longitude: 27.8493,
    displayOrder: 53,
    translations: {
      fr: { name: "Zambie" },
      en: { name: "Zambia" },
    },
    regions: [
      {
        name: { fr: "Lusaka", en: "Lusaka" },
        cities: [
          {
            name: { fr: "Lusaka", en: "Lusaka" },
            lat: -15.3875,
            lng: 28.3228,
            isFeatured: true,
          },
        ],
      },
    ],
  },

  // 54. Zimbabwe

  {
    code: "ZW",
    phonePrefix: "+263",
    currency: "ZWL",
    currencySymbol: "Z$",
    flagEmoji: "🇿🇼",
    latitude: -19.0154,
    longitude: 29.1549,
    displayOrder: 48,
    translations: {
      fr: { name: "Zimbabwe" },
      en: { name: "Zimbabwe" },
    },
    regions: [
      {
        name: { fr: "Harare", en: "Harare" },
        cities: [
          {
            name: { fr: "Harare", en: "Harare" },
            lat: -17.8252,
            lng: 31.0335,
            isFeatured: true,
          },
        ],
      },
    ],
  },
];

const plans = [
  {
    namePlan: "Gratuit",
    price: 0,
    duration: "AN",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-12-31"),
    premiumAds: 3,
    photosPerAd: 3,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features: "Visibilité normale, 3 annonces, 3 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Bronze",
    price: 150,
    duration: "AN",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-12-31"),
    premiumAds: 5,
    photosPerAd: 8,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features:
      "Visibilité élevée, 5 annonces premium, 8 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Argent",
    price: 250,
    duration: "AN",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-12-31"),
    premiumAds: 10,
    photosPerAd: 8,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features:
      "Visibilité élevée, 10 annonces premium, 8 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Or",
    price: 400,
    duration: "AN",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-12-31"),
    premiumAds: 20,
    photosPerAd: 10,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features:
      "Visibilité élevée, 20 annonces premium, 10 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Diamant",
    price: 1500,
    duration: "AN",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-12-31"),
    premiumAds: 25,
    photosPerAd: 15,
    shortVideosPerAd: 1,
    youtubeVideoDuration: "30-45 MIN",
    zoneRadius: 30,
    features:
      "Visibilité maximale, 25 annonces premium, 15 photos/annonce, 1 vidéo courte, vidéo YouTube 30-45min, zone de 30km",
  },
];

console.log("🧹 Resetting database...");

// ============================================================
// 🔥 1. DELETE in correct order (respecting foreign keys)
// ============================================================

// Children first (translations, property data, etc.)
await prisma.propertyStatusTranslation.deleteMany();
await prisma.propertyTypeTranslation.deleteMany();
await prisma.cityTranslation.deleteMany();
await prisma.regionTranslation.deleteMany();
await prisma.countryTranslation.deleteMany();

await prisma.propertyImage.deleteMany();
await prisma.propertyVideo.deleteMany();
await prisma.propertyFeature.deleteMany();
await prisma.propertyLocation.deleteMany();
await prisma.appointment.deleteMany();
await prisma.contact.deleteMany();

await prisma.subscriptions.deleteMany();
await prisma.subscriptionPlan.deleteMany();

// Properties depending on other models
await prisma.property.deleteMany();

// Geographic & taxonomy models
await prisma.city.deleteMany();
await prisma.region.deleteMany();
await prisma.country.deleteMany();

// Type & status
await prisma.propertyType.deleteMany();
await prisma.propertyStatus.deleteMany();

// Finally: languages
await prisma.language.deleteMany();

console.log("✔️ Database cleared");

// ============================================
// FONCTION PRINCIPALE
// ============================================

async function main() {
  console.log("🌍 Début du seed complet...\n");

  // ================================
  // SEED DES LANGUES
  // ================================

  // 1. CRÉER LES LANGUES
  console.log("📝 Création des langues...");
  //   const french = await prisma.language.upsert({
  //     where: { code: "fr" },
  //     update: {},
  //     create: {
  //       code: "fr",
  //       name: "Français",
  //       isActive: true,
  //       isDefault: true,
  //     },
  //   });

  //   const english = await prisma.language.upsert({
  //     where: { code: "en" },
  //     update: {},
  //     create: {
  //       code: "en",
  //       name: "English",
  //       isActive: true,
  //       isDefault: false,
  //     },
  //   });

  const langMap: Record<string, any> = {};

  for (const lang of languages) {
    const created = await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: {
        code: lang.code,
        name: lang.name,
        isActive: true,
        isDefault: lang.isDefault ?? false,
      },
    });

    langMap[lang.code] = created;
  }

  console.log("✅ Langues créées: FR, EN\n");

  // ================================
  // SEED TYPES DE PROPRIÉTÉS
  // ================================

  // 2. CRÉER LES TYPES DE PROPRIÉTÉS AVEC TRADUCTIONS

  console.log("🏠 Création des types de propriétés...");

  for (const type of propertyTypes) {
    const createdType = await prisma.propertyType.upsert({
      // where: { id: 0 }, // hack pour forcer create*only*
      where: { code: type.code }, // ✅ Utilise le champ unique 'code'
      update: {},
      create: {
        code: type.code,
        isActive: true,
        translations: {
          create: [
            {
              languageId: langMap["fr"].id,
              value: type.translations.fr,
            },
            {
              languageId: langMap["en"].id,
              value: type.translations.en,
            },
          ],
        },
      },
    });
  }

  console.log(`✅ ${propertyTypes.length} types de propriétés créés\n`);

  // ================================
  // SEED STATUS DES PROPRIÉTÉS
  // ================================
  // 3. CRÉER LES STATUTS DE PROPRIÉTÉS AVEC TRADUCTIONS
  console.log("📋 Création des statuts de propriétés...");

  for (const status of propertyStatuses) {
    await prisma.propertyStatus.upsert({
      // where: { id: 0 }, // idem → create uniquement
      where: { code: status.code }, // ✅ Utilise le champ unique 'code'
      update: {},
      create: {
        code: status.code,
        translations: {
          create: [
            {
              languageId: langMap["fr"].id,
              value: status.translations.fr,
            },
            {
              languageId: langMap["en"].id,
              value: status.translations.en,
            },
          ],
        },
      },
    });
  }

  console.log(`✅ ${propertyStatuses.length} statuts créés\n`);

  // 4. CRÉER LES PAYS AVEC TRADUCTIONS
  console.log("🗺️  Création des pays africains...");
  //   const createdCountries = new Map();

  //   for (const countryData of countries) {
  //     console.log(`   📍 ${countryData.translations.fr}...`);

  //     const country = await prisma.country.create({
  //       data: {
  //         code: countryData.code,
  //         phonePrefix: countryData.phonePrefix,
  //         currency: countryData.currency,
  //         currencySymbol: countryData.currencySymbol,
  //         flagEmoji: countryData.flagEmoji,
  //         latitude: countryData.latitude,
  //         longitude: countryData.longitude,
  //         isActive: true,
  //         displayOrder: countryData.displayOrder,
  //         translations: {
  //           create: [
  //             {
  //               languageId: french.id,
  //               name: countryData.translations.fr,
  //             },
  //             {
  //               languageId: english.id,
  //               name: countryData.translations.en,
  //             },
  //           ],
  //         },
  //       },
  //     });

  //     createdCountries.set(countryData.code, country.id);

  //     // Créer les régions et villes
  //     for (const regionData of countryData.regions) {
  //       const region = await prisma.region.create({
  //         data: {
  //           countryId: country.id,
  //           isActive: true,
  //           translations: {
  //             create: [
  //               {
  //                 languageId: french.id,
  //                 name: regionData.name.fr,
  //               },
  //               {
  //                 languageId: english.id,
  //                 name: regionData.name.en,
  //               },
  //             ],
  //           },
  //         },
  //       });

  //       // Créer les villes
  //       for (const cityData of regionData.cities) {
  //         await prisma.city.create({
  //           data: {
  //             countryId: country.id,
  //             regionId: region.id,
  //             latitude: cityData.lat,
  //             longitude: cityData.lng,
  //             isActive: true,
  //             isFeatured: cityData.isFeatured || false,
  //             translations: {
  //               create: [
  //                 {
  //                   languageId: french.id,
  //                   name: cityData.name.fr,
  //                 },
  //                 {
  //                   languageId: english.id,
  //                   name: cityData.name.en,
  //                 },
  //               ],
  //             },
  //           },
  //         });
  //       }
  //     }
  //   }

  // Créer les pays, régions et villes
  for (const countryData of countries) {
    console.log(`📍 Création de ${countryData.translations.fr.name}...`);

    const country = await prisma.country.create({
      data: {
        code: countryData.code,
        phonePrefix: countryData.phonePrefix,
        currency: countryData.currency,
        currencySymbol: countryData.currencySymbol,
        flagEmoji: countryData.flagEmoji,
        latitude: countryData.latitude,
        longitude: countryData.longitude,
        isActive: true,
        displayOrder: countryData.displayOrder,
        translations: {
          create: [
            {
              languageId: langMap["fr"].id,
              name: countryData.translations.fr.name,
            },
            {
              languageId: langMap["en"].id,
              name: countryData.translations.en.name,
            },
          ],
        },
      },
    });

    // Créer les régions et villes
    for (const regionData of countryData.regions) {
      const region = await prisma.region.create({
        data: {
          countryId: country.id,
          isActive: true,
          translations: {
            create: [
              {
                languageId: langMap["fr"].id,
                name: regionData.name.fr,
              },
              {
                languageId: langMap["en"].id,
                name: regionData.name.en,
              },
            ],
          },
        },
      });

      // Créer les villes
      for (const cityData of regionData.cities) {
        await prisma.city.create({
          data: {
            countryId: country.id,
            regionId: region.id,
            latitude: cityData.lat,
            longitude: cityData.lng,
            isActive: true,
            isFeatured: cityData.isFeatured || false,
            translations: {
              create: [
                {
                  languageId: langMap["fr"].id,
                  name: cityData.name.fr,
                },
                {
                  languageId: langMap["en"].id,
                  name: cityData.name.en,
                },
              ],
            },
          },
        });
      }
    }
  }
  console.log(`✅ ${countries.length} pays créés avec régions et villes\n`);

  // 5. CRÉER LES PLANS D'ABONNEMENT
  console.log("💎 Création des plans d'abonnement...");
  for (const plan of plans) {
    await prisma.subscriptionPlan.create({
      data: {
        namePlan: plan.namePlan,
        price: plan.price,
        duration: plan.duration,
        country: { connect: { id: 1 } }, // arbitraire mais les pays doivent être crées avant
        startDate: plan.startDate,
        endDate: plan.endDate,
        premiumAds: plan.premiumAds,
        photosPerAd: plan.photosPerAd,
        shortVideosPerAd: plan.shortVideosPerAd,
        youtubeVideoDuration: plan.youtubeVideoDuration,
        zoneRadius: plan.zoneRadius,
        features: plan.features,
      },
    });
    console.log(`   ✅ Plan ${plan.namePlan} créé`);
  }
  console.log(`✅ ${plans.length} plans d'abonnement créés\n`);

  // RÉSUMÉ FINAL
  console.log("🎉 SEED TERMINÉ AVEC SUCCÈS!\n");
  console.log("📊 Résumé:");
  console.log(`   - Langues: 2 (FR, EN)`);
  console.log(`   - Types de propriétés: ${propertyTypes.length}`);
  console.log(`   - Statuts de propriétés: ${propertyStatuses.length}`);
  console.log(`   - Pays: ${countries.length}`);
  console.log(`   - Plans d'abonnement: ${plans.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur durant le seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
