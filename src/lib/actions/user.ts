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
  
  // Only query property if propertyId is provided and valid
  let property = null;
  if (propertyId !== undefined && propertyId !== null) {
    property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      }
    });
    if (!property) return false;
  }
  
  // Determine which userId to use
  const targetUserId = property?.userId || userId;
  if (!targetUserId) return false;
  
  // Check if user has an active Diamant subscription
  const userFound = await prisma.user.findFirst({
    where: {
      id: targetUserId,
      subscriptions: {
        some: {
          plan: {
            namePlan: {
              in: ["diamant", "Diamant"]
            }
          },
          endDate: {
            gt: currentDate,
          },
          status: "ACTIVE"
        }
      }
    },
  });
  
  return !!userFound;
}
