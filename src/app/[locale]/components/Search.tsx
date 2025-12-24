// "use client";
// import React, { useState, useEffect, Fragment } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
// import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import FilterSVG from "../assets/svg/FilterSVG";
// import useModalOpen from "../hooks/useModalOpen";
// import SearchSlider from "./SearchSlider";
// import SearchSelect from "./SearchSelect";
// import useFilterDatas from "../hooks/useFilterDatas";
// import ButtonClose from "./ButtonClose";
// import { capitalizeFirstLetter } from "@/lib/utils";
// import { motion } from "framer-motion";

// const Search = () => {
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();
//   const [openModal, setOpenModal] = useState(false);
//   const handleModalOpen = useModalOpen();
//   const selectFilters = useFilterDatas();
//   const [once, setOnce] = useState(true);

//   //État local pour la recherche
//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("query") ?? ""
//   );
//   //État local pour city
//   const [cityValue, setCityValue] = useState(searchParams.get("city") ?? "");

//   const handleInputChange = (query: string) => {
//     setSearchQuery(query); // Met à jour l'état local
//     handleChange(query, cityValue); // Débounced callback pour l'URL
//   };

//   const handleInputCityChange = (city: string) => {
//     const formattedCity = capitalizeFirstLetter(city.trim()); // Capitalise et supprime les espaces
//     setCityValue(formattedCity); // Met à jour l'état local
//     handleChange(searchQuery, formattedCity); // Débounced callback pour l'URL
//   };

//   //Débounced callback pour mettre à jour l'URL
//   const handleChange = useDebouncedCallback(
//     async (query?: string, city?: string) => {
//       const params = new URLSearchParams(searchParams);
//       if (query) {
//         params.set("query", query);
//         setLoading(true);
//       } else {
//         params.delete("query");
//       }

//       if (city) {
//         params.set("city", city);
//       } else {
//         params.delete("city");
//       }
//       console.log("Updated URL params:", params.toString()); // Debugging
//       router.replace(`${pathName}?${params.toString()}`);
//       setLoading(false);
//     },
//     500
//   );

//   //j utilise une clé dynamique pour synchroniser les select avec les states
//   const [resetKey, setResetKey] = useState(0);
//   //Fonction pour réinitialiser tous les filtres
//   const resetFilters = () => {
//     selectFilters.map((item) => {
//       if (item.type === "slider" && item.setRange && item.rangeValue) {
//         item.setRange(item.rangeValue);
//       } else if (item.type !== "slider" && item.setValue) {
//         item.setValue("");
//       }
//     });
//     setSearchQuery(""); // Réinitialise la recherche
//     setCityValue("");
//     setResetKey((prev) => prev + 1);
//     //Supprime tous les paramètres de l'URL
//     router.replace(pathName);
//     router.refresh();
//   };

//   const resetSearchQuery = () => {
//     //Créez une nouvelle instance de URLSearchParams
//     const params = new URLSearchParams(searchParams);

//     //Supprimez le paramètre de requête
//     params.delete("query");

//     //Réinitialisez l'état local
//     setSearchQuery("");

//     //Construisez la nouvelle URL
//     const newUrl = params.toString()
//       ? `${pathName}?${params.toString()}`
//       : pathName;

//     //Utilisez router.replace au lieu de router.push pour éviter l'historique
//     router.replace(newUrl);
//   };

//   const resetCityQuery = () => {
//     //Créez une nouvelle instance de URLSearchParams
//     const params = new URLSearchParams(searchParams);

//     //Supprimez le paramètre de requête
//     params.delete("city");

//     //Réinitialisez l'état local
//     setCityValue("");

//     //Construisez la nouvelle URL
//     const newUrl = params.toString()
//       ? `${pathName}?${params.toString()}`
//       : pathName;

//     //Utilisez router.replace au lieu de router.push pour éviter l'historique
//     router.replace(newUrl);
//   };

//   //Synchronisation initiale de l'état avec les paramètres URL
//   useEffect(() => {
//     const cityParam = searchParams.get("city") ?? "";
//     if (!cityValue && cityParam !== cityValue) {
//       setCityValue(cityParam);
//     }

//     const queryParam = searchParams.get("query") ?? "";
//     if (!searchQuery && queryParam !== searchQuery) {
//       setSearchQuery(queryParam);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (
//       !openModal &&
//       selectFilters &&
//       selectFilters.length > 0 &&
//       searchParams &&
//       once
//     ) {
//       selectFilters.map((item) => {
//         if (item.name === "city" && item.setValue) {
//           const cityParam = searchParams.get("city");
//           if (cityParam) {
//             item.setValue(cityParam);
//           }
//         }
//         if (item.rangeName && item.setRange) {
//           const minRange = searchParams.get(item.rangeName[0]);
//           const maxRange = searchParams.get(item.rangeName[1]);
//           if (minRange && maxRange) {
//             item.setRange([Number(minRange), Number(maxRange)]);
//           }
//         } else if (
//           item.name &&
//           item.setValue &&
//           item.type !== "slider" &&
//           item.items
//         ) {
//           const searchString = searchParams.get(item.name);
//           let matchItem = item.items.find(
//             (value) => value.value == searchString
//           );
//           if (item.name == "sortOrder")
//             matchItem = matchItem = item.items.find(
//               (value) => value.id == searchString
//             );
//           if (matchItem) {
//             item.setValue(matchItem?.id.toString());
//           } else {
//             item.setValue(""); // Pas de tri
//           }
//         }
//       });
//       setOnce(false);
//     }
//   }, [searchParams, selectFilters, openModal, once]);

//   useEffect(() => {
//     console.log("Current cityValue:", cityValue);
//     handleChange(searchQuery, cityValue); // Inclure cityValue
//   }, [cityValue]);

//   return (
//     <>
//       {openModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
//           onClick={() => handleModalOpen(setOpenModal, "auto", false)} // Ferme la modale en cliquant en dehors
//         >
//           <motion.div
//             className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl animate-fadeDown p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-hide"
//             onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l’intérieur
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.5, ease: "easeInOut" }}
//           >
//             {/* Close Button */}
//             <button
//               className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center"
//               onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//             >
//               ✕
//             </button>

//             {/* Filters */}
//             <div className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)] scrollbar-hide">
//               <div className="flex flex-col gap-4 justify-center items-center">
//                 {selectFilters.map((item, index) => (
//                   <Fragment key={index}>
//                     {item.type === "slider" ? (
//                       <SearchSlider
//                         ariaLabel={item.ariaLabel}
//                         value={item.range || []}
//                         step={item.step || 1}
//                         rangeValue={item.rangeValue || [0, 10]}
//                         searchParams={searchParams}
//                         setValue={item.setRange}
//                         name={item.name}
//                         formatOptions={item.formatOptions}
//                         rangeName={item.rangeName || []}
//                       />
//                     ) : (
//                       <SearchSelect
//                         ariaLabel={item.ariaLabel}
//                         placeholder={item.placeholder || ""}
//                         value={item.value || ""}
//                         setValue={item.setValue}
//                         values={item.items || []}
//                         searchParams={searchParams}
//                         name={item.name}
//                       />
//                     )}
//                   </Fragment>
//                 ))}
//                 {/* Input pour "city" */}
//                 <Input
//                   isClearable
//                   placeholder="Ville"
//                   value={cityValue}
//                   onChange={(e) => handleInputCityChange(e.target.value)}
//                   onClear={resetCityQuery}
//                   className="w-full "
//                 />
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
//               <button
//                 onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
//               >
//                 Accepter
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700 text-center"
//                 onClick={resetFilters}
//               >
//                 Effacer les filtres
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg w-full mx-auto rounded-lg">
//         <div key={resetKey} className="flex flex-col space-y-4 w-full">
//           <div className="flex flex-row gap-3 items-center sm:justify-center">
//             <Input
//               isClearable
//               onClear={resetSearchQuery}
//               placeholder="Rechercher une annonce..."
//               onChange={(e) => handleInputChange(e.target.value)}
//               className="flex-1 w-full sm:max-w-xl px-4 py-2 shadow-md rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
//               value={searchQuery}
//             />
//             <button
//               onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
//               className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-white hover:text-indigo-600 border border-transparent hover:border-white"
//             >
//               <span className="font-medium">Filtres</span>
//               <FilterSVG width="24" height="24" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Search;

// end ----------------------------------------------------------
// next-intl with chatgpt

// "use client";
// import React, { useState, useEffect, Fragment } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
// import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
// // import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { useDebouncedCallback } from "use-debounce";
// import { useTranslations } from "next-intl"; // Import de next-intl
// import FilterSVG from "../assets/svg/FilterSVG";
// import useModalOpen from "../hooks/useModalOpen";
// import SearchSlider from "./SearchSlider";
// import SearchSelect from "./SearchSelect";
// import useFilterDatas from "../hooks/useFilterDatas";
// import ButtonClose from "./ButtonClose";
// import { capitalizeFirstLetter } from "@/lib/utils";
// import { motion } from "framer-motion";
// import { usePathname, useRouter } from "@/i18n/routing";
// import { useSearchParams } from "next/navigation";

// const Search = () => {
//   const t = useTranslations("Search"); // Chargement des traductions

//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const pathName = usePathname();
//   const router = useRouter();
//   const [openModal, setOpenModal] = useState(false);
//   const handleModalOpen = useModalOpen();
//   const selectFilters = useFilterDatas();
//   const [once, setOnce] = useState(true);

//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("query") ?? ""
//   );
//   const [cityValue, setCityValue] = useState(searchParams.get("city") ?? "");

//   const handleInputChange = (query: string) => {
//     setSearchQuery(query);
//     handleChange(query, cityValue);
//   };

//   const handleInputCityChange = (city: string) => {
//     const formattedCity = capitalizeFirstLetter(city.trim());
//     setCityValue(formattedCity);
//     handleChange(searchQuery, formattedCity);
//   };

//   const handleChange = useDebouncedCallback(
//     async (query?: string, city?: string) => {
//       const params = new URLSearchParams(searchParams);
//       if (query) {
//         params.set("query", query);
//         setLoading(true);
//       } else {
//         params.delete("query");
//       }

//       if (city) {
//         params.set("city", city);
//       } else {
//         params.delete("city");
//       }

//       router.replace(`${pathName}?${params.toString()}`);
//       setLoading(false);
//     },
//     500
//   );

//   const [resetKey, setResetKey] = useState(0);
//   const resetFilters = () => {
//     selectFilters.forEach((item) => {
//       if (item.type === "slider" && item.setRange && item.rangeValue) {
//         item.setRange(item.rangeValue);
//       } else if (item.type !== "slider" && item.setValue) {
//         item.setValue("");
//       }
//     });

//     setSearchQuery("");
//     setCityValue("");
//     setResetKey((prev) => prev + 1);
//     router.replace(pathName);
//     router.refresh();
//   };

//   useEffect(() => {
//     const cityParam = searchParams.get("city") ?? "";
//     if (!cityValue && cityParam !== cityValue) {
//       setCityValue(cityParam);
//     }

//     const queryParam = searchParams.get("query") ?? "";
//     if (!searchQuery && queryParam !== searchQuery) {
//       setSearchQuery(queryParam);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (!openModal && selectFilters.length > 0 && once) {
//       selectFilters.forEach((item) => {
//         if (item.name === "city" && item.setValue) {
//           const cityParam = searchParams.get("city");
//           if (cityParam) {
//             item.setValue(cityParam);
//           }
//         }
//       });
//       setOnce(false);
//     }
//   }, [searchParams, selectFilters, openModal, once]);

//   return (
//     <>
//       {openModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
//           onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//         >
//           <motion.div
//             className="relative w-full max-w-xl max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl p-6 overflow-y-auto scrollbar-hide"
//             onClick={(e) => e.stopPropagation()}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.5, ease: "easeInOut" }}
//           >
//             <button
//               className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center"
//               onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//             >
//               ✕
//             </button>

//             <div className="px-6 mt-8">
//               <div className="flex flex-col gap-4">
//                 {selectFilters.map((item, index) => (
//                   <Fragment key={index}>
//                     {item.type === "slider" ? (
//                       <SearchSlider
//                         ariaLabel={item.ariaLabel}
//                         value={item.range || []}
//                         step={item.step || 1}
//                         rangeValue={item.rangeValue || [0, 10]}
//                         searchParams={searchParams}
//                         setValue={item.setRange}
//                         name={item.name}
//                         formatOptions={item.formatOptions}
//                         rangeName={item.rangeName || []}
//                       />
//                     ) : (
//                       <SearchSelect
//                         ariaLabel={item.ariaLabel}
//                         placeholder={item.placeholder || ""}
//                         value={item.value || ""}
//                         setValue={item.setValue}
//                         values={item.items || []}
//                         searchParams={searchParams}
//                         name={item.name}
//                       />
//                     )}
//                   </Fragment>
//                 ))}

//                 <Input
//                   isClearable
//                   placeholder={t("cityPlaceholder")}
//                   value={cityValue}
//                   onChange={(e) => handleInputCityChange(e.target.value)}
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
//               <button
//                 onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700"
//               >
//                 {t("accept")}
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700"
//                 onClick={resetFilters}
//               >
//                 {t("clearFilters")}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg w-full mx-auto rounded-lg">
//         <div
//           key={resetKey}
//           className="flex flex-row gap-3 items-center sm:justify-center"
//         >
//           <Input
//             isClearable
//             placeholder={t("searchPlaceholder")}
//             onChange={(e) => handleInputChange(e.target.value)}
//             className="flex-1 w-full sm:max-w-xl px-4 py-2 shadow-md rounded-lg"
//             value={searchQuery}
//           />
//           <button
//             onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
//             className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 rounded-lg"
//           >
//             <span className="font-medium">{t("filters")}</span>
//             <FilterSVG width="24" height="24" />
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Search;

// end ----------------------------------------------------------
// next-intl with claude

// "use client";
// import React, { useState, useEffect, Fragment } from "react";
// import { Input } from "@nextui-org/react";
// import { useTranslations } from "next-intl";
// import FilterSVG from "../assets/svg/FilterSVG";
// import useModalOpen from "../hooks/useModalOpen";
// import SearchSlider from "./SearchSlider";
// import SearchSelect from "./SearchSelect";
// import useFilterDatas from "../hooks/useFilterDatas";
// import { motion } from "framer-motion";
// import { useSearchParams } from "next/navigation";
// import { usePathname, useRouter } from "@/i18n/routing";

// const Search = () => {
//   const t = useTranslations("Search");
//   const [loading, setLoading] = useState(false);
//   const searchParams = useSearchParams();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [openModal, setOpenModal] = useState(false);
//   const handleModalOpen = useModalOpen();
//   const selectFilters = useFilterDatas();
//   const [once, setOnce] = useState(true);

//   const [searchQuery, setSearchQuery] = useState(
//     searchParams.get("query") ?? ""
//   );
//   const [cityValue, setCityValue] = useState(searchParams.get("city") ?? "");

//   const handleInputChange = (query: string) => {
//     setSearchQuery(query);
//     handleChange(query, cityValue);
//   };

//   const handleInputCityChange = (city: string) => {
//     const formattedCity =
//       city.trim().charAt(0).toUpperCase() + city.slice(1).toLowerCase();
//     setCityValue(formattedCity);
//     handleChange(searchQuery, formattedCity);
//   };

//   const handleChange = React.useCallback(
//     async (query?: string, city?: string) => {
//       const params = new URLSearchParams(searchParams.toString());
//       if (query) {
//         params.set("query", query);
//         setLoading(true);
//       } else {
//         params.delete("query");
//       }

//       if (city) {
//         params.set("city", city);
//       } else {
//         params.delete("city");
//       }
//       router.replace(`${pathname}?${params.toString()}`);
//       setLoading(false);
//     },
//     [pathname, router, searchParams]
//   );

//   const [resetKey, setResetKey] = useState(0);

//   const resetFilters = () => {
//     selectFilters.forEach((item) => {
//       if (item.type === "slider" && item.setRange && item.rangeValue) {
//         item.setRange(item.rangeValue);
//       } else if (item.type !== "slider" && item.setValue) {
//         item.setValue("");
//       }
//     });
//     setSearchQuery("");
//     setCityValue("");
//     setResetKey((prev) => prev + 1);
//     router.replace(pathname);
//     router.refresh();
//   };

//   const resetSearchQuery = () => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("query");
//     setSearchQuery("");
//     const newUrl = params.toString()
//       ? `${pathname}?${params.toString()}`
//       : pathname;
//     router.replace(newUrl);
//   };

//   const resetCityQuery = () => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.delete("city");
//     setCityValue("");
//     const newUrl = params.toString()
//       ? `${pathname}?${params.toString()}`
//       : pathname;
//     router.replace(newUrl);
//   };

//   useEffect(() => {
//     const cityParam = searchParams.get("city") ?? "";
//     if (!cityValue && cityParam !== cityValue) {
//       setCityValue(cityParam);
//     }

//     const queryParam = searchParams.get("query") ?? "";
//     if (!searchQuery && queryParam !== searchQuery) {
//       setSearchQuery(queryParam);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     if (
//       !openModal &&
//       selectFilters &&
//       selectFilters.length > 0 &&
//       searchParams &&
//       once
//     ) {
//       selectFilters.forEach((item) => {
//         if (item.name === "city" && item.setValue) {
//           const cityParam = searchParams.get("city");
//           if (cityParam) {
//             item.setValue(cityParam);
//           }
//         }
//         if (item.rangeName && item.setRange) {
//           const minRange = searchParams.get(item.rangeName[0]);
//           const maxRange = searchParams.get(item.rangeName[1]);
//           if (minRange && maxRange) {
//             item.setRange([Number(minRange), Number(maxRange)]);
//           }
//         } else if (
//           item.name &&
//           item.setValue &&
//           item.type !== "slider" &&
//           item.items
//         ) {
//           const searchString = searchParams.get(item.name);
//           let matchItem = item.items.find(
//             (value) => value.value === searchString
//           );
//           if (item.name === "sortOrder") {
//             matchItem = item.items.find((value) => value.id === searchString);
//           }
//           if (matchItem) {
//             item.setValue(matchItem?.id.toString());
//           } else {
//             item.setValue("");
//           }
//         }
//       });
//       setOnce(false);
//     }
//   }, [searchParams, selectFilters, openModal, once]);

//   return (
//     <>
//       {openModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
//           onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//         >
//           <motion.div
//             className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl animate-fadeDown p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-hide"
//             onClick={(e) => e.stopPropagation()}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.5, ease: "easeInOut" }}
//           >
//             <button
//               className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center"
//               onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//               aria-label={t("closeModal")}
//             >
//               ✕
//             </button>

//             <div className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)] scrollbar-hide">
//               <div className="flex flex-col gap-4 justify-center items-center">
//                 {selectFilters.map((item, index) => (
//                   <Fragment key={index}>
//                     {item.type === "slider" ? (
//                       <SearchSlider
//                         ariaLabel={item.ariaLabel}
//                         value={item.range || []}
//                         step={item.step || 1}
//                         rangeValue={item.rangeValue || [0, 10]}
//                         searchParams={searchParams}
//                         setValue={item.setRange}
//                         name={item.name}
//                         formatOptions={item.formatOptions}
//                         rangeName={item.rangeName || []}
//                       />
//                     ) : (
//                       <SearchSelect
//                         ariaLabel={item.ariaLabel}
//                         placeholder={item.placeholder || ""}
//                         value={item.value || ""}
//                         setValue={item.setValue}
//                         values={item.items || []}
//                         searchParams={searchParams}
//                         name={item.name}
//                       />
//                     )}
//                   </Fragment>
//                 ))}
//                 <Input
//                   isClearable
//                   placeholder={t("cityPlaceholder")}
//                   value={cityValue}
//                   onChange={(e) => handleInputCityChange(e.target.value)}
//                   onClear={resetCityQuery}
//                   className="w-full"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm mt-4">
//               <button
//                 onClick={() => handleModalOpen(setOpenModal, "auto", false)}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
//               >
//                 {t("accept")}
//               </button>
//               <button
//                 className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700 text-center"
//                 onClick={resetFilters}
//               >
//                 {t("clearFilters")}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg w-full mx-auto rounded-lg">
//         <div key={resetKey} className="flex flex-col space-y-4 w-full">
//           <div className="flex flex-row gap-3 items-center sm:justify-center">
//             <Input
//               isClearable
//               onClear={resetSearchQuery}
//               placeholder={t("searchPlaceholder")}
//               onChange={(e) => handleInputChange(e.target.value)}
//               className="flex-1 w-full sm:max-w-xl px-4 py-2 shadow-md rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
//               value={searchQuery}
//             />
//             <button
//               onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
//               className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-white hover:text-indigo-600 border border-transparent hover:border-white"
//             >
//               <span className="font-medium">{t("filters")}</span>
//               <FilterSVG width="24" height="24" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Search;

// 07/12 code modifié pour s adapter au nouveau prisma feature/multilingual-countries

"use client";
import React, { useState, useEffect, Fragment } from "react";
import { Input } from "@nextui-org/react";
import { useTranslations } from "next-intl";
import FilterSVG from "../assets/svg/FilterSVG";
import useModalOpen from "../hooks/useModalOpen";
import SearchSlider from "./SearchSlider";
import SearchSelect from "./SearchSelect";
import useFilterDatas from "../hooks/useFilterDatas";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";

const Search = () => {
  const t = useTranslations("Search");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = useModalOpen();
  const selectFilters = useFilterDatas();
  const [once, setOnce] = useState(true);

  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("query") ?? ""
  );

  const keyCache = searchParams?.get("key_cache") || "initial";
  // Ancien état cityValue supprimé, car la ville est maintenant gérée par SearchSelect via selectFilters.

  const handleInputChange = (query: string) => {
    setSearchQuery(query);
    // Don't auto-search on every keystroke, wait for search button
  };

  // Handle search button click
  const handleSearch = React.useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (searchQuery) {
      params.set("query", searchQuery);
    } else {
      params.delete("query");
    }

    // Get locale from current URL to ensure we use the correct one
    // Use window.location if available, otherwise extract from pathname
    let locale = 'fr'; // default
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      // Find the first valid locale code
      for (const part of pathParts) {
        if (/^[a-z]{2}$/.test(part) && ['fr', 'en', 'pt', 'ar'].includes(part)) {
          locale = part;
          break;
        }
      }
    } else {
      // Fallback: extract from pathname
      const pathParts = pathname.split('/').filter(Boolean);
      const foundLocale = pathParts.find(part => /^[a-z]{2}$/.test(part) && ['fr', 'en', 'pt', 'ar'].includes(part));
      if (foundLocale) {
        locale = foundLocale;
      }
    }
    
    // Always route to result page for searches (never redirect to home)
    // Construct the path with exactly one locale prefix - no duplicates
    const targetPath = `/${locale}/result`;
    
    // Add key_cache to force re-render and prevent redirect
    params.set("key_cache", Date.now().toString());
    
    // Use replace to update URL without adding to history and prevent redirects
    // This ensures the page stays on /result and doesn't redirect to home
    const searchUrl = `${targetPath}?${params.toString()}`;
    
    // Prevent any redirect by using replace - this should stay on result page
    router.replace(searchUrl);
  }, [pathname, router, searchParams, searchQuery]);

  // Les fonctions handleInputCityChange et resetCityQuery ont été supprimées.
  // La logique de la ville est maintenant déléguée à SearchSelect et useFilterDatas.

  const handleChange = React.useCallback(
    async (query?: string) => {
      // 'city' a été retiré des paramètres
      const params = new URLSearchParams(searchParams?.toString() || "");
      if (query) {
        params.set("query", query);
        setLoading(true);
      } else {
        params.delete("query");
      }

      // La logique de 'city' est gérée par le SearchSelect et useFilterDatas

      // Fix: Ensure we route to the correct path
      let targetPath = pathname;
      
      // Fix duplicate locale in path (e.g., /fr/fr/result -> /fr/result)
      if (targetPath.match(/^\/[a-z]{2}\/[a-z]{2}\//)) {
        const locale = targetPath.split('/')[1];
        const restOfPath = targetPath.split('/').slice(3).join('/');
        targetPath = `/${locale}/${restOfPath}`;
      }
      
      // If we're on result, buy, or rent page, stay there
      if (targetPath.includes('/result') || targetPath.includes('/buy') || targetPath.includes('/rent')) {
        router.replace(`${targetPath}?${params.toString()}`);
        setLoading(false);
        return;
      }
      
      // If we're on home page, route to result page for searches
      if (targetPath.match(/^\/[a-z]{2}$/) || targetPath.match(/^\/[a-z]{2}\/$/)) {
        const locale = targetPath.replace(/\//g, '') || 'fr';
        targetPath = `/${locale}/result`;
      } else if (!targetPath.includes('/result') && !targetPath.includes('/buy') && !targetPath.includes('/rent')) {
        // If not on result, buy, or rent page, go to result page
        const locale = targetPath.split('/')[1] || 'fr';
        targetPath = `/${locale}/result`;
      }

      router.replace(`${targetPath}?${params.toString()}`);
      setLoading(false);
    },
    [pathname, router, searchParams]
  );

  const [resetKey, setResetKey] = useState(0);

  const resetFilters = () => {
    selectFilters.forEach((item) => {
      if (item.type === "slider" && item.setRange && item.rangeValue) {
        item.setRange(item.rangeValue);
      } else if (item.type !== "slider" && item.setValue) {
        // Réinitialise tous les SearchSelect (y compris la ville, si elle y est)
        item.setValue("");
      }
    });
    setSearchQuery("");
    // setCityValue(""); // Ligne supprimée
    setResetKey((prev) => prev + 1);
    // Extract locale to ensure we stay on result page
    const locale = pathname.split('/')[1] || 'fr';
    const resultPath = `/${locale}/result`;
    router.replace(resultPath);
  };

  const resetSearchQuery = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("query");
    setSearchQuery("");
    const newUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(newUrl);
  };

  // La fonction resetCityQuery a été supprimée.

  useEffect(() => {
    // La logique de synchronisation de cityValue a été supprimée.

    const queryParam = searchParams?.get("query") ?? "";
    if (!searchQuery && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [searchParams, searchQuery]); // cityValue retiré des dépendances

  // useEffect(() => {
  //   if (
  //     !openModal &&
  //     selectFilters &&
  //     selectFilters.length > 0 &&
  //     searchParams &&
  //     once
  //   ) {
  //     selectFilters.forEach((item) => {
  //       // La logique spécifique à 'city' en tant que champ texte a été retirée

  //       if (item.rangeName && item.setRange) {
  //         const minRange = searchParams.get(item.rangeName[0]);
  //         const maxRange = searchParams.get(item.rangeName[1]);
  //         if (minRange && maxRange) {
  //           item.setRange([Number(minRange), Number(maxRange)]);
  //         }
  //       } else if (
  //         item.name &&
  //         item.setValue &&
  //         item.type !== "slider" &&
  //         item.items
  //       ) {
  //         const searchString = searchParams.get(item.name);
  //         let matchItem = item.items.find(
  //           (value) => value.value === searchString
  //         );
  //         if (item.name === "sortOrder") {
  //           // Logique spécifique pour 'sortOrder'
  //           matchItem = item.items.find((value) => value.id === searchString);
  //         }
  //         if (matchItem) {
  //           // Ici, on synchronise tous les SearchSelect (y compris la ville) avec les searchParams
  //           item.setValue(matchItem?.id.toString());
  //         } else {
  //           item.setValue("");
  //         }
  //       }
  //     });
  //     setOnce(false);
  //   }
  // }, [searchParams, selectFilters, openModal, once]);

  return (
    <>
      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => handleModalOpen(setOpenModal, "auto", false)}
        >
          <motion.div
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl animate-fadeDown p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center"
              onClick={() => handleModalOpen(setOpenModal, "auto", false)}
              aria-label={t("closeModal")}
            >
              ✕
            </button>

            <div className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)] scrollbar-hide">
              <div
                //  NOUVELLE CLÉ : Utiliser l'état d'ouverture du modal pour forcer le re-rendu
                // La clé doit changer à la fois si le modal s'ouvre/ferme ET si l'URL change.
                key={openModal.toString() + keyCache}
                className="flex flex-col gap-4 justify-center items-center"
              >
                {selectFilters.map((item, index) => (
                  // <Fragment key={index}>
                  <Fragment key={item.name}>
                    {/* Utiliser le nom comme clé stable */}
                    {item.type === "slider" ? (
                      <SearchSlider
                        ariaLabel={item.ariaLabel}
                        value={item.range || []}
                        step={item.step || 1}
                        rangeValue={item.rangeValue || [0, 10]}
                        searchParams={searchParams!}
                        setValue={item.setRange}
                        name={item.name}
                        formatOptions={item.formatOptions}
                        rangeName={item.rangeName || []}
                      />
                    ) : (
                      // Ceci gère désormais TOUS les filtres de sélection, y compris la ville
                      <SearchSelect
                        // key={item.name} // <--- Utilisez le nom du filtre (e.g., 'city', 'queryStatus') comme clé
                        // La clé est le nom du filtre + la clé de cache
                        key={`${item.name}-${keyCache}`} // <-- CLÉ DYNAMIQUE ET UNIQUE
                        ariaLabel={item.ariaLabel}
                        placeholder={item.placeholder || ""}
                        value={item.value || ""}
                        setValue={item.setValue}
                        values={item.items || []}
                        searchParams={searchParams!}
                        name={item.name}
                      />
                    )}
                  </Fragment>
                ))}
                {/* L'Input pour la ville est supprimé ici */}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm mt-4">
              <button
                onClick={() => handleModalOpen(setOpenModal, "auto", false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
              >
                {t("accept")}
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700 text-center"
                onClick={resetFilters}
              >
                {t("clearFilters")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg w-full mx-auto rounded-lg">
        <div key={resetKey} className="flex flex-col space-y-4 w-full">
          <div className="flex flex-row gap-3 items-center sm:justify-center">
            <Input
              isClearable
              onClear={resetSearchQuery}
              placeholder={t("searchPlaceholder")}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="flex-1 w-full sm:max-w-xl px-4 py-2 shadow-md rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
              value={searchQuery}
            />
            <button
              onClick={handleSearch}
              className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-md transition-all duration-200 ease-in-out border border-transparent"
            >
              <span className="font-medium">{t("searchButton") || "Rechercher"}</span>
            </button>
            <button
              onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
              className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-white hover:text-indigo-600 border border-transparent hover:border-white"
            >
              <span className="font-medium">{t("filters")}</span>
              <FilterSVG width="24" height="24" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
