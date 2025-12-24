"use server";

import { prisma } from "@/lib/prisma"; // Assurez-vous que le chemin est bon
import {
  PropertyFormSchema,
  PropertyFormData,
} from "@/lib/validations/property-schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPropertyAction(
  data: PropertyFormData,
  userId: string
) {
  // 1. Validation des données
  const validated = PropertyFormSchema.safeParse(data);

  if (!validated.success) {
    return { success: false, error: validated.error.flatten() };
  }

  const {
    name,
    description,
    price,
    typeId,
    statusId,
    countryId,
    location,
    features,
    contact,
    images,
  } = validated.data;

  try {
    // 2. Création dans la Base de Données (Transaction implicite)
    const newProperty = await prisma.property.create({
      data: {
        // Champs simples
        userId: userId, // L'ID de l'utilisateur connecté
        countryId: countryId,
        typeId: typeId,
        statusId: Number(statusId), // ID numérique attendu par Prisma
        price: Number(price), // convertir la string en number pour Prisma
        isActive: true, // Set to true by default - can be changed later for moderation
        isFeatured: false,
        publishedAt: new Date(), // Set publishedAt to current date

        // Champs JSON (Cast explicite souvent nécessaire pour TS avec Prisma Json)
        name: name as any,
        description: description as any,

        // --- RELATIONS IMBRIQUÉES (Le gros morceau) ---

        // 3. Création de la Location liée
        location: {
          create: {
            streetAddress: location.streetAddress,
            cityId: location.cityId,
            neighborhood: location.neighborhood,
            zip: location.zip,
            latitude: location.latitude,
            longitude: location.longitude,
            landmark: location.landmark as any, // JSON
          },
        },

        // 4. Création des Features liées
        feature: {
          create: {
            bedrooms: features.bedrooms,
            bathrooms: features.bathrooms,
            area: features.area,
            parkingSpots: features.parkingSpots,
            hasSwimmingPool: features.hasSwimmingPool,
            hasGardenYard: features.hasGardenYard,
            hasBalcony: features.hasBalcony,
          },
        },

        // 5. Création du Contact lié
        contact: {
          create: {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
          },
        },

        // 6. Création des Images liées
        images: {
          create: images.map((url, index) => ({
            url: url,
            isMain: index === 0, // La première image est la principale
          })),
        },
      },
    });

    // 7. Revalidation du cache (pour mettre à jour la liste des annonces)
    revalidatePath("/properties"); // Public properties page
    revalidatePath("/user/properties"); // User's own properties page
    revalidatePath("/result"); // Search results page
    revalidatePath("/buy"); // Buy page
    revalidatePath("/rent"); // Rent page

    return { success: true, propertyId: newProperty.id };
  } catch (error) {
    console.error("Erreur lors de la création de l'annonce:", error);
    return { success: false, error: "Erreur serveur lors de la création." };
  }
}
