// "use server";

// import prisma from "../prisma";

// export const saveSubscription = async ({
//   paymentId,
//   planId,
//   userId,
//   startDate,
//   endDate,
// }: {
//   paymentId: string;
//   planId: number;
//   userId: string;
//   startDate: Date;
//   endDate: Date;
// }) => {
//   try {
//     await prisma.subscriptions.create({
//       data: {
//         paymentID: paymentId,
//         startDate: startDate,
//         endDate: endDate,
//         user: {
//           connect: {
//             id: userId,
//           },
//         },
//         plan: {
//           connect: {
//             id: planId,
//           },
//         },
//       },
//     });

//     return {
//       message: "Abonnement enregistré avec succès",
//     };
//   } catch (e: any) {
//     return {
//       message: e.message,
//     };
//   }
// };
// end -----------------------------------
// begin -----------------------------------
// intégration plan gratuit par Cedrico

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
    // Use upsert to handle cases where paymentID already exists
    // This prevents duplicate key errors if user clicks multiple times or payment is retried
    await prisma.subscriptions.upsert({
      where: {
        paymentID: paymentId,
      },
      update: {
        // Update existing subscription if paymentID exists
        startDate: startDate,
        endDate: endDate,
        planId: planId,
        userId: userId,
        updatedAt: new Date(),
      },
      create: {
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
  } catch (e) {
    const error =
      e instanceof Error ? e : new Error("Une erreur inconnue s'est produite");
    console.error('[saveSubscription] Error:', error);
    return { success: false, message: error.message };
  }
};

export const getUserSub = async (userId: string) => {
  const userSubscription = await prisma.subscriptions.findFirst({
    where: { userId: userId },
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  });

  return userSubscription;
};

// export const numberOfSubInCity = async ({
//   planId,
//   city,
// }: {
//   planId: number;
//   city: string;
// }) => {
//   const nbrUserFreeInCity = await prisma.user.findMany({
//     where: {
//       AND: [
//         { Property: { some: { location: { city: city } } } },
//         { subscriptions: { some: { planId: planId } } },
//       ],
//     },
//   });

//   return nbrUserFreeInCity.length;
// };

export const saveFreeSubscription = async ({
  userId,
  planId,
  paymentId,
  startDate,
  endDate,
}: // city,
SubscriptionDataType) => {
  try {
    if (!userId || !planId)
      return { success: false, message: "Données corrompues" };
    // Récupérer l'utilisateur et ses abonnements
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // select: { subscriptions: { include: { plan: true } } },
      select: { subscriptions: true }, // Pas besoin d'inclure le plan ici
    });

    // Vérification de la présence du plan (corrigé avec .some())
    // const isUserInPacks = user?.subscriptions.map((item) => {
    //   if (item.planId == planId) {
    //     return true;
    //   } else return false;
    // });
    const isUserAlreadyInPlan = user?.subscriptions.some(
      (item) => item.planId === planId // CORRECTION : palnId -> planId
    );

    // if (isUserInPacks && isUserInPacks?.includes(true))
    //   return {
    //     success: false,
    //     message: "Vous êtes déjà dans un abonnement payant",
    //   };
    if (isUserAlreadyInPlan)
      return {
        success: false,
        message: "Vous avez déjà cet abonnement.",
      };
    // if (isUserInPacks && isUserInPacks?.includes(false))
    //   return {
    //     success: false,
    //     message: "Vous avez déjà eu un abonnement gratuit",
    //   };
    // const nbrUserFreeInCity = await numberOfSubInCity({ planId, city });

    // if (nbrUserFreeInCity >= 3)
    //   return {
    //     success: false,
    //     message:
    //       "La limite d'abonnement gratuit dans cette ville a été dépassé",
    //   };

    const result = await saveSubscription({
      paymentId,
      endDate,
      startDate,
      userId,
      planId,
    });
    return result;
  } catch (e) {
    // return {
    //   success: false,
    //   message: error.message,
    // };
    const error =
      e instanceof Error ? e : new Error("Une erreur inconnue s'est produite");
    return { success: false, message: error.message };
  }
};
