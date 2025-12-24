/**
 * Subscription Limits Enforcement
 * 
 * This module enforces subscription plan limits:
 * - Maximum number of listings
 * - Maximum photos per listing
 * - Video upload restrictions
 * - Premium listing features
 */

import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@prisma/client";

export interface SubscriptionLimits {
  maxListings: number; // -1 for unlimited
  photosPerListing: number;
  videosEnabled: boolean;
  premiumListings: number;
}

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  currentCount?: number;
  limit?: number;
}

/**
 * Get user's active subscription limits
 */
export async function getUserSubscriptionLimits(
  userId: string
): Promise<SubscriptionLimits | null> {
  const subscription = await prisma.subscriptions.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: new Date(),
      },
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!subscription || !subscription.plan) {
    return null; // No active subscription
  }

  const plan = subscription.plan;

  return {
    maxListings: plan.premiumAds === 999 ? -1 : plan.premiumAds, // 999 = unlimited
    photosPerListing: plan.photosPerAd,
    videosEnabled: plan.shortVideosPerAd > 0,
    premiumListings: plan.premiumAds === 999 ? -1 : plan.premiumAds,
  };
}

/**
 * Check if user can create a new listing
 */
export async function canCreateListing(
  userId: string
): Promise<LimitCheckResult> {
  const limits = await getUserSubscriptionLimits(userId);

  if (!limits) {
    return {
      allowed: false,
      reason: "Vous devez avoir un abonnement actif pour publier des annonces.",
    };
  }

  // Unlimited listings
  if (limits.maxListings === -1) {
    return { allowed: true };
  }

  // Count existing listings
  const currentCount = await prisma.property.count({
    where: {
      userId,
    },
  });

  if (currentCount >= limits.maxListings) {
    return {
      allowed: false,
      reason: `Vous avez atteint la limite de ${limits.maxListings} annonces pour votre plan actuel. Passez au plan supérieur pour continuer.`,
      currentCount,
      limit: limits.maxListings,
    };
  }

  return {
    allowed: true,
    currentCount,
    limit: limits.maxListings,
  };
}

/**
 * Check if user can upload photos for a listing
 */
export async function canUploadPhotos(
  userId: string,
  listingId: number,
  photoCount: number
): Promise<LimitCheckResult> {
  const limits = await getUserSubscriptionLimits(userId);

  if (!limits) {
    return {
      allowed: false,
      reason: "Vous devez avoir un abonnement actif pour uploader des photos.",
    };
  }

  // Count existing photos for this listing
  const existingPhotos = await prisma.propertyImage.count({
    where: {
      propertyId: listingId,
    },
  });

  const totalPhotos = existingPhotos + photoCount;

  if (totalPhotos > limits.photosPerListing) {
    return {
      allowed: false,
      reason: `Vous avez atteint la limite de ${limits.photosPerListing} photos par annonce pour votre plan actuel.`,
      currentCount: existingPhotos,
      limit: limits.photosPerListing,
    };
  }

  return {
    allowed: true,
    currentCount: existingPhotos,
    limit: limits.photosPerListing,
  };
}

/**
 * Check if user can upload videos
 */
export async function canUploadVideo(
  userId: string
): Promise<LimitCheckResult> {
  const limits = await getUserSubscriptionLimits(userId);

  if (!limits) {
    return {
      allowed: false,
      reason: "Vous devez avoir un abonnement actif pour uploader des vidéos.",
    };
  }

  if (!limits.videosEnabled) {
    return {
      allowed: false,
      reason: "Votre plan actuel ne permet pas l'upload de vidéos. Passez au plan Diamant pour activer cette fonctionnalité.",
    };
  }

  return { allowed: true };
}

/**
 * Get upgrade message for user
 */
export async function getUpgradeMessage(userId: string): Promise<string | null> {
  const subscription = await prisma.subscriptions.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: new Date(),
      },
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!subscription || !subscription.plan) {
    return "Vous n'avez pas d'abonnement actif. Abonnez-vous pour commencer à publier des annonces.";
  }

  const planName = subscription.plan.namePlan.toLowerCase();

  if (planName === "bronze") {
    return "Passez au plan Argent pour augmenter vos limites.";
  } else if (planName === "argent") {
    return "Passez au plan Or pour augmenter vos limites.";
  } else if (planName === "or") {
    return "Passez au plan Diamant pour des fonctionnalités illimitées.";
  }

  return null;
}




