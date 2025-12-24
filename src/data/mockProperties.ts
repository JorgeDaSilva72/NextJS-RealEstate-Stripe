export interface Property {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: {
    city: string;
    country: string;
  };
  image: string;
  characteristics: {
    bedrooms: number;
    bathrooms: number;
    rooms: number;
    area: number;
    parking?: boolean;
    garden?: boolean;
    pool?: boolean;
  };
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Villa de Luxe avec Vue Ocean",
    price: 980000,
    location: {
      city: "Casablanca",
      country: "Maroc",
    },
    image: "/Hero1.jpg",
    characteristics: {
      bedrooms: 4,
      bathrooms: 5,
      rooms: 5,
      area: 350,
      parking: true,
      garden: true,
      pool: true,
    },
    description:
      "Magnifique villa moderne avec vue imprenable sur l'océan. Cette propriété exceptionnelle offre un cadre de vie luxueux avec toutes les commodités modernes.",
    coordinates: {
      lat: 33.5731,
      lng: -7.5898,
    },
  },
  {
    id: "2",
    title: "Appartement Moderne Centre-Ville",
    price: 550000,
    location: {
      city: "Rabat",
      country: "Maroc",
    },
    image: "/Hero2.jpg",
    characteristics: {
      bedrooms: 3,
      bathrooms: 2,
      rooms: 4,
      area: 120,
      parking: true,
    },
    description:
      "Appartement spacieux et lumineux au cœur de la ville, proche de tous les commerces et transports.",
    coordinates: {
      lat: 34.0209,
      lng: -6.8416,
    },
  },
  {
    id: "3",
    title: "Maison Familiale avec Jardin",
    price: 450000,
    location: {
      city: "Marrakech",
      country: "Maroc",
    },
    image: "/Hero3.jpg",
    characteristics: {
      bedrooms: 5,
      bathrooms: 3,
      rooms: 6,
      area: 280,
      parking: true,
      garden: true,
    },
    description:
      "Belle maison familiale avec grand jardin, idéale pour une famille nombreuse.",
    coordinates: {
      lat: 31.6295,
      lng: -7.9811,
    },
  },
  {
    id: "4",
    title: "Penthouse Vue Panoramique",
    price: 1200000,
    location: {
      city: "Tanger",
      country: "Maroc",
    },
    image: "/Hero4.jpg",
    characteristics: {
      bedrooms: 4,
      bathrooms: 4,
      rooms: 5,
      area: 400,
      parking: true,
      pool: true,
    },
    description:
      "Luxueux penthouse avec terrasse panoramique offrant une vue à 360° sur la ville et la mer.",
    coordinates: {
      lat: 35.7595,
      lng: -5.834,
    },
  },
  {
    id: "5",
    title: "Studio Moderne",
    price: 180000,
    location: {
      city: "Agadir",
      country: "Maroc",
    },
    image: "/Hero1.jpg",
    characteristics: {
      bedrooms: 1,
      bathrooms: 1,
      rooms: 1,
      area: 45,
    },
    description: "Studio moderne et fonctionnel, parfait pour un premier achat.",
    coordinates: {
      lat: 30.4278,
      lng: -9.5981,
    },
  },
  {
    id: "6",
    title: "Villa Prestige",
    price: 750000,
    location: {
      city: "Fès",
      country: "Maroc",
    },
    image: "/Hero2.jpg",
    characteristics: {
      bedrooms: 6,
      bathrooms: 4,
      rooms: 7,
      area: 450,
      parking: true,
      garden: true,
      pool: true,
    },
    description:
      "Villa de prestige avec piscine et jardin paysager, dans un quartier résidentiel calme.",
    coordinates: {
      lat: 34.0331,
      lng: -5.0003,
    },
  },
];














