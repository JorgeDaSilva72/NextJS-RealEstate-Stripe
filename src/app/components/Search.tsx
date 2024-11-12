// import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
// import { Input } from "@nextui-org/react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import React from "react";
// import { useDebouncedCallback } from "use-debounce";

// const Search = () => {
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();
//   const handleChange = useDebouncedCallback((query: string) => {
//     const params = new URLSearchParams(searchParams);
//     if (query) params.set("query", query);
//     else params.delete("query");

//     router.replace(`${pathName}?${params.toString()}`);
//   }, 1000);

//   return (
//     <div className="p-4 flex items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500">
//       <Input
//         onChange={(e) => handleChange(e.target.value)}
//         className="w-96 shadow"
//         endContent={<MagnifyingGlassIcon className="w-4 text-slate-500 " />}
//         defaultValue={searchParams.get("query") ?? ""}
//       />
//     </div>
//   );
// };

// export default Search;

// "use client";
// import React, { useState, useEffect } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
// import { Input, Spinner } from "@nextui-org/react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";

// const Search = () => {
//   // const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();

//   const handleChange = useDebouncedCallback(async (query: string) => {
//     const params = new URLSearchParams(searchParams);
//     if (query) {
//       params.set("query", query);
//       setLoading(true);

//       // Appel à une API de suggestions (exemple fictif)
//       try {
//         // const res = await fetch(`/api/suggestions?query=${query}`);
//         // const data = await res.json();
//         // setSuggestions(data);
//       } catch (error) {
//         // console.error("Erreur lors de la recherche des suggestions", error);
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       params.delete("query");

//       // setSuggestions([]);
//     }

//     router.replace(`${pathName}?${params.toString()}`);
//     setLoading(false);
//   }, 1000);

//   return (
//     <div className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500">
//       <Input
//         onChange={(e) => handleChange(e.target.value)}
//         className="w-96 shadow"
//         endContent={
//           loading ? (
//             <Spinner />
//           ) : (
//             <MagnifyingGlassIcon className="w-4 text-slate-500" />
//           )
//         }
//         defaultValue={searchParams.get("query") ?? ""}
//       />
//       {/* {suggestions.length > 0 && (
//         <div className="w-96 bg-white shadow mt-2 rounded-lg">
//           {suggestions.map((suggestion, index) => (
//             <div key={index} className="p-2 hover:bg-gray-200 cursor-pointer">
//               {suggestion}
//             </div>
//           ))}
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default Search;

"use client";
import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { PropertyStatus, PropertyType } from "@prisma/client"; // Importez le type PropertyStatus si défini dans Prisma

// Exemples de valeurs de status
// const statusOptions = [
//   { value: "", label: "All Statuses" },
//   { value: "Vente", label: "Vente" },
//   { value: "Location", label: "Location" },
//   { value: "Location saisonnière", label: "Location saisonnière" },
//   { value: "Location meublée", label: "Location meublée" },

//   // Ajoutez d'autres statuts ici selon vos besoins
// ];

const Search = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("queryStatus") ?? ""
  );
  const [statuses, setStatuses] = useState<PropertyStatus[]>([]); // Définition explicite du type

  const [selectedType, setSelectedType] = useState(
    searchParams.get("queryType") ?? ""
  );
  const [types, setTypes] = useState<PropertyType[]>([]); // Définition explicite du type

  // Ajoutez l'option "Aucun type" au début de `types`
  const typesWithNoneOption = [
    { id: "none", value: "Tout Type de bien" },
    ...types,
  ];

  // Ajoutez l'option "Aucun type" au début de `types`
  const statusWithNoneOption = [
    { id: "none", value: "Toute opération" },
    ...statuses,
  ];

  const fetchStatuses = async () => {
    try {
      const response = await fetch("/api/searchStatuses");
      const data: PropertyStatus[] = await response.json();
      setStatuses(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statuts:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await fetch("/api/searchTypes");
      const data: PropertyType[] = await response.json();
      setTypes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des types:", error);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchTypes();
  }, []);

  const handleChange = useDebouncedCallback(async (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
      setLoading(true);
    } else {
      params.delete("query");
    }

    router.replace(`${pathName}?${params.toString()}`);
    setLoading(false);
  }, 1000);

  // Gestion du changement de statut
  // const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const status = e.target.value;
  //   setSelectedStatus(status);

  //   const params = new URLSearchParams(searchParams);
  //   if (status) {
  //     params.set("queryStatus", status);
  //   } else {
  //     params.delete("queryStatus");
  //   }

  //   router.replace(`${pathName}?${params.toString()}`);
  // };

  const handleStatusChange = (type: string) => {
    // Convertit le Set en tableau et récupère le premier élément sélectionné
    const selectedId = Array.from(type)[0] as string;

    // Si l'ID sélectionné est "none", on retire le paramètre `queryStatus`
    if (selectedId === "none") {
      setSelectedStatus(""); // Réinitialise le status sélectionné
      const params = new URLSearchParams(searchParams);
      params.delete("queryStatus"); // Supprime `queryStatus` de l'URL
      router.replace(`${pathName}?${params.toString()}`);
      return;
    }

    // Recherche de l'élément dans `statuses` en comparant correctement les status
    const selectedStatus = statuses.find(
      (item) => String(item.id) === selectedId
    );

    if (selectedStatus) {
      setSelectedStatus(selectedStatus.value);

      const params = new URLSearchParams(searchParams);
      params.set("queryStatus", selectedStatus.value); // Ajoute la `value` au lieu de l'ID dans l'URL

      router.replace(`${pathName}?${params.toString()}`);
    } else {
      // Si aucune sélection, on supprime `queryType` des paramètres
      const params = new URLSearchParams(searchParams);
      params.delete("queryStatus");

      router.replace(`${pathName}?${params.toString()}`);
    }
  };
  // const handleTypeChange = (type: string) => {
  //   // Convertit le Set en tableau et récupère le premier élément sélectionné
  //   const selectedId = Array.from(type)[0] as string;

  //   // Si l'ID sélectionné est "none", on retire le paramètre `queryType`
  //   if (selectedId === "none") {
  //     setSelectedType(""); // Réinitialise le type sélectionné
  //     const params = new URLSearchParams(searchParams);
  //     params.delete("queryType"); // Supprime `queryType` de l'URL
  //     router.replace(`${pathName}?${params.toString()}`);
  //     return;
  //   }

  //   // Recherche de l'élément dans `types` en comparant correctement les types
  //   const selectedType = types.find((item) => String(item.id) === selectedId);

  //   if (selectedType) {
  //     setSelectedType(selectedType.value);

  //     const params = new URLSearchParams(searchParams);
  //     params.set("queryType", selectedType.value); // Ajoute la `value` au lieu de l'ID dans l'URL

  //     router.replace(`${pathName}?${params.toString()}`);
  //   } else {
  //     // Si aucune sélection, on supprime `queryType` des paramètres
  //     const params = new URLSearchParams(searchParams);
  //     params.delete("queryType");

  //     router.replace(`${pathName}?${params.toString()}`);
  //   }
  // };

  // Gestion du changement de type
  // const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const type = e.target.value;
  //   setSelectedType(type);

  //   const params = new URLSearchParams(searchParams);
  //   if (type) {
  //     params.set("queryType", type);
  //   } else {
  //     params.delete("queryType");
  //   }

  //   router.replace(`${pathName}?${params.toString()}`);
  // };

  const handleTypeChange = (type: string) => {
    // Convertit le Set en tableau et récupère le premier élément sélectionné
    const selectedId = Array.from(type)[0] as string;

    // Si l'ID sélectionné est "none", on retire le paramètre `queryType`
    if (selectedId === "none") {
      setSelectedType(""); // Réinitialise le type sélectionné
      const params = new URLSearchParams(searchParams);
      params.delete("queryType"); // Supprime `queryType` de l'URL
      router.replace(`${pathName}?${params.toString()}`);
      return;
    }

    // Recherche de l'élément dans `types` en comparant correctement les types
    const selectedType = types.find((item) => String(item.id) === selectedId);

    if (selectedType) {
      setSelectedType(selectedType.value);

      const params = new URLSearchParams(searchParams);
      params.set("queryType", selectedType.value); // Ajoute la `value` au lieu de l'ID dans l'URL

      router.replace(`${pathName}?${params.toString()}`);
    } else {
      // Si aucune sélection, on supprime `queryType` des paramètres
      const params = new URLSearchParams(searchParams);
      params.delete("queryType");

      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 space-y-4">
      <Input
        onChange={(e) => handleChange(e.target.value)}
        className="w-96 shadow"
        endContent={
          loading ? (
            <Spinner />
          ) : (
            <MagnifyingGlassIcon className="w-4 text-slate-500" />
          )
        }
        defaultValue={searchParams.get("query") ?? ""}
      />

      {/* Select pour le choix du status */}
      {/* <select
        value={selectedStatus}
        onChange={handleStatusChange}
        className="w-96 p-2 shadow rounded bg-white text-gray-700"
      >
        <option value="">Toute Opération</option>
        {statuses.map((status) => (
          <option key={status.id} value={status.value}>
            {status.value}
          </option>
        ))}
      </select> */}

      {/* Select pour le choix du status avec onSelectionChange */}
      <Select
        placeholder="Opération"
        value={selectedStatus}
        className=" w-96 p-2 shadow rounded bg-white text-gray-700"
        selectionMode="single"
        onSelectionChange={(value) => handleStatusChange(value as string)}
      >
        {/* Utilisation de `typesWithNoneOption` */}
        {statusWithNoneOption.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        ))}
      </Select>

      {/* Select pour le choix du type */}
      {/* <select
        value={selectedType}
        onChange={handleTypeChange}
        className="w-96 p-2 shadow rounded bg-white text-gray-700"
      >
        <option value="">Type de bien</option>
        {types.map((type) => (
          <option key={type.id} value={type.value}>
            {type.value}
          </option>
        ))}
      </select> */}
      {/* Select pour le choix du type avec onSelectionChange */}
      <Select
        placeholder="Type de bien"
        value={selectedType}
        className="w-96 p-2 shadow rounded bg-white text-gray-700"
        selectionMode="single"
        onSelectionChange={(value) => handleTypeChange(value as string)}
      >
        {/* Utilisation de `typesWithNoneOption` */}
        {typesWithNoneOption.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Search;
