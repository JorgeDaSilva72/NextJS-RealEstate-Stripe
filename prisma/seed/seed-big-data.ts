import { PrismaClient, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to get random element from array
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to get random number in range
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to get random float in range
function getRandomFloat(min: number, max: number, decimals: number = 6): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

// Property name templates
const propertyNameTemplates = {
  fr: {
    apartment: [
      "Appartement moderne T{rooms} - {neighborhood}",
      "Appartement lumineux F{rooms} - {neighborhood}",
      "Appartement de standing - {neighborhood}",
      "Appartement rénové T{rooms} - {neighborhood}",
      "Appartement avec balcon - {neighborhood}",
      "Appartement haut standing - {neighborhood}",
    ],
    house: [
      "Maison familiale {rooms} chambres - {neighborhood}",
      "Belle maison avec jardin - {neighborhood}",
      "Maison traditionnelle - {neighborhood}",
      "Maison moderne {rooms} chambres - {neighborhood}",
      "Maison de charme - {neighborhood}",
      "Maison spacieuse - {neighborhood}",
    ],
    villa: [
      "Villa de prestige - {neighborhood}",
      "Villa moderne avec piscine - {neighborhood}",
      "Villa de luxe {rooms} chambres - {neighborhood}",
      "Villa avec vue sur mer - {neighborhood}",
      "Villa contemporaine - {neighborhood}",
      "Villa d'exception - {neighborhood}",
    ],
    commercial: [
      "Local commercial - {neighborhood}",
      "Boutique en centre-ville - {neighborhood}",
      "Commerce de {area}m² - {neighborhood}",
      "Espace commercial - {neighborhood}",
    ],
    office: [
      "Bureau moderne - {neighborhood}",
      "Espace de bureaux {area}m² - {neighborhood}",
      "Bureau professionnel - {neighborhood}",
    ],
    land: [
      "Terrain constructible {area}m² - {neighborhood}",
      "Parcelle à bâtir - {neighborhood}",
      "Terrain viabilisé - {neighborhood}",
    ],
  },
  en: {
    apartment: [
      "Modern T{rooms} Apartment - {neighborhood}",
      "Bright F{rooms} Apartment - {neighborhood}",
      "Luxury Apartment - {neighborhood}",
      "Renovated T{rooms} Apartment - {neighborhood}",
      "Apartment with Balcony - {neighborhood}",
      "High-end Apartment - {neighborhood}",
    ],
    house: [
      "Family House {rooms} Bedrooms - {neighborhood}",
      "Beautiful House with Garden - {neighborhood}",
      "Traditional House - {neighborhood}",
      "Modern House {rooms} Bedrooms - {neighborhood}",
      "Charming House - {neighborhood}",
      "Spacious House - {neighborhood}",
    ],
    villa: [
      "Prestigious Villa - {neighborhood}",
      "Modern Villa with Pool - {neighborhood}",
      "Luxury Villa {rooms} Bedrooms - {neighborhood}",
      "Villa with Sea View - {neighborhood}",
      "Contemporary Villa - {neighborhood}",
      "Exceptional Villa - {neighborhood}",
    ],
    commercial: [
      "Commercial Space - {neighborhood}",
      "Downtown Shop - {neighborhood}",
      "Commercial Space {area}m² - {neighborhood}",
      "Retail Space - {neighborhood}",
    ],
    office: [
      "Modern Office - {neighborhood}",
      "Office Space {area}m² - {neighborhood}",
      "Professional Office - {neighborhood}",
    ],
    land: [
      "Buildable Land {area}m² - {neighborhood}",
      "Building Plot - {neighborhood}",
      "Serviced Land - {neighborhood}",
    ],
  },
};

// Description templates
const descriptionTemplates = {
  fr: {
    apartment: [
      "Superbe appartement de {area}m² situé dans le quartier recherché de {neighborhood}. Cet appartement lumineux comprend {bedrooms} chambres, {bathrooms} salle(s) de bain, un salon spacieux, une cuisine équipée{balcony}. Proche de toutes commodités.",
      "Appartement moderne et fonctionnel de {area}m² dans {neighborhood}. Comprend {bedrooms} chambres, {bathrooms} salle(s) de bain, salon, cuisine équipée{balcony}. Résidence sécurisée avec parking.",
      "Magnifique appartement de standing de {area}m² situé à {neighborhood}. {bedrooms} chambres, {bathrooms} salle(s) de bain, grand salon, cuisine moderne{balcony}. Idéal pour une famille.",
    ],
    house: [
      "Belle maison familiale de {area}m² avec jardin, située dans le quartier calme de {neighborhood}. La maison comprend {bedrooms} chambres, {bathrooms} salle(s) de bain, un salon spacieux, une cuisine équipée{garden}. Parfaite pour une famille.",
      "Maison traditionnelle de {area}m² dans {neighborhood}. {bedrooms} chambres, {bathrooms} salle(s) de bain, salon, cuisine{garden}. Quartier résidentiel calme et sécurisé.",
      "Maison moderne de {area}m² avec jardin dans {neighborhood}. Comprend {bedrooms} chambres, {bathrooms} salle(s) de bain, grand salon, cuisine équipée{garden}. Idéale pour une famille nombreuse.",
    ],
    villa: [
      "Villa de prestige de {area}m² avec piscine, située dans le quartier exclusif de {neighborhood}. La villa comprend {bedrooms} chambres en suite, {bathrooms} salle(s) de bain, grand salon, cuisine moderne, bureau{garden}. Jardin paysager et piscine privée.",
      "Villa moderne de {area}m² avec vue sur mer dans {neighborhood}. {bedrooms} chambres en suite, {bathrooms} salle(s) de bain, salon panoramique, cuisine haut de gamme{garden}. Piscine et jardin tropical.",
      "Villa d'exception de {area}m² dans {neighborhood}. {bedrooms} chambres, {bathrooms} salle(s) de bain, grand salon, cuisine équipée{garden}. Piscine à débordement et jardin paysager. Sécurité 24h/24.",
    ],
    commercial: [
      "Local commercial de {area}m² situé dans {neighborhood}. Idéal pour commerce, restaurant, ou bureau. Emplacement stratégique avec forte affluence. Parking disponible.",
      "Espace commercial de {area}m² dans le quartier commerçant de {neighborhood}. Vitrine sur rue, idéal pour boutique ou commerce. Emplacement de choix.",
    ],
    office: [
      "Bureau moderne de {area}m² dans {neighborhood}. Espace professionnel avec bureaux, salle de réunion, réception. Idéal pour entreprise ou cabinet. Parking disponible.",
      "Espace de bureaux de {area}m² situé à {neighborhood}. Bureau équipé, salle de réunion, espace réception. Emplacement professionnel de qualité.",
    ],
    land: [
      "Terrain constructible de {area}m² situé dans {neighborhood}. Terrain viabilisé, idéal pour construction de maison ou villa. Emplacement calme et résidentiel.",
      "Parcelle à bâtir de {area}m² dans {neighborhood}. Terrain plat, viabilisé, avec toutes les commodités. Parfait pour votre projet de construction.",
    ],
  },
  en: {
    apartment: [
      "Superb apartment of {area}m² located in the sought-after {neighborhood} district. This bright apartment includes {bedrooms} bedrooms, {bathrooms} bathroom(s), a spacious living room, an equipped kitchen{balcony}. Close to all amenities.",
      "Modern and functional apartment of {area}m² in {neighborhood}. Includes {bedrooms} bedrooms, {bathrooms} bathroom(s), living room, equipped kitchen{balcony}. Secured residence with parking.",
      "Magnificent luxury apartment of {area}m² located in {neighborhood}. {bedrooms} bedrooms, {bathrooms} bathroom(s), large living room, modern kitchen{balcony}. Ideal for a family.",
    ],
    house: [
      "Beautiful family house of {area}m² with garden, located in the quiet {neighborhood} district. The house includes {bedrooms} bedrooms, {bathrooms} bathroom(s), a spacious living room, an equipped kitchen{garden}. Perfect for a family.",
      "Traditional house of {area}m² in {neighborhood}. {bedrooms} bedrooms, {bathrooms} bathroom(s), living room, kitchen{garden}. Quiet and secure residential neighborhood.",
      "Modern house of {area}m² with garden in {neighborhood}. Includes {bedrooms} bedrooms, {bathrooms} bathroom(s), large living room, equipped kitchen{garden}. Ideal for a large family.",
    ],
    villa: [
      "Prestigious villa of {area}m² with pool, located in the exclusive {neighborhood} district. The villa includes {bedrooms} en-suite bedrooms, {bathrooms} bathroom(s), large living room, modern kitchen, office{garden}. Landscaped garden and private pool.",
      "Modern villa of {area}m² with sea view in {neighborhood}. {bedrooms} en-suite bedrooms, {bathrooms} bathroom(s), panoramic living room, high-end kitchen{garden}. Pool and tropical garden.",
      "Exceptional villa of {area}m² in {neighborhood}. {bedrooms} bedrooms, {bathrooms} bathroom(s), large living room, equipped kitchen{garden}. Infinity pool and landscaped garden. 24/7 security.",
    ],
    commercial: [
      "Commercial space of {area}m² located in {neighborhood}. Ideal for shop, restaurant, or office. Strategic location with high foot traffic. Parking available.",
      "Commercial space of {area}m² in the commercial district of {neighborhood}. Street frontage, ideal for shop or business. Prime location.",
    ],
    office: [
      "Modern office of {area}m² in {neighborhood}. Professional space with offices, meeting room, reception. Ideal for company or firm. Parking available.",
      "Office space of {area}m² located in {neighborhood}. Equipped office, meeting room, reception area. Quality professional location.",
    ],
    land: [
      "Buildable land of {area}m² located in {neighborhood}. Serviced land, ideal for house or villa construction. Quiet and residential location.",
      "Building plot of {area}m² in {neighborhood}. Flat land, serviced, with all amenities. Perfect for your construction project.",
    ],
  },
};

// Neighborhood names by country
const neighborhoods: Record<string, string[]> = {
  SN: ["Almadies", "Mermoz", "Fann", "Point E", "Ouakam", "Yoff", "Plateau", "Sicap", "Liberté", "Grand Dakar"],
  CI: ["Cocody", "Riviera", "Marcory", "Yopougon", "Abobo", "Plateau", "Adjamé", "Koumassi", "Treichville", "Angré"],
  MA: ["Agdal", "Hay Riad", "Souissi", "Maârif", "Ain Diab", "Anfa", "Oasis", "Hay Mohammadi", "Ain Sebaâ", "Sidi Maarouf"],
  DZ: ["Hydra", "El Biar", "Bologhine", "Bab El Oued", "Casbah", "Belcourt", "Kouba", "Birkhadem", "Dely Ibrahim", "Bouzaréah"],
  TN: ["Lac", "Belvédère", "Carthage", "Sidi Bou Said", "La Marsa", "Ariana", "Menzah", "El Manar", "Ennasr", "Mutuelleville"],
  EG: ["Zamalek", "Maadi", "Heliopolis", "New Cairo", "6th October", "Nasr City", "Dokki", "Giza", "Shubra", "Mokattam"],
  NG: ["Victoria Island", "Ikoyi", "Lekki", "Banana Island", "Garki", "Wuse", "Maitama", "Asokoro", "Jabi", "Utako"],
  ZA: ["Sandton", "Rosebank", "Melrose", "Parkhurst", "Greenside", "Houghton", "Illovo", "Hyde Park", "Bryanston", "Fourways"],
  KE: ["Westlands", "Karen", "Lavington", "Kilimani", "Kileleshwa", "Runda", "Muthaiga", "Parklands", "Riverside", "Loresho"],
};

// Street address templates
const streetTemplates = [
  "Rue {number}",
  "Avenue {number}",
  "Boulevard {number}",
  "Route {number}",
  "Impasse {number}",
  "Villa {number}",
  "Résidence {name}",
  "Appartement {number}",
];

// First names and last names for contacts
const firstNames = ["Amadou", "Fatima", "Moussa", "Aissatou", "Ibrahima", "Mariama", "Ousmane", "Aminata", "Boubacar", "Kadiatou", "Sékou", "Awa", "Mohamed", "Ndeye", "Cheikh", "Rokhaya", "Mamadou", "Aicha", "Abdoulaye", "Aissata"];
const lastNames = ["Diallo", "Traoré", "Koné", "Ba", "Ndiaye", "Sall", "Diop", "Fall", "Sy", "Kane", "Gueye", "Thiam", "Cissé", "Sow", "Niang", "Seck", "Mbaye", "Faye", "Diouf", "Camara"];

// Unsplash image IDs for different property types
const unsplashImageIds = [
  // Houses/Villas
  "1568605114967-8130f3a36994", "156401379991-4e8cba197a45", "1568605114967-8130f3a36994",
  "1560448204-e02f11c3d0e2", "1560448075-8740d4ea9c21", "156401379991-4e8cba197a45",
  // Apartments/Interiors
  "1522708323590-d24dbb6b0267", "1484154218962-a197022b5858", "1502672260266-1c1ef2d93688",
  "1556912173-46c336c7fd55", "1616594039964-ae9021a400a0", "1552321554-5fefe8c9ef14",
  // Kitchens
  "1556912173-46c336c7fd55", "1556912172-58b3501b0b4b", "1556912172-58b3501b0b4c",
  // Bedrooms
  "1616594039964-ae9021a400a0", "1552321554-5fefe8c9ef14", "1560448204-e02f11c3d0e2",
  // Bathrooms
  "1552321554-5fefe8c9ef14", "1552321554-5fefe8c9ef15", "1552321554-5fefe8c9ef16",
  // Living rooms
  "1560448204-e02f11c3d0e2", "1484154218962-a197022b5858", "1502672260266-1c1ef2d93688",
  // Gardens/Pools
  "1600566753190-17f0baa2a6c3", "1600585154340-be6161a56a0c", "1600607687644-c7171b42498b",
  // Exteriors
  "1600585152915-d0bec72f2755", "1600607687920-4e2a09cf159d", "1600566753086-00f18fb6b3ea",
];

function getRandomImageUrl(): string {
  const width = 800;
  const imageId = getRandomElement(unsplashImageIds);
  return `https://images.unsplash.com/photo-${imageId}?w=${width}&q=80`;
}

// Generate realistic property data
function generatePropertyData(
  propertyType: any,
  status: any,
  country: any,
  city: any,
  user: any,
  index: number
) {
  const typeCode = propertyType.code;
  const isRent = status.code === "for_rent";
  const neighborhood = getRandomElement(neighborhoods[country.code] || neighborhoods["SN"]);
  
  // Generate features based on property type
  let bedrooms = 1;
  let bathrooms = 1;
  let area = 50;
  let parkingSpots = 0;
  let hasSwimmingPool = false;
  let hasGardenYard = false;
  let hasBalcony = false;
  let floor: number | null = null;
  let totalFloors: number | null = null;
  let yearBuilt: number | null = null;

  switch (typeCode) {
    case "apartment":
      bedrooms = getRandomInt(1, 4);
      bathrooms = getRandomInt(1, 3);
      area = getRandomInt(40, 150);
      parkingSpots = getRandomInt(0, 2);
      hasBalcony = Math.random() > 0.3;
      floor = getRandomInt(0, 10);
      totalFloors = getRandomInt(3, 15);
      yearBuilt = getRandomInt(1990, 2024);
      break;
    case "house":
      bedrooms = getRandomInt(2, 6);
      bathrooms = getRandomInt(1, 4);
      area = getRandomInt(80, 300);
      parkingSpots = getRandomInt(1, 3);
      hasGardenYard = Math.random() > 0.2;
      hasBalcony = Math.random() > 0.5;
      floor = 0;
      totalFloors = getRandomInt(1, 3);
      yearBuilt = getRandomInt(1980, 2024);
      break;
    case "villa":
      bedrooms = getRandomInt(3, 7);
      bathrooms = getRandomInt(2, 6);
      area = getRandomInt(200, 600);
      parkingSpots = getRandomInt(2, 5);
      hasSwimmingPool = Math.random() > 0.4;
      hasGardenYard = true;
      hasBalcony = true;
      floor = 0;
      totalFloors = getRandomInt(1, 3);
      yearBuilt = getRandomInt(2000, 2024);
      break;
    case "commercial":
      bedrooms = 0;
      bathrooms = getRandomInt(1, 2);
      area = getRandomInt(30, 500);
      parkingSpots = getRandomInt(0, 5);
      yearBuilt = getRandomInt(1990, 2024);
      break;
    case "office":
      bedrooms = 0;
      bathrooms = getRandomInt(1, 3);
      area = getRandomInt(50, 300);
      parkingSpots = getRandomInt(1, 10);
      floor = getRandomInt(1, 10);
      totalFloors = getRandomInt(3, 20);
      yearBuilt = getRandomInt(2000, 2024);
      break;
    case "land":
      bedrooms = 0;
      bathrooms = 0;
      area = getRandomInt(200, 5000);
      parkingSpots = 0;
      break;
    default:
      bedrooms = getRandomInt(1, 4);
      bathrooms = getRandomInt(1, 2);
      area = getRandomInt(50, 200);
      parkingSpots = getRandomInt(0, 2);
  }

  // Generate price based on type, status, and area
  let price = 0;
  if (typeCode === "land") {
    price = isRent ? getRandomInt(50000, 500000) : getRandomInt(5000000, 50000000);
  } else if (typeCode === "commercial" || typeCode === "office") {
    price = isRent ? getRandomInt(100000, 2000000) : getRandomInt(10000000, 200000000);
  } else {
    const pricePerSqm = isRent 
      ? getRandomInt(3000, 15000) 
      : (typeCode === "villa" ? getRandomInt(500000, 2000000) : getRandomInt(200000, 800000));
    price = area * pricePerSqm;
    if (typeCode === "villa" && !isRent) {
      price = getRandomInt(50000000, 500000000);
    }
  }

  // Adjust price based on country currency (rough estimates)
  if (country.currency === "MAD") {
    price = Math.floor(price * 0.15); // Convert to MAD
  } else if (country.currency === "XOF") {
    // Keep as is for XOF
  } else if (country.currency === "DZD") {
    price = Math.floor(price * 0.006); // Convert to DZD
  }

  // Generate name
  const nameTemplate = getRandomElement(propertyNameTemplates.fr[typeCode as keyof typeof propertyNameTemplates.fr] || propertyNameTemplates.fr.apartment);
  const nameFr = nameTemplate
    .replace("{rooms}", bedrooms.toString())
    .replace("{neighborhood}", neighborhood)
    .replace("{area}", area.toString());
  
  const nameEnTemplate = getRandomElement(propertyNameTemplates.en[typeCode as keyof typeof propertyNameTemplates.en] || propertyNameTemplates.en.apartment);
  const nameEn = nameEnTemplate
    .replace("{rooms}", bedrooms.toString())
    .replace("{neighborhood}", neighborhood)
    .replace("{area}", area.toString());

  // Generate description
  const descTemplate = getRandomElement(descriptionTemplates.fr[typeCode as keyof typeof descriptionTemplates.fr] || descriptionTemplates.fr.apartment);
  const balconyText = hasBalcony ? ", balcon" : "";
  const gardenText = hasGardenYard ? ", jardin" : "";
  const descFr = descTemplate
    .replace(/{area}/g, area.toString())
    .replace(/{neighborhood}/g, neighborhood)
    .replace(/{bedrooms}/g, bedrooms.toString())
    .replace(/{bathrooms}/g, bathrooms.toString())
    .replace(/{balcony}/g, balconyText)
    .replace(/{garden}/g, gardenText);

  const descEnTemplate = getRandomElement(descriptionTemplates.en[typeCode as keyof typeof descriptionTemplates.en] || descriptionTemplates.en.apartment);
  const descEn = descEnTemplate
    .replace(/{area}/g, area.toString())
    .replace(/{neighborhood}/g, neighborhood)
    .replace(/{bedrooms}/g, bedrooms.toString())
    .replace(/{bathrooms}/g, bathrooms.toString())
    .replace(/{balcony}/g, balconyText)
    .replace(/{garden}/g, gardenText);

  // Generate location
  const streetTemplate = getRandomElement(streetTemplates);
  const streetNumber = getRandomInt(1, 200);
  const streetName = streetTemplate
    .replace("{number}", streetNumber.toString())
    .replace("{name}", ["Les Palmiers", "Les Roses", "Les Jasmins", "Le Soleil", "La Paix"][Math.floor(Math.random() * 5)]);

  // Get city coordinates and add small random offset
  const cityLat = city.latitude ? parseFloat(city.latitude.toString()) : (country.latitude ? parseFloat(country.latitude.toString()) : 14.7167);
  const cityLng = city.longitude ? parseFloat(city.longitude.toString()) : (country.longitude ? parseFloat(country.longitude.toString()) : -17.4677);
  
  const latitude = getRandomFloat(cityLat - 0.1, cityLat + 0.1);
  const longitude = getRandomFloat(cityLng - 0.1, cityLng + 0.1);

  // Generate contact
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const phonePrefix = country.phonePrefix || "+221";
  const phone = `${phonePrefix} ${getRandomInt(10, 99)} ${getRandomInt(100, 999)} ${getRandomInt(10, 99)} ${getRandomInt(10, 99)}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;

  // Generate published date (within last 90 days)
  const daysAgo = getRandomInt(0, 90);
  const publishedAt = new Date();
  publishedAt.setDate(publishedAt.getDate() - daysAgo);

  // Generate images (3-8 images per property)
  const imageCount = getRandomInt(3, 8);
  const images = Array.from({ length: imageCount }, (_, i) => ({
    url: getRandomImageUrl(),
    isMain: i === 0,
    displayOrder: i,
  }));

  // Random featured status (20% chance)
  const isFeatured = Math.random() < 0.2;

  // Random view count
  const viewCount = getRandomInt(0, 500);

  return {
    name: { fr: nameFr, en: nameEn },
    description: { fr: descFr, en: descEn },
    price,
    currency: country.currency,
    userId: user.id,
    typeId: propertyType.id,
    statusId: status.id,
    countryId: country.id,
    isActive: true,
    isFeatured,
    viewCount,
    publishedAt,
    location: {
      create: {
        streetAddress: streetName,
        cityId: city.id,
        neighborhood,
        zip: getRandomInt(10000, 99999).toString(),
        latitude,
        longitude,
        landmark: {
          fr: `Près de ${getRandomElement(["l'école", "le marché", "la mosquée", "l'hôpital", "le centre commercial", "la gare"])}`,
          en: `Near ${getRandomElement(["the school", "the market", "the mosque", "the hospital", "the shopping center", "the station"])}`,
        },
      },
    },
    feature: {
      create: {
        bedrooms,
        bathrooms,
        parkingSpots,
        area,
        hasSwimmingPool,
        hasGardenYard,
        hasBalcony,
        floor,
        totalFloors,
        yearBuilt,
      },
    },
    images: {
      create: images,
    },
    contact: {
      create: {
        name: `${firstName} ${lastName}`,
        phone,
        email,
      },
    },
  };
}

async function main() {
  console.log("🌱 Début du seeding de grandes données de propriétés...");

  // ============================================
  // 1. RÉCUPÉRER LES DONNÉES DE RÉFÉRENCE
  // ============================================

  const languages = await prisma.language.findMany();
  const frenchLang = languages.find((l) => l.code === "fr");
  const englishLang = languages.find((l) => l.code === "en");

  if (!frenchLang || !englishLang) {
    throw new Error(
      "Les langues 'fr' et 'en' doivent être populées. Exécutez d'abord: npm run db:seed:ref"
    );
  }

  // Récupérer tous les pays actifs
  const countries = await prisma.country.findMany({
    where: { isActive: true },
    include: {
      cities: {
        take: 20, // Prendre jusqu'à 20 villes par pays
      },
    },
  });

  if (countries.length === 0) {
    throw new Error("Aucun pays trouvé. Exécutez d'abord: npm run db:seed:ref");
  }

  // Récupérer tous les types de propriétés
  const propertyTypes = await prisma.propertyType.findMany();

  if (propertyTypes.length === 0) {
    throw new Error("Aucun type de propriété trouvé. Exécutez d'abord: npm run db:seed:ref");
  }

  // Récupérer tous les statuts
  const propertyStatuses = await prisma.propertyStatus.findMany();

  if (propertyStatuses.length === 0) {
    throw new Error("Aucun statut de propriété trouvé. Exécutez d'abord: npm run db:seed:ref");
  }

  // Récupérer ou créer des utilisateurs (créer 20 utilisateurs)
  const userCount = 20;
  const users = await Promise.all(
    Array.from({ length: userCount }, (_, i) =>
      prisma.user.upsert({
        where: { id: `user_seed_${i + 1}` },
        update: {},
        create: {
          id: `user_seed_${i + 1}`,
          firstname: getRandomElement(firstNames),
          lastname: getRandomElement(lastNames),
          email: `user${i + 1}@example.com`,
          avatarUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
        },
      })
    )
  );

  console.log(`✅ ${users.length} utilisateurs créés/récupérés`);

  // Récupérer les plans d'abonnement pour créer des abonnements actifs
  const subscriptionPlans = await prisma.subscriptionPlan.findMany();
  const planBronze = subscriptionPlans.find((p) => p.namePlan === "Bronze");
  
  if (planBronze) {
    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    // Créer des abonnements actifs pour tous les utilisateurs
    await Promise.all(
      users.map((user, i) =>
        prisma.subscriptions.upsert({
          where: { paymentID: `sub_user_${i + 1}` },
          update: {},
          create: {
            userId: user.id,
            planId: planBronze.id,
            paymentID: `sub_user_${i + 1}`,
            status: SubscriptionStatus.ACTIVE,
            startDate: today,
            endDate: nextYear,
          },
        })
      )
    );
    console.log(`✅ Abonnements créés pour ${users.length} utilisateurs`);
  }

  // ============================================
  // 2. NETTOYER LES PROPRIÉTÉS EXISTANTES (OPTIONNEL)
  // ============================================

  console.log("🧹 Nettoyage des propriétés existantes...");
  await prisma.propertyImage.deleteMany();
  await prisma.propertyVideo.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.propertyFeature.deleteMany();
  await prisma.propertyLocation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.property.deleteMany();
  console.log("✅ Propriétés existantes supprimées");

  // ============================================
  // 3. GÉNÉRER ET CRÉER LES PROPRIÉTÉS
  // ============================================

  const totalProperties = 200; // Nombre total de propriétés à créer
  const batchSize = 10; // Créer par lots de 10

  console.log(`\n🏗️  Création de ${totalProperties} propriétés...`);

  let createdCount = 0;

  for (let i = 0; i < totalProperties; i += batchSize) {
    const batch = [];
    const currentBatchSize = Math.min(batchSize, totalProperties - i);

    for (let j = 0; j < currentBatchSize; j++) {
      const index = i + j;
      
      // Sélectionner aléatoirement les données de référence
      const country = getRandomElement(countries);
      const cities = country.cities || [];
      const city = cities.length > 0 
        ? getRandomElement(cities)
        : await prisma.city.findFirst({ where: { countryId: country.id } });
      
      if (!city) {
        console.warn(`⚠️  Aucune ville trouvée pour le pays ${country.code}, passage au suivant...`);
        continue;
      }

      const propertyType = getRandomElement(propertyTypes);
      const status = getRandomElement(propertyStatuses);
      const user = getRandomElement(users);

      const propertyData = generatePropertyData(
        propertyType,
        status,
        country,
        city,
        user,
        index
      );

      batch.push(
        prisma.property.create({
          data: propertyData,
        })
      );
    }

    if (batch.length > 0) {
      await Promise.all(batch);
      createdCount += batch.length;
      console.log(`   ✅ ${createdCount}/${totalProperties} propriétés créées...`);
    }
  }

  // ============================================
  // 4. STATISTIQUES FINALES
  // ============================================

  const finalPropertyCount = await prisma.property.count();
  const finalImageCount = await prisma.propertyImage.count();
  const finalUserCount = await prisma.user.count();
  const forSaleCount = await prisma.property.count({
    where: {
      status: {
        code: "for_sale",
      },
    },
  });
  const forRentCount = await prisma.property.count({
    where: {
      status: {
        code: "for_rent",
      },
    },
  });

  console.log("\n🎉 Seeding terminé avec succès !");
  console.log(`📊 Statistiques :`);
  console.log(`   - ${finalUserCount} utilisateurs`);
  console.log(`   - ${finalPropertyCount} propriétés`);
  console.log(`   - ${forSaleCount} propriétés à vendre`);
  console.log(`   - ${forRentCount} propriétés à louer`);
  console.log(`   - ${finalImageCount} images`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

