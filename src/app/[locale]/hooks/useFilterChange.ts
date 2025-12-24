// import {
//   ReadonlyURLSearchParams,
//   usePathname,
//   useRouter,
// } from "next/navigation";
// import { SelectNameType } from "../../../data/filters";

// export interface FilterValueType {
//   id: number | string;
//   value: string;
// }

// export type FilterValueTypes = FilterValueType[];

// export type SetArrayNumberAndStringType = React.Dispatch<
//   React.SetStateAction<string | number[]>
// >;

// const useFilterChange = () => {
//   const router = useRouter();
//   const pathName = usePathname();
//   return (
//     value: string | number[],
//     setValue: SetArrayNumberAndStringType,
//     searchParams: ReadonlyURLSearchParams,
//     name: SelectNameType,
//     values?: FilterValueTypes,
//     rangeName?: string[]
//   ) => {
//     const selectedId = Array.isArray(value)
//       ? value
//       : (Array.from(value)[0] as string);
//     const params = new URLSearchParams(searchParams);
//     const updateRoute = (params: URLSearchParams) =>
//       router.replace(`${pathName}?${params.toString()}`);
//     if (selectedId === "none") {
//       setValue("");
//       params.delete(name);
//       updateRoute(params);
//       return;
//     }
//     const selected =
//       values?.find((item) => String(item.id) === selectedId) || null;

//     if (selected) {
//       setValue(selected.id.toString());
//       params.set(
//         name,
//         name === "sortOrder" ? String(selected.id) : selected.value
//       );
//       updateRoute(params);
//     } else if (Array.isArray(value) && Array.isArray(rangeName)) {
//       setValue(value);
//       params.set(rangeName[0], value[0].toString());
//       params.set(rangeName[1], value[1].toString());
//       updateRoute(params);
//     } else {
//       params.delete(name);
//       updateRoute(params);
//     }
//   };
// };

// export default useFilterChange;

// 08/12/2025

// import {
//   ReadonlyURLSearchParams,
//   usePathname,
//   useRouter,
// } from "next/navigation";
// import { SelectNameType } from "../../../data/filters";

// export interface FilterValueType {
//   id: number | string;
//   value: string;
// }

// export type FilterValueTypes = FilterValueType[];

// export type SetArrayNumberAndStringType = React.Dispatch<
//   React.SetStateAction<string | number[]>
// >;

// const useFilterChange = () => {
//   const router = useRouter();
//   const pathName = usePathname();

//   return (
//     value: string | number[],
//     setValue: SetArrayNumberAndStringType,
//     searchParams: ReadonlyURLSearchParams,
//     name: SelectNameType,
//     values?: FilterValueTypes,
//     rangeName?: string[]
//   ) => {
//     // 1. Détermination de la sélection (ID ou tableau de nombres pour les ranges)
//     const selectedId = Array.isArray(value)
//       ? value
//       : (Array.from(value)[0] as string); // Pour NextUI Select, 'value' est un Set<string>

//     const params = new URLSearchParams(searchParams);
//     const updateRoute = (params: URLSearchParams) => {
//       // AJOUTER UN PARAMÈTRE DE CACHE/CLÉ DYNAMIQUE
//       params.set("key_cache", Date.now().toString());
//       router.replace(`${pathName}?${params.toString()}`);
//       // N'oubliez pas le refresh pour forcer le Server Component à refetcher
//       router.refresh();
//     };

//     // 2. Gestion de la réinitialisation (choix "none")
//     if (selectedId === "none") {
//       setValue("");
//       params.delete(name);
//       updateRoute(params);
//       return;
//     }

//     // 3. Cas des filtres de sélection (type, statut, ville, pays, tri)
//     const selected =
//       values?.find((item) => String(item.id) === selectedId) || null;

//     if (selected) {
//       // Met à jour l'état du hook useFilterDatas
//       setValue(selected.id.toString());

//       // ✅ CORRECTION MAJEURE: On envoie TOUJOURS l'ID technique (String(selected.id))
//       // pour les filtres de sélection dans l'URL.
//       // Le Server Component Home.tsx n'a besoin que de l'ID/Code.
//       params.set(
//         name,
//         String(selected.id) // <--- Utiliser l'ID/Code technique dans tous les cas
//       );

//       updateRoute(params);
//     }
//     // 4. Cas des filtres de plage (Slider)
//     else if (Array.isArray(value) && Array.isArray(rangeName)) {
//       setValue(value);
//       params.set(rangeName[0], value[0].toString());
//       params.set(rangeName[1], value[1].toString());
//       updateRoute(params);
//     }
//     // 5. Cas par défaut (si l'ID est perdu ou malformé, on nettoie)
//     else {
//       params.delete(name);
//       updateRoute(params);
//     }
//   };
// };

// export default useFilterChange;

// 09/12/2025 simplification de selectedId et la gestion de la dépendance Pays/Ville.

import {
  ReadonlyURLSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { SelectNameType } from "../../../data/filters"; // Assurez-vous que le chemin est correct

export interface FilterValueType {
  id: number | string;
  value: string;
}

export type FilterValueTypes = FilterValueType[];

export type SetArrayNumberAndStringType = React.Dispatch<
  React.SetStateAction<string | number[]>
>;

const useFilterChange = () => {
  const router = useRouter();
  const pathName = usePathname();

  return (
    value: string | number[],
    setValue: SetArrayNumberAndStringType,
    searchParams: ReadonlyURLSearchParams,
    name: SelectNameType,
    values?: FilterValueTypes,
    rangeName?: string[]
  ) => {
    // 1. Détermination de la sélection (ID ou tableau de nombres pour les ranges)
    // C'est soit Array<number> (Sliders), soit string (Selecteurs)
    const selectedId = Array.isArray(value) ? value : String(value);

    const params = new URLSearchParams(searchParams);

    const updateRoute = (params: URLSearchParams) => {
      // Fix: Ensure we route to the correct path
      // If pathname contains duplicate locale (e.g., /fr/fr), fix it
      let targetPath = pathName;
      
      // Extract locale from pathname at the start
      const extractLocale = (path: string): string => {
        const parts = path.split('/').filter(Boolean);
        return parts[0] && /^[a-z]{2}$/.test(parts[0]) ? parts[0] : 'fr';
      };
      
      const locale = extractLocale(pathName || '');
      
      if (!targetPath) {
        targetPath = `/${locale}/result`;
      } else {
        // Fix duplicate locale in path (e.g., /fr/fr -> /fr/result)
        if (targetPath.match(/^\/[a-z]{2}\/[a-z]{2}/)) {
          const pathLocale = targetPath.split('/')[1];
          // Route to result page if on home, otherwise keep current path
          if (targetPath === `/${pathLocale}` || targetPath === `/${pathLocale}/`) {
            targetPath = `/${pathLocale}/result`;
          } else {
            // Remove duplicate locale
            targetPath = targetPath.replace(`/${pathLocale}/${pathLocale}`, `/${pathLocale}`);
          }
        }
        
        // If we're on home page, route to result page for searches
        if (targetPath.match(/^\/[a-z]{2}$/) || targetPath.match(/^\/[a-z]{2}\/$/)) {
          const pathLocale = targetPath.replace(/\//g, '') || locale;
          targetPath = `/${pathLocale}/result`;
        }
        
        // If we're on buy/rent page, stay on that page
        if (targetPath.includes('/buy') || targetPath.includes('/rent')) {
          // Stay on current page
        } else if (!targetPath.includes('/result') && !targetPath.includes('/buy') && !targetPath.includes('/rent')) {
          // If not on result, buy, or rent page, go to result page
          const pathLocale = targetPath.split('/')[1] || locale;
          targetPath = `/${pathLocale}/result`;
        }
      }

      // AJOUTER UN PARAMÈTRE DE CACHE/CLÉ DYNAMIQUE
      params.set("key_cache", Date.now().toString());
      router.replace(`${targetPath}?${params.toString()}`);
      // N'oubliez pas le refresh pour forcer le Server Component à refetcher
      router.refresh();
    };

    // 2. Gestion de la réinitialisation (choix "none")
    // Note: selectedId doit être de type string pour ce cas
    if (typeof selectedId === "string" && selectedId === "none") {
      setValue("");
      params.delete(name);

      // LOGIQUE DE DÉPENDANCE : Si on réinitialise le Pays, on réinitialise la Ville aussi.
      if (name === "country") {
        params.delete("cityId");
      }

      updateRoute(params);
      return;
    }

    // 3. Cas des filtres de sélection (type, statut, ville, pays, tri)
    const selected =
      values?.find((item) => String(item.id) === selectedId) || null;

    if (selected) {
      // Met à jour l'état du hook useFilterDatas
      setValue(selected.id.toString());

      // On envoie l'ID technique (String(selected.id)) dans l'URL.
      params.set(
        name,
        String(selected.id) // Utiliser l'ID/Code technique dans l'URL
      );

      // LOGIQUE DE DÉPENDANCE : Si un nouveau pays est sélectionné, on réinitialise la ville.
      if (name === "country") {
        params.delete("cityId"); // Supprime cityId de l'URL
      }

      updateRoute(params);
    }
    // 4. Cas des filtres de plage (Slider)
    else if (Array.isArray(value) && Array.isArray(rangeName)) {
      setValue(value);
      params.set(rangeName[0], value[0].toString());
      params.set(rangeName[1], value[1].toString());
      updateRoute(params);
    }
    // 5. Cas par défaut (si l'ID est perdu ou malformé, on nettoie)
    else {
      // Si value est une string et que selected est null (ID non trouvé ou malformé)
      params.delete(name);
      updateRoute(params);
    }
  };
};

export default useFilterChange;
