import { z } from "zod";

// Validation pour les champs traduisibles (JSON)
const TranslatedStringSchema = z.object({
  fr: z.string().min(1, "Le texte en français est requis"),
  en: z.string().optional(), // L'anglais peut être optionnel au début
});

export const PropertyFormSchema = z.object({
  // Informations de base
  name: TranslatedStringSchema,
  description: TranslatedStringSchema,
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Format de prix invalide"), // On reçoit une string pour le Decimal

  // Relations (IDs envoyés par le formulaire)
  typeId: z.number().int(),
  statusId: z.string(), // C'est un code (ex: 'for_sale') ou un ID selon votre implémentation
  countryId: z.number().int(),

  // Location
  location: z.object({
    streetAddress: z.string().min(5),
    cityId: z.number().int(),
    neighborhood: z.string().optional(),
    zip: z.string().optional(),
    landmark: TranslatedStringSchema.optional(), // JSON optionnel
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),

  // Caractéristiques (Features)
  features: z.object({
    bedrooms: z.number().int().min(0),
    bathrooms: z.number().int().min(0),
    area: z.number().min(1), // m²
    parkingSpots: z.number().int().default(0),
    hasSwimmingPool: z.boolean().default(false),
    hasGardenYard: z.boolean().default(false),
    hasBalcony: z.boolean().default(false),
  }),

  // Contact (souvent pré-rempli avec l'user, mais modifiable)
  contact: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email(),
  }),

  // Images (Pour l'instant, on suppose qu'on reçoit un tableau d'URLs après upload)
  images: z.array(z.string().url()).min(1, "Au moins une image est requise"),
});

export type PropertyFormData = z.infer<typeof PropertyFormSchema>;
