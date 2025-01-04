"use server";

import prisma from "../prisma";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function updateUserAvatar(avatarUrl: string, userId: string) {
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatarUrl: avatarUrl,
    },
  });
}

export async function isUserDiamant(propertyId?: number, userId?: string) {
  const currentDate = new Date();
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    }
  })
  if (!property && propertyId) return false;
  if (property?.userId || userId) {
    const userFound = await prisma.user.findUnique({
      where: {
        id: property?.userId ? property.userId : userId ? userId : "",
        subscriptions: {
          some: {
            plan: {
              namePlan: {
                in: ["diamant", "Diamant"]
              }
            },
            endDate: {
              gt: currentDate,
            }
          }
        }
      },
    })
    return userFound ? true : false;
  } else return false;

}
