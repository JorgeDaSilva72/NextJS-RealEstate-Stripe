// "use client";
// import React, { useState, useEffect } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
// import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import { citiesOfMorocco } from "../data/cities";
// import { countries } from "../data/countries";
// import FilterSVG from "../assets/svg/FilterSVG"; // ajout
// // import "./search.css"; // ajout
// import useModalOpen from "../hooks/useModalOpen"; // ajout

// const Search = () => {
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();
//   const [openModal, setOpenModal] = useState(false); // ajout
//   const handleModalOpen = useModalOpen(); // ajout

//   const [selectedStatus, setSelectedStatus] = useState(
//     searchParams.get("queryStatus") ?? ""
//   );
//   const [statuses, setStatuses] = useState<PropertyStatus[]>([]);

//   const [selectedType, setSelectedType] = useState(
//     searchParams.get("queryType") ?? ""
//   );
//   const [types, setTypes] = useState<PropertyType[]>([]);

//   const typesWithNoneOption = [
//     { id: "none", value: "Tout Type de bien" },
//     ...types,
//   ];

//   const statusWithNoneOption = [
//     { id: "none", value: "Toute opération" },
//     ...statuses,
//   ];
//   const citiesOfMoroccoWithNoneOption = [
//     { id: "none", value: "Toutes les villes" },
//     ...citiesOfMorocco,
//   ];

//   const countriesWithNoneOption = [
//     { id: "none", value: "Tous les pays" },
//     ...countries,
//   ];

//   const [priceRange, setPriceRange] = useState([0, 1000000]);
//   const [areaRange, setAreaRange] = useState([0, 1000]);
//   const [bedroomsRange, setBedroomsRange] = useState([0, 10]);
//   const [bathroomsRange, setBathroomsRange] = useState([0, 10]);
//   const [sortOrder, setSortOrder] = useState("");
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // Gestion de l'affichage des filtres avancés

//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("query") ?? ""
//   );

//   const [selectedCountry, setSelectedCountry] = useState(
//     searchParams.get("country") ?? ""
//   );

//   const [selectedCity, setSelectedCity] = useState(
//     searchParams.get("city") ?? ""
//   );

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
//     const minPrice = searchParams.get("minPrice");
//     const maxPrice = searchParams.get("maxPrice");
//     if (minPrice && maxPrice) {
//       setPriceRange([Number(minPrice), Number(maxPrice)]);
//     }

//     const minArea = searchParams.get("minArea");
//     const maxArea = searchParams.get("maxArea");
//     if (minArea && maxArea) {
//       setAreaRange([Number(minArea), Number(maxArea)]);
//     }

//     const minBedrooms = searchParams.get("minBedrooms");
//     const maxBedrooms = searchParams.get("maxBedrooms");
//     if (minBedrooms && maxBedrooms) {
//       setBedroomsRange([Number(minBedrooms), Number(maxBedrooms)]);
//     }

//     const minBathrooms = searchParams.get("minBathrooms");
//     const maxBathrooms = searchParams.get("maxBathrooms");
//     if (minBathrooms && maxBathrooms) {
//       setBathroomsRange([Number(minBathrooms), Number(maxBathrooms)]);
//     }

//     const sortOrder = searchParams.get("sortOrder");
//     if (sortOrder) {
//       setSortOrder(sortOrder);
//     } else {
//       setSortOrder(""); // Pas de tri
//     }

//     const country = searchParams.get("country");
//     if (country) {
//       setSelectedCountry(country);
//     } else {
//       setSelectedCountry("");
//     }

//     const city = searchParams.get("city");
//     if (city) {
//       setSelectedCity(city);
//     } else {
//       setSelectedCity("");
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     // Afficher les filtres avancés si des critères avancés sont présents dans l'URL
//     const hasAdvancedFilters =
//       searchParams.get("minPrice") ||
//       searchParams.get("maxPrice") ||
//       searchParams.get("minArea") ||
//       searchParams.get("maxArea") ||
//       searchParams.get("minBedrooms") ||
//       searchParams.get("maxBedrooms") ||
//       searchParams.get("minBathrooms") ||
//       searchParams.get("maxBathrooms");

//     setShowAdvancedFilters(Boolean(hasAdvancedFilters));
//   }, [searchParams]);

//   const handleInputChange = (query: string) => {
//     setSearchQuery(query); // Met à jour l'état local
//     handleChange(query); // Débounced callback pour l'URL
//   };

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
//   }, 500);

//   const handleStatusChange = (type: string) => {
//     const selectedId = Array.from(type)[0] as string;
//     if (selectedId === "none") {
//       setSelectedStatus("");
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryStatus");
//       router.replace(`${pathName}?${params.toString()}`);
//       return;
//     }
//     const selectedStatus = statuses.find(
//       (item) => String(item.id) === selectedId
//     );
//     if (selectedStatus) {
//       setSelectedStatus(selectedStatus.value);
//       const params = new URLSearchParams(searchParams);
//       params.set("queryStatus", selectedStatus.value);
//       router.replace(`${pathName}?${params.toString()}`);
//     } else {
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryStatus");
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleTypeChange = (type: string) => {
//     const selectedId = Array.from(type)[0] as string;
//     if (selectedId === "none") {
//       setSelectedType("");
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryType");
//       router.replace(`${pathName}?${params.toString()}`);
//       return;
//     }
//     const selectedType = types.find((item) => String(item.id) === selectedId);
//     if (selectedType) {
//       setSelectedType(selectedType.value);
//       const params = new URLSearchParams(searchParams);
//       params.set("queryType", selectedType.value);
//       router.replace(`${pathName}?${params.toString()}`);
//     } else {
//       const params = new URLSearchParams(searchParams);
//       params.delete("queryType");
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleCountryChange = (type: string) => {
//     const selectedId = Array.from(type)[0] as string;
//     if (selectedId === "none") {
//       setSelectedCountry("");
//       const params = new URLSearchParams(searchParams);
//       params.delete("country");
//       router.replace(`${pathName}?${params.toString()}`);
//       return;
//     }
//     const selectedCountry = countriesWithNoneOption.find(
//       (item) => String(item.id) === selectedId
//     );

//     if (selectedCountry) {
//       setSelectedCountry(selectedCountry.value);
//       const params = new URLSearchParams(searchParams);
//       params.set("country", selectedCountry.value);
//       router.replace(`${pathName}?${params.toString()}`);
//     } else {
//       const params = new URLSearchParams(searchParams);
//       params.delete("country");
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleCityChange = (type: string) => {
//     const selectedId = Array.from(type)[0] as string;
//     if (selectedId === "none") {
//       setSelectedCity("");
//       const params = new URLSearchParams(searchParams);
//       params.delete("city");
//       router.replace(`${pathName}?${params.toString()}`);
//       return;
//     }
//     const selectedCity = citiesOfMoroccoWithNoneOption.find(
//       (item) => String(item.id) === selectedId
//     );

//     if (selectedCity) {
//       setSelectedCity(selectedCity.value);
//       const params = new URLSearchParams(searchParams);
//       params.set("city", selectedCity.value);
//       router.replace(`${pathName}?${params.toString()}`);
//     } else {
//       const params = new URLSearchParams(searchParams);
//       params.delete("city");
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handlePriceChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setPriceRange(value);
//       const params = new URLSearchParams(searchParams);
//       params.set("minPrice", value[0].toString());
//       params.set("maxPrice", value[1].toString());
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleAreaChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setAreaRange(value);
//       const params = new URLSearchParams(searchParams);
//       params.set("minArea", value[0].toString());
//       params.set("maxArea", value[1].toString());
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleBedroomsChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setBedroomsRange(value);
//       const params = new URLSearchParams(searchParams);
//       params.set("minBedrooms", value[0].toString());
//       params.set("maxBedrooms", value[1].toString());
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleBathroomsChange = (value: number | number[]) => {
//     if (Array.isArray(value)) {
//       setBathroomsRange(value);
//       const params = new URLSearchParams(searchParams);
//       params.set("minBathrooms", value[0].toString());
//       params.set("maxBathrooms", value[1].toString());
//       router.replace(`${pathName}?${params.toString()}`);
//     }
//   };

//   const handleSortOrderChange = (value: string | Set<string>) => {
//     const sortOrder = value instanceof Set ? Array.from(value)[0] : value; // Conversion du Set en chaîne
//     console.log("Sort order selected:", sortOrder); // Debugging
//     const params = new URLSearchParams(searchParams);

//     if (sortOrder === "none") {
//       params.delete("sortOrder"); // Supprime le tri de l'URL
//       setSortOrder(""); // Réinitialise l'état du tri
//     } else {
//       params.set("sortOrder", sortOrder); // Définit le critère de tri
//       setSortOrder(sortOrder); // Met à jour l'état
//     }

//     router.replace(`${pathName}?${params.toString()}`);
//   };

//   const toggleAdvancedFilters = () => {
//     setShowAdvancedFilters((prev) => !prev); // Toggle de l'affichage
//   };

//   // j utilise une clé dynamique pour synchroniser les select avec les states
//   const [resetKey, setResetKey] = useState(0);
//   // Fonction pour réinitialiser tous les filtres
//   const resetFilters = () => {
//     setSearchQuery(""); // Réinitialise la recherche
//     setSelectedStatus("");
//     setSelectedType("");
//     setResetKey((prev) => prev + 1);
//     setSortOrder("");
//     setPriceRange([0, 1000000]);
//     setAreaRange([0, 1000]);
//     setBedroomsRange([0, 10]);
//     setBathroomsRange([0, 10]);

//     // Supprime tous les paramètres de l'URL
//     router.replace(pathName);
//   };

//   return (
//     // <div className="p-6 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-lg w-full mx-auto space-y-6">
//     //   {/* Section 1 : Filtres principaux */}
//     //   <div
//     //     key={resetKey}
//     //     className="flex flex-col space-y-4  lg:space-y-8  w-full"
//     //   >
//     //     <div className="flex flex-col space-y-4">
//     //       <Input
//     //         placeholder="Recherche dans les titres"
//     //         onChange={(e) => handleInputChange(e.target.value)}
//     //         className="w-full max-w-md shadow-lg"
//     //         endContent={
//     //           loading ? (
//     //             <Spinner />
//     //           ) : (
//     //             <MagnifyingGlassIcon className="w-4 text-slate-500" />
//     //           )
//     //         }
//     //         value={searchQuery} // Utilise value au lieu de defaultValue
//     //         // defaultValue={searchParams.get("query") ?? ""}
//     //       />
//     //     </div>

//     //     {/* Filtres principaux */}
//     //     <div className="flex flex-wrap gap-4 justify-start">
//     //       <Select
//     //         aria-label="Choisir l'opération"
//     //         placeholder="Opération"
//     //         value={selectedStatus || ""}
//     //         className="flex-grow max-w-xs p-2 shadow-lg bg-white text-gray-700 rounded"
//     //         selectionMode="single"
//     //         onSelectionChange={(value) => handleStatusChange(value as string)}
//     //       >
//     //         {statusWithNoneOption.map((item) => (
//     //           <SelectItem key={item.id} value={item.id}>
//     //             {item.value}
//     //           </SelectItem>
//     //         ))}
//     //       </Select>

//     //       <Select
//     //         aria-label="Choisir le type de bien"
//     //         placeholder="Type de bien"
//     //         value={selectedType}
//     //         className="flex-grow max-w-xs p-2 shadow-lg bg-white text-gray-700 rounded"
//     //         selectionMode="single"
//     //         onSelectionChange={(value) => handleTypeChange(value as string)}
//     //       >
//     //         {typesWithNoneOption.map((item) => (
//     //           <SelectItem key={item.id} value={item.id}>
//     //             {item.value}
//     //           </SelectItem>
//     //         ))}
//     //       </Select>

//     //       <Select
//     //         aria-label="Pays"
//     //         placeholder="Choisir un pays"
//     //         value={selectedCountry}
//     //         className="flex-grow max-w-xs p-2 shadow-lg bg-white text-gray-700 rounded"
//     //         selectionMode="single"
//     //         onSelectionChange={(value) => handleCountryChange(value as string)}
//     //       >
//     //         {countriesWithNoneOption.map((item) => (
//     //           <SelectItem key={item.id} value={item.id}>
//     //             {item.value}
//     //           </SelectItem>
//     //         ))}
//     //       </Select>

//     //       <Select
//     //         aria-label="Villes"
//     //         placeholder="Choisir une ville"
//     //         value={selectedCity}
//     //         className="flex-grow max-w-xs p-2 shadow-lg bg-white text-gray-700 rounded"
//     //         selectionMode="single"
//     //         onSelectionChange={(value) => handleCityChange(value as string)}
//     //       >
//     //         {citiesOfMoroccoWithNoneOption.map((item) => (
//     //           <SelectItem key={item.id} value={item.id}>
//     //             {item.value}
//     //           </SelectItem>
//     //         ))}
//     //       </Select>

//     //       <Select
//     //         aria-label="Trier par"
//     //         placeholder="Trier par"
//     //         value={sortOrder}
//     //         className="flex-grow max-w-xs p-2 shadow-lg bg-white text-gray-700 rounded"
//     //         selectionMode="single"
//     //         // onSelectionChange retourne un objet Set dans lequel se trouve la valeur sélectionnée ("desc") au lieu de simplement renvoyer la chaîne elle-même.
//     //         onSelectionChange={(value) =>
//     //           handleSortOrderChange(value as string)
//     //         }
//     //       >
//     //         <SelectItem key={"none"} value="none">
//     //           Aucun tri
//     //         </SelectItem>
//     //         <SelectItem key={"price-asc"} value="price-asc">
//     //           Prix croissant
//     //         </SelectItem>
//     //         <SelectItem key={"price-desc"} value="price-desc">
//     //           Prix décroissant
//     //         </SelectItem>
//     //         <SelectItem key={"surface-asc"} value="surface-asc">
//     //           Surface croissante
//     //         </SelectItem>
//     //         <SelectItem key={"surface-desc"} value="surface-desc">
//     //           Surface décroissante
//     //         </SelectItem>
//     //         <SelectItem key={"date-asc"} value="date-asc">
//     //           Plus ancien
//     //         </SelectItem>
//     //         <SelectItem key={"date-desc"} value="date-desc">
//     //           Plus récent
//     //         </SelectItem>
//     //       </Select>
//     //     </div>

//     //     {/* Section 2 : Filtres avancés (affichage conditionnel) */}
//     //     {showAdvancedFilters && (
//     //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     //         <Slider
//     //           label="Prix (€)"
//     //           value={priceRange}
//     //           step={10000}
//     //           minValue={0}
//     //           maxValue={1000000}
//     //           onChange={handlePriceChange}
//     //           formatOptions={{ style: "currency", currency: "EUR" }}
//     //           className="w-full shadow-lg bg-white p-2 rounded"
//     //           showTooltip
//     //         />

//     //         <Slider
//     //           label="Surface habitable (m²)"
//     //           value={areaRange}
//     //           step={10}
//     //           minValue={0}
//     //           maxValue={1000}
//     //           onChange={handleAreaChange}
//     //           className="w-full shadow-lg bg-white p-2 rounded"
//     //           showTooltip
//     //         />

//     //         <Slider
//     //           label="Chambres"
//     //           value={bedroomsRange}
//     //           step={1}
//     //           minValue={0}
//     //           maxValue={10}
//     //           onChange={handleBedroomsChange}
//     //           className="w-full shadow-lg bg-white p-2 rounded"
//     //           showTooltip
//     //         />

//     //         <Slider
//     //           label="Salles de bain"
//     //           value={bathroomsRange}
//     //           step={1}
//     //           minValue={0}
//     //           maxValue={10}
//     //           onChange={handleBathroomsChange}
//     //           className="w-full shadow-lg bg-white p-2 rounded"
//     //           showTooltip
//     //         />
//     //       </div>
//     //     )}

//     //     <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
//     //       <button
//     //         className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 text-center"
//     //         onClick={toggleAdvancedFilters}
//     //       >
//     //         {showAdvancedFilters
//     //           ? "Masquer les filtres avancés"
//     //           : "Plus de critères"}
//     //       </button>
//     //       <button
//     //         className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700 text-center"
//     //         onClick={resetFilters}
//     //       >
//     //         Réinitialiser les filtres
//     //       </button>
//     //     </div>
//     //   </div>
//     // </div>
//     <>
//       {/* Modal fenêtre filtre */}
//       {openModal && (
//         // <div className="w-full h-screen flex absolute top-0 backdrop-filter backdrop-brightness-75 backdrop-blur-md z-50 items-center justify-center">
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//           {/* <div className="relative max-1024:h-3/5 max-440:h-4/5 max-440:w-9/10 h-full rounded-lg w-500px pt-8 pb-5 bg-gradient-to-br from-sky-400 to-indigo-500 animate-fadeDown"> */}
//           <div className="p-4 relative w-full max-w-md mx-4 sm:mx-auto max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl  animate-fadeDown">
//             {/* Close Button */}
//             {/* <span
//               onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//               className="text-white absolute top-0 right-0 rounded-tr-lg text-[18px] cursor-pointer font-normal bg-[rgb(203,59,59)] text-aliceblue p-1 transition duration-150 ease-in-out hover:bg-[rgb(253,1,1)]"
//             >
//               X
//             </span> */}
//             <button
//               onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//               className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
//             >
//               ✕
//             </button>
//             {/* Filtres principaux */}
//             {/* <div className="mt-5 overflow-y-scroll overflow-hidden h-88% pl-8 pr-6 scroll-blue max-440:pl-6 max-440:pr-4"> */}
//             {/* Scrollable Content */}
//             {/* <div
//               className="p-6 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-100px)]
//               scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
//             > */}
//             <div
//               className="p-6 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)]
//   [&::-webkit-scrollbar]:hidden
//   [-ms-overflow-style:none]
//   [scrollbar-width:none]"
//             >
//               <div
//                 className="p-6 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-100px)]
//               scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
//               ></div>
//               <div className="flex flex-col gap-4 justify-center items-center">
//                 <Select
//                   aria-label="Choisir l'opération"
//                   placeholder="Opération"
//                   variant="bordered"
//                   value={selectedStatus || ""}
//                   className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//                   selectionMode="single"
//                   onSelectionChange={(value) =>
//                     handleStatusChange(value as string)
//                   }
//                 >
//                   {statusWithNoneOption.map((item) => (
//                     <SelectItem key={item.id} value={item.id}>
//                       {item.value}
//                     </SelectItem>
//                   ))}
//                 </Select>

//                 <Select
//                   aria-label="Choisir le type de bien"
//                   variant="bordered"
//                   placeholder="Type de bien"
//                   value={selectedType}
//                   className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//                   selectionMode="single"
//                   onSelectionChange={(value) =>
//                     handleTypeChange(value as string)
//                   }
//                 >
//                   {typesWithNoneOption.map((item) => (
//                     <SelectItem key={item.id} value={item.id}>
//                       {item.value}
//                     </SelectItem>
//                   ))}
//                 </Select>

//                 <Select
//                   aria-label="Pays"
//                   variant="bordered"
//                   placeholder="Choisir un pays"
//                   value={selectedCountry}
//                   className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//                   selectionMode="single"
//                   onSelectionChange={(value) =>
//                     handleCountryChange(value as string)
//                   }
//                 >
//                   {countriesWithNoneOption.map((item) => (
//                     <SelectItem key={item.id} value={item.id}>
//                       {item.value}
//                     </SelectItem>
//                   ))}
//                 </Select>

//                 <Select
//                   aria-label="Villes"
//                   variant="bordered"
//                   placeholder="Choisir une ville"
//                   value={selectedCity}
//                   className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//                   selectionMode="single"
//                   onSelectionChange={(value) =>
//                     handleCityChange(value as string)
//                   }
//                 >
//                   {citiesOfMoroccoWithNoneOption.map((item) => (
//                     <SelectItem key={item.id} value={item.id}>
//                       {item.value}
//                     </SelectItem>
//                   ))}
//                 </Select>

//                 <Select
//                   aria-label="Trier par"
//                   variant="bordered"
//                   placeholder="Trier par"
//                   value={sortOrder}
//                   className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
//                   selectionMode="single"
//                   // onSelectionChange retourne un objet Set dans lequel se trouve la valeur sélectionnée ("desc") au lieu de simplement renvoyer la chaîne elle-même.
//                   onSelectionChange={(value) =>
//                     handleSortOrderChange(value as string)
//                   }
//                 >
//                   <SelectItem key={"none"} value="none">
//                     Aucun tri
//                   </SelectItem>
//                   <SelectItem key={"price-asc"} value="price-asc">
//                     Prix croissant
//                   </SelectItem>
//                   <SelectItem key={"price-desc"} value="price-desc">
//                     Prix décroissant
//                   </SelectItem>
//                   <SelectItem key={"surface-asc"} value="surface-asc">
//                     Surface croissante
//                   </SelectItem>
//                   <SelectItem key={"surface-desc"} value="surface-desc">
//                     Surface décroissante
//                   </SelectItem>
//                   <SelectItem key={"date-asc"} value="date-asc">
//                     Plus ancien
//                   </SelectItem>
//                   <SelectItem key={"date-desc"} value="date-desc">
//                     Plus récent
//                   </SelectItem>
//                 </Select>

//                 {/* Section 2 : Filtres avancés (affichage conditionnel) */}
//                 {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"> */}
//                 <Slider
//                   label="Prix (€)"
//                   value={priceRange}
//                   step={10000}
//                   minValue={0}
//                   maxValue={1000000}
//                   onChange={handlePriceChange}
//                   formatOptions={{ style: "currency", currency: "EUR" }}
//                   className="w-full shadow-lg bg-white p-2 rounded"
//                   showTooltip
//                 />

//                 <Slider
//                   label="Surface habitable (m²)"
//                   value={areaRange}
//                   step={10}
//                   minValue={0}
//                   maxValue={1000}
//                   onChange={handleAreaChange}
//                   className="w-full shadow-lg bg-white p-2 rounded"
//                   showTooltip
//                 />

//                 <Slider
//                   label="Chambres"
//                   value={bedroomsRange}
//                   step={1}
//                   minValue={0}
//                   maxValue={10}
//                   onChange={handleBedroomsChange}
//                   className="w-full shadow-lg bg-white p-2 rounded"
//                   showTooltip
//                 />
//                 <Slider
//                   label="Salles de bain"
//                   value={bathroomsRange}
//                   step={1}
//                   minValue={0}
//                   maxValue={10}
//                   onChange={handleBathroomsChange}
//                   className="w-full shadow-lg bg-white p-2 rounded"
//                   showTooltip
//                 />
//               </div>
//             </div>
//             {/* <div className="flex mt-3 justify-between items-center w-full px-8 max-440:px-6"> */}
//             <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
//               <button
//                 onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
//               >
//                 Accepter
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700  text-center"
//                 onClick={resetFilters}
//               >
//                 Effacer les filtres
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       <div className="p-2 pl-20 bg-gradient-to-br sm:p-3 from-sky-400 to-indigo-500 shadow-lg w-full mx-auto">
//         {/* Section 1 : Filtres principaux */}
//         <div
//           key={resetKey}
//           className="flex flex-col space-y-4  lg:space-y-8  w-full"
//         >
//           <div className="flex flex-row gap-2 items-center sm:justify-center">
//             <Input
//               placeholder="Recherche dans les titres"
//               onChange={(e) => handleInputChange(e.target.value)}
//               className="w-full max-w-md shadow-lg"
//               endContent={
//                 loading ? (
//                   <Spinner />
//                 ) : (
//                   <MagnifyingGlassIcon className="w-4 text-slate-500" />
//                 )
//               }
//               value={searchQuery} // Utilise value au lieu de defaultValue
//               // defaultValue={searchParams.get("query") ?? ""}
//             />
//             <div
//               onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
//               className="flex flex-row text-white gap-2 mt-0 border border-[#717273] p-1 rounded-lg cursor-pointer transition duration-200 ease-in-out hover:border-white hover:text-[#717273] hover:bg-[#e2e4e6]"
//             >
//               <span>Filtres</span>
//               <FilterSVG width="30" height="30" />
//             </div>
//           </div>
//           {/* Filtres principaux */}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Search;
// ---------------------------------------------------------------------
// Refactoring du composant search

"use client";
import React, { useState, useEffect, Fragment } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import FilterSVG from "../assets/svg/FilterSVG"; // ajout
import useModalOpen from "../hooks/useModalOpen"; // ajout
import SearchSlider from "./SearchSlider";
import SearchSelect from "./SearchSelect";
import useFilterDatas from "../hooks/useFilterDatas";
import ButtonClose from "./ButtonClose";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false); // ajout
  const handleModalOpen = useModalOpen(); // ajout
  const selectFilters = useFilterDatas();
  const [once, setOnce] = useState(true);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") ?? ""
  );

  // Synchroniser l'état initial avec les paramètres URL
  useEffect(() => {
    const queryParam = searchParams.get("query") ?? "";
  }, [searchParams]);

  useEffect(() => {
    if (
      !openModal &&
      selectFilters &&
      selectFilters.length > 0 &&
      searchParams &&
      once
    ) {
      selectFilters.map((item) => {
        if (item.rangeName && item.setRange) {
          const minRange = searchParams.get(item.rangeName[0]);
          const maxRange = searchParams.get(item.rangeName[1]);
          if (minRange && maxRange) {
            item.setRange([Number(minRange), Number(maxRange)]);
          }
        } else if (
          item.name &&
          item.setValue &&
          item.type !== "slider" &&
          item.items
        ) {
          const searchString = searchParams.get(item.name);
          let matchItem = item.items.find(
            (value) => value.value == searchString
          );
          if (item.name == "sortOrder")
            matchItem = matchItem = item.items.find(
              (value) => value.id == searchString
            );
          if (matchItem) {
            item.setValue(matchItem?.id.toString());
          } else {
            item.setValue(""); // Pas de tri
          }
        }
      });
      setOnce(false);
    }
  }, [searchParams, selectFilters, openModal, once]);

  const handleInputChange = (query: string) => {
    setSearchQuery(query); // Met à jour l'état local
    handleChange(query); // Débounced callback pour l'URL
  };

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
  }, 500);

  // j utilise une clé dynamique pour synchroniser les select avec les states
  const [resetKey, setResetKey] = useState(0);
  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    selectFilters.map((item) => {
      if (item.type === "slider" && item.setRange && item.rangeValue) {
        item.setRange(item.rangeValue);
      } else if (item.type !== "slider" && item.setValue) {
        item.setValue("");
      }
    });
    setSearchQuery(""); // Réinitialise la recherche
    setResetKey((prev) => prev + 1);
    // Supprime tous les paramètres de l'URL
    router.replace(pathName);
    router.refresh();
  };

  const resetSearchQuery = () => {
    // Créez une nouvelle instance de URLSearchParams
    const params = new URLSearchParams(searchParams);

    // Supprimez le paramètre de requête
    params.delete("query");

    // Réinitialisez l'état de recherche
    setSearchQuery("");

    // Construisez la nouvelle URL
    const newUrl = params.toString()
      ? `${pathName}?${params.toString()}`
      : pathName;

    // Utilisez router.replace au lieu de router.push pour éviter l'historique
    router.replace(newUrl);
  };

  return (
    <>
      {/* Modal fenêtre filtre */}
      {openModal && (
        // <div className="w-full h-screen flex absolute top-0 backdrop-filter backdrop-brightness-75 backdrop-blur-md z-50 items-center justify-center">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          {/* <div className="relative max-1024:h-3/5 max-440:h-4/5 max-440:w-9/10 h-full rounded-lg w-500px pt-8 pb-5 bg-gradient-to-br from-sky-400 to-indigo-500 animate-fadeDown"> */}
          <div className="p-4 relative w-full max-w-md mx-4 sm:mx-auto max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl  animate-fadeDown">
            {/* Close Button */}

            <ButtonClose
              top="top-2"
              right="right-2"
              width="w-8"
              height="h-8"
              onClick={() => handleModalOpen(setOpenModal, "auto", false)}
            />
            {/* Filtres principaux */}
            {/* <div className="mt-5 overflow-y-scroll overflow-hidden h-88% pl-8 pr-6 scroll-blue max-440:pl-6 max-440:pr-4"> */}
            {/* Scrollable Content */}
            {/* <div
              className="p-6 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-100px)] 
              scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent"
            > */}
            <div
              className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)] 
  [&::-webkit-scrollbar]:hidden 
  [-ms-overflow-style:none] 
  [scrollbar-width:none]"
            >
              <div className="flex flex-col gap-4 justify-center items-center">
                {selectFilters.map((item, index) => (
                  <Fragment key={index}>
                    {item.type === "slider" ? (
                      <SearchSlider
                        ariaLabel={item.ariaLabel}
                        value={item.range || []}
                        step={item.step || 1}
                        rangeValue={item.rangeValue || [0, 10]}
                        searchParams={searchParams}
                        setValue={item.setRange}
                        name={item.name}
                        formatOptions={item.formatOptions}
                        rangeName={item.rangeName || []}
                      />
                    ) : (
                      <SearchSelect
                        ariaLabel={item.ariaLabel}
                        placeholder={item.placeholder || ""}
                        value={item.value || ""}
                        setValue={item.setValue}
                        values={item.items || []}
                        searchParams={searchParams}
                        name={item.name}
                      />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
            {/* <div className="flex mt-3 justify-between items-center w-full px-8 max-440:px-6"> */}
            <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
              <button
                onClick={() => handleModalOpen(setOpenModal, "auto", false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
              >
                Accepter
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700  text-center"
                onClick={resetFilters}
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="p-2 pl-20 bg-gradient-to-br sm:p-3 from-sky-400 to-indigo-500 shadow-lg w-full mx-auto">
        {/* Section 1 : Filtres principaux */}
        <div
          key={resetKey}
          className="flex flex-col space-y-4  lg:space-y-8  w-full"
        >
          <div className="flex flex-row gap-2 items-center sm:justify-center">
            <Input
              isClearable
              onClear={resetSearchQuery}
              placeholder="Recherche dans les titres"
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full max-w-md shadow-lg"
              // endContent={
              //   loading ? (
              //     <Spinner />
              //   ) : (
              //     <MagnifyingGlassIcon className="w-4 text-slate-500" />
              //   )
              // }
              value={searchQuery} // Utilise value au lieu de defaultValue
              // defaultValue={searchParams.get("query") ?? ""}
            />
            <div
              onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
              className="flex flex-row text-white gap-2 mt-0 border border-[#717273] p-1 rounded-lg cursor-pointer transition duration-200 ease-in-out hover:border-white hover:text-[#717273] hover:bg-[#e2e4e6]"
            >
              <span>Filtres</span>
              <FilterSVG width="30" height="30" />
            </div>
          </div>
          {/* Filtres principaux */}
        </div>
      </div>
    </>
  );
};

export default Search;
