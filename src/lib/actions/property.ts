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
"use server";

import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
import prisma from "../prisma";
import { Property } from "@prisma/client";

export async function saveProperty(
  propertyData: AddPropertyInputType,
  imagesUrls: string[],
  userId: string
) {
  if (!userId) {
    throw new Error("Utilisateur non authentifié.");
  }

  // todo faire un contrôle côté serveur des champs obligatoires

  // if (
  //   !propertyData.name ||
  //   !propertyData.price ||
  //   !propertyData.statusId ||
  //   !propertyData.typeId
  // ) {
  //   throw new Error("Les champs obligatoires sont manquants.");
  // }
  if (!propertyData.name || !propertyData.statusId || !propertyData.typeId) {
    throw new Error("Les champs obligatoires sont manquants.");
  }

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
          name: propertyData.name,
          description: propertyData.description,
          price: propertyData.price,
          statusId: propertyData.statusId,
          typeId: propertyData.typeId,
          userId,
          location: {
            create: propertyData.location,
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
        },
      });
      return property;
    });

    console.log("saveProperty: succès", { result });
    return result;
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la propriété:", error);
    throw new Error("Une erreur est survenue lors de l'enregistrement.");
  }
}

export async function editProperty(
  propertyId: number,
  propertyData: AddPropertyInputType,
  newImagesUrls: string[],
  deletedImageIDs: number[]
) {
  if (!propertyId) {
    throw new Error("L'identifiant de la propriété est requis.");
  }

  try {
    // Définir les données à mettre à jour
    const dataToUpdate = {
      name: propertyData.name,
      price: propertyData.price,
      statusId: propertyData.statusId,
      typeId: propertyData.typeId,
      description: propertyData.description,
      contact: {
        update: propertyData.contact,
      },
      feature: {
        update: propertyData.propertyFeature,
      },
      location: {
        update: propertyData.location,
      },
      images: {
        create: newImagesUrls.map((img) => ({
          url: img,
        })),
        deleteMany: {
          id: { in: deletedImageIDs },
        },
      },
    };
    // Exécuter la requête Prisma
    const result = await prisma.property.update({
      where: {
        id: propertyId,
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

export async function deleteProperty(id: number) {
  if (!id) {
    throw new Error("L'identifiant de la propriété est requis.");
  }

  try {
    const result = await prisma.property.delete({
      where: { id },
    });

    console.log("deleteProperty: succès", { result });
    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la suppression.");
  }
}
