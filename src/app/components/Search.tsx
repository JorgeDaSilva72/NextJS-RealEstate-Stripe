"use client";
import React, { useState, useEffect, Fragment } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import FilterSVG from "../assets/svg/FilterSVG";
import useModalOpen from "../hooks/useModalOpen";
import SearchSlider from "./SearchSlider";
import SearchSelect from "./SearchSelect";
import useFilterDatas from "../hooks/useFilterDatas";
import ButtonClose from "./ButtonClose";
import { capitalizeFirstLetter } from "@/lib/utils";
import { X } from "lucide-react";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = useModalOpen();
  const selectFilters = useFilterDatas();
  const [once, setOnce] = useState(true);

  // État local pour la recherche
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") ?? ""
  );
  // État local pour city
  const [cityValue, setCityValue] = useState(searchParams.get("city") ?? "");

  const handleInputChange = (query: string) => {
    setSearchQuery(query); // Met à jour l'état local
    handleChange(query, cityValue); // Débounced callback pour l'URL
  };

  const handleInputCityChange = (city: string) => {
    const formattedCity = capitalizeFirstLetter(city.trim()); // Capitalise et supprime les espaces
    setCityValue(formattedCity); // Met à jour l'état local
    handleChange(searchQuery, formattedCity); // Débounced callback pour l'URL
  };

  // Débounced callback pour mettre à jour l'URL
  const handleChange = useDebouncedCallback(
    async (query?: string, city?: string) => {
      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("query", query);
        setLoading(true);
      } else {
        params.delete("query");
      }

      if (city) {
        params.set("city", city);
      } else {
        params.delete("city");
      }
      console.log("Updated URL params:", params.toString()); // Debugging
      router.replace(`${pathName}?${params.toString()}`);
      setLoading(false);
    },
    500
  );

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
    setCityValue("");
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

    // Réinitialisez l'état local
    setSearchQuery("");

    // Construisez la nouvelle URL
    const newUrl = params.toString()
      ? `${pathName}?${params.toString()}`
      : pathName;

    // Utilisez router.replace au lieu de router.push pour éviter l'historique
    router.replace(newUrl);
  };

  const resetCityQuery = () => {
    // Créez une nouvelle instance de URLSearchParams
    const params = new URLSearchParams(searchParams);

    // Supprimez le paramètre de requête
    params.delete("city");

    // Réinitialisez l'état local
    setCityValue("");

    // Construisez la nouvelle URL
    const newUrl = params.toString()
      ? `${pathName}?${params.toString()}`
      : pathName;

    // Utilisez router.replace au lieu de router.push pour éviter l'historique
    router.replace(newUrl);
  };

  //Synchronisation initiale de l'état avec les paramètres URL
  useEffect(() => {
    const cityParam = searchParams.get("city") ?? "";
    if (!cityValue && cityParam !== cityValue) {
      setCityValue(cityParam);
    }

    const queryParam = searchParams.get("query") ?? "";
    if (!searchQuery && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
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
        if (item.name === "city" && item.setValue) {
          const cityParam = searchParams.get("city");
          if (cityParam) {
            item.setValue(cityParam);
          }
        }
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

  useEffect(() => {
    console.log("Current cityValue:", cityValue);
    handleChange(searchQuery, cityValue); // Inclure cityValue
  }, [cityValue]);

  return (
    //   <>
    //     {/* Modal fenêtre filtre */}
    //     {openModal && (
    //       // <div className="w-full h-screen flex absolute top-0 backdrop-filter backdrop-brightness-75 backdrop-blur-md z-50 items-center justify-center">
    //       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    //         {/* <div className="relative max-1024:h-3/5 max-440:h-4/5 max-440:w-9/10 h-full rounded-lg w-500px pt-8 pb-5 bg-gradient-to-br from-sky-400 to-indigo-500 animate-fadeDown"> */}
    //         <div className="p-4 relative w-full max-w-md mx-4 sm:mx-auto max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl  animate-fadeDown">
    //           {/* Close Button */}

    //           <ButtonClose
    //             top="top-2"
    //             right="right-2"
    //             width="w-8"
    //             height="h-8"
    //             onClick={() => handleModalOpen(setOpenModal, "auto", false)}
    //           />

    //           <div
    //             className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)]
    // [&::-webkit-scrollbar]:hidden
    // [-ms-overflow-style:none]
    // [scrollbar-width:none]"
    //           >
    //             <div className="flex flex-col gap-4 justify-center items-center">
    //               {selectFilters.map((item, index) => (
    //                 <Fragment key={index}>
    //                   {item.type === "text" ? (
    //                     <></>
    //                   ) : // <Input
    //                   //   placeholder={item.placeholder}
    //                   //   value={item.value}
    //                   //   onChange={(e) => item.setValue?.(e.target.value)}
    //                   //   className="w-full"
    //                   // />
    //                   item.type === "slider" ? (
    //                     <SearchSlider
    //                       ariaLabel={item.ariaLabel}
    //                       value={item.range || []}
    //                       step={item.step || 1}
    //                       rangeValue={item.rangeValue || [0, 10]}
    //                       searchParams={searchParams}
    //                       setValue={item.setRange}
    //                       name={item.name}
    //                       formatOptions={item.formatOptions}
    //                       rangeName={item.rangeName || []}
    //                     />
    //                   ) : (
    //                     <SearchSelect
    //                       ariaLabel={item.ariaLabel}
    //                       placeholder={item.placeholder || ""}
    //                       value={item.value || ""}
    //                       setValue={item.setValue}
    //                       values={item.items || []}
    //                       searchParams={searchParams}
    //                       name={item.name}
    //                     />
    //                   )}
    //                 </Fragment>
    //               ))}
    //               {/* Input pour "city" */}
    //               <Input
    //                 isClearable
    //                 placeholder="Ville"
    //                 value={cityValue}
    //                 onChange={(e) => handleInputCityChange(e.target.value)}
    //                 onClear={resetCityQuery}
    //                 className="w-full max-w-md"
    //               />
    //             </div>
    //           </div>
    //           {/* <div className="flex mt-3 justify-between items-center w-full px-8 max-440:px-6"> */}
    //           <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
    //             <button
    //               onClick={() => handleModalOpen(setOpenModal, "auto", false)}
    //               className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
    //             >
    //               Accepter
    //             </button>
    //             <button
    //               className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700  text-center"
    //               onClick={resetFilters}
    //             >
    //               Effacer les filtres
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //     <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg w-full mx-auto rounded-lg">
    //       <div key={resetKey} className="flex flex-col space-y-4 w-full">
    //         <div className="flex flex-row gap-3 items-center sm:justify-center">
    //           <Input
    //             isClearable
    //             onClear={resetSearchQuery}
    //             placeholder="Rechercher une annonce..."
    //             onChange={(e) => handleInputChange(e.target.value)}
    //             className="flex-1 w-full sm:max-w-xl px-4 py-2 shadow-md rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
    //             value={searchQuery}
    //           />
    //           <button
    //             onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
    //             className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-white hover:text-indigo-600 border border-transparent hover:border-white"
    //           >
    //             <span className="font-medium">Filtres</span>
    //             <FilterSVG width="24" height="24" />
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </>
    <>
      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => handleModalOpen(setOpenModal, "auto", false)} // Ferme la modale en cliquant en dehors
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-2xl animate-fadeDown p-4 sm:p-6 md:p-8 overflow-y-auto scrollbar-hide"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l’intérieur
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center"
              onClick={() => handleModalOpen(setOpenModal, "auto", false)}
            >
              ✕
            </button>

            {/* Filters */}
            <div className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)] scrollbar-hide">
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
                {/* Input pour "city" */}
                <Input
                  isClearable
                  placeholder="Ville"
                  value={cityValue}
                  onChange={(e) => handleInputCityChange(e.target.value)}
                  onClear={resetCityQuery}
                  className="w-full "
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
              <button
                onClick={() => handleModalOpen(setOpenModal, "auto", false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
              >
                Accepter
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700 text-center"
                onClick={resetFilters}
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg w-full mx-auto rounded-lg">
        <div key={resetKey} className="flex flex-col space-y-4 w-full">
          <div className="flex flex-row gap-3 items-center sm:justify-center">
            <Input
              isClearable
              onClear={resetSearchQuery}
              placeholder="Rechercher une annonce..."
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 w-full sm:max-w-xl px-4 py-2 shadow-md rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
              value={searchQuery}
            />
            <button
              onClick={() => handleModalOpen(setOpenModal, "hidden", true)}
              className="flex flex-row items-center gap-2 px-4 py-2 text-white bg-white/20 rounded-lg shadow-md transition-all duration-200 ease-in-out hover:bg-white hover:text-indigo-600 border border-transparent hover:border-white"
            >
              <span className="font-medium">Filtres</span>
              <FilterSVG width="24" height="24" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
