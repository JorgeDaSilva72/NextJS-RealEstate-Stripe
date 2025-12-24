import { PrismaClient, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding des propriétés...");

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

  // Récupérer les plans d'abonnement
  const subscriptionPlans = await prisma.subscriptionPlan.findMany();
  const planDiamant = subscriptionPlans.find((p) => p.namePlan === "Diamant");
  const planOr = subscriptionPlans.find((p) => p.namePlan === "Or");
  const planBronze = subscriptionPlans.find((p) => p.namePlan === "Bronze");

  if (!planDiamant || !planOr || !planBronze) {
    throw new Error(
      "Plans d'abonnement non trouvés. Exécutez d'abord: npm run db:seed:ref"
    );
  }

  // Récupérer les pays
  const senegal = await prisma.country.findUnique({ where: { code: "SN" } });
  const coteDivoire = await prisma.country.findUnique({
    where: { code: "CI" },
  });
  const maroc = await prisma.country.findUnique({ where: { code: "MA" } });

  if (!senegal || !coteDivoire || !maroc) {
    throw new Error(
      "Pays non trouvés. Exécutez d'abord: npm run db:seed:ref"
    );
  }

  // Récupérer les types de propriétés
  const propertyTypes = await prisma.propertyType.findMany({
    include: {
      translations: {
        where: { languageId: frenchLang.id },
      },
    },
  });

  const appartementType = propertyTypes.find(
    (pt) =>
      pt.code === "apartment" ||
      pt.translations.some((t) => t.value.toLowerCase().includes("appartement"))
  );

  const villaType = propertyTypes.find(
    (pt) =>
      pt.code === "villa" ||
      pt.translations.some((t) => t.value.toLowerCase().includes("villa"))
  );

  const maisonType = propertyTypes.find(
    (pt) =>
      pt.code === "house" ||
      pt.translations.some((t) => t.value.toLowerCase().includes("maison"))
  );

  if (!appartementType || !villaType || !maisonType) {
    throw new Error(
      "Types de propriétés non trouvés. Exécutez d'abord: npm run db:seed:ref"
    );
  }

  // Récupérer les statuts
  const propertyStatuses = await prisma.propertyStatus.findMany({
    include: {
      translations: {
        where: { languageId: frenchLang.id },
      },
    },
  });

  const forSaleStatus = propertyStatuses.find(
    (ps) =>
      ps.code === "for_sale" ||
      ps.translations.some((t) => t.value.toLowerCase().includes("vendre"))
  );

  const forRentStatus = propertyStatuses.find(
    (ps) =>
      ps.code === "for_rent" ||
      ps.translations.some((t) => t.value.toLowerCase().includes("louer"))
  );

  if (!forSaleStatus || !forRentStatus) {
    throw new Error(
      "Statuts de propriétés non trouvés. Exécutez d'abord: npm run db:seed:ref"
    );
  }

  // Récupérer les villes
  const dakar = await prisma.city.findFirst({
    where: {
      countryId: senegal.id,
      translations: {
        some: {
          name: "Dakar",
        },
      },
    },
  });

  const abidjan = await prisma.city.findFirst({
    where: {
      countryId: coteDivoire.id,
      translations: {
        some: {
          name: "Abidjan",
        },
      },
    },
  });

  const rabat = await prisma.city.findFirst({
    where: {
      countryId: maroc.id,
      translations: {
        some: {
          name: "Rabat",
        },
      },
    },
  });

  if (!dakar || !abidjan || !rabat) {
    throw new Error(
      "Villes non trouvées. Exécutez d'abord: npm run db:seed:ref"
    );
  }

  console.log("✅ Données de référence récupérées");

  // ============================================
  // 2. CRÉER OU RÉCUPÉRER DES UTILISATEURS
  // ============================================

  const users = await Promise.all([
    prisma.user.upsert({
      where: { id: "user_1_seed" },
      update: {},
      create: {
        id: "user_1_seed",
        firstname: "Amadou",
        lastname: "Diallo",
        email: "amadou.diallo@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
      },
    }),
    prisma.user.upsert({
      where: { id: "user_2_seed" },
      update: {},
      create: {
        id: "user_2_seed",
        firstname: "Fatima",
        lastname: "Traoré",
        email: "fatima.traore@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=45",
      },
    }),
    prisma.user.upsert({
      where: { id: "user_3_seed" },
      update: {},
      create: {
        id: "user_3_seed",
        firstname: "Moussa",
        lastname: "Koné",
        email: "moussa.kone@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=33",
      },
    }),
  ]);

  console.log("✅ Utilisateurs créés/récupérés");

  // ============================================
  // 3. CRÉER LES ABONNEMENTS ACTIFS
  // ============================================

  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  await Promise.all([
    prisma.subscriptions.upsert({
      where: { paymentID: "sub_amadou_diamant" },
      update: {},
      create: {
        userId: users[0].id,
        planId: planDiamant.id,
        paymentID: "sub_amadou_diamant",
        status: SubscriptionStatus.ACTIVE,
        startDate: today,
        endDate: nextYear,
      },
    }),
    prisma.subscriptions.upsert({
      where: { paymentID: "sub_fatima_or" },
      update: {},
      create: {
        userId: users[1].id,
        planId: planOr.id,
        paymentID: "sub_fatima_or",
        status: SubscriptionStatus.ACTIVE,
        startDate: today,
        endDate: nextYear,
      },
    }),
    prisma.subscriptions.upsert({
      where: { paymentID: "sub_moussa_bronze" },
      update: {},
      create: {
        userId: users[2].id,
        planId: planBronze.id,
        paymentID: "sub_moussa_bronze",
        status: SubscriptionStatus.ACTIVE,
        startDate: today,
        endDate: nextYear,
      },
    }),
  ]);

  console.log("✅ Abonnements créés");

  // ============================================
  // 4. NETTOYER LES PROPRIÉTÉS EXISTANTES (OPTIONNEL)
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
  // 5. CRÉER LES PROPRIÉTÉS
  // ============================================

  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // PROPRIÉTÉ 1: Villa de luxe à Dakar (À vendre)
  const property1 = await prisma.property.create({
    data: {
      name: {
        fr: "Villa moderne avec vue sur l'océan - Almadies",
        en: "Modern villa with ocean view - Almadies",
      },
      description: {
        fr: `Magnifique villa contemporaine située dans le quartier prisé des Almadies à Dakar. Cette propriété d'exception offre une vue imprenable sur l'océan Atlantique. La villa dispose d'espaces de vie spacieux et lumineux, avec une cuisine équipée haut de gamme, un salon ouvert sur une terrasse panoramique, et 5 chambres en suite.`,
        en: `Magnificent contemporary villa located in the sought-after Almadies district of Dakar. This exceptional property offers a breathtaking view of the Atlantic Ocean. The villa features spacious and bright living areas, with a high-end equipped kitchen and 5 en-suite bedrooms.`,
      },
      price: 450000000, // 450 millions FCFA
      currency: senegal.currency,
      userId: users[0].id,
      typeId: villaType.id,
      statusId: forSaleStatus.id,
      countryId: senegal.id,
      publishedAt: oneWeekAgo,
      isActive: true,
      isFeatured: true,
      location: {
        create: {
          streetAddress: "15 Avenue Cheikh Anta Diop",
          cityId: dakar.id,
          neighborhood: "Almadies",
          zip: "12500",
          latitude: 14.7167,
          longitude: -17.4677,
          landmark: {
            fr: "Près de l'hôtel Radisson Blu",
            en: "Near the Radisson Blu hotel",
          },
        },
      },
      feature: {
        create: {
          bedrooms: 5,
          bathrooms: 6,
          parkingSpots: 3,
          area: 450,
          hasSwimmingPool: true,
          hasGardenYard: true,
          hasBalcony: true,
          floor: 0,
          totalFloors: 1,
          yearBuilt: 2020,
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
            isMain: true,
          },
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
            isMain: false,
          },
        ],
      },
      contact: {
        create: {
          name: "Amadou Diallo",
          phone: "+221 77 123 45 67",
          email: "amadou.diallo@example.com",
        },
      },
    },
  });

  console.log("✅ Propriété 1 créée : Villa Dakar");

  // PROPRIÉTÉ 2: Appartement à Abidjan (À louer)
  const property2 = await prisma.property.create({
    data: {
      name: {
        fr: "Appartement standing F4 - Cocody Riviera",
        en: "Luxury F4 Apartment - Cocody Riviera",
      },
      description: {
        fr: `Superbe appartement de standing de 120m² situé au cœur de Cocody Riviera, dans une résidence sécurisée récente. Cet appartement lumineux comprend un grand salon-salle à manger avec balcon, une cuisine américaine, 3 chambres, et 2 salles de bain modernes.`,
        en: `Superb luxury apartment of 120m² located in the heart of Cocody Riviera, in a recent secured residence. This bright apartment includes a large living-dining room with a balcony, an open-plan kitchen, 3 spacious bedrooms, and 2 modern bathrooms.`,
      },
      price: 600000, // 600 000 FCFA/mois
      currency: coteDivoire.currency,
      userId: users[1].id,
      typeId: appartementType.id,
      statusId: forRentStatus.id,
      countryId: coteDivoire.id,
      publishedAt: twoDaysAgo,
      isActive: true,
      isFeatured: false,
      location: {
        create: {
          streetAddress: "Résidence Les Palmiers, Bloc C, 3ème étage",
          cityId: abidjan.id,
          neighborhood: "Cocody Riviera",
          zip: "01 BP 1234",
          latitude: 5.3599,
          longitude: -4.0083,
          landmark: {
            fr: "Derrière la pharmacie Sainte Marie",
            en: "Behind Saint Marie pharmacy",
          },
        },
      },
      feature: {
        create: {
          bedrooms: 3,
          bathrooms: 2,
          parkingSpots: 1,
          area: 120,
          hasSwimmingPool: false,
          hasGardenYard: false,
          hasBalcony: true,
          floor: 3,
          totalFloors: 5,
          yearBuilt: 2018,
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            isMain: true,
          },
          {
            url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            isMain: false,
          },
        ],
      },
      contact: {
        create: {
          name: "Fatima Traoré",
          phone: "+225 07 12 34 56 78",
          email: "fatima.traore@example.com",
        },
      },
    },
  });

  console.log("✅ Propriété 2 créée : Appartement Abidjan");

  // PROPRIÉTÉ 3: Maison à Rabat (À vendre) - Utilise Rabat car Casablanca n'existe pas dans le seed
  const property3 = await prisma.property.create({
    data: {
      name: {
        fr: "Maison familiale avec jardin - Rabat",
        en: "Family house with garden - Rabat",
      },
      description: {
        fr: `Belle maison familiale de 200m² avec jardin de 150m², située dans un quartier calme et résidentiel de Rabat. La maison comprend 4 chambres, 3 salles de bain, un salon spacieux, une cuisine équipée, et un garage pour 2 voitures. Idéale pour une famille.`,
        en: `Beautiful family house of 200m² with a 150m² garden, located in a quiet residential neighborhood of Rabat. The house includes 4 bedrooms, 3 bathrooms, a spacious living room, an equipped kitchen, and a garage for 2 cars. Ideal for a family.`,
      },
      price: 2500000, // 2.5 millions MAD
      currency: maroc.currency,
      userId: users[2].id,
      typeId: maisonType.id,
      statusId: forSaleStatus.id,
      countryId: maroc.id,
      publishedAt: oneMonthAgo,
      isActive: true,
      isFeatured: true,
      location: {
        create: {
          streetAddress: "45 Rue Mohammed V",
          cityId: rabat.id,
          neighborhood: "Agdal",
          zip: "10000",
          latitude: 34.0209,
          longitude: -6.8416,
          landmark: {
            fr: "Près de l'Université Mohammed V",
            en: "Near Mohammed V University",
          },
        },
      },
      feature: {
        create: {
          bedrooms: 4,
          bathrooms: 3,
          parkingSpots: 2,
          area: 200,
          hasSwimmingPool: false,
          hasGardenYard: true,
          hasBalcony: false,
          floor: 0,
          totalFloors: 2,
          yearBuilt: 2015,
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600585152915-d0bec72f2755?w=800",
            isMain: true,
          },
          {
            url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
            isMain: false,
          },
        ],
      },
      contact: {
        create: {
          name: "Moussa Koné",
          phone: "+212 6 12 34 56 78",
          email: "moussa.kone@example.com",
        },
      },
    },
  });

  console.log("✅ Propriété 3 créée : Maison Rabat");

  // PROPRIÉTÉ 4: Appartement à Rabat (À louer)
  const property4 = await prisma.property.create({
    data: {
      name: {
        fr: "Appartement moderne T3 - Rabat Agdal",
        en: "Modern T3 Apartment - Rabat Agdal",
      },
      description: {
        fr: `Appartement moderne et lumineux de 90m² situé dans le quartier Agdal à Rabat. Proche des universités et des commerces. L'appartement comprend 2 chambres, 1 salle de bain, un salon, une cuisine équipée, et un balcon avec vue.`,
        en: `Modern and bright apartment of 90m² located in the Agdal district of Rabat. Close to universities and shops. The apartment includes 2 bedrooms, 1 bathroom, a living room, an equipped kitchen, and a balcony with a view.`,
      },
      price: 4500, // 4500 MAD/mois
      currency: maroc.currency,
      userId: users[0].id,
      typeId: appartementType.id,
      statusId: forRentStatus.id,
      countryId: maroc.id,
      publishedAt: twoDaysAgo,
      isActive: true,
      isFeatured: false,
      location: {
        create: {
          streetAddress: "12 Avenue Allal Ben Abdellah",
          cityId: rabat.id,
          neighborhood: "Agdal",
          zip: "10000",
          latitude: 34.0133,
          longitude: -6.8533,
          landmark: {
            fr: "Près de l'Université Mohammed V",
            en: "Near Mohammed V University",
          },
        },
      },
      feature: {
        create: {
          bedrooms: 2,
          bathrooms: 1,
          parkingSpots: 1,
          area: 90,
          hasSwimmingPool: false,
          hasGardenYard: false,
          hasBalcony: true,
          floor: 4,
          totalFloors: 6,
          yearBuilt: 2019,
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
            isMain: true,
          },
          {
            url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            isMain: false,
          },
        ],
      },
      contact: {
        create: {
          name: "Amadou Diallo",
          phone: "+212 6 11 22 33 44",
          email: "amadou.diallo@example.com",
        },
      },
    },
  });

  console.log("✅ Propriété 4 créée : Appartement Rabat");

  // PROPRIÉTÉ 5: Villa à Dakar (À louer)
  const property5 = await prisma.property.create({
    data: {
      name: {
        fr: "Villa de prestige avec piscine - Mermoz",
        en: "Prestigious villa with pool - Mermoz",
      },
      description: {
        fr: `Villa de prestige de 350m² avec piscine privée, située dans le quartier résidentiel de Mermoz à Dakar. La villa comprend 4 chambres en suite, un grand salon, une cuisine moderne, un bureau, et un jardin paysager. Idéale pour une location haut de gamme.`,
        en: `Prestigious villa of 350m² with private pool, located in the residential district of Mermoz in Dakar. The villa includes 4 en-suite bedrooms, a large living room, a modern kitchen, an office, and a landscaped garden. Ideal for luxury rental.`,
      },
      price: 2500000, // 2.5 millions FCFA/mois
      currency: senegal.currency,
      userId: users[1].id,
      typeId: villaType.id,
      statusId: forRentStatus.id,
      countryId: senegal.id,
      publishedAt: oneWeekAgo,
      isActive: true,
      isFeatured: true,
      location: {
        create: {
          streetAddress: "Villa 23, Rue de la Corniche",
          cityId: dakar.id,
          neighborhood: "Mermoz",
          zip: "12500",
          latitude: 14.6928,
          longitude: -17.4467,
          landmark: {
            fr: "Près de l'ambassade de France",
            en: "Near the French Embassy",
          },
        },
      },
      feature: {
        create: {
          bedrooms: 4,
          bathrooms: 5,
          parkingSpots: 4,
          area: 350,
          hasSwimmingPool: true,
          hasGardenYard: true,
          hasBalcony: true,
          floor: 0,
          totalFloors: 2,
          yearBuilt: 2021,
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
            isMain: true,
          },
          {
            url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
            isMain: false,
          },
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
            isMain: false,
          },
        ],
      },
      contact: {
        create: {
          name: "Fatima Traoré",
          phone: "+221 77 987 65 43",
          email: "fatima.traore@example.com",
        },
      },
    },
  });

  console.log("✅ Propriété 5 créée : Villa Mermoz");

  // ============================================
  // 6. STATISTIQUES FINALES
  // ============================================

  const totalProperties = await prisma.property.count();
  const totalImages = await prisma.propertyImage.count();
  const totalUsers = await prisma.user.count();

  console.log("\n🎉 Seeding terminé avec succès !");
  console.log(`📊 Statistiques :`);
  console.log(`   - ${totalUsers} utilisateurs`);
  console.log(`   - ${totalProperties} propriétés`);
  console.log(`   - ${totalImages} images`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

