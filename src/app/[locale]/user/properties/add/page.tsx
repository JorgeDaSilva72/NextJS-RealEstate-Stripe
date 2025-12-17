// "use server";

// import React from "react";
// import prisma from "@/lib/prisma";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { getUserById } from "@/lib/actions/user";
// import { PropertyType, PropertyStatus } from "@prisma/client";
// import AddPropertyClient from "./_components/AddPropertyClient";

// const AddPropertyPage = async () => {
//   let showModal = false;
//   let modalMessage = "";
//   let planDetails = null;

//   try {
//     // Obtenez la session et l'utilisateur
//     const { getUser } = await getKindeServerSession();
//     const user = await getUser();

//     // Vérifiez si l'utilisateur est valide
//     const dbUser = await getUserById(user ? user.id : "");
//     if (!dbUser || !dbUser.id) {
//       throw new Error("Something went wrong with authentication");
//     }

//     // Cherchez le plan d'abonnement de l'utilisateur dans la base de données
//     const userSubscription = await prisma.subscriptions.findFirst({
//       where: { userId: dbUser?.id },
//       include: { plan: true },
//       orderBy: { createdAt: "desc" },
//     });

//     // Détails du plan actuel
//     planDetails = userSubscription?.plan
//       ? {
//           namePlan: userSubscription.plan.namePlan,
//           premiumAds: userSubscription.plan.premiumAds,
//           photosPerAd: userSubscription.plan.photosPerAd,
//           shortVideosPerAd: userSubscription.plan.shortVideosPerAd,
//           youtubeVideoDuration: userSubscription.plan.youtubeVideoDuration,
//         }
//       : null;

//     // Comptez le nombre d annoncess associées à cet utilisateur
//     const totalPropertiesCount = await prisma.property.count({
//       where: {
//         userId: user?.id,
//       },
//     });

//     // Vérifiez si l'abonnement est expiré ou inexistant
//     const currentDate = new Date();
//     const isSubscriptionExpired = userSubscription?.endDate
//       ? new Date(userSubscription.endDate) < currentDate
//       : true;

//     // Vérifiez les limites du Pack Bronze
//     // Si le plan est "Bronze", retourne le nombre d'annonces premium autorisées (premiumAds), ou 1 par défaut si cette valeur n'est pas définie.
//     // Si le plan n'est pas "Bronze", retourne 0.
//     // const bronzePackLimit =
//     //   planDetails?.namePlan === "Bronze" ? planDetails?.premiumAds || 1 : 0;

//     //  Si l'utilisateur n'a pas d'abonnement et a déjà posté une annonce OU si l'abonnement est expiré, on montre la modale
//     //   if (
//     //     isSubscriptionExpired ||
//     //     (!userSubscription && totalPropertiesCount >= 1)
//     //   ) {
//     //     showModal = true;
//     //   }
//     // } catch (error) {
//     //   console.log((error as Error).message);
//     // }

//     //  Si l'utilisateur n'a pas d'abonnement, que l'abonnement est expiré
//     // ou que la limite d'annonces est atteinte, montrez la modale
//     // Déterminez la raison de la modale

//     const currentPlanLimit = planDetails?.premiumAds || 0; // Limite des annonces par plan
//     const photoLimit = planDetails?.photosPerAd || 8;
//     const shortVideoLimit = planDetails?.shortVideosPerAd || 0;

//     if (!userSubscription) {
//       showModal = true;
//       modalMessage = "Un abonnement est requis pour publier des annonces.";
//     } else if (isSubscriptionExpired) {
//       showModal = true;
//       modalMessage =
//         "Votre abonnement a expiré. Veuillez le renouveler pour continuer à publier des annonces.";
//     } else if (
//       planDetails?.premiumAds &&
//       totalPropertiesCount >= planDetails.premiumAds
//     ) {
//       showModal = true;
//       modalMessage = `Vous avez atteint la limite de ${currentPlanLimit} annonces pour votre plan actuel ${planDetails?.namePlan}. Mettez à niveau votre abonnement pour continuer.`;
//     }
//   } catch (error) {
//     console.log((error as Error).message);
//   }

//   // Typage des données récupérées
//   const [propertyTypes, propertyStatuses]: [PropertyType[], PropertyStatus[]] =
//     await Promise.all([
//       prisma.propertyType.findMany(),
//       prisma.propertyStatus.findMany(),
//     ]);

//   /// Passez `showModal`, `planDetails` et les données récupérées au composant client
//   return (
//     <AddPropertyClient
//       showModal={showModal}
//       modalMessage={modalMessage}
//       types={propertyTypes}
//       statuses={propertyStatuses}
//       planDetails={planDetails}
//     />
//   );
// };

// export default AddPropertyPage;

// ----------------------------------------------------------
// next-intl with claude

// "use server";

// import React from "react";
// import prisma from "@/lib/prisma";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { getUserById } from "@/lib/actions/user";
// import { PropertyType, PropertyStatus } from "@prisma/client";
// import AddPropertyClient from "./_components/AddPropertyClient";
// import { getTranslations } from "next-intl/server";

// const AddPropertyPage = async () => {
//   const t = await getTranslations("AddPropertyPage");
//   let showModal = false;
//   let modalMessage = "";
//   let planDetails = null;

//   try {
//     const { getUser } = await getKindeServerSession();
//     const user = await getUser();

//     const dbUser = await getUserById(user ? user.id : "");
//     if (!dbUser || !dbUser.id) {
//       throw new Error(t("authError"));
//     }

//     const userSubscription = await prisma.subscriptions.findFirst({
//       where: { userId: dbUser?.id },
//       include: { plan: true },
//       orderBy: { createdAt: "desc" },
//     });

//     planDetails = userSubscription?.plan
//       ? {
//           namePlan: userSubscription.plan.namePlan,
//           premiumAds: userSubscription.plan.premiumAds,
//           photosPerAd: userSubscription.plan.photosPerAd,
//           shortVideosPerAd: userSubscription.plan.shortVideosPerAd,
//           youtubeVideoDuration: userSubscription.plan.youtubeVideoDuration,
//         }
//       : null;

//     const totalPropertiesCount = await prisma.property.count({
//       where: {
//         userId: user?.id,
//       },
//     });

//     const currentDate = new Date();
//     const isSubscriptionExpired = userSubscription?.endDate
//       ? new Date(userSubscription.endDate) < currentDate
//       : true;

//     const currentPlanLimit = planDetails?.premiumAds || 0;
//     const photoLimit = planDetails?.photosPerAd || 8;
//     const shortVideoLimit = planDetails?.shortVideosPerAd || 0;

//     if (!userSubscription) {
//       showModal = true;
//       modalMessage = t("subscriptionRequired");
//     } else if (isSubscriptionExpired) {
//       showModal = true;
//       modalMessage = t("subscriptionExpired");
//     } else if (
//       planDetails?.premiumAds &&
//       totalPropertiesCount >= planDetails.premiumAds
//     ) {
//       showModal = true;
//       modalMessage = t("limitReached", {
//         limit: currentPlanLimit,
//         plan: planDetails?.namePlan,
//       });
//     }
//   } catch (error) {
//     console.log((error as Error).message);
//   }

//   const [propertyTypes, propertyStatuses]: [PropertyType[], PropertyStatus[]] =
//     await Promise.all([
//       prisma.propertyType.findMany(),
//       prisma.propertyStatus.findMany(),
//     ]);

//   return (
//     <AddPropertyClient
//       showModal={showModal}
//       modalMessage={modalMessage}
//       types={propertyTypes}
//       statuses={propertyStatuses}
//       planDetails={planDetails}
//     />
//   );
// };

// export default AddPropertyPage;

// 08/12/2025

"use server";

import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserById } from "@/lib/actions/user";
// PropertyType et PropertyStatus n'auront plus besoin d'être importés directement de @prisma/client,
// car nous allons manipuler les données avec les traductions incluses.
import AddPropertyClient from "./_components/AddPropertyClient";
import { getTranslations, getLocale } from "next-intl/server"; // Importation de getLocale
import { getLanguageIdByCode } from "@/lib/utils"; 

// ⚠️ IMPORTANT : Définir les types des données incluant les traductions.
// Assurez-vous que les champs 'translations' existent sur vos modèles PropertyType et PropertyStatus dans schema.prisma.

// Type pour un item récupéré avec sa traduction
interface ItemWithTranslation {
  id: number;
  code: string | null; // Ajout du code pour la transformation (can be null from DB)
  translations: {
    value?: string;
    name?: string;
  }[];
}
// Type simplifié pour le composant client
interface ClientItem {
  id: number;
  code: string;
  name: string; // Nom traduit
}
// const AddPropertyPage = async () => {
const AddPropertyPage = async ({ 
  params 
}: { 
  params: { locale: string } 
}) => {
  const t = await getTranslations("AddPropertyPage");
  // ⚠️ ÉTAPE 1 : Récupérer la locale. L'appel est asynchrone dans Next-Intl/Server, mais nous le traitons comme une string.
  // const currentLocale: string = await getLocale();

  // 2. Récupérez la locale directement depuis l'URL (plus fiable que getLocale ici)
  // On attend params pour les versions récentes de Next.js
  const { locale } = await params; 
  const currentLocale = locale;

  let showModal = false;
  let modalMessage = "";
  let planDetails = null;

  // 1. DÉTERMINER L'ID DE LA LANGUE
  // ✅ ÉTAPE 2 : ATTENDRE la fonction getLanguageIdByCode qui est asynchrone.
  let languageId: number | undefined;
  try {
    languageId = await getLanguageIdByCode(currentLocale);
  } catch (error) {
    console.error(`Error fetching language ID for locale ${currentLocale}:`, error);
  }

  if (!languageId) {
    console.error(`Language ID for locale ${currentLocale} not found.`);
    // Try to get default language (usually 'en' or 'fr')
    try {
      languageId = await getLanguageIdByCode('en');
      if (!languageId) {
        languageId = await getLanguageIdByCode('fr');
      }
    } catch (error) {
      console.error('Error fetching default language:', error);
    }
  }

  console.log("#############################################");
  console.log("NOUVELLE LOCALE DETECTÉE:", currentLocale);
  console.log("NOUVEL ID LANGUE:", languageId);
  console.log("#############################################");

  // Initialisation des limites de médias
  let photoLimit = 8;
  let shortVideoLimit = 0;

  try {
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    // If no user from Kinde, redirect to login
    if (!user || !user.id) {
      redirect("/api/auth/login");
    }

    // Récupérer l'utilisateur DB
    const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    // Vous pourriez inclure directement ici les données d'abonnement
    // si cela rend le code plus clair, mais nous le faisons après pour l'instant.
    });

    if (!dbUser) {
      // L'utilisateur est connecté via Kinde mais n'est pas dans la DB.
      // Cela ne devrait plus arriver après correction des problèmes de connexion.
      // Si cela arrive, vous pourriez choisir de le créer ici ou de le rediriger.
      console.error("User found in Kinde but not in DB. Redirection.");
      redirect("/api/auth/login");
    }

    // --- LOGIQUE D'ABONNEMENT (Inchangement) ---
    const userSubscription = await prisma.subscriptions.findFirst({
      where: { userId: dbUser.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    planDetails = userSubscription?.plan
      ? {
        namePlan: userSubscription.plan.namePlan,
        premiumAds: userSubscription.plan.premiumAds,
        photosPerAd: userSubscription.plan.photosPerAd,
        shortVideosPerAd: userSubscription.plan.shortVideosPerAd,
        youtubeVideoDuration: userSubscription.plan.youtubeVideoDuration,
      }
      : null;

    const totalPropertiesCount = await prisma.property.count({
      where: {
        userId: user.id,
      },
    });

    // ... (Logique de vérification d'expiration et de limite atteinte )
    const currentDate = new Date();
    const isSubscriptionExpired = userSubscription?.endDate
      ? new Date(userSubscription.endDate) < currentDate
      : true;

    const currentPlanLimit = planDetails?.premiumAds || 0;
    // Mise à jour des limites basées sur le plan
    photoLimit = planDetails?.photosPerAd || photoLimit;
    shortVideoLimit = planDetails?.shortVideosPerAd || shortVideoLimit;

    if (!userSubscription) {
      showModal = true;
      modalMessage = t("subscriptionRequired");
    } else if (isSubscriptionExpired) {
      showModal = true;
      modalMessage = t("subscriptionExpired");
    } else if (
      planDetails?.premiumAds &&
      totalPropertiesCount >= planDetails.premiumAds
    ) {
      showModal = true;
      modalMessage = t("limitReached", {
        limit: currentPlanLimit,
        plan: planDetails?.namePlan,
      });
    }
    // --- FIN LOGIQUE D'ABONNEMENT ---
  } catch (error) {
    console.error("Error in AddPropertyPage:", error);
    // If there's any error, redirect to login
    redirect("/api/auth/login");
  }

  // 2. REQUÊTES PRISMA AVEC TRADUCTION
  let propertyTypesRaw: ItemWithTranslation[] = [];
  let propertyStatusesRaw: ItemWithTranslation[] = [];
  let countriesRaw: ItemWithTranslation[] = [];
  let citiesRaw: ItemWithTranslation[] = [];
  
  try {
    [propertyTypesRaw, propertyStatusesRaw, countriesRaw, citiesRaw] =
      await Promise.all([
        // Récupérer les types de biens
        prisma.propertyType.findMany({
          select: {
            id: true,
            code: true,
            translations: {
              where: languageId ? { languageId: languageId } : undefined,
              select: {
                value: true,
              },
              take: 1,
            },
          },
          orderBy: {
            displayOrder: "asc", // Optionnel: Assurer un ordre d'affichage
          },
        }),

        // Récupérer les statuts de biens
        prisma.propertyStatus.findMany({
          select: {
            id: true,
            code: true,
            translations: {
              where: languageId ? { languageId: languageId } : undefined,
              select: {
                value: true,
              },
              take: 1,
            },
          },
          orderBy: {
            displayOrder: "asc", // Optionnel: Assurer un ordre d'affichage
          },
        }),

        // Récupérer les Pays traduits
        prisma.country.findMany({
          where: { isActive: true },
          select: {
            id: true,
            code: true,
            translations: {
              where: languageId ? { languageId: languageId } : undefined,
              select: { name: true },
              take: 1,
            },
          },
          orderBy: { displayOrder: "asc" },
        }),

        // Récupérer les Villes traduites
        prisma.city.findMany({
          where: { isActive: true },
          select: {
            id: true,
            code: true,
            translations: {
              where: languageId ? { languageId: languageId } : undefined,
              select: { name: true },
              take: 1,
            },
          },
          orderBy: { countryId: "asc" }, // Optionnel: Tri par pays ou ordre
        }),
      ]);
  } catch (error) {
    console.error("Error fetching property data:", error);
    // Return empty arrays if query fails to prevent page crash
    propertyTypesRaw = [];
    propertyStatusesRaw = [];
    countriesRaw = [];
    citiesRaw = [];
  }

  // 3. Transformation des données pour le composant client
  // const mapItems = (items: ItemWithTranslation[]): ClientItem[] =>
  //   items.map((item) => {
  //     // Pour les Pays et Villes, la traduction est dans item.translations[0]?.name
  //     const translationValue = item.translations[0] as {
  //       value?: string;
  //       name?: string;
  //     };

  //     // Si c'est un PropertyType/Status, on utilise 'value'. Si Country/City, on utilise 'name'.
  //     const translatedName = translationValue.value || translationValue.name;
  //     const code = item.code || `code_${item.id}`;

  //     return {
  //       id: item.id,
  //       code: code,
  //       name: translatedName || code || `ID ${item.id} (No Translation)`,
  //     };
  //   });
const mapItems = (items: ItemWithTranslation[]): ClientItem[] =>
  items.map((item) => {
    // On récupère la première traduction trouvée par le filtre languageId
    const translationEntry = item.translations[0];

    // On extrait la valeur (PropertyType) ou le nom (City/Country)
    const translatedName = translationEntry?.value || translationEntry?.name;
    const code = item.code || `code_${item.id}`;

    return {
      id: item.id,
      code: code,
      // MODIFICATION : Si translatedName est absent, on affiche le CODE technique. 
      // Si vous voyez "APARTMENT" au lieu de "Appartement", c'est que la traduction EN manque en DB.
      name: translatedName || `[MISSING] ${code.toUpperCase()}`,
    };
  });

  return (
    <AddPropertyClient
      showModal={showModal}
      modalMessage={modalMessage}
      // Passage des données traduites
      types={mapItems(propertyTypesRaw)}
      statuses={mapItems(propertyStatusesRaw)}
      countries={mapItems(countriesRaw as any)}
      cities={mapItems(citiesRaw as any)}
      planDetails={planDetails}
      // Passage des limites de médias
      photoLimit={photoLimit}
      shortVideoLimit={shortVideoLimit}
    />
  );
};

export default AddPropertyPage;
