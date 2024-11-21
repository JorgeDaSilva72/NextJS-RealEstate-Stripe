"use server";

import React from "react";
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserById } from "@/lib/actions/user";
import { PropertyType, PropertyStatus } from "@prisma/client";
import AddPropertyClient from "./_components/AddPropertyClient";

const AddPropertyPage = async () => {
  let showModal = false;
  let modalMessage = "";
  let planDetails = null;

  try {
    // Obtenez la session et l'utilisateur
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    // Vérifiez si l'utilisateur est valide
    const dbUser = await getUserById(user ? user.id : "");
    if (!dbUser || !dbUser.id) {
      throw new Error("Something went wrong with authentication");
    }

    // Cherchez le plan d'abonnement de l'utilisateur dans la base de données
    const userSubscription = await prisma.subscriptions.findFirst({
      where: { userId: dbUser?.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    // Détails du plan actuel
    planDetails = userSubscription?.plan
      ? {
          namePlan: userSubscription.plan.namePlan,
          premiumAds: userSubscription.plan.premiumAds,
          photosPerAd: userSubscription.plan.photosPerAd,
          shortVideosPerAd: userSubscription.plan.shortVideosPerAd,
          youtubeVideoDuration: userSubscription.plan.youtubeVideoDuration,
        }
      : null;

    // Comptez le nombre d annoncess associées à cet utilisateur
    const totalPropertiesCount = await prisma.property.count({
      where: {
        userId: user?.id,
      },
    });

    // Vérifiez si l'abonnement est expiré ou inexistant
    const currentDate = new Date();
    const isSubscriptionExpired = userSubscription?.endDate
      ? new Date(userSubscription.endDate) < currentDate
      : true;

    // Vérifiez les limites du Pack Bronze
    // Si le plan est "Bronze", retourne le nombre d'annonces premium autorisées (premiumAds), ou 1 par défaut si cette valeur n'est pas définie.
    // Si le plan n'est pas "Bronze", retourne 0.
    // const bronzePackLimit =
    //   planDetails?.namePlan === "Bronze" ? planDetails?.premiumAds || 1 : 0;

    //  Si l'utilisateur n'a pas d'abonnement et a déjà posté une annonce OU si l'abonnement est expiré, on montre la modale
    //   if (
    //     isSubscriptionExpired ||
    //     (!userSubscription && totalPropertiesCount >= 1)
    //   ) {
    //     showModal = true;
    //   }
    // } catch (error) {
    //   console.log((error as Error).message);
    // }

    //  Si l'utilisateur n'a pas d'abonnement, que l'abonnement est expiré
    // ou que la limite d'annonces est atteinte, montrez la modale
    // Déterminez la raison de la modale

    const currentPlanLimit = planDetails?.premiumAds || 0; // Limite des annonces par plan
    const photoLimit = planDetails?.photosPerAd || 8;
    const shortVideoLimit = planDetails?.shortVideosPerAd || 0;

    if (!userSubscription) {
      showModal = true;
      modalMessage = "Un abonnement est requis pour publier des annonces.";
    } else if (isSubscriptionExpired) {
      showModal = true;
      modalMessage =
        "Votre abonnement a expiré. Veuillez le renouveler pour continuer à publier des annonces.";
    } else if (
      planDetails?.premiumAds &&
      totalPropertiesCount >= planDetails.premiumAds
    ) {
      showModal = true;
      modalMessage = `Vous avez atteint la limite de ${currentPlanLimit} annonces pour votre plan actuel ${planDetails?.namePlan}. Mettez à niveau votre abonnement pour continuer.`;
    }
  } catch (error) {
    console.log((error as Error).message);
  }

  // Typage des données récupérées
  const [propertyTypes, propertyStatuses]: [PropertyType[], PropertyStatus[]] =
    await Promise.all([
      prisma.propertyType.findMany(),
      prisma.propertyStatus.findMany(),
    ]);

  /// Passez `showModal`, `planDetails` et les données récupérées au composant client
  return (
    <AddPropertyClient
      showModal={showModal}
      modalMessage={modalMessage}
      types={propertyTypes}
      statuses={propertyStatuses}
      planDetails={planDetails}
    />
  );
};

export default AddPropertyPage;
