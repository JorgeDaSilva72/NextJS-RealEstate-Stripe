// "use client";
// import { Select, SelectItem } from "@nextui-org/react";
// import React, { useEffect, useState } from "react";
// import useFilterChange, {
//   FilterValueTypes,
//   SetArrayNumberAndStringType,
// } from "../hooks/useFilterChange";
// import { ReadonlyURLSearchParams } from "next/navigation";
// import { SelectNameType } from "@/data/filters";

// interface SearchSelectPropsType {
//   value: string; // ID technique (e.g., "1", "price-asc")
//   setValue?: React.Dispatch<React.SetStateAction<string>>;
//   searchParams: ReadonlyURLSearchParams;
//   values: FilterValueTypes;
//   name: SelectNameType;
//   ariaLabel: string;
//   placeholder: string;
// }

// const SearchSelect = ({
//   ariaLabel,
//   placeholder,
//   value,
//   setValue,
//   values,
//   searchParams,
//   name,
// }: SearchSelectPropsType) => {
//   const handleFilterChange = useFilterChange();

//   // // Utilisons un Set pour l'état interne, ce qui est la façon dont NextUI gère les clés.
//   // const [keys, setKeys] = React.useState(new Set<string>(value ? [value] : []));

//   // 1. État local pour gérer la clé sélectionnée (Set<string>)
//   // Initialisation à partir de la prop 'value'
//   const [selectedKeysSet, setSelectedKeysSet] = useState(
//     new Set<string>(value ? [value] : [])
//   );
//   // // 1. Synchronisation de l'état interne (keys) avec la prop value (ID technique)
//   // React.useEffect(() => {
//   //   // Si la prop 'value' change (via URL change), met à jour l'état du composant.
//   //   setKeys(new Set<string>(value ? [value] : []));
//   // }, [value]);

//   // 2. Synchronisation de l'état local avec la prop 'value' (qui vient de l'URL)
//   useEffect(() => {
//     // Si la prop 'value' change, mettez à jour le Set pour refléter la sélection de l'URL.
//     if (value !== Array.from(selectedKeysSet).join("")) {
//       setSelectedKeysSet(new Set<string>(value ? [value] : []));
//     }
//   }, [value, selectedKeysSet]);

//   // 3. Gestion du changement d'interface utilisateur
//   const handleSelectionChange = (keys: Set<string>) => {
//     // NextUI fournit un Set. Convertissons-le en string ID.
//     const keysArray = Array.from(keys);
//     const selectedKey = keysArray.length > 0 ? keysArray[0].toString() : "none";

//     // Mettre à jour l'état local pour une réaction UI immédiate (évite le clignotement)
//     setSelectedKeysSet(new Set([selectedKey]));

//     // Appeler le hook global pour mettre à jour l'URL et l'état global
//     handleFilterChange(
//       selectedKey,
//       setValue as SetArrayNumberAndStringType,
//       searchParams,
//       name,
//       values
//     );
//   };

//   return (
//     <Select
//       aria-label={ariaLabel}
//       placeholder={placeholder}
//       variant="bordered"
//       // value={value}
//       // selectedKeys={[value]}
//       // selectedKeys={keys}
//       // Laissez le Select être contrôlé par l'état local Set<string>
//       selectedKeys={selectedKeysSet}
//       className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//       selectionMode="single"
//       // 2. Gestion du changement : met à jour l'état local, puis appelle le hook global
//       //
//       // onSelectionChange={(selectedKeys) => {
//       //   // NextUI retourne un Set<string> ou Set<number> pour la sélection
//       //   const keysArray = Array.from(selectedKeys);
//       //   const selectedKey =
//       //     keysArray.length > 0 ? keysArray[0].toString() : "none";

//       //   // Mettre à jour l'état interne du Select avant l'appel asynchrone pour éviter le clignotement
//       //   setKeys(new Set([selectedKey]));

//       //   // Appel de la logique globale qui met à jour l'URL
//       //   handleFilterChange(
//       //     selectedKey,
//       //     setValue as SetArrayNumberAndStringType,
//       //     searchParams,
//       //     name,
//       //     values
//       //   );
//       // }}
//       // L'événement de changement reçoit le Set<string>
//       onSelectionChange={(keys) => {
//         // La méthode 'keys' de NextUI retourne un Set<string> ou Set<number>
//         // const selectedKeys = keys as Set<string>;
//         // const selectedKey = Array.from(selectedKeys).join("");

//         //
//         handleSelectionChange(keys as Set<string>);
//       }}
//     >
//       {values.map((item) => (
//         // <SelectItem key={item.id} value={item.id}>
//         <SelectItem key={String(item.id)} value={String(item.id)}>
//           {item.value} {/* Affiche la traduction */}
//         </SelectItem>
//       ))}
//     </Select>
//   );
// };

// export default SearchSelect;

// 09/12/2025

// "use client";
// import { Select, SelectItem } from "@nextui-org/react";
// import React, { useEffect, useState } from "react";
// import { ReadonlyURLSearchParams } from "next/navigation";
// import { SelectNameType } from "@/data/filters"; // Assurez-vous que ce chemin est correct
// import useFilterChange, {
//   FilterValueTypes,
//   SetArrayNumberAndStringType,
// } from "../hooks/useFilterChange"; // Assurez-vous que ce chemin est correct

// // L'interface pour les props (basée sur votre structure)
// interface SearchSelectPropsType {
//   value: string; // L'ID technique actuel (e.g., "1", "price-asc", ou "")
//   setValue?: React.Dispatch<React.SetStateAction<string>>;
//   searchParams: ReadonlyURLSearchParams;
//   values: FilterValueTypes; // La liste des options
//   name: SelectNameType;
//   ariaLabel: string;
//   placeholder: string;
// }

// const SearchSelect = ({
//   ariaLabel,
//   placeholder,
//   value,
//   setValue,
//   values,
//   searchParams,
//   name,
// }: SearchSelectPropsType) => {
//   const handleFilterChange = useFilterChange();

//   // 1. État local pour gérer la clé sélectionnée (Set<string> est ce que NextUI préfère)
//   // Utilise la prop 'value' pour l'initialisation.
//   const [selectedKeysSet, setSelectedKeysSet] = useState(
//     new Set<string>(value ? [value] : [])
//   );

//   // 2. Synchronisation de l'état local avec la prop 'value' (qui vient du hook useFilterDatas/URL)
//   // useEffect(() => {
//   //   // Convertir le Set<string> actuel en string pour comparaison
//   //   const currentLocalValue = Array.from(selectedKeysSet).join("");

//   //   // Mettre à jour si la prop 'value' change et est différente de l'état local
//   //   if (value !== currentLocalValue) {
//   //     // S'assurer que le Set contient l'ID string de l'URL
//   //     setSelectedKeysSet(new Set<string>(value ? [value] : []));
//   //   }
//   // }, [value, selectedKeysSet]);

//   // 2. Synchronisation de l'état local avec la prop 'value' (qui vient du hook useFilterDatas/URL)
//   useEffect(() => {
//     // Simplement mettre à jour le Set local avec la 'value' globale.
//     // La prop 'value' est la source de vérité finale (venant de l'URL).
//     setSelectedKeysSet(new Set<string>(value ? [value] : []));

//     // Dépendant uniquement de 'value' pour refléter la source de vérité externe (l'URL)
//   }, [value]);

//   // 3. Gestion du changement d'interface utilisateur
//   const handleSelectionChange = (keys: Set<string>) => {
//     // NextUI fournit un Set. Convertissons-le en string ID.
//     const keysArray = Array.from(keys);
//     // L'ID technique sélectionné ("1", "price-asc", ou "none")
//     const selectedKey = keysArray.length > 0 ? keysArray[0].toString() : "none";

//     // Mise à jour de l'état local pour un rendu UI immédiat
//     setSelectedKeysSet(new Set([selectedKey]));

//     // Appel du hook global pour mettre à jour l'URL et l'état global
//     handleFilterChange(
//       selectedKey,
//       setValue as SetArrayNumberAndStringType,
//       searchParams,
//       name,
//       values
//     );
//   };

//   return (
//     <Select
//       aria-label={ariaLabel}
//       placeholder={placeholder}
//       variant="bordered"
//       // ✅ Contrôlé par l'état local Set<string>
//       selectedKeys={selectedKeysSet}
//       className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//       selectionMode="single"
//       onSelectionChange={(keys) => handleSelectionChange(keys as Set<string>)}
//     >
//       {/* 4. Rendu des options : l'ID technique est utilisé comme clé et valeur */}
//       {values.map((item) => (
//         // Assurez-vous que key et value sont des STRING, même si item.id est un number.
//         <SelectItem key={String(item.id)} value={String(item.id)}>
//           {item.value} {/* Ceci est la traduction affichée */}
//         </SelectItem>
//       ))}
//     </Select>
//   );
// };

// export default SearchSelect;

// 09/12/2025

"use client";
import { Select, SelectItem } from "@nextui-org/react";
import React, { useState } from "react";
import { ReadonlyURLSearchParams } from "next/navigation";
import { SelectNameType } from "@/data/filters";
import useFilterChange, {
  FilterValueTypes,
  SetArrayNumberAndStringType,
} from "../hooks/useFilterChange";

interface SearchSelectPropsType {
  value: string; // L'ID technique actuel (e.g., "1", "price-asc", ou "")
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  searchParams: ReadonlyURLSearchParams;
  values: FilterValueTypes; // La liste des options
  name: SelectNameType;
  ariaLabel: string;
  placeholder: string;
}

const SearchSelect = ({
  ariaLabel,
  placeholder,
  value,
  setValue,
  values,
  searchParams,
  name,
}: SearchSelectPropsType) => {
  const handleFilterChange = useFilterChange();

  // 1. État local pour gérer la clé sélectionnée (Initialisé avec la prop 'value')
  // Ceci est réinitialisé lorsque la prop 'key' change
  const [selectedKeysSet, setSelectedKeysSet] = useState(
    new Set<string>(value ? [value] : [])
  );

  // NOTE: Le useEffect de synchronisation est SUPPRIMÉ. La prop 'key' gère la réinitialisation.

  // 2. Gestion du changement d'interface utilisateur
  const handleSelectionChange = (keys: Set<string>) => {
    const keysArray = Array.from(keys);
    const selectedKey = keysArray.length > 0 ? keysArray[0].toString() : "none";

    // Mise à jour de l'état local pour un rendu UI immédiat
    setSelectedKeysSet(new Set([selectedKey]));

    // Appel du hook global pour mettre à jour l'URL et l'état global
    handleFilterChange(
      selectedKey,
      setValue as SetArrayNumberAndStringType,
      searchParams,
      name,
      values
    );
  };

  return (
    <Select
      aria-label={ariaLabel}
      placeholder={placeholder}
      variant="bordered"
      // ✅ SOLUTION : Utiliser la prop 'key' pour forcer le re-montage si 'value' change
      key={name + value}
      // Contrôlé par l'état local Set<string>
      selectedKeys={selectedKeysSet}
      className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
      selectionMode="single"
      onSelectionChange={(keys) => handleSelectionChange(keys as Set<string>)}
    >
      {/* 3. Rendu des options */}
      {values.map((item) => (
        <SelectItem key={String(item.id)} value={String(item.id)}>
          {item.value}
        </SelectItem>
      ))}
    </Select>
  );
};

export default SearchSelect;
