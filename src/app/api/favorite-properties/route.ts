// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// // Gère uniquement la méthode POST
// export async function POST(req: Request) {
//   try {
//     // Récupérer le corps de la requête
//     const body = await req.json();
//     const { ids } = body;

//     if (!ids || !Array.isArray(ids)) {
//       return NextResponse.json(
//         { error: "Invalid request payload" },
//         { status: 400 }
//       );
//     }

//     // Requête pour récupérer les propriétés favorites depuis Prisma
//     const favoriteProperties = await prisma.property.findMany({
//       where: {
//         id: {
//           in: ids, // Filtre basé sur les IDs favoris
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//         price: true,
//         images: {
//           select: {
//             url: true,
//           },
//         },
//         location: {
//           select: {
//             city: true,
//             state: true,
//           },
//         },
//         feature: {
//           select: {
//             area: true,
//             bedrooms: true,
//             bathrooms: true,
//             parkingSpots: true,
//           },
//         },
//         status: true,
//         type: true,
//       },
//     });

//     return NextResponse.json(favoriteProperties);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des propriétés :", error);
//     return NextResponse.json(
//       { error: "Erreur serveur interne" },
//       { status: 500 }
//     );
//   }
// }

// // Gérer les autres méthodes HTTP
// export async function GET() {
//   return NextResponse.json(
//     { error: "GET method not supported on this route." },
//     { status: 405 }
//   );
// }

// 09-12-2025

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { getLanguageIdByCode } from "@/lib/utils";

// // Type simplifié pour les données traduites (ajoutez ce type si vous ne l'avez pas déjà)
// interface TranslatedItem {
//   id: number;
//   value: string; // Le nom traduit
// }

// // Gère uniquement la méthode POST
// export async function POST(req: Request) {
//   try {
//     // 1. Récupérer le corps de la requête et les paramètres d'URL (pour la langue)
//     const url = new URL(req.url);
//     const currentLocale = url.searchParams.get("lang") || "fr"; // Récupère la locale
//     const languageId = await getLanguageIdByCode(currentLocale); // ⚠️ Assurez-vous d'avoir cette fonction disponible

//     const body = await req.json();
//     // Les IDs des favoris sont probablement des chaînes de caractères (UUID ou string ID)
//     const { ids } = body as { ids: string[] };

//     if (!ids || !Array.isArray(ids)) {
//       return NextResponse.json(
//         { error: "Invalid request payload" },
//         { status: 400 }
//       );
//     }

//     // 2. LOGIQUE DE TRADUCTION DE BASE (Réutilisée de vos Server Components)
//     const getTranslatedValue = (translations: any, fallbackCode: string) => {
//       return translations[0]?.value || translations[0]?.name || fallbackCode;
//     };

//     // 3. Requête pour récupérer les propriétés favorites depuis Prisma
//     const favoritePropertiesRaw = await prisma.property.findMany({
//       where: {
//         id: {
//           in: ids, // Filtre basé sur les IDs favoris (si les IDs sont des strings)
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//         price: true,
//         images: { select: { url: true } },
//         location: {
//           select: {
//             streetAddress: true, // Peut-être plus pertinent que 'state'
//             cityId: true, // Nous aurons besoin de l'ID de la ville
//             city: {
//               select: {
//                 translations: {
//                   where: { languageId: languageId },
//                   select: { name: true }, // Traduction du nom de la ville
//                   take: 1,
//                 },
//                 country: {
//                   select: {
//                     translations: {
//                       where: { languageId: languageId },
//                       select: { name: true }, // Traduction du nom du pays
//                       take: 1,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//         feature: {
//           select: {
//             area: true,
//             bedrooms: true,
//             bathrooms: true,
//             parkingSpots: true,
//           },
//         },
//         // ✅ Inclusion des traductions pour Status et Type
//         status: {
//           select: {
//             code: true,
//             translations: {
//               where: { languageId: languageId },
//               select: { value: true },
//               take: 1,
//             },
//           },
//         },
//         type: {
//           select: {
//             code: true,
//             translations: {
//               where: { languageId: languageId },
//               select: { value: true },
//               take: 1,
//             },
//           },
//         },
//       },
//     });

//     // 4. POST-TRAITEMENT : Transformer les données brutes en format client
//     const favoriteProperties = favoritePropertiesRaw.map((prop) => {
//       const cityName = getTranslatedValue(
//         prop.location?.city?.translations,
//         "N/A"
//       );
//       const countryName = getTranslatedValue(
//         prop.location?.city?.country?.translations,
//         "N/A"
//       );

//       const statusName = getTranslatedValue(
//         prop.status.translations,
//         prop.status.code
//       );
//       const typeName = getTranslatedValue(
//         prop.type.translations,
//         prop.type.code
//       );

//       return {
//         id: prop.id,
//         name: prop.name,
//         price: prop.price,
//         images: prop.images,
//         area: prop.feature?.area,
//         bedrooms: prop.feature?.bedrooms,
//         bathrooms: prop.feature?.bathrooms,
//         parkingSpots: prop.feature?.parkingSpots,
//         // Remplacement des objets bruts par les noms traduits
//         location: {
//           city: cityName,
//           country: countryName,
//           address: prop.location?.streetAddress,
//         },
//         status: statusName,
//         type: typeName,
//       };
//     });

//     return NextResponse.json(favoriteProperties);
//   } catch (error) {
//     console.error("Erreur lors de la récupération des propriétés :", error);
//     return NextResponse.json(
//       { error: "Erreur serveur interne" },
//       { status: 500 }
//     );
//   }
// }

// // Gérer les autres méthodes HTTP
// export async function GET() {
//   return NextResponse.json(
//     { error: "GET method not supported on this route." },
//     { status: 405 }
//   );
// }

// // ⚠️ Ceci doit exister dans votre environnement ou être importé d'un fichier utilitaire.
// async function getLanguageIdByCode(
//   localeCode: string
// ): Promise<number | undefined> {
//   // Implémentez la recherche de l'ID de langue à partir du code de la locale (ex: 'fr' -> 1)
//   // C'est la même fonction que vous utilisez dans vos Server Components.
//   const language = await prisma.language.findUnique({
//     where: { code: localeCode },
//     select: { id: true },
//   });
//   return language?.id;
// }

import { NextResponse } from "next/server";

// Cette fonction gère les requêtes HTTP GET vers l'endpoint /api/favorite-properties
export async function GET() {
  // Le code minimum requis pour que Vercel compile et déploie la route.
  return NextResponse.json(
    { message: "Hello, Vercel! API is running." },
    { status: 200 }
  );
}

// NOTE : Vous n'avez pas besoin d'inclure d'autres méthodes (POST, PUT, etc.)
// si vous ne les utilisez pas, mais la définition de la fonction asynchrone est cruciale.
