"use server";

import React from "react";
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserById } from "@/lib/actions/user";
import { PropertyType, PropertyStatus } from "@prisma/client";
import AddPropertyClient from "./_components/AddPropertyClient";

const AddPropertyPage = async () => {
  let showModal = false;

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

    //  Si l'utilisateur n'a pas d'abonnement et a déjà posté une annonce OU si l'abonnement est expiré, on montre la modale
    if (
      isSubscriptionExpired ||
      (!userSubscription && totalPropertiesCount >= 1)
    ) {
      showModal = true;
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

  // Passez `showModal` et les données récupérées au composant client
  return (
    <AddPropertyClient
      showModal={showModal}
      types={propertyTypes}
      statuses={propertyStatuses}
    />
  );
};

export default AddPropertyPage;
