import { z } from "zod";

// Schéma pour les champs multilingues (name, description, landmark)

export const MultilingualTextSchema = z.object({
  fr: z.string().optional().or(z.literal("")), 
  en: z.string().optional().or(z.literal("")),
  // Ajoutez d'autres locales si nécessaire
});

// Pour garder le Titre et la Description obligatoires, créez un schéma spécifique :
// export const MandatoryMultilingualSchema = z.object({
//   fr: z.string().min(1, "La traduction française est obligatoire."),
//   en: z.string().optional(),
// });

// Schéma pour les caractéristiques
export const PropertyFeatureSchema = z.object({
  bedrooms: z.number().int().min(1, "Doit avoir au moins 1 chambre."),
  bathrooms: z.number().int().min(1, "Doit avoir au moins 1 salle de bain."),
  parkingSpots: z.number().int().min(0),
  area: z.number().int().min(10, "La surface doit être d'au moins 10 m²."),
  hasSwimmingPool: z.boolean(),
  hasGardenYard: z.boolean(),
  hasBalcony: z.boolean(),
  floor: z.number().int().min(0).optional(),
  totalFloors: z.number().int().min(1).optional(),
  yearBuilt: z.number().int().min(1900).optional(),
});

// Schéma pour la localisation
export const PropertyLocationSchema = z.object({
  // countryId: z.number().int().min(1, "Le pays est obligatoire."),
  countryId: z.number().int().optional(),
  cityId: z.number().int().min(1, "La ville est obligatoire."),
  // streetAddress: z.string().min(5, "L'adresse est obligatoire."),
  streetAddress: z.string().optional(),
  neighborhood: z.string().optional(),
  zip: z.string().optional(),
  // landmark est multilingue
  landmark: MultilingualTextSchema.optional(),
  latitude: z.number().optional(), // Coordonnées GPS
  longitude: z.number().optional(),
});

// Schéma pour les images
export const PropertyImageSchema = z.object({
  url: z.string().url("L'URL de l'image n'est pas valide."),
  caption: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isMain: z.boolean().optional(),
});

// Schéma pour les contacts
export const ContactSchema = z.object({
  name: z.string().min(2, "Le nom du contact est obligatoire."),
  phone: z.string().min(8, "Le numéro de téléphone est obligatoire."),
  email: z.string().email("L'adresse e-mail est invalide."),
});

// Schéma principal pour la création d'une propriété
export const PropertyFormSchema = z.object({
  // Champs de la table Property
  typeId: z.string().min(1, "Le type est obligatoire.").transform(val => Number(val)),
  statusId: z.string().min(1, "Le statut est obligatoire.").transform(val => Number(val)),
  price: z.string().min(1, "Le prix est obligatoire.").transform(val => Number(val)),
  currency: z.string().min(1, "La devise est obligatoire."), // Ex: XOF
  countryId: z.string().optional().transform(val => Number(val)),
  
  // Champs Multilingues (JSONB)
  name: MultilingualTextSchema,
  description: MultilingualTextSchema,
  
  // Relations imbriquées (Création en cascade)
  feature: PropertyFeatureSchema,
  location: PropertyLocationSchema.extend({
      // Vous devez transformer les IDs ici aussi s'ils sont dans le sous-schéma
      cityId: z.string().min(1).transform(val => Number(val)), // Exemple si cityId est dans le sous-schéma
  }),
  contact: ContactSchema,
  
  // Liste d'images et de vidéos
  images: z.array(PropertyImageSchema).min(1, "Au moins une image est obligatoire."),
  // Simplifié pour l'instant
  videos: z.array(z.object({ url: z.string().url() })).optional(), 
});




// 🚨 Les deux types dont vous avez besoin :

// 1. PropertyFormInputType: Le type des données BRUTES reçues du formulaire (avant transformation Zod).
//    C'est le type à utiliser dans `useForm<...>` et le `onSubmit` de React Hook Form.
export type PropertyFormInputType = z.input<typeof PropertyFormSchema>;// <- Ce type attendra des STRING

// 2. PropertyFormOutputType: Le type des données TRANSFORMÉES (après transformation Zod, avec numbers).
//    C'est le type utilisé par Prisma dans la Server Action.
export type PropertyFormOutputType = z.infer<typeof PropertyFormSchema>; // <- Ce type contiendra des NUMBER