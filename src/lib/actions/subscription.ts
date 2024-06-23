"use server";

import prisma from "../prisma";

export const saveSubscription = async ({
  paymentId,
  planId,
  userId,
}: {
  paymentId: string;
  planId: number;
  userId: string;
}) => {
  try {
    await prisma.subscriptions.create({
      data: {
        paymentID: paymentId,
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
      message: "Abonnement enregistré avec succès",
    };
  } catch (e: any) {
    return {
      message: e.message,
    };
  }
};
