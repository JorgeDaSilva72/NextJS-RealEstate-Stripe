// import validator from "validator";
// import { unknown, z } from "zod";

// export const AddPropertyFormSchema = z.object({
//   name: z.string().min(1, "Veuillez indiquer un titre"),
//   description: z.string().min(1, "Veuillez indiquer une description"),
//   typeId: z
//     .string()
//     .min(1, "Veuillez selectionner un type")
//     .transform((data: unknown) => Number(data)),
//   statusId: z
//     .string()
//     .min(1, "Veuillez selectionner un statut")
//     .transform((data: unknown) => Number(data)),
//   price: z
//     .string()
//     .min(1, "Veuillez indiquer le prix")
//     .regex(new RegExp("^[0-9]+$"), "Veuillez indiquer le prix")
//     .transform((data: unknown) => Number(data)),
//   location: z.object({
//     // streetAddress: z.string().min(1, "Veuillez indiquer l'adresse postale"),
//     streetAddress: z.string(),
//     city: z.string().min(1, "Veuillez indiquer le nom de la ville"),
//     state: z.string().min(1, "Veuillez indiquer le nom du pays"),
//     // zip: z.string().min(1, "Veuillez indiquer le numéro de boîte postale"),
//     zip: z.string(),

//     // .refine(
//     //   (data) => validator.isPostalCode(data, "US"),
//     //   "Enter the zip code"
//     // ),
//     // region: z.string().min(1, "Veuillez indiquer la région"),
//     region: z.string(),
//     landmark: z.string(),
//   }),
//   propertyFeature: z.object({
//     // bedrooms: z
//     //   .string()
//     //   .regex(new RegExp("^[0-9]+$"), "Veuillez indiquer le nombre de chambres")
//     //   .transform((data: unknown) => Number(data)),
//     bedrooms: z
//       .number({
//         invalid_type_error: "Veuillez indiquer le nombre de chambres",
//       })
//       .int()
//       .min(0, "Le nombre de chambres ne peut pas être négatif"),
//     // bathrooms: z
//     //   .string()
//     //   .regex(
//     //     new RegExp("^[0-9]+$"),
//     //     "Veuillez indiquer le nombre de salles de bains"
//     //   )
//     //   .transform((data: unknown) => Number(data)),
//     bathrooms: z
//       .number({
//         invalid_type_error: "Veuillez indiquer le nombre de salles de bains",
//       })
//       .int()
//       .min(0, "Le nombre dealles de bains ne peut pas être négatif"),
//     // parkingSpots: z
//     //   .string()
//     //   .regex(
//     //     new RegExp("^[0-9]+$"),
//     //     "Veuillez indiquer le nombre de places de stationnement"
//     //   )
//     //   .transform((data: unknown) => Number(data)),
//     parkingSpots: z
//       .number({
//         invalid_type_error:
//           "Veuillez indiquer le nombre de places de stationnement",
//       })
//       .int()
//       .min(0, "Le nombre de places de stationnement ne peut pas être négatif"),

//     // area: z
//     //   .string()
//     //   .regex(new RegExp("^[0-9]+$"), "Veuillez indiquer la superficie en m²")
//     //   .transform((data: unknown) => Number(data)),

//     area: z
//       .number({
//         invalid_type_error: "Veuillez indiquer la superficie en m²",
//       })
//       .int()
//       .min(0, "La superficie ne peut pas être négatif"),

//     hasSwimmingPool: z.boolean(),
//     hasGardenYard: z.boolean(),
//     hasBalcony: z.boolean(),
//   }),
//   contact: z.object({
//     name: z.string().min(1, "Veuillez indiquer le nom du contact"),
//     phone: z
//       .string()
//       .refine(
//         validator.isMobilePhone,
//         "Veuillez indiquer un numéro de téléphone valide"
//       ),
//     email: z.string().email(),
//   }),
// });

// ----------------------------------------------------------
// next-intl with chatgpt

// import validator from "validator";
// import { unknown, z } from "zod";

// export const getAddPropertyFormSchema = (t: (key: string) => string) =>
//   z.object({
//     name: z.string().min(1, { message: t("validation.titleRequired") }),
//     description: z
//       .string()
//       .min(1, { message: t("validation.descriptionRequired") }),
//     typeId: z
//       .string()
//       .min(1, { message: t("validation.typeRequired") })
//       .transform((data: unknown) => Number(data)),
//     statusId: z
//       .string()
//       .min(1, { message: t("validation.statusRequired") })
//       .transform((data: unknown) => Number(data)),
//     price: z
//       .string()
//       .min(1, { message: t("validation.priceRequired") })
//       .regex(new RegExp("^[0-9]+$"), { message: t("validation.priceInvalid") })
//       .transform((data: unknown) => Number(data)),
//     location: z.object({
//       streetAddress: z.string(),
//       city: z.string().min(1, { message: t("validation.cityRequired") }),
//       state: z.string().min(1, { message: t("validation.countryRequired") }),
//       zip: z.string(),
//       region: z.string(),
//       landmark: z.string(),
//     }),
//     propertyFeature: z.object({
//       bedrooms: z
//         .number({ invalid_type_error: t("validation.bedroomsRequired") })
//         .int()
//         .min(0, { message: t("validation.bedroomsNegative") }),
//       bathrooms: z
//         .number({ invalid_type_error: t("validation.bathroomsRequired") })
//         .int()
//         .min(0, { message: t("validation.bathroomsNegative") }),
//       parkingSpots: z
//         .number({ invalid_type_error: t("validation.parkingRequired") })
//         .int()
//         .min(0, { message: t("validation.parkingNegative") }),
//       area: z
//         .number({ invalid_type_error: t("validation.areaRequired") })
//         .int()
//         .min(0, { message: t("validation.areaNegative") }),
//       hasSwimmingPool: z.boolean(),
//       hasGardenYard: z.boolean(),
//       hasBalcony: z.boolean(),
//     }),
//     contact: z.object({
//       name: z.string().min(1, { message: t("validation.contactNameRequired") }),
//       phone: z.string().refine(validator.isMobilePhone, {
//         message: t("validation.phoneInvalid"),
//       }),
//       email: z.string().email({ message: t("validation.emailInvalid") }),
//     }),
//   });

// 08/12/2025 pour s adapter au nouveau prisma feature/multlingual-countries

import validator from "validator";
import { unknown, z } from "zod";

export const getAddPropertyFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, { message: t("validation.titleRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),

    // Type et Status restent corrects (string -> Number pour l'ID)
    // typeId: z
    //   .string()
    //   .min(1, { message: t("validation.typeRequired") })
    //   .transform((data: unknown) => Number(data)),
    // statusId: z
    //   .string()
    //   .min(1, { message: t("validation.statusRequired") })
    //   .transform((data: unknown) => Number(data)),
    // price: z
    //   .string()
    //   .min(1, { message: t("validation.priceRequired") })
    //   .regex(new RegExp("^[0-9]+$"), { message: t("validation.priceInvalid") })
    //   .transform((data: unknown) => Number(data)),

    // 🎯 CORRECTION D'INPUT POUR ACCEPTATION D'ÉDITION (number ou string)
    typeId: z
      .preprocess(
        (val) => (typeof val === "number" ? String(val) : val),
        z.string().min(1, { message: t("validation.typeRequired") })
      )
      .transform((data: unknown) => Number(data)),

    statusId: z
      .preprocess(
        (val) => (typeof val === "number" ? String(val) : val),
        z.string().min(1, { message: t("validation.statusRequired") })
      )
      .transform((data: unknown) => Number(data)),

    // CORRECTION POUR PRICE
    price: z
      .preprocess(
        (val) => (typeof val === "number" ? String(val) : val),
        z
          .string()
          .min(1, { message: t("validation.priceRequired") })
          .regex(new RegExp("^[0-9]+$"), {
            message: t("validation.priceInvalid"),
          })
      )
      .transform((data: unknown) => Number(data)),

    // 🎯 MISE À JOUR CRITIQUE POUR LA LOCATION
    // location: z.object({
    //   // L'ID de la ville est maintenant requis et doit être un nombre
    //   cityId: z
    //     .string()
    //     .min(1, { message: t("validation.cityRequired") })
    //     .transform((data: unknown) => Number(data)),
    // CORRECTION POUR cityId
    location: z.object({
      cityId: z
        .preprocess(
          (val) => (typeof val === "number" ? String(val) : val),
          z.string().min(1, { message: t("validation.cityRequired") })
        )
        .transform((data: unknown) => Number(data)),
      // Les autres champs sont maintenant optionnels (ils peuvent être null ou vides selon le formulaire)
      // Si vous ne collectez pas ces champs via le formulaire, retirez-les.
      streetAddress: z.string().optional(),

      // Les autres champs deviennent optionnels et peuvent être omis s'ils sont gérés par le CityId
      // NOTE : Si vous avez des champs de région/pays dans le formulaire, ils doivent être passés comme IDs.
      // regionId: z.string().optional().transform((data: unknown) => (data ? Number(data) : undefined)),
      // countryId: z.string().optional().transform((data: unknown) => (data ? Number(data) : undefined)),

      // Conservons les champs textuels si votre formulaire continue de les soumettre mais les rendons optionnels.
      // Si la base de données n'a plus ces colonnes, elles doivent être supprimées ici.
      // Basé sur votre schéma PropertyLocation: il n'y a plus de colonne 'state'/'region'/'country'/'city' textuelle.
      // zip et landmark sont dans PropertyLocation.
      zip: z.string().optional(),
      landmark: z.string().optional(),

      // Champs GPS (assumons qu'ils sont envoyés comme nombres si définis)
      latitude: z.number().optional().nullable(),
      longitude: z.number().optional().nullable(),
    }),

    // Les Features et le Contact restent inchangés
    propertyFeature: z.object({
      bedrooms: z
        .number({ invalid_type_error: t("validation.bedroomsRequired") })
        .int()
        .min(0, { message: t("validation.bedroomsNegative") }),
      bathrooms: z
        .number({ invalid_type_error: t("validation.bathroomsRequired") })
        .int()
        .min(0, { message: t("validation.bathroomsNegative") }),
      parkingSpots: z
        .number({ invalid_type_error: t("validation.parkingRequired") })
        .int()
        .min(0, { message: t("validation.parkingNegative") }),
      area: z
        .number({ invalid_type_error: t("validation.areaRequired") })
        .int()
        .min(0, { message: t("validation.areaNegative") }),
      hasSwimmingPool: z.boolean(),
      hasGardenYard: z.boolean(),
      hasBalcony: z.boolean(),
    }),
    contact: z.object({
      name: z.string().min(1, { message: t("validation.contactNameRequired") }),
      phone: z.string().refine(validator.isMobilePhone, {
        message: t("validation.phoneInvalid"),
      }),
      email: z.string().email({ message: t("validation.emailInvalid") }),
    }),
  });
