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

"use server";

import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
import prisma from "../prisma";
import { Property } from "@prisma/client";
import { sendEmail } from "@/app/services/searchService";
import { NextResponse } from "next/server";

export async function saveProperty(
  propertyData: AddPropertyInputType,
  imagesUrls: string[],
  videoUrls: string[], // Ajouter les vidéos
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
          videos: {
            create: videoUrls.map((url) => ({ url })), // Ajout des vidéos
          },
        },
      });
      return property;
    });

    console.log("saveProperty: succès", { result });
    // const emailList = [
    //   'tahirynirina001@gmail.com',
    //   'rivahravelomanantsoa@gmail.com',
    //   'ramihantavololoniaina@gmail.com'
    // ];
    // const emailPromises = emailList.map(email => sendEmail(email));
    // try {
    //   await Promise.all(emailPromises);
    //   console.log("Tous les e-mails ont été envoyés.");
    // } catch (error) {
    //   console.error("Erreur lors de l'envoi des e-mails :", error);
    // }

    try {
      // Récupérer les recherches sauvegardées
      const savedSearches = await prisma.savedSearch.findMany();
      // Récupérer toutes les propriétés avec leur localisation
      const properties = await prisma.property.findMany({
        include: {
          location: true,
        }
      });

      for (const search of savedSearches) {
        // Filtrer les propriétés en fonction des critères de recherche
        const matchingProperties = properties.filter((property) => {
          const isQueryStatusMatching = search.queryStatus === property.statusId;
          const isQueryTypeMatching = search.queryType === property.typeId;
          const isCountryMatching = !search.country || search.country.toLowerCase() === property.location?.state.toLowerCase();

          // Vérification finale de tous les critères
          return isQueryStatusMatching && isQueryTypeMatching && isCountryMatching;
        });

        // Si des propriétés correspondent, envoyer un email
        if (matchingProperties.length > 0) {
          console.log(`Propriétés correspondantes trouvées pour la recherche "${search.name}" de l'utilisateur ${search.userId}.`);

          // Récupérer l'utilisateur associé à la recherche sauvegardée
          const user = await prisma.savedSearch.findUnique({
            where: {
              id: search.id, // Utilisez l'ID de la recherche pour trouver l'utilisateur
            },
            include: {
              user: true, // Inclure l'utilisateur
            }
          });
          if (user && user.user) {
            const userEmail = user.user.email;  // Accédez correctement à l'email

            // Envoi de l'email
            await sendEmail(userEmail);  // Appel à la fonction d'envoi d'email
          } else {
            console.log('Aucun utilisateur trouvé pour cette recherche sauvegardée.');
          }
        }
      }

      return NextResponse.json(
        { message: "Matching properties processed successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      return NextResponse.json(
        { error: "Failed to process matching properties" },
        { status: 500 }
      );
    }


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
  deletedImageIDs: number[],
  newVideosUrls: string[],
  deletedvideoIDs: number[]
) {
  // console.log("newVideosUrls:", newVideosUrls);
  // console.log("deletedvideoIDs:", deletedvideoIDs);

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
      videos: {
        create: newVideosUrls.map((vid) => ({
          url: vid,
        })),
        deleteMany: {
          id: { in: deletedvideoIDs },
        },
      },
    };

    // Log pour débogage
    console.log(
      "editProperty: données à mettre à jour",
      JSON.stringify(dataToUpdate, null, 2)
    );
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

export async function getProperty(id: number) {
  if (!id) {
    throw new Error("L'identifiant de la propriété est requis.");
  }
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    return property;
  } catch (error) {
    console.error("Erreur lors de la récupération de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la récupération.");
  }
}
