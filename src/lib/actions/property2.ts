"use server";

import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PropertyFormOutputType, PropertyFormInputType, PropertyFormSchema } from "../schemas/property2";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";

// Importez votre fonction de suppression d'image de l'hébergeur
import { removeImages } from "@/lib/upload"; 

// Type de réponse pour toutes les Server Actions
interface ServerActionResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}




/**
 * Server Action pour créer une nouvelle annonce immobilière.
 * @param formData - Les données du formulaire client.
 * @returns Un objet indiquant le succès ou les erreurs.
 */
export async function createPropertyAction(
  formData: PropertyFormInputType
): Promise<ServerActionResponse> {
  // 1. Authentification et Autorisation
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }
  
  // (OPTIONNEL) Ajouter ici la logique de vérification d'abonnement et de limite.

  // 2. Validation des Données (Zod)
  try {
    const validatedData = PropertyFormSchema.parse(formData);
    
    const { 
      typeId,
      statusId,
      price,
      currency,
      name,
      description,
      feature,
      location,
      contact,
      images,
      videos
    } = validatedData;
    
    // 3. Création en Cascade dans Prisma
    await prisma.property.create({
      data: {
        // Champs de la table Property
        userId: user.id,
        typeId,
        statusId,
        price,
        currency,
        name: name as any,         // JSONB: Pas besoin de stringify, Prisma le gère
        description: description as any, // JSONB
        countryId: location.countryId,

        // Création des relations imbriquées (Nested Writes)
        location: {
          create: {
            streetAddress: location.streetAddress ?? "",
            cityId: location.cityId,
            neighborhood: location.neighborhood ?? null,
           zip: location.zip ?? null,
            // JSONB
            landmark: location.landmark as any,
           latitude: location.latitude ?? null,
           longitude: location.longitude ?? null,
          }
        },
        feature: {
          create: {
            ...feature
          }
        },
        contact: {
          create: {
            ...contact
          }
        },
        // Création des listes de médias
        images: {
          createMany: {
            data: images
          }
        },
        videos: {
          createMany: {
            data: (validatedData.videos || []).map(v => ({ url: v.url })) // Si le schéma PropertyVideo est plus simple
          }
        }
      }
    });

    // 4. Invalidation du Cache (pour que la nouvelle annonce apparaisse sur la page d'accueil)
    revalidatePath('/');
    
    return { success: true, message: "Annonce créée avec succès !" };

  } catch (error) {
    console.error("Erreur de création de propriété:", error);
    
    if (error instanceof ZodError) {
      // Formater les erreurs Zod pour le client
      const formattedErrors: Record<string, string[]> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        formattedErrors[path] = formattedErrors[path] || [];
        formattedErrors[path].push(err.message);
      });
      return { success: false, message: "Erreur de validation des données.", errors: formattedErrors };
    }
    
    return { success: false, message: "Une erreur inattendue est survenue lors de la création." };
  }
}


/**
 * Server Action pour éditer une annonce immobilière existante.
 * @param propertyId - L'ID de la propriété à éditer (string).
 * @param formData - Les données du formulaire client (incluant les médias ajoutés).
 * @param deletedImageIDs - IDs DB des images à supprimer.
 * @param deletedVideoIDs - IDs DB des vidéos à supprimer.
 * @returns Un objet indiquant le succès ou les erreurs.
 */
export async function editPropertyAction(
  propertyId: string, 
  formData: PropertyFormInputType,
  deletedImageIDs: number[],
  deletedVideoIDs: number[]
): Promise<ServerActionResponse> {
  // 1. Authentification et Autorisation
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return { success: false, message: "Non autorisé. Veuillez vous connecter." };
  }
  
  // 2. Validation des Données (Zod)
  let validatedData;
  try {
    // Valide les données brutes (string) et les transforme en format final (number, JSONB, etc.)
    validatedData = PropertyFormSchema.parse(formData);
  } catch (error) {
    if (error instanceof ZodError) {
      // Formater et retourner les erreurs Zod (Même logique que createPropertyAction)
      const formattedErrors: Record<string, string[]> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        formattedErrors[path] = formattedErrors[path] || [];
        formattedErrors[path].push(err.message);
      });
      return { success: false, message: "Erreur de validation des données.", errors: formattedErrors };
    }
    return { success: false, message: "Une erreur de validation inattendue est survenue." };
  }

  // 3. LOGIQUE D'ÉDITION AVANCÉE (Suppression des Fichiers Externes)
  try {
    const { 
      typeId,
      statusId,
      price,
      currency,
      name,
      description,
      feature,
      location,
      contact,
      images, 
      videos 
    } = validatedData;

    // A. Suppression des anciens fichiers de l'hébergeur (si nécessaire)
    if (deletedImageIDs.length > 0) {
        // 🚨 Étape critique : Récupérer les URLs des images DB à supprimer
        const imagesToDelete = await prisma.propertyImage.findMany({
            where: { id: { in: deletedImageIDs } },
            select: { url: true }
        });
        const deletedImageURLs = imagesToDelete.map(item => item.url.split("/").at(-1)).filter(Boolean) as string[];

        // Appeler la fonction de suppression de l'hébergeur
        await removeImages(deletedImageURLs, "propertyImages");
    }

    // B. Mise à jour en cascade dans Prisma
    await prisma.property.update({
      where: { id: Number(propertyId), userId: user.id }, // Sécurité et ciblage
      data: {
        // Champs directs
        typeId,
        statusId,
        price,
        currency,
        name: name as any, // JSONB
        description: description as any, // JSONB

        // 1. Mise à jour des relations de 1 à 1 (Location, Feature, Contact)
        location: { update: { ...location,landmark : location.landmark as any } }, // Force le type JSONB
        feature: { update: { ...feature } },
        contact: { update: { ...contact } },

        // 2. Mise à jour des relations de 1 à N (Images, Vidéos)
        images: {
          // Supprime les enregistrements DB correspondant aux IDs marqués pour suppression
          deleteMany: { id: { in: deletedImageIDs } }, 
          // Crée les NOUVEAUX enregistrements qui n'ont pas encore d'ID DB (ceux qui viennent d'être uploadés)
          createMany: {
            data: images.filter(img => !('id' in img)).map(img => ({
                url: img.url, 
                caption: img.caption, 
                isMain: img.isMain,
                displayOrder: img.displayOrder 
            }))
          }
        },
        videos: {
          deleteMany: { id: { in: deletedVideoIDs } },
          createMany: {
            data: (validatedData.videos || []).map(v => ({ url: v.url }))
          }
        }
      }
    });

    // 4. Invalidation du Cache
    revalidatePath('/');
    revalidatePath(`/user/properties`); // Page de liste des propriétés de l'utilisateur

    return { success: true, message: "Annonce modifiée avec succès." };

  } catch (error) {
    console.error("Erreur d'édition de propriété:", error);
    return { success: false, message: "Une erreur inattendue est survenue lors de la modification." };
  }
}