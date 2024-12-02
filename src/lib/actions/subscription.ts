"use server";
import prisma from "../prisma";

interface SubscriptionDataType {
  paymentId: string;
  planId: number;
  userId: string;
  startDate: Date;
  endDate: Date;
  city?: string;
}

export const saveSubscription = async ({
  paymentId,
  planId,
  userId,
  startDate,
  endDate,
}: SubscriptionDataType) => {
  try {
    await prisma.subscriptions.create({
      data: {
        paymentID: paymentId,
        startDate: startDate,
        endDate: endDate,
        user: {
          connect: {
            id: userId,
          },
        },
        plan: {
          connect: {
            id: planId,
          },
        },
      },
    });

    return {
      success: true,
      message: "Abonnement enregistré avec succès",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.message,
    };
  }
};

export const getUserSub = async (userId: string) => {
  const userSubscription = await prisma.subscriptions.findFirst({
    where: { userId: userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  return userSubscription
}

export const numberOfSubInCity = async ({planId, city}: {planId: number, city: string}) => {
  const nbrUserFreeInCity = await prisma.user.findMany({
    where: {
      AND: [
        { Property: { some: { location: { city: city } } } },
        { subscriptions: { some: { palnId: planId } } },
      ],
    },
  });

  return nbrUserFreeInCity.length;
}

export const saveFreeSubscription = async ({
  userId,
  planId,
  paymentId,
  startDate,
  endDate,
  city,
}: SubscriptionDataType) => {
  try {
    if (!userId || !planId || !city)
      return { success: false, message: "Données corrompu" };
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptions: { include: { plan: true } } },
    });

    const isUserInPacks = user?.subscriptions.map((item) => {
      if (item.palnId == planId) {
        return true;
      } else return false;
    });

    if (isUserInPacks && isUserInPacks?.includes(true))
      return {
        success: false,
        message: "Vous êtes déjà dans un abonnement payant",
      };

    if (isUserInPacks && isUserInPacks?.includes(false)) return {
      success: false,
      message: "Vous avez déjà eu un abonnement gratuit"
    }
    const nbrUserFreeInCity = await numberOfSubInCity({planId, city})

    if (nbrUserFreeInCity > 3)
      return {
        success: false,
        message: "La limite d'abonnement gratuit dans cette ville a été dépassé",
      };

    const result = await saveSubscription({ paymentId, endDate, startDate, userId, planId });
    return result;
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
