import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  {
    namePlan: "Bronze",
    price: 150,
    duration: "AN",
    country: "",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-31"),
    premiumAds: 5,
    photosPerAd: 8,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features:
      "Visibilité élevée, 5 annonces premium, 8 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Argent",
    price: 250,
    duration: "AN",
    country: "",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-31"),
    premiumAds: 10,
    photosPerAd: 8,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features:
      "Visibilité élevée, 10 annonces premium, 8 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Or",
    price: 400,
    duration: "AN",
    country: "",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-31"),
    premiumAds: 20,
    photosPerAd: 10,
    shortVideosPerAd: 0,
    youtubeVideoDuration: "",
    zoneRadius: 0,
    features:
      "Visibilité élevée, 20 annonces premium, 10 photos/annonce, pas de vidéos",
  },
  {
    namePlan: "Diamant",
    price: 1500,
    duration: "AN",
    country: "Maroc",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-01-31"),
    premiumAds: 25,
    photosPerAd: 15,
    shortVideosPerAd: 1,
    youtubeVideoDuration: "30-45 MIN",
    zoneRadius: 30,
    features: "Visibilité maximale",
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.subscriptionPlan.create({ data: plan });
    console.log(`Seed completed: Plan ${plan.namePlan} has been added.`);
  }
  //   await prisma.subscriptionPlan.create({
  //     data: {
  //       namePlan: "Or",
  //       price: 400,
  //       duration: "AN",
  //       country: "",
  //       startDate: new Date("2024-12-01"),
  //       endDate: new Date("2025-01-31"),
  //       premiumAds: 20,
  //       photosPerAd: 10,
  //       shortVideosPerAd: 0,
  //       youtubeVideoDuration: "",
  //       zoneRadius: 0,
  //       features:
  //         "Visibilité élevée, 20 annonces premium, 10 photos/annonce, pas de vidéos",
  //     },
  //   });
  //   console.log("Seed completed: Plan Or has been added.");
  //   // Ajoute le plan Diamant

  //   await prisma.subscriptionPlan.create({
  //     data: {
  //       namePlan: "Diamant",
  //       price: 1500,
  //       duration: "AN",
  //       country: "Maroc",
  //       startDate: new Date("2024-12-01"),
  //       endDate: new Date("2025-01-31"),
  //       premiumAds: 25,
  //       photosPerAd: 15,
  //       shortVideosPerAd: 1,
  //       youtubeVideoDuration: "30-45 MIN",
  //       zoneRadius: 30,
  //       features: "Visibilité maximale",
  //     },
  //   });

  //   console.log("Seed completed: Plan Diamant has been added.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
