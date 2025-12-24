// "use server";

// import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
// import prisma from "../prisma";
// import { Property } from "@prisma/client";

// export async function saveProperty(
//   propertyData: AddPropertyInputType,
//   imagesUrls: string[],
//   userId: string
// ) {
//   const basic: Omit<Property, "id"> = {
//     name: propertyData.name,
//     description: propertyData.description,
//     price: propertyData.price,
//     statusId: propertyData.statusId,
//     typeId: propertyData.typeId,
//     createdAt: new Date(), // Modif apés l ajout de la colonne dans la table
//     userId,
//   };
//   const result = await prisma.property.create({
//     data: {
//       ...basic,
//       location: {
//         create: propertyData.location,
//       },
//       feature: {
//         create: propertyData.propertyFeature,
//       },
//       contact: {
//         create: propertyData.contact,
//       },
//       images: {
//         create: imagesUrls.map((img) => ({
//           url: img,
//         })),
//       },
//     },
//   });
//   console.log("saveProperty:", { result });
//   return result;
// }

// export async function editProperty(
//   propertyId: number,
//   propertyData: AddPropertyInputType,
//   newImagesUrls: string[],
//   deletedImageIDs: number[]
// ) {
//   const result = await prisma.property.update({
//     where: {
//       id: propertyId,
//     },
//     data: {
//       name: propertyData.name,
//       price: propertyData.price,
//       statusId: propertyData.statusId,
//       typeId: propertyData.typeId,
//       description: propertyData.description,
//       contact: {
//         update: {
//           ...propertyData.contact,
//         },
//       },
//       feature: {
//         update: {
//           ...propertyData.propertyFeature,
//         },
//       },
//       location: {
//         update: {
//           ...propertyData.location,
//         },
//       },
//       images: {
//         create: newImagesUrls.map((img) => ({
//           url: img,
//         })),
//         deleteMany: {
//           id: { in: deletedImageIDs },
//         },
//       },
//     },
//   });

//   console.log("editProperty:", { result });

//   return result;
// }

// export async function deleteProperty(id: number) {
//   const result = await prisma.property.delete({
//     where: {
//       id,
//     },
//   });
//   return result;
// }

// ----------------------------------

// "use server";

// import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
// import prisma from "../prisma";
// import { Property } from "@prisma/client";

// export async function saveProperty(
//   propertyData: AddPropertyInputType,
//   imagesUrls: string[],
//   videoUrls: string[], // Ajouter les vidéos
//   userId: string
// ) {
//   if (!userId) {
//     throw new Error("Utilisateur non authentifié.");
//   }

//   // todo faire un contrôle côté serveur des champs obligatoires

//   // if (
//   //   !propertyData.name ||
//   //   !propertyData.price ||
//   //   !propertyData.statusId ||
//   //   !propertyData.typeId
//   // ) {
//   //   throw new Error("Les champs obligatoires sont manquants.");
//   // }
//   if (!propertyData.name || !propertyData.statusId || !propertyData.typeId) {
//     throw new Error("Les champs obligatoires sont manquants.");
//   }

//   // todo contrôler la limite des annonce en fonction des plans d'abonnement
//   // todo 1 solution : modifier schéma Zod maxImagesAllowed: z.number().optional()

//   // if (imagesUrls.length > (propertyData.maxImagesAllowed || 10)) {
//   //   throw new Error(
//   //     `Le nombre maximal d'images (${propertyData.maxImagesAllowed || 10}) a été dépassé.`
//   //   );
//   // }

//   try {
//     const result = await prisma.$transaction(async (tx) => {
//       const property = await tx.property.create({
//         data: {
//           name: propertyData.name,
//           description: propertyData.description,
//           price: propertyData.price,
//           statusId: propertyData.statusId,
//           typeId: propertyData.typeId,
//           userId,
//           location: {
//             create: propertyData.location,
//           },
//           feature: {
//             create: propertyData.propertyFeature,
//           },
//           contact: {
//             create: propertyData.contact,
//           },
//           images: {
//             create: imagesUrls.map((url) => ({ url })),
//           },
//           videos: {
//             create: videoUrls.map((url) => ({ url })), // Ajout des vidéos
//           },
//         },
//       });
//       return property;
//     });

//     console.log("saveProperty: succès", { result });
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de l'enregistrement de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de l'enregistrement.");
//   }
// }

// export async function editProperty(
//   propertyId: number,
//   propertyData: AddPropertyInputType,
//   newImagesUrls: string[],
//   // newVideosUrls: string[],
//   deletedImageIDs: number[]
//   // deletedvideoIDs: number[]
// ) {
//   // console.log("newVideosUrls:", newVideosUrls);
//   // console.log("deletedvideoIDs:", deletedvideoIDs);

//   if (!propertyId) {
//     throw new Error("L'identifiant de la propriété est requis.");
//   }

//   try {
//     // Définir les données à mettre à jour
//     const dataToUpdate = {
//       name: propertyData.name,
//       price: propertyData.price,
//       statusId: propertyData.statusId,
//       typeId: propertyData.typeId,
//       description: propertyData.description,
//       contact: {
//         update: propertyData.contact,
//       },
//       feature: {
//         update: propertyData.propertyFeature,
//       },
//       location: {
//         update: propertyData.location,
//       },
//       images: {
//         create: newImagesUrls.map((img) => ({
//           url: img,
//         })),
//         deleteMany: {
//           id: { in: deletedImageIDs },
//         },
//       },
//       // videos: {
//       //   create: newVideosUrls.map((vid) => ({
//       //     url: vid,
//       //   })),
//       //   deleteMany: {
//       //     id: { in: deletedvideoIDs },
//       //   },
//       // },
//     };

//     // Log pour débogage
//     console.log(
//       "editProperty: données à mettre à jour",
//       JSON.stringify(dataToUpdate, null, 2)
//     );
//     // Exécuter la requête Prisma
//     const result = await prisma.property.update({
//       where: {
//         id: propertyId,
//       },
//       data: dataToUpdate,
//     });

//     console.log("editProperty: succès", { result });
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la modification de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de la modification.");
//   }
// }

// export async function deleteProperty(id: number) {
//   if (!id) {
//     throw new Error("L'identifiant de la propriété est requis.");
//   }

//   try {
//     const result = await prisma.property.delete({
//       where: { id },
//     });

//     console.log("deleteProperty: succès", { result });
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la suppression de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de la suppression.");
//   }
// }

// JhnRavelo supprime les fichiers quand une annonce est supprimée.

// "use server";

// import { AddPropertyInputType } from "@/app/[locale]/user/properties/add/_components/AddPropertyForm";
// // import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
// import prisma from "../prisma";
// import { Property } from "@prisma/client";

// export async function saveProperty(
//   propertyData: AddPropertyInputType,
//   imagesUrls: string[],
//   videoUrls: string[], // Ajouter les vidéos
//   userId: string
// ) {
//   if (!userId) {
//     throw new Error("Utilisateur non authentifié.");
//   }

//   // todo faire un contrôle côté serveur des champs obligatoires

//   // if (
//   //   !propertyData.name ||
//   //   !propertyData.price ||
//   //   !propertyData.statusId ||
//   //   !propertyData.typeId
//   // ) {
//   //   throw new Error("Les champs obligatoires sont manquants.");
//   // }
//   if (!propertyData.name || !propertyData.statusId || !propertyData.typeId) {
//     throw new Error("Les champs obligatoires sont manquants.");
//   }

//   // todo contrôler la limite des annonce en fonction des plans d'abonnement
//   // todo 1 solution : modifier schéma Zod maxImagesAllowed: z.number().optional()

//   // if (imagesUrls.length > (propertyData.maxImagesAllowed || 10)) {
//   //   throw new Error(
//   //     `Le nombre maximal d'images (${propertyData.maxImagesAllowed || 10}) a été dépassé.`
//   //   );
//   // }

//   try {
//     const result = await prisma.$transaction(async (tx) => {
//       const property = await tx.property.create({
//         data: {
//           name: propertyData.name,
//           description: propertyData.description,
//           price: propertyData.price,
//           statusId: propertyData.statusId,
//           typeId: propertyData.typeId,
//           userId,
//           location: {
//             create: propertyData.location,
//           },
//           feature: {
//             create: propertyData.propertyFeature,
//           },
//           contact: {
//             create: propertyData.contact,
//           },
//           images: {
//             create: imagesUrls.map((url) => ({ url })),
//           },
//           videos: {
//             create: videoUrls.map((url) => ({ url })), // Ajout des vidéos
//           },
//         },
//       });
//       return property;
//     });

//     console.log("saveProperty: succès", { result });
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de l'enregistrement de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de l'enregistrement.");
//   }
// }

// export async function editProperty(
//   propertyId: number,
//   propertyData: AddPropertyInputType,
//   newImagesUrls: string[],
//   deletedImageIDs: number[],
//   newVideosUrls: string[],
//   deletedvideoIDs: number[]
// ) {
//   // console.log("newVideosUrls:", newVideosUrls);
//   // console.log("deletedvideoIDs:", deletedvideoIDs);

//   if (!propertyId) {
//     throw new Error("L'identifiant de la propriété est requis.");
//   }

//   try {
//     // Définir les données à mettre à jour
//     const dataToUpdate = {
//       name: propertyData.name,
//       price: propertyData.price,
//       statusId: propertyData.statusId,
//       typeId: propertyData.typeId,
//       description: propertyData.description,
//       contact: {
//         update: propertyData.contact,
//       },
//       feature: {
//         update: propertyData.propertyFeature,
//       },
//       location: {
//         update: propertyData.location,
//       },
//       images: {
//         create: newImagesUrls.map((img) => ({
//           url: img,
//         })),
//         deleteMany: {
//           id: { in: deletedImageIDs },
//         },
//       },
//       videos: {
//         create: newVideosUrls.map((vid) => ({
//           url: vid,
//         })),
//         deleteMany: {
//           id: { in: deletedvideoIDs },
//         },
//       },
//     };

//     // Log pour débogage
//     console.log(
//       "editProperty: données à mettre à jour",
//       JSON.stringify(dataToUpdate, null, 2)
//     );
//     // Exécuter la requête Prisma
//     const result = await prisma.property.update({
//       where: {
//         id: propertyId,
//       },
//       data: dataToUpdate,
//     });

//     console.log("editProperty: succès", { result });
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la modification de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de la modification.");
//   }
// }

// export async function deleteProperty(id: number) {
//   if (!id) {
//     throw new Error("L'identifiant de la propriété est requis.");
//   }

//   try {
//     const result = await prisma.property.delete({
//       where: { id },
//     });

//     console.log("deleteProperty: succès", { result });
//     return result;
//   } catch (error) {
//     console.error("Erreur lors de la suppression de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de la suppression.");
//   }
// }

// export async function getProperty(id: number) {
//   if (!id) {
//     throw new Error("L'identifiant de la propriété est requis.");
//   }
//   try {
//     const property = await prisma.property.findUnique({
//       where: { id },
//       include: { images: true },
//     });

//     return property;
//   } catch (error) {
//     console.error("Erreur lors de la récupération de la propriété:", error);
//     throw new Error("Une erreur est survenue lors de la récupération.");
//   }
// }

// 09/12/2025 changements pour qu il s adapte à notre nouvelle base de données feature/multilingual-countries

"use server";

// import { AddPropertyInputType } from "@/app/[locale]/user/properties/add/_components/AddPropertyForm";
import prisma from "../prisma";
import { Property } from "@prisma/client";

// 1. Assurez-vous d'importer la fonction getAddPropertyFormSchema
import { getAddPropertyFormSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// 2. Définir AddPropertyInputType comme le type de sortie (output) du schéma Zod
// L'Output de Zod contient les données TRANSFORMÉES (number pour cityId)
export type AddPropertyOutputType = z.infer<
  ReturnType<typeof getAddPropertyFormSchema>
>;

// La fonction reste la même car les données d'entrée (propertyData) sont déjà adaptées
export async function saveProperty(
  // propertyData: AddPropertyOutputType,
  propertyData: any, // Changed to any to accept multilingual structure
  imagesUrls: string[],
  videoUrls: string[],
  userId: string
) {
  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }
  if (!propertyData.name || !propertyData.statusId || !propertyData.typeId) {
    throw new Error("Les champs obligatoires sont manquants.");
  }

  // Handle multilingual name and description
  // If name is already an object, use it as is, otherwise convert string to object
  const multilingualName = typeof propertyData.name === 'object'
    ? propertyData.name
    : { fr: propertyData.name, en: propertyData.name };

  const multilingualDescription = propertyData.description
    ? (typeof propertyData.description === 'object'
      ? propertyData.description
      : { fr: propertyData.description, en: propertyData.description })
    : null;

  // todo contrôler la limite des annonce en fonction des plans d'abonnement
  // todo 1 solution : modifier schéma Zod maxImagesAllowed: z.number().optional()

  // if (imagesUrls.length > (propertyData.maxImagesAllowed || 10)) {
  //   throw new Error(
  //     `Le nombre maximal d'images (${propertyData.maxImagesAllowed || 10}) a été dépassé.`
  //   );
  // }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          name: multilingualName,
          description: multilingualDescription,
          price: propertyData.price,
          statusId: propertyData.statusId,
          typeId: propertyData.typeId,
          userId,
          isActive: true, // Set to true by default
          publishedAt: new Date(), // Set publishedAt to current date
          countryId: propertyData.location?.countryId || propertyData.countryId,
          location: {
            create: propertyData.location as any,
          },
          feature: {
            create: propertyData.propertyFeature,
          },
          contact: {
            create: propertyData.contact,
          },
          images: {
            create: imagesUrls.map((url) => ({ url })),
          },
          videos: {
            create: videoUrls.map((url) => ({ url })),
          },
        },
      });
      return property;
    });

    console.log("saveProperty: succès", { result });
    
    // Revalidate cache to update property listings
    revalidatePath("/properties");
    revalidatePath("/user/properties");
    revalidatePath("/result");
    revalidatePath("/buy");
    revalidatePath("/rent");
    
    return result;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la propriété:", error);
    throw new Error("Une erreur est survenue lors de l'enregistrement.");
  }
}

// Fonction editProperty : Correction de la signature du PropertyId
export async function editProperty(
  propertyId: string, // ✅ CHANGEMENT : Accepte un string pour l'ID
  //propertyData: AddPropertyOutputType,
  
  propertyData: any, // Changed to any to accept multilingual structure
  newImagesUrls: string[],
  deletedImageIDs: number[],
  newVideosUrls: string[],
  deletedvideoIDs: number[]
) {
  if (!propertyId) {
    throw new Error("L'identifiant de la propriété est requis.");
  }

  // Convertir l'ID en nombre pour Prisma (si l'ID est INT dans la BDD)
  const idAsNumber = parseInt(propertyId);
  if (isNaN(idAsNumber)) {
    throw new Error("L'identifiant de la propriété n'est pas valide.");
  }
  // Handle multilingual name and description
  const multilingualName = typeof propertyData.name === 'object'
    ? propertyData.name
    : { fr: propertyData.name, en: propertyData.name };

  const multilingualDescription = propertyData.description
    ? (typeof propertyData.description === 'object'
      ? propertyData.description
      : { fr: propertyData.description, en: propertyData.description })
    : null;

  try {
    const dataToUpdate = {
      name: multilingualName,
      price: propertyData.price,
      statusId: propertyData.statusId,
      typeId: propertyData.typeId,
      description: multilingualDescription,
      contact: {
        update: propertyData.contact,
      },
      feature: {
        update: propertyData.propertyFeature,
      },
      location: {
        update: propertyData.location as any,
      },
      images: {
        create: newImagesUrls.map((img) => ({
          url: img,
        })),
        deleteMany: {
          id: { in: deletedImageIDs },
        },
      },
      videos: {
        create: newVideosUrls.map((vid) => ({
          url: vid,
        })),
        deleteMany: {
          id: { in: deletedvideoIDs },
        },
      },
    };

    const result = await prisma.property.update({
      where: {
        id: idAsNumber, // Utilisation de l'ID converti
      },
      data: dataToUpdate,
    });

    console.log("editProperty: succès", { result });
    return result;
  } catch (error) {
    console.error("Erreur lors de la modification de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la modification.");
  }
}

// Fonction deleteProperty : Correction de la signature du PropertyId
export async function deleteProperty(id: string) {
  // ✅ CHANGEMENT : Accepte un string pour l'ID
  if (!id) {
    throw new Error("L'identifiant de la propriété est requis.");
  }

  const idAsNumber = parseInt(id);
  if (isNaN(idAsNumber)) {
    throw new Error("L'identifiant de la propriété n'est pas valide.");
  }

  try {
    const result = await prisma.property.delete({
      where: { id: idAsNumber }, // Utilisation de l'ID converti
    });
    // ✅ Nouvelle ligne : invalider le cache de la page de la liste
    revalidatePath("/user/properties");
    console.log("deleteProperty: succès", { result });
    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la suppression.");
  }
}

// Fonction getProperty : Correction de la signature du PropertyId
export async function getProperty(id: string) {
  // ✅ CHANGEMENT : Accepte un string pour l'ID
  if (!id) {
    throw new Error("L'identifiant de la propriété est requis.");
  }

  const idAsNumber = parseInt(id);
  if (isNaN(idAsNumber)) {
    throw new Error("L'identifiant de la propriété n'est pas valide.");
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: idAsNumber }, // Utilisation de l'ID converti
      include: { images: true },
    });

    return property;
  } catch (error) {
    console.error("Erreur lors de la récupération de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la récupération.");
  }
}
