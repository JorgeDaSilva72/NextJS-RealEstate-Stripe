// "use client";
// import React, { useState, useEffect } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
// import { Input, Select, SelectItem, Spinner } from "@nextui-org/react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { PropertyStatus, PropertyType } from "@prisma/client"; // Importez le type PropertyStatus si défini dans Prisma
// import { Slider } from "@nextui-org/react";

// const Search = () => {
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();

//   const [selectedStatus, setSelectedStatus] = useState(
//     searchParams.get("queryStatus") ?? ""
//   );
//   const [statuses, setStatuses] = useState<PropertyStatus[]>([]); // Définition explicite du type

//   const [selectedType, setSelectedType] = useState(
//     searchParams.get("queryType") ?? ""
//   );
//   const [types, setTypes] = useState<PropertyType[]>([]); // Définition explicite du type

//   // Ajoutez l'option "Tout Type de bien" au début de `types`
//   const typesWithNoneOption = [
//     { id: "none", value: "Tout Type de bien" },
//     ...types,
//   ];

//   // Ajoutez l'option "Toute opération" au début de `statuses`
//   const statusWithNoneOption = [
//     { id: "none", value: "Toute opération" },
//     ...statuses,
//   ];

//   const [priceRange, setPriceRange] = useState([0, 1000000]);
//   const [areaRange, setAreaRange] = useState([0, 1000]);

//   const fetchStatuses = async () => {
//     try {
//       const response = await fetch("/api/searchStatuses");
//       const data: PropertyStatus[] = await response.json();
//       setStatuses(data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des statuts:", error);
//     }
//   };

//   const fetchTypes = async () => {
//     try {
//       const response = await fetch("/api/searchTypes");
//       const data: PropertyType[] = await response.json();
//       setTypes(data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des types:", error);
//     }
//   };

//   useEffect(() => {
//     fetchStatuses();
//     fetchTypes();
//   }, []);

//   useEffect(() => {
//     // Récupère les valeurs de minPrice et maxPrice des paramètres de recherche dans l'URL
//     const minPrice = searchParams.get("minPrice");
//     const maxPrice = searchParams.get("maxPrice");

//     // Si les valeurs sont présentes, met à jour l'état du priceRange avec celles-ci
//     if (minPrice && maxPrice) {
//       setPriceRange([Number(minPrice), Number(maxPrice)]);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     // Récupère les valeurs de minArea et maxArea des paramètres de recherche dans l'URL
//     const minArea = searchParams.get("minArea");
//     const maxArea = searchParams.get("maxArea");

//     // Si les valeurs sont présentes, met à jour l'état du areaRange avec celles-ci
//     if (minArea && maxArea) {
//       setAreaRange([Number(minArea), Number(maxArea)]);
//     }
//   }, [searchParams]);

//   const handleChange = useDebouncedCallback(async (query: string) => {
//     const params = new URLSearchParams(searchParams);
//     if (query) {
//       params.set("query", query);
//       setLoading(true);
//     } else {
//       params.delete("query");
//     }

//     router.replace(`${pathName}?${params.toString()}`);
//     setLoading(false);
//   }, 1000);

//   // Gestion du changement de statut
//   const handleStatusChange = (type: string) => {
//     // Convertit le Set en tableau et récupère le premier élément sélectionné
//     const selectedId = Array.from(type)[0] as string;

//     // Si l'ID sélectionné est "none", on retire le paramètre `queryStatus`
//     if (selectedId === "none") {
//       setSelectedStatus(""); // Réinitialise le status sélectionné
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryStatus"); // Supprime `queryStatus` de l'URL
//       router.replace(`${pathName}?${params.toString()}`);
//       return;
//     }

//     // Recherche de l'élément dans `statuses` en comparant correctement les status
//     const selectedStatus = statuses.find(
//       (item) => String(item.id) === selectedId
//     );

//     if (selectedStatus) {
//       setSelectedStatus(selectedStatus.value);

//       const params = new URLSearchParams(searchParams);
//       params.set("queryStatus", selectedStatus.value); // Ajoute la `value` au lieu de l'ID dans l'URL

//       router.replace(`${pathName}?${params.toString()}`);
//     } else {
//       // Si aucune sélection, on supprime `queryType` des paramètres
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryStatus");

//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   // Gestion du changement de type
//   const handleTypeChange = (type: string) => {
//     // Convertit le Set en tableau et récupère le premier élément sélectionné
//     const selectedId = Array.from(type)[0] as string;

//     // Si l'ID sélectionné est "none", on retire le paramètre `queryType`
//     if (selectedId === "none") {
//       setSelectedType(""); // Réinitialise le type sélectionné
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryType"); // Supprime `queryType` de l'URL
//       router.replace(`${pathName}?${params.toString()}`);
//       return;
//     }

//     // Recherche de l'élément dans `types` en comparant correctement les types
//     const selectedType = types.find((item) => String(item.id) === selectedId);

//     if (selectedType) {
//       setSelectedType(selectedType.value);

//       const params = new URLSearchParams(searchParams);
//       params.set("queryType", selectedType.value); // Ajoute la `value` au lieu de l'ID dans l'URL

//       router.replace(`${pathName}?${params.toString()}`);
//     } else {
//       // Si aucune sélection, on supprime `queryType` des paramètres
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryType");

//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   // Gestion du changement de prix
//   const handlePriceChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setPriceRange(value);
//       const params = new URLSearchParams(searchParams);
//       params.set("minPrice", value[0].toString());
//       params.set("maxPrice", value[1].toString());
//       router.replace(`${pathName}?${params.toString()}`); //pour mettre à jour l'URL sans recharger la page.
//     }
//   };

//   // Gestion du changement de area
//   const handleAreaChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setAreaRange(value);
//       const params = new URLSearchParams(searchParams);
//       params.set("minArea", value[0].toString());
//       params.set("maxArea", value[1].toString());
//       router.replace(`${pathName}?${params.toString()}`); //pour mettre à jour l'URL sans recharger la page.
//     }
//   };

//   return (
//     <div className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 space-y-4">
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

//       {/* Select pour le choix du status avec onSelectionChange */}
//       <Select
//         placeholder="Opération"
//         value={selectedStatus}
//         className=" w-96 p-2 shadow rounded bg-white text-gray-700"
//         selectionMode="single"
//         onSelectionChange={(value) => handleStatusChange(value as string)}
//       >
//         {/* Utilisation de `typesWithNoneOption` */}
//         {statusWithNoneOption.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>

//       {/* Select pour le choix du type avec onSelectionChange */}
//       <Select
//         placeholder="Type de bien"
//         value={selectedType}
//         className="w-96 p-2 shadow rounded bg-white text-gray-700"
//         selectionMode="single"
//         onSelectionChange={(value) => handleTypeChange(value as string)}
//       >
//         {/* Utilisation de `typesWithNoneOption` */}
//         {typesWithNoneOption.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>

//       <Slider
//         label="Prix"
//         value={priceRange}
//         step={10000}
//         minValue={0}
//         maxValue={1000000}
//         // onChange={(value) => {
//         //   if (Array.isArray(value)) {
//         //     setPriceRange(value);
//         //   } else {
//         //     setPriceRange([value, value]); // Par exemple, si ce n'est pas un tableau, définissez les deux bornes avec la même valeur
//         //   }
//         // }}
//         onChange={handlePriceChange}
//         // defaultValue={[100000, 500000]}
//         formatOptions={{ style: "currency", currency: "USD" }}
//         className="max-w-md"
//         showTooltip
//       />
//       <Slider
//         label="Surface Habitable en m²"
//         value={areaRange}
//         step={10}
//         minValue={0}
//         maxValue={1000}
//         // onChange={(value) => {
//         //   if (Array.isArray(value)) {
//         //     setPriceRange(value);
//         //   } else {
//         //     setPriceRange([value, value]); // Par exemple, si ce n'est pas un tableau, définissez les deux bornes avec la même valeur
//         //   }
//         // }}
//         onChange={handleAreaChange}
//         // defaultValue={[100000, 500000]}
//         // formatOptions={{ style: "area", currency: "" }}
//         className="max-w-md"
//         showTooltip
//       />
//     </div>
//   );
// };

// export default Search;
"use client";
import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { PropertyStatus, PropertyType } from "@prisma/client";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("queryStatus") ?? ""
  );
  const [statuses, setStatuses] = useState<PropertyStatus[]>([]);

  const [selectedType, setSelectedType] = useState(
    searchParams.get("queryType") ?? ""
  );
  const [types, setTypes] = useState<PropertyType[]>([]);

  const typesWithNoneOption = [
    { id: "none", value: "Tout Type de bien" },
    ...types,
  ];

  const statusWithNoneOption = [
    { id: "none", value: "Toute opération" },
    ...statuses,
  ];

  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [areaRange, setAreaRange] = useState([0, 1000]);

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

  useEffect(() => {
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice && maxPrice) {
      setPriceRange([Number(minPrice), Number(maxPrice)]);
    }
  }, [searchParams]);

  useEffect(() => {
    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    if (minArea && maxArea) {
      setAreaRange([Number(minArea), Number(maxArea)]);
    }
  }, [searchParams]);

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

  const handleStatusChange = (type: string) => {
    const selectedId = Array.from(type)[0] as string;
    if (selectedId === "none") {
      setSelectedStatus("");
      const params = new URLSearchParams(searchParams);
      params.delete("queryStatus");
      router.replace(`${pathName}?${params.toString()}`);
      return;
    }
    const selectedStatus = statuses.find(
      (item) => String(item.id) === selectedId
    );
    if (selectedStatus) {
      setSelectedStatus(selectedStatus.value);
      const params = new URLSearchParams(searchParams);
      params.set("queryStatus", selectedStatus.value);
      router.replace(`${pathName}?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete("queryStatus");
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  const handleTypeChange = (type: string) => {
    const selectedId = Array.from(type)[0] as string;
    if (selectedId === "none") {
      setSelectedType("");
      const params = new URLSearchParams(searchParams);
      params.delete("queryType");
      router.replace(`${pathName}?${params.toString()}`);
      return;
    }
    const selectedType = types.find((item) => String(item.id) === selectedId);
    if (selectedType) {
      setSelectedType(selectedType.value);
      const params = new URLSearchParams(searchParams);
      params.set("queryType", selectedType.value);
      router.replace(`${pathName}?${params.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete("queryType");
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRange(value);
      const params = new URLSearchParams(searchParams);
      params.set("minPrice", value[0].toString());
      params.set("maxPrice", value[1].toString());
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  const handleAreaChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setAreaRange(value);
      const params = new URLSearchParams(searchParams);
      params.set("minArea", value[0].toString());
      params.set("maxArea", value[1].toString());
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center bg-gradient-to-br from-sky-400 to-indigo-500 space-y-4 sm:space-y-6 lg:space-y-8">
      <Input
        onChange={(e) => handleChange(e.target.value)}
        className=" w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl shadow"
        endContent={
          loading ? (
            <Spinner />
          ) : (
            <MagnifyingGlassIcon className="w-4 text-slate-500" />
          )
        }
        defaultValue={searchParams.get("query") ?? ""}
      />
      <Select
        placeholder="Opération"
        value={selectedStatus}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-2 shadow rounded bg-white text-gray-700"
        selectionMode="single"
        onSelectionChange={(value) => handleStatusChange(value as string)}
      >
        {statusWithNoneOption.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        ))}
      </Select>
      <Select
        placeholder="Type de bien"
        value={selectedType}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-2 shadow rounded bg-white text-gray-700"
        selectionMode="single"
        onSelectionChange={(value) => handleTypeChange(value as string)}
      >
        {typesWithNoneOption.map((item) => (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        ))}
      </Select>
      <Slider
        label="Prix"
        value={priceRange}
        step={10000}
        minValue={0}
        maxValue={1000000}
        onChange={handlePriceChange}
        formatOptions={{ style: "currency", currency: "USD" }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        showTooltip
      />
      <Slider
        label="Surface Habitable en m²"
        value={areaRange}
        step={10}
        minValue={0}
        maxValue={1000}
        onChange={handleAreaChange}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        showTooltip
      />
    </div>
  );
};

export default Search;
