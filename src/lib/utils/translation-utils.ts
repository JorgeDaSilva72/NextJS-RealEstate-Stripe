// Définition d'un type pour le bloc de traduction JSON
interface LocalizedText {
  [key: string]: string | undefined;
  fr: string; // Supposons que le français est toujours requis
}

/**
 * Extrait la chaîne de caractères traduite d'un objet JSON multilingue.
 * @param field L'objet JSON contenant les traductions (ex: {fr: '...', en: '...'})
 * @param locale La locale active (ex: 'fr', 'en')
 * @returns La chaîne traduite, ou une chaîne de secours.
 */

// Helper function to extract text from multilingual JSON
//  export  const getLocalizedText = (field: any, locale: string): string => {
//     if (!field) return "";
//     if (typeof field === "string") return field;
//     if (typeof field === "object") {
//       return (
//         field[locale] || field.fr || field.en || field.ar || field.pt || ""
//       );
//     }
//     return String(field);
//   };

export const getLocalizedText = (
  field: LocalizedText | string | null | undefined,
  locale: string
): string => {
  if (!field) return "";

  // Cas où le champ est encore une simple string (pour les anciens champs non JSON ou par erreur)
  if (typeof field === "string") return field;

  // Si c'est un objet (JSONB)
  if (typeof field === "object" && field !== null) {
    // 1. Essayer la locale demandée
    const translated = field[locale];
    if (translated) {
      return translated;
    }

    // 2. Logique de Fallback (Ordre de priorité : fr -> en -> première clé trouvée)
    return (
      field.fr ||
      field.en ||
      Object.values(field).find((v) => typeof v === "string") ||
      ""
    );
  }

  return String(field);
};
