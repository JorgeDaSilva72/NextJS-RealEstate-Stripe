import BronzePack from "@/app/[locale]/user/subscription/_components/BronzePack";
import DiamondPack from "@/app/[locale]/user/subscription/_components/DiamondPack";
import GoldPack from "@/app/[locale]/user/subscription/_components/GoldPack";
import GratuitPack from "@/app/[locale]/user/subscription/_components/GratuitPack";
import SilverPack from "@/app/[locale]/user/subscription/_components/SilverPack";
import Visit3DPack from "@/app/[locale]/user/subscription/_components/Visit3DPack";
import { SubscriptionPlan } from "@prisma/client";
import React from "react";

export type PlanName =
  | "gratuit"
  | "bronze"
  | "argent"
  | "or"
  | "diamant"
  | "visite3d";

export const COMPONENT_MAPPING: Record<PlanName, React.FC<any>> = {
  gratuit: GratuitPack,
  bronze: BronzePack,
  argent: SilverPack,
  or: GoldPack,
  diamant: DiamondPack,
  visite3d: Visit3DPack,
};

export const PLAN_ORDER: PlanName[] = [
  "gratuit",
  "bronze",
  "argent",
  "or",
  "diamant",
  "visite3d",
];

// Plans publics avec informations limitées
export const PUBLIC_PLANS: Partial<SubscriptionPlan>[] = [
  {
    namePlan: "Gratuit",
    // price: 0,
    // premiumAds: "2",
    // photosPerAd: "5",
    // shortVideosPerAd: "0",
    // features: ["Publication d'annonces gratuites", "Photos de base incluses"],
  },
  {
    namePlan: "Bronze",
    // price: null, // Prix masqué
    // premiumAds: "5",
    // photosPerAd: "8",
    // shortVideosPerAd: "1",
    // features: ["Annonces premium", "Plus de photos", "Vidéo courte incluse"],
  },
  {
    namePlan: "Argent",
    // price: null, // Prix masqué
    // premiumAds: "5",
    // photosPerAd: "8",
    // shortVideosPerAd: "1",
    // features: ["Annonces premium", "Plus de photos", "Vidéo courte incluse"],
  },
  {
    namePlan: "Or",
    // price: null, // Prix masqué
    // premiumAds: "5",
    // photosPerAd: "8",
    // shortVideosPerAd: "1",
    // features: ["Annonces premium", "Plus de photos", "Vidéo courte incluse"],
  },
  {
    namePlan: "Diamant",
    // price: null, // Prix masqué
    // premiumAds: "5",
    // photosPerAd: "8",
    // shortVideosPerAd: "1",
    // features: ["Annonces premium", "Plus de photos", "Vidéo courte incluse"],
  },
];
