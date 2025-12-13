// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   console.log("🌱 Début du seeding...");

//   // ============================================
//   // 1. CRÉER DES UTILISATEURS
//   // ============================================

//   const users = await Promise.all([
//     prisma.user.upsert({
//       where: { id: "user_1_seed" },
//       update: {},
//       create: {
//         id: "user_1_seed",
//         firstName: "Amadou",
//         lastName: "Diallo",
//         email: "amadou.diallo@example.com",
//         avatarUrl: "https://i.pravatar.cc/150?img=12",
//       },
//     }),
//     prisma.user.upsert({
//       where: { id: "user_2_seed" },
//       update: {},
//       create: {
//         id: "user_2_seed",
//         firstName: "Fatima",
//         lastName: "Traoré",
//         email: "fatima.traore@example.com",
//         avatarUrl: "https://i.pravatar.cc/150?img=45",
//       },
//     }),
//     prisma.user.upsert({
//       where: { id: "user_3_seed" },
//       update: {},
//       create: {
//         id: "user_3_seed",
//         firstName: "Moussa",
//         lastName: "Koné",
//         email: "moussa.kone@example.com",
//         avatarUrl: "https://i.pravatar.cc/150?img=33",
//       },
//     }),
//   ]);

//   console.log("✅ Utilisateurs créés");

//   // ============================================
//   // 2. RÉCUPÉRER LES DONNÉES DE RÉFÉRENCE
//   // ============================================

//   // Récupérer les langues
//   const languages = await prisma.language.findMany();
//   const frenchLang = languages.find((l) => l.code === "fr");

//   if (!frenchLang) {
//     throw new Error(
//       "Langue française non trouvée. Assurez-vous que les langues sont déjà populées."
//     );
//   }

//   // Récupérer les pays (supposons Sénégal, Côte d'Ivoire, Maroc)
//   const senegal = await prisma.country.findUnique({ where: { code: "SN" } });
//   const coteDivoire = await prisma.country.findUnique({
//     where: { code: "CI" },
//   });
//   const maroc = await prisma.country.findUnique({ where: { code: "MA" } });

//   if (!senegal || !coteDivoire || !maroc) {
//     throw new Error(
//       "Pays non trouvés. Assurez-vous que les pays sont déjà populés."
//     );
//   }

//   // Récupérer les types de propriétés (Appartement, Villa, Maison)
//   const propertyTypes = await prisma.propertyType.findMany({
//     include: {
//       translations: {
//         where: { languageId: frenchLang.id },
//       },
//     },
//   });

//   const appartementType = propertyTypes.find(
//     (pt) =>
//       pt.code === "apartment" ||
//       pt.translations.some((t) => t.value.toLowerCase().includes("appartement"))
//   );

//   const villaType = propertyTypes.find(
//     (pt) =>
//       pt.code === "villa" ||
//       pt.translations.some((t) => t.value.toLowerCase().includes("villa"))
//   );

//   const maisonType = propertyTypes.find(
//     (pt) =>
//       pt.code === "house" ||
//       pt.translations.some((t) => t.value.toLowerCase().includes("maison"))
//   );

//   if (!appartementType || !villaType || !maisonType) {
//     throw new Error(
//       "Types de propriétés non trouvés. Assurez-vous qu'ils sont déjà populés."
//     );
//   }

//   // Récupérer les statuts (À vendre, À louer)
//   const propertyStatuses = await prisma.propertyStatus.findMany({
//     include: {
//       translations: {
//         where: { languageId: frenchLang.id },
//       },
//     },
//   });

//   const forSaleStatus = propertyStatuses.find(
//     (ps) =>
//       ps.code === "for_sale" ||
//       ps.translations.some((t) => t.value.toLowerCase().includes("vendre"))
//   );

//   const forRentStatus = propertyStatuses.find(
//     (ps) =>
//       ps.code === "for_rent" ||
//       ps.translations.some((t) => t.value.toLowerCase().includes("louer"))
//   );

//   if (!forSaleStatus || !forRentStatus) {
//     throw new Error(
//       "Statuts de propriétés non trouvés. Assurez-vous qu'ils sont déjà populés."
//     );
//   }

//   // Récupérer ou créer des villes
//   const dakar = await prisma.city.findFirst({
//     where: {
//       countryId: senegal.id,
//       translations: {
//         some: {
//           name: "Dakar",
//         },
//       },
//     },
//   });

//   const abidjan = await prisma.city.findFirst({
//     where: {
//       countryId: coteDivoire.id,
//       translations: {
//         some: {
//           name: "Abidjan",
//         },
//       },
//     },
//   });

//   const rabat = await prisma.city.findFirst({
//     where: {
//       countryId: maroc.id,
//       translations: {
//         some: {
//           name: "Rabat",
//         },
//       },
//     },
//   });

//   if (!dakar || !abidjan || !rabat) {
//     throw new Error(
//       "Villes non trouvées. Assurez-vous que les villes sont déjà populées."
//     );
//   }

//   console.log("✅ Données de référence récupérées");

//   // ============================================
//   // 3. CRÉER LES 3 ANNONCES IMMOBILIÈRES
//   // ============================================

//   // 🏠 ANNONCE 1 : Villa de luxe à Dakar
//   const property1 = await prisma.property.create({
//     data: {
//       name: "Villa moderne avec vue sur l'océan - Almadies",
//       description: `Magnifique villa contemporaine située dans le quartier prisé des Almadies à Dakar. Cette propriété d'exception offre une vue imprenable sur l'océan Atlantique.

// La villa dispose d'espaces de vie spacieux et lumineux, avec une cuisine équipée haut de gamme, un salon ouvert sur une terrasse panoramique, et 5 chambres en suite avec dressing.

// Le jardin paysager de 800m² comprend une piscine à débordement, un espace barbecue couvert et un jardin tropical. Sécurité 24h/24, garage pour 3 véhicules.

// Idéale pour une famille expatriée ou pour un investissement locatif haut de gamme.`,
//       price: 450000000, // 450 millions FCFA
//       //   currency: senegal.currency,
//       userId: users[0].id,
//       typeId: villaType.id,
//       statusId: forSaleStatus.id,
//       countryId: senegal.id,
//       //   isActive: true,
//       //   isFeatured: true,
//       //   viewCount: 247,
//       //   publishedAt: new Date(),

//       location: {
//         create: {
//           streetAddress: "15 Avenue Cheikh Anta Diop",
//           cityId: dakar.id,
//           neighborhood: "Almadies",
//           zip: "12500",
//           latitude: 14.7167,
//           longitude: -17.4677,
//           landmark: "Près de l'hôtel Radisson Blu",
//         },
//       },

//       feature: {
//         create: {
//           bedrooms: 5,
//           bathrooms: 6,
//           parkingSpots: 3,
//           area: 450, // m²
//           hasSwimmingPool: true,
//           hasGardenYard: true,
//           hasBalcony: true,
//         },
//       },

//       images: {
//         create: [
//           {
//             url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
//             // caption: 'Façade principale',
//             // displayOrder: 1,
//             // isMain: true
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
//             // caption: 'Salon avec vue sur la mer',
//             // displayOrder: 2,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
//             // caption: 'Cuisine moderne',
//             // displayOrder: 3,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
//             // caption: 'Piscine à débordement',
//             // displayOrder: 4,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
//             // caption: 'Chambre principale',
//             // displayOrder: 5,
//             // isMain: false
//           },
//         ],
//       },

//       videos: {
//         create: [
//           {
//             url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//             // title: 'Visite virtuelle complète',
//             // duration: 180
//           },
//         ],
//       },

//       contact: {
//         create: {
//           name: "Amadou Diallo",
//           phone: "+221 77 123 45 67",
//           email: "amadou.diallo@example.com",
//         },
//       },
//     },
//   });

//   console.log("✅ Annonce 1 créée : Villa Dakar");

//   // 🏢 ANNONCE 2 : Appartement moderne à Abidjan
//   const property2 = await prisma.property.create({
//     data: {
//       name: "Appartement standing F4 - Cocody Riviera",
//       description: `Superbe appartement de standing de 120m² situé au cœur de Cocody Riviera, dans une résidence sécurisée récente.

// Cet appartement lumineux comprend un grand salon-salle à manger avec balcon, une cuisine américaine entièrement équipée, 3 chambres spacieuses dont une suite parentale avec dressing, et 2 salles de bain modernes.

// La résidence offre : ascenseur, parking privé, gardiennage 24h/24, générateur électrique, et espaces verts communs.

// Proche de toutes commodités : supermarchés, écoles internationales, centres commerciaux et accès rapide au Plateau.

// Disponible immédiatement pour location longue durée.`,
//       price: 600000, // 600 000 FCFA/mois
//       //   currency: coteDivoire.currency,
//       userId: users[1].id,
//       typeId: appartementType.id,
//       statusId: forRentStatus.id,
//       countryId: coteDivoire.id,
//       //   isActive: true,
//       //   isFeatured: false,
//       //   viewCount: 89,
//       //   publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours

//       location: {
//         create: {
//           streetAddress: "Résidence Les Palmiers, Bloc C, 3ème étage",
//           cityId: abidjan.id,
//           neighborhood: "Cocody Riviera",
//           zip: "01 BP 1234",
//           latitude: 5.3599,
//           longitude: -4.0083,
//           landmark: "Derrière la pharmacie Sainte Marie",
//         },
//       },

//       feature: {
//         create: {
//           bedrooms: 3,
//           bathrooms: 2,
//           parkingSpots: 1,
//           area: 120,
//           hasSwimmingPool: false,
//           hasGardenYard: false,
//           hasBalcony: true,
//         },
//       },

//       images: {
//         create: [
//           {
//             url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
//             // caption: 'Vue du salon',
//             // displayOrder: 1,
//             // isMain: true
//           },
//           {
//             url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800",
//             // caption: 'Cuisine équipée',
//             // displayOrder: 2,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
//             // caption: 'Chambre principale',
//             // displayOrder: 3,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
//             // caption: 'Salle de bain moderne',
//             // displayOrder: 4,
//             // isMain: false
//           },
//         ],
//       },

//       contact: {
//         create: {
//           name: "Fatima Traoré",
//           phone: "+225 07 12 34 56 78",
//           email: "fatima.traore@example.com",
//         },
//       },
//     },
//   });

//   console.log("✅ Annonce 2 créée : Appartement Abidjan");

//   // 🏡 ANNONCE 3 : Maison familiale à Rabat
//   const property3 = await prisma.property.create({
//     data: {
//       name: "Belle maison traditionnelle - Quartier Anfa",
//       description: `Charmante maison traditionnelle marocaine de 280m² sur un terrain de 400m², idéalement située dans le quartier résidentiel d'Anfa.

// Cette propriété familiale offre des volumes généreux avec un salon marocain authentique, un salon européen, une salle à manger, et une cuisine traditionnelle.

// 4 chambres spacieuses à l'étage, dont 2 avec salle de bain privative. Patio intérieur avec fontaine et jardin arboré.

// Architecture typique avec zellige, boiseries sculptées et plafonds en stuc. Garage double et terrasse sur le toit avec vue sur la ville.

// Parfaite pour une famille recherchant l'authenticité dans un quartier calme et recherché de Casablanca.`,
//       price: 4500000, // 4,5 millions MAD
//       //   currency: maroc.currency,
//       userId: users[2].id,
//       typeId: maisonType.id,
//       statusId: forSaleStatus.id,
//       countryId: maroc.id,
//       //   isActive: true,
//       //   isFeatured: true,
//       //   viewCount: 156,
//       //   publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours

//       location: {
//         create: {
//           streetAddress: "42 Rue Mohamed Abdou",
//           cityId: rabat.id,
//           neighborhood: "Anfa",
//           zip: "20100",
//           latitude: 33.5892,
//           longitude: -7.6164,
//           landmark: "Proche du Lycée Lyautey",
//         },
//       },

//       feature: {
//         create: {
//           bedrooms: 4,
//           bathrooms: 3,
//           parkingSpots: 2,
//           area: 280,
//           hasSwimmingPool: false,
//           hasGardenYard: true,
//           hasBalcony: false,
//         },
//       },

//       images: {
//         create: [
//           {
//             url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
//             // caption: 'Façade traditionnelle',
//             // displayOrder: 1,
//             // isMain: true
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
//             // caption: 'Patio intérieur avec fontaine',
//             // displayOrder: 2,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800",
//             // caption: 'Salon marocain',
//             // displayOrder: 3,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
//             // caption: 'Cuisine traditionnelle',
//             // displayOrder: 4,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
//             // caption: 'Jardin arboré',
//             // displayOrder: 5,
//             // isMain: false
//           },
//           {
//             url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
//             // caption: 'Terrasse sur le toit',
//             // displayOrder: 6,
//             // isMain: false
//           },
//         ],
//       },

//       videos: {
//         create: [
//           {
//             url: "https://www.youtube.com/watch?v=example2",
//             // title: "Visite guidée de la maison",
//             // duration: 240,
//           },
//         ],
//       },

//       contact: {
//         create: {
//           name: "Moussa Koné",
//           phone: "+212 6 12 34 56 78",
//           email: "moussa.kone@example.com",
//         },
//       },
//     },
//   });

//   console.log("✅ Annonce 3 créée : Maison Casablanca");

//   // ============================================
//   // 4. STATISTIQUES FINALES
//   // ============================================

//   const totalProperties = await prisma.property.count();
//   const totalUsers = await prisma.user.count();

//   console.log("\n🎉 Seeding terminé avec succès !");
//   console.log(`📊 Statistiques :`);
//   console.log(`   - ${totalUsers} utilisateurs`);
//   console.log(`   - ${totalProperties} annonces immobilières`);
//   //   console.log(
//   //     `   - ${
//   //       property1.images.length +
//   //       property2.images.length +
//   //       property3.images.length
//   //     } images`
//   //   );
// }

// main()
//   .catch((e) => {
//     console.error("❌ Erreur lors du seeding :", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seeding des données de test...");

  // 0. NETTOYAGE (Optionnel mais recommandé pour les données de test)
  // Pour les données de test, il est souvent préférable de vider les tables dépendantes
  // pour ne pas avoir d'erreurs d'ID dupliqués, surtout si les users sont recréés.

  await prisma.subscriptions.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.propertyVideo.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.propertyFeature.deleteMany();
  await prisma.propertyLocation.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.googleAnalyticsToken.deleteMany(); // Nettoyage du token si présent
  await prisma.user.deleteMany(); // Nettoyage des utilisateurs

  console.log("🧹 Utilisateurs, annonces et abonnements précédents effacés.");

  // ============================================
  // 1. CRÉER DES UTILISATEURS
  // ============================================

  const users = await Promise.all([
    prisma.user.upsert({
      where: { id: "user_1_seed" },
      update: {},
      create: {
        id: "user_1_seed",
        firstName: "Amadou",
        lastName: "Diallo",
        email: "amadou.diallo@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
      },
    }),
    prisma.user.upsert({
      where: { id: "user_2_seed" },
      update: {},
      create: {
        id: "user_2_seed",
        firstName: "Fatima",
        lastName: "Traoré",
        email: "fatima.traore@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=45",
      },
    }),
    prisma.user.upsert({
      where: { id: "user_3_seed" },
      update: {},
      create: {
        id: "user_3_seed",
        firstName: "Moussa",
        lastName: "Koné",
        email: "moussa.kone@example.com",
        avatarUrl: "https://i.pravatar.cc/150?img=33",
      },
    }),
  ]);

  console.log("✅ Utilisateurs créés");

  // ============================================
  // 2. RÉCUPÉRER LES DONNÉES DE RÉFÉRENCE
  // ============================================

  const languages = await prisma.language.findMany();
  const frenchLang = languages.find((l) => l.code === "fr");
  const englishLang = languages.find((l) => l.code === "en");

  if (!frenchLang || !englishLang) {
    throw new Error(
      "Les langues 'fr' et 'en' doivent être populées par le seed principal."
    );
  }
  // Récupérer les plans d'abonnement (AJOUT)

  const subscriptionPlans = await prisma.subscriptionPlan.findMany();

  if (subscriptionPlans.length === 0) {
    throw new Error(
      "Plans d'abonnement non trouvés. Assurez-vous qu'ils sont déjà populés."
    );
  }

  // ARécupération des plans (pour le reste du code, on utilise plans ci-dessous)

  const planDiamant = subscriptionPlans.find((p) => p.namePlan === "Diamant");
  const planOr = subscriptionPlans.find((p) => p.namePlan === "Or");
  const planBronze = subscriptionPlans.find((p) => p.namePlan === "Bronze");

  if (!planDiamant || !planOr || !planBronze) {
    throw new Error(
      "Plans 'Diamant', 'Or' ou 'Bronze' non trouvés. Vérifiez les noms."
    );
  }
  console.log("✅ Plans d'abonnement récupérés");

  // Récupérer les pays (supposons Sénégal, Côte d'Ivoire, Maroc)

  const senegal = await prisma.country.findUnique({ where: { code: "SN" } });
  const coteDivoire = await prisma.country.findUnique({
    where: { code: "CI" },
  });
  const maroc = await prisma.country.findUnique({ where: { code: "MA" } });

  if (!senegal || !coteDivoire || !maroc) {
    throw new Error(
      "Pays non trouvés. Assurez-vous que les pays sont déjà populés."
    );
  }

  // Récupérer les types de propriétés (Appartement, Villa, Maison)

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
      "Types de propriétés non trouvés. Assurez-vous qu'ils sont déjà populés."
    );
  }

  // Récupérer les statuts (À vendre, À louer)

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
      "Statuts de propriétés non trouvés. Assurez-vous qu'ils sont déjà populés."
    );
  }

  // Récupérer ou créer des villes

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
      "Villes non trouvées. Assurez-vous que les villes sont déjà populées."
    );
  }

  console.log("✅ Données de référence récupérées");

  // ============================================
  // 3. CRÉER LES 3 ANNONCES IMMOBILIÈRES
  // ============================================

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 🏠 ANNONCE 1 : Villa de luxe à Dakar
  const property1 = await prisma.property.create({
    // CHANGEMENT CRITIQUE: NAME et DESCRIPTION en JSON
    data: {
      name: {
        fr: "Villa moderne avec vue sur l'océan - Almadies",
        en: "Modern villa with ocean view - Almadies",
      },
      description: {
        fr: `Magnifique villa contemporaine située dans le quartier prisé des Almadies à Dakar. Cette propriété d'exception offre une vue imprenable sur l'océan Atlantique. La villa dispose d'espaces de vie spacieux et lumineux, avec une cuisine équipée haut de gamme, un salon ouvert sur une terrasse panoramique, et 5 chambres en suite.`,
        en: `Magnificent contemporary villa located in the sought-after Almadies district of Dakar. This exceptional property offers a breathtaking view of the Atlantic Ocean. The villa features spacious and bright living areas, with a high-end equipped kitchen and 5 en-suite bedrooms.`,
      },
      // CHANGEMENT CRITIQUE: PRICE en STRING
      price: 450000000, // 450 millions FCFA //
      currency: senegal.currency,
      userId: users[0].id,
      typeId: villaType.id,
      statusId: forSaleStatus.id,
      countryId: senegal.id,
      // AJOUT CRUCIAL : Définir la date de publication
      publishedAt: oneWeekAgo, // AJOUT FACULTATIF : pour garantir la visibilité selon votre schéma
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
          // CHANGEMENT CRITIQUE: LANDMARK en JSON
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
          area: 450, // m²
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
          },
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
          },
        ],
      },
      videos: {
        create: [
          {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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

  console.log("✅ Annonce 1 créée : Villa Dakar");

  // 🏢 ANNONCE 2 : Appartement moderne à Abidjan

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
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
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

  console.log("✅ Annonce 2 créée : Appartement Abidjan");

  // 🏡 ANNONCE 3 : Maison familiale à Rabat

  const property3 = await prisma.property.create({
    data: {
      name: {
        fr: "Belle maison traditionnelle - Quartier Anfa",
        en: "Beautiful traditional house - Anfa District",
      },
      description: {
        fr: `Charmante maison traditionnelle marocaine de 280m² sur un terrain de 400m², idéalement située dans le quartier résidentiel d'Anfa. Cette propriété familiale offre des volumes généreux avec un salon marocain authentique, et 4 chambres spacieuses à l'étage.`,
        en: `Charming traditional Moroccan house of 280m² on a 400m² plot, ideally located in the residential Anfa district. This family property offers generous volumes with an authentic Moroccan living room and 4 spacious bedrooms upstairs.`,
      },
      price: 4500000, // 4,5 millions MAD
      userId: users[2].id,
      typeId: maisonType.id,
      statusId: forSaleStatus.id,
      countryId: maroc.id,
      publishedAt: now, // Publiée immédiatement (maintenant)
      isActive: true,
      isFeatured: true,
      location: {
        create: {
          streetAddress: "42 Rue Mohamed Abdou",
          cityId: rabat.id,
          neighborhood: "Anfa",
          zip: "20100",
          latitude: 33.5892,
          longitude: -7.6164,
          landmark: {
            fr: "Proche du Lycée Lyautey",
            en: "Near Lycée Lyautey",
          },
        },
      },
      feature: {
        create: {
          bedrooms: 4,
          bathrooms: 3,
          parkingSpots: 2,
          area: 280,
          hasSwimmingPool: false,
          hasGardenYard: true,
          hasBalcony: false,
          floor: 1,
          totalFloors: 2,
          yearBuilt: 1995,
        },
      },
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
          },
          {
            url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
          },
        ],
      },
      videos: {
        create: [
          {
            url: "https://www.youtube.com/watch?v=example2",
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

  console.log("✅ Annonce 3 créée : Maison Casablanca");

  // ============================================
  // 4. CRÉER LES ABONNEMENTS DE TEST
  // ============================================

  const today = new Date();
  const nextYear = new Date(today);
  nextYear.setFullYear(today.getFullYear() + 1);

  console.log("\n💳 Création d'abonnements de test...");

  // 4.1 Récupérer les plans d'abonnement pour lier les subscriptions
  // On suppose que les plans "Diamant", "Or" et "Bronze" existent grâce au premier seed.

  const plans = await prisma.subscriptionPlan.findMany();

  const planDiamant2 = plans.find((p) => p.namePlan === "Diamant");
  const planOr2 = plans.find((p) => p.namePlan === "Or");
  const planBronze2 = plans.find((p) => p.namePlan === "Bronze");

  if (!planDiamant2 || !planOr2 || !planBronze2) {
    throw new Error(
      "Erreur: Plans d'abonnement requis ('Diamant', 'Or', 'Bronze') introuvables."
    );
  }

  const subscriptions = await Promise.all([
    // Abonnement 1: Amadou Diallo (user_1_seed) - Plan DIAMANT
    prisma.subscriptions.upsert({
      where: { paymentID: "sub_amadou_diamant" }, // Utilisez un paymentID unique
      update: {},
      create: {
        userId: users[0].id,
        planId: planDiamant.id,
        paymentID: "sub_amadou_diamant",
        status: SubscriptionStatus.ACTIVE, // CHANGEMENT CRITIQUE: Utilisation de l'ENUM
        startDate: today,
        endDate: nextYear,
      },
    }),

    // Abonnement 2: Fatima Traoré (user_2_seed) - Plan OR

    prisma.subscriptions.upsert({
      where: { paymentID: "sub_fatima_or" },
      update: {},
      create: {
        userId: users[1].id,
        planId: planOr.id,
        paymentID: "sub_fatima_or",
        status: SubscriptionStatus.ACTIVE, // CHANGEMENT CRITIQUE: Utilisation de l'ENUM
        startDate: today,
        endDate: nextYear,
      },
    }),

    // Abonnement 3: Moussa Koné (user_3_seed) - Plan BRONZE (Exemple de statut "pending")

    prisma.subscriptions.upsert({
      where: { paymentID: "sub_moussa_bronze_pending" },
      update: {},
      create: {
        userId: users[2].id,
        planId: planBronze.id,
        paymentID: "sub_moussa_bronze_pending",
        status: SubscriptionStatus.ACTIVE, // CHANGEMENT CRITIQUE: Utilisation de l'ENUM
        startDate: today,
        endDate: nextYear,
      },
    }),
  ]);

  console.log(`✅ ${subscriptions.length} abonnements créés`); // ============================================ // 5. STATISTIQUES FINALES (Ancienne section 4) // ============================================

  // ============================================
  // 5. STATISTIQUES FINALES
  // ============================================

  const totalProperties = await prisma.property.count();
  const totalUsers = await prisma.user.count();
  const totalSubscriptions = await prisma.subscriptions.count(); // AJOUT

  console.log("\n🎉 Seeding terminé avec succès !");
  console.log(`Statistiques :`);
  console.log(`- ${totalUsers} utilisateurs`);
  console.log(`- ${totalProperties} annonces immobilières`);
  console.log(`- ${totalSubscriptions} abonnements actifs`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
