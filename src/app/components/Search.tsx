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
import { Input, Spinner } from "@nextui-org/react";
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

  // Utilisation de state pour le status
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("queryStatus") ?? ""
  );
  const [statuses, setStatuses] = useState<PropertyStatus[]>([]); // Définition explicite du type

  const [selectedType, setSelectedType] = useState(
    searchParams.get("queryType") ?? ""
  );
  const [types, setTypes] = useState<PropertyType[]>([]); // Définition explicite du type

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
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setSelectedStatus(status);

    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set("queryStatus", status);
    } else {
      params.delete("queryStatus");
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  // Gestion du changement de type
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setSelectedType(type);

    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set("queryType", type);
    } else {
      params.delete("queryType");
    }

    router.replace(`${pathName}?${params.toString()}`);
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
      <select
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
      </select>

      {/* Select pour le choix du type */}
      <select
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
      </select>
    </div>
  );
};

export default Search;
