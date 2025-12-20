import { z } from "zod";

// Schéma pour les champs multilingues (name, description, landmark)
// Accepte soit une string (qui sera transformée en objet avec la locale actuelle)
// soit un objet JSON existant
export const MultilingualTextSchema = z.preprocess(
  (val) => {
    // Si c'est déjà un objet, le retourner tel quel
    if (val && typeof val === "object" && !Array.isArray(val)) {
      return val;
    }
    // Si c'est une string, la transformer en objet avec la locale actuelle (fr par défaut)
    if (typeof val === "string" && val.trim().length > 0) {
      return { fr: val.trim() };
    }
    // Si c'est vide ou null, retourner un objet vide (sera validé par le schéma suivant)
    return { fr: "" };
  },
  z.object({
    fr: z.string().min(1, "La traduction française est obligatoire."),
    en: z.string().optional(),
    ar: z.string().optional(),
    pt: z.string().optional(),
  })
);

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
  countryId: z.number().int().min(1, "Le pays est obligatoire."),
  cityId: z.number().int().min(1, "La ville est obligatoire."),
  streetAddress: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().min(5, "L'adresse est obligatoire (minimum 5 caractères).")
  ),
  neighborhood: z.preprocess(
    (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : undefined),
    z.string().optional()
  ),
  zip: z.preprocess(
    (val) => (typeof val === "string" && val.trim().length > 0 ? val.trim() : undefined),
    z.string().optional()
  ),
  // landmark est multilingue - accepte string ou objet
  landmark: z.preprocess(
    (val) => {
      if (!val) return undefined;
      if (val && typeof val === "object" && !Array.isArray(val)) {
        return val;
      }
      if (typeof val === "string" && val.trim().length > 0) {
        return { fr: val.trim() };
      }
      return undefined;
    },
    z.object({
      fr: z.string().min(1).optional(),
      en: z.string().optional(),
      ar: z.string().optional(),
      pt: z.string().optional(),
    }).optional()
  ),
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
  typeId: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return "";
      return String(val).trim();
    },
    z.string().min(1, "Le type est obligatoire.")
  ).transform(val => {
    const num = Number(val);
    if (isNaN(num)) throw new Error("Le type doit être un nombre valide.");
    return num;
  }),
  statusId: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return "";
      return String(val).trim();
    },
    z.string().min(1, "Le statut est obligatoire.")
  ).transform(val => {
    const num = Number(val);
    if (isNaN(num)) throw new Error("Le statut doit être un nombre valide.");
    return num;
  }),
  price: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return "";
      return String(val).trim();
    },
    z.string().min(1, "Le prix est obligatoire.")
      .regex(/^\d+(\.\d{1,2})?$/, "Le prix doit être un nombre valide.")
  ).transform(val => {
    const num = Number(val);
    if (isNaN(num)) throw new Error("Le prix doit être un nombre valide.");
    return num;
  }),
  currency: z.preprocess(
    (val) => (typeof val === "string" ? val.trim() : val),
    z.string().min(1, "La devise est obligatoire.")
  ), // Ex: XOF
  countryId: z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const str = String(val).trim();
      return str.length > 0 ? str : undefined;
    },
    z.string().optional()
  ).transform(val => val ? Number(val) : undefined),
  
  // Champs Multilingues (JSONB)
  name: MultilingualTextSchema,
  description: MultilingualTextSchema,
  
  // Relations imbriquées (Création en cascade)
  feature: PropertyFeatureSchema,
  location: PropertyLocationSchema.extend({
    // Transformer les IDs string en number avec validation
    countryId: z.preprocess(
      (val) => {
        if (val === null || val === undefined || val === "") return "";
        return String(val).trim();
      },
      z.string().min(1, "Le pays est obligatoire.")
    ).transform(val => {
      const num = Number(val);
      if (isNaN(num) || num < 1) throw new Error("Le pays doit être un nombre valide.");
      return num;
    }),
    cityId: z.preprocess(
      (val) => {
        if (val === null || val === undefined || val === "") return "";
        return String(val).trim();
      },
      z.string().min(1, "La ville est obligatoire.")
    ).transform(val => {
      const num = Number(val);
      if (isNaN(num) || num < 1) throw new Error("La ville doit être un nombre valide.");
      return num;
    }),
  }),
  contact: ContactSchema.extend({
    name: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().min(2, "Le nom du contact est obligatoire (minimum 2 caractères).")
    ),
    phone: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().min(8, "Le numéro de téléphone est obligatoire (minimum 8 caractères).")
    ),
    email: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.string().email("L'adresse e-mail est invalide.")
    ),
  }),
  
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