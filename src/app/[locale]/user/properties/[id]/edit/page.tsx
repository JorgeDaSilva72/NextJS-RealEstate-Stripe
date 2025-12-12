// import prisma from "@/lib/prisma";
// import AddPropertyForm from "../../add/_components/AddPropertyForm";
// import { notFound, redirect } from "next/navigation";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// interface Props {
//   params: { id: string };
// }

// const EditPropertyPage = async ({ params }: Props) => {
//   const [propertyTypes, propertyStatuses, property] = await Promise.all([
//     prisma.propertyType.findMany(),
//     prisma.propertyStatus.findMany(),
//     prisma.property.findUnique({
//       where: {
//         id: +params.id,
//       },
//       include: {
//         location: true,
//         feature: true,
//         contact: true,
//         images: true,
//         videos: true,
//       },
//     }),
//   ]);

//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   if (!property) return notFound();
//   if (!user || property.userId !== user.id) redirect("/unauthorized");
//   return (
//     <AddPropertyForm
//       types={propertyTypes}
//       statuses={propertyStatuses}
//       property={property}
//       isEdit={true}
//     />
//   );
// };

// export default EditPropertyPage;
//---------------------------------------
// JhnRavelo fixer le bug de la suppression de l'image.

// import prisma from "@/lib/prisma";
// import AddPropertyForm from "../../add/_components/AddPropertyForm";
// import { notFound, redirect } from "next/navigation";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { getUserById } from "@/lib/actions/user";

// interface Props {
//   params: { id: string };
// }

// const EditPropertyPage = async ({ params }: Props) => {
//   const { getUser } = getKindeServerSession();
//   const user = await getUser();
//   // Vérifiez si l'utilisateur est valide
//   const dbUser = await getUserById(user ? user.id : "");
//   if (!dbUser || !dbUser.id) {
//     throw new Error("Something went wrong with authentication");
//   }

//   const [propertyTypes, propertyStatuses, property, plan] = await Promise.all([
//     prisma.propertyType.findMany(),
//     prisma.propertyStatus.findMany(),
//     prisma.property.findUnique({
//       where: {
//         id: +params.id,
//       },
//       include: {
//         location: true,
//         feature: true,
//         contact: true,
//         images: true,
//         videos: true,
//       },
//     }),
//     prisma.subscriptions.findFirst({
//       where: { userId: dbUser?.id },
//       include: { plan: true },
//     }),
//   ]);

//   if (!property) return notFound();
//   if (!user || property.userId !== user.id) redirect("/unauthorized");
//   return (
//     <AddPropertyForm
//       types={propertyTypes}
//       statuses={propertyStatuses}
//       property={property}
//       planDetails={plan?.plan}
//       isEdit={true}
//     />
//   );
// };

// export default EditPropertyPage;

// 09/12/2025 pour s adapter au nouveau prisma feature/multlingual-countries

"use server";

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserById } from "@/lib/actions/user";
import AddPropertyForm from "../../add/_components/AddPropertyForm";
import { getTranslations, getLocale } from "next-intl/server";
import { getLanguageIdByCode } from "@/lib/utils";

interface Props {
  params: { id: string };
}

// Définition des types et fonction de mapping (à conserver)
interface ItemWithTranslation {
  id: number;
  code: string;
  translations: { value?: string; name?: string }[]; // 'name' ou 'value' selon le modèle
}
interface ClientItem {
  id: number;
  code: string;
  name: string;
}
const mapItems = (items: ItemWithTranslation[]): ClientItem[] =>
  items.map((item) => {
    // Tenter d'utiliser 'value' (pour Status/Type) ou 'name' (pour City/Country)
    const translationValue = item.translations[0] as {
      value?: string;
      name?: string;
    };
    const translatedName = translationValue.value || translationValue.name;

    return {
      id: item.id,
      code: item.code,
      name: translatedName || item.code || `ID ${item.id} (No Translation)`,
    };
  });
// Fin des types et fonction de mapping

const EditPropertyPage = async ({ params }: Props) => {
  const t = await getTranslations("EditPropertyPage");
  const currentLocale: string = await getLocale();
  const languageId = await getLanguageIdByCode(currentLocale);

  if (!languageId) {
    console.error(`Language ID for locale ${currentLocale} not found.`);
  }

  // Initialisation des limites de médias
  let photoLimit = 8;
  let shortVideoLimit = 0;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const dbUser = await getUserById(user ? user.id : "");
  if (!dbUser || !dbUser.id) {
    throw new Error(t("authError"));
  }

  const propertyId = Number(params.id);
  if (isNaN(propertyId)) return notFound();

  // 2. Requêtes PRISMA AVEC TRADUCTION
  const [
    propertyTypesRaw,
    propertyStatusesRaw,
    countriesRaw, // NOUVEAU
    citiesRaw, // NOUVEAU
    property,
    userSubscription,
  ] = await Promise.all([
    // 1. Types de biens AVEC TRADUCTION
    prisma.propertyType.findMany({
      select: {
        id: true,
        code: true,
        translations: {
          where: { languageId: languageId },
          select: { value: true },
          take: 1,
        },
      },
      orderBy: { displayOrder: "asc" },
    }) as Promise<ItemWithTranslation[]>,

    // 2. Statuts de biens AVEC TRADUCTION
    prisma.propertyStatus.findMany({
      select: {
        id: true,
        code: true,
        translations: {
          where: { languageId: languageId },
          select: { value: true },
          take: 1,
        },
      },
      orderBy: { displayOrder: "asc" },
    }) as Promise<ItemWithTranslation[]>,

    // 3. Pays AVEC TRADUCTION (NOUVEAU)
    prisma.country.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        translations: {
          where: { languageId: languageId },
          select: { name: true },
          take: 1,
        },
      },
      orderBy: { displayOrder: "asc" },
    }) as Promise<ItemWithTranslation[]>,

    // 4. Villes AVEC TRADUCTION (NOUVEAU)
    prisma.city.findMany({
      where: { isActive: true },
      select: {
        id: true,
        code: true,
        translations: {
          where: { languageId: languageId },
          select: { name: true },
          take: 1,
        },
      },
      orderBy: { countryId: "asc" },
    }) as Promise<ItemWithTranslation[]>,

    // 5. Récupérer l'annonce (inchangée)
    prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        location: true,
        feature: true,
        contact: true,
        images: true,
        videos: true,
      },
    }),

    // 6. Récupérer l'abonnement
    prisma.subscriptions.findFirst({
      where: { userId: dbUser?.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!property) return notFound();
  if (!user || property.userId !== user.id) redirect("/unauthorized");

  // 3. LOGIQUE DE CALCUL DES LIMITES DE MÉDIAS
  const planDetails = userSubscription?.plan;

  if (planDetails) {
    photoLimit = planDetails.photosPerAd || photoLimit;
    shortVideoLimit = planDetails.shortVideosPerAd || shortVideoLimit;
  }

  // 4. Transformation des données pour le composant client
  const propertyTypes = mapItems(propertyTypesRaw);
  const propertyStatuses = mapItems(propertyStatusesRaw);
  const countries = mapItems(countriesRaw);
  const cities = mapItems(citiesRaw);

  return (
    <AddPropertyForm
      types={propertyTypes}
      statuses={propertyStatuses}
      countries={countries}
      cities={cities}
      property={property}
      planDetails={planDetails}
      isEdit={true}
      photoLimit={photoLimit}
      shortVideoLimit={shortVideoLimit}
    />
  );
};

export default EditPropertyPage;
