"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Ajoute le plan Diamant
    await prisma.subscriptionPlan.create({
        data: {
            namePlan: "diamant",
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
    });
    console.log("Seed completed: Plan Diamant has been added.");
}
main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
    console.error("Error during seeding:", e);
    prisma.$disconnect();
    process.exit(1);
});
