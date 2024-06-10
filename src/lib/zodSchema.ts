import validator from "validator";
import { unknown, z } from "zod";

export const AddPropertyFormSchema = z.object({
  name: z.string().min(1, "Veuillez indiquer un titre"),
  description: z.string().min(1, "Veuillez indiquer une description"),
  typeId: z
    .string()
    .min(1, "Veuillez selectionner un type")
    .transform((data: unknown) => Number(data)),
  statusId: z
    .string()
    .min(1, "Veuillez selectionner un statut")
    .transform((data: unknown) => Number(data)),
  price: z
    .string()
    .min(1, "Veuillez indiquer le prix")
    .regex(new RegExp("^[0-9]+$"), "Veuillez indiquer le prix")
    .transform((data: unknown) => Number(data)),
  location: z.object({
    streetAddress: z.string().min(1, "Veuillez indiquer l'adresse postale"),
    city: z.string().min(1, "Veuillez indiquer le nom de la ville"),
    state: z.string().min(1, "Veuillez indiquer le nom de l'état"),
    zip: z.string(),
    // .refine(
    //   (data) => validator.isPostalCode(data, "US"),
    //   "Enter the zip code"
    // ),
    region: z.string().min(1, "Veuillez indiquer la région"),
    landmark: z.string(),
  }),
  propertyFeature: z.object({
    bedrooms: z
      .string()
      .regex(new RegExp("^[0-9]+$"), "Veuillez indiquer le nombre de chambres")
      .transform((data: unknown) => Number(data)),
    bathrooms: z
      .string()
      .regex(
        new RegExp("^[0-9]+$"),
        "Veuillez indiquer le nombre de salles de bains"
      )
      .transform((data: unknown) => Number(data)),
    parkingSpots: z
      .string()
      .regex(
        new RegExp("^[0-9]+$"),
        "Veuillez indiquer le nombre de places de stationnement"
      )
      .transform((data: unknown) => Number(data)),
    area: z
      .string()
      .regex(new RegExp("^[0-9]+$"), "Veuillez indiquer la superficie en m²")
      .transform((data: unknown) => Number(data)),
    hasSwimmingPool: z.boolean(),
    hasGardenYard: z.boolean(),
    hasBalcony: z.boolean(),
  }),
  contact: z.object({
    name: z.string().min(1, "Veuillez indiquer le nom du contact"),
    phone: z
      .string()
      .refine(
        validator.isMobilePhone,
        "Veuillez indiquer un numéro de téléphone valide"
      ),
    email: z.string().email(),
  }),
});
