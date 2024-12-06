import prisma from "@/lib/prisma";

async function createProperty() {
    try {
        // Récupérer l'ID du type et du statut à partir de leur valeur
        const propertyType = await prisma.propertyType.findUnique({
            where: { value: "Appartement" }, // "Appartement" est une valeur dans votre PropertyType
        });

        const propertyStatus = await prisma.propertyStatus.findUnique({
            where: { value: "Location" }, // "Vente" est une valeur dans votre PropertyStatus
        });

        // Si l'un des deux n'existe pas, lancer une erreur
        if (!propertyType || !propertyStatus) {
            throw new Error("Le type ou le statut spécifié n'existe pas.");
        }

        // Créer la propriété
        const newProperty = await prisma.property.create({
            data: {
                name: "Appartement à Paris",
                description: "Un magnifique appartement en plein cœur de Paris",
                price: 500000,
                userId: "kp_08e7f216b79347b694f2fc8dc41befc3", // Assurez-vous que l'utilisateur existe dans votre base
                typeId: propertyType.id, // Utilisez `typeId` pour connecter la relation
                statusId: propertyStatus.id, // Utilisez `statusId` pour connecter la relation
                location: {
                    create: {
                        streetAddress: "12 Rue de Paris",
                        city: "Agadir",
                        state: "Maroc",
                        zip: "75001",
                        region: "Paris",
                        landmark: "Près de la gare",
                    },
                },
                feature: {
                    create: {
                        bedrooms: 3,
                        bathrooms: 2,
                        parkingSpots: 1,
                        area: 120,
                        hasSwimmingPool: false,
                        hasGardenYard: true,
                        hasBalcony: true,
                    },
                },
                images: {
                    create: [
                        {
                            url: "https://example.com/image1.jpg",
                        },
                        {
                            url: "https://example.com/image2.jpg",
                        },
                    ],
                },
                videos: {
                    create: [
                        {
                            url: "https://example.com/video1.mp4",
                        },
                        {
                            url: "https://example.com/video2.mp4",
                        },
                    ],
                },
            },
        });

        console.log("Nouvelle propriété créée :", newProperty);
    } catch (error) {
        console.error("Erreur lors de la création de la propriété :", error);
    }
}

createProperty();
