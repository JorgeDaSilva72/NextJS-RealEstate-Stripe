// Refactoring du composant search

"use client";
import React, { useState, useEffect, Fragment } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { Input, Select, SelectItem, Spinner, Slider } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import { citiesOfMorocco } from "../data/cities";
// import { countries } from "../data/countries";
import FilterSVG from "../assets/svg/FilterSVG"; // ajout
import useModalOpen from "../hooks/useModalOpen"; // ajout
//import { selectFilters } from "../data/filters";
import SearchSlider from "./SearchSlider";
import SearchSelect from "./SearchSelect";
import useFilterDatas from "../hooks/useFilterDatas";
import { div } from "framer-motion/client";

const Search = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false); // ajout
  const handleModalOpen = useModalOpen(); // ajout
  const selectFilters = useFilterDatas();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") ?? ""
  );

  // useEffect(() => {    
  //   if (!openModal) {
  //     const savedFilters = getSavedSearches();
  //     const localStorageFilters = savedFilters[0] || [];
  //     console.log('localstorageFilters', localStorageFilters)

  //     selectFilters.map((item) => {
  //       console.log('test item', item.name)
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
  //           (value) => value.value == searchString
  //         );
  //         if (item.name == "sortOrder")
  //           matchItem = matchItem = item.items.find(
  //             (value) => value.id == searchString
  //           );
  //         if (matchItem) {
  //           item.setValue(matchItem?.id.toString());
  //         } else {
  //           item.setValue(""); // Pas de tri
  //         }
  //       }
  //     });
  //   }
  // }, [searchParams, selectFilters, openModal]);


  //Riv
  const saveSearch = () => {
    const savedFilters = selectFilters.map((filter) => {
      if (filter.type === "slider") {
        return {
          name: filter.name,
          type: filter.type,
          range: filter.range || [],
        };
      } else {
        return {
          name: filter.name,
          type: filter.type,
          value: filter.value || "",
        };
      }
    });

    // Sauvegarder dans LocalStorage (ou une API backend)
    const previousSearches = JSON.parse(localStorage.getItem("savedSearches") || "[]");
    localStorage.setItem("savedSearches", JSON.stringify([...previousSearches, savedFilters]));

    // Notifier l'utilisateur
    alert("Votre recherche a été enregistrée !");

  }

  const getSavedSearches = () => {
    const savedSearches = localStorage.getItem("savedSearches");
    if (savedSearches) {
      try {
        // console.log('filtre recu')
        const parsedSearches = JSON.parse(savedSearches);
        // Vérifier que c'est bien un tableau et qu'il contient les bonnes informations
        if (Array.isArray(parsedSearches) && parsedSearches.length > 0) {
          // console.log('filtre parsedSearches', parsedSearches);
          return parsedSearches;

        }
        return []; // Retourner un tableau vide si la structure est incorrecte
      } catch (error) {
        console.error("Erreur lors de la lecture des recherches sauvegardées", error);
        return []; // Retourner un tableau vide si JSON.parse échoue
      }
    }
    return []; // Retourner un tableau vide si aucun élément n'est trouvé
  };
  interface Filter {
    name: string;
    value: string;
    type?: string;
    range?: number[];
  }
  const savedFilters: Filter[][] = getSavedSearches() || [];

  // Accédez à l'élément dans le sous-tableau à l'index 0
  const filters = savedFilters[0] || [];
  // console.log('get data local', filters)

  const [localFilters, setLocalFilters] = useState<Filter[][]>([]);

  useEffect(() => {
    const savedFilters = getSavedSearches() || [];
    setLocalFilters(savedFilters);
  }, []);

  useEffect(() => {
    if (!openModal) {
      const localStorageFilters = localFilters[0] || [];

      selectFilters.forEach((item) => {
        const savedFilter = localStorageFilters.find((f) => f.name === item.name);

        if (savedFilter) {
          if (savedFilter.type === "slider" && savedFilter.range) {
            item.setRange && item.setRange(savedFilter.range);
          } else if (savedFilter.value) {
            item.setValue && item.setValue(savedFilter.value);
          }
        } else {
          if (item.rangeName && item.setRange) {
            const minRange = searchParams.get(item.rangeName[0]);
            const maxRange = searchParams.get(item.rangeName[1]);
            if (minRange && maxRange) {
              item.setRange([Number(minRange), Number(maxRange)]);
            }
          } else if (item.name && item.setValue && item.type !== "slider" && item.items) {
            const searchString = searchParams.get(item.name);
            let matchItem = item.items.find((value) => value.value === searchString);

            if (item.name === "sortOrder") {
              matchItem = item.items.find((value) => value.id === searchString);
            }

            if (matchItem) {
              item.setValue(matchItem.id.toString());
            } else {
              item.setValue("");
            }
          }
        }
      });
    }
  }, [localFilters, searchParams, selectFilters, openModal]);

  const handleInputChange = (query: string) => {
    setSearchQuery(query); // Met à jour l'état local
    handleChange(query); // Mise à jour différée (debounced callback)
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

    setResetKey((prev) => prev + 1);
    // Supprime tous les paramètres de l'URL
    router.replace(pathName);
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
            {/* <span
              onClick={() => handleModalOpen(setOpenModal, "auto", false)}
              className="text-white absolute top-0 right-0 rounded-tr-lg text-[18px] cursor-pointer font-normal bg-[rgb(203,59,59)] text-aliceblue p-1 transition duration-150 ease-in-out hover:bg-[rgb(253,1,1)]"
            >
              X
            </span> */}
            <button
              onClick={() => handleModalOpen(setOpenModal, "auto", false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              ✕
            </button>
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
              {/*
              <div className="flex flex-col gap-4 justify-center items-center">
                {selectFilters.map((item, index) => {
                  // console.log("Item:", item);  // Affiche l'élément à chaque itération
                  return (
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
                  );
                })}
              </div> */}
              <div className="flex flex-col gap-4 justify-center items-center">
                {selectFilters.map((item, index) => {
                  const localStorageFilters = localFilters[0] || [];
                  // Trouver le filtre sauvegardé correspondant
                  const savedFilter = localStorageFilters.find((f) => f.name === item.name);
                  const updatedItem = savedFilter
                    ? {
                      ...item,
                      value: savedFilter.value || item.value,
                      range: savedFilter.range || item.range,
                    }
                    : item;
                  console.log("Item:", updatedItem);
                  return (
                    <Fragment key={index}>
                      {item.type === "slider" ? (
                        <SearchSlider
                          ariaLabel={updatedItem.ariaLabel}
                          value={updatedItem.range || []}
                          step={updatedItem.step || 1}
                          rangeValue={updatedItem.rangeValue || [0, 10]}
                          searchParams={searchParams}
                          setValue={updatedItem.setRange}
                          name={updatedItem.name}
                          formatOptions={updatedItem.formatOptions}
                          rangeName={updatedItem.rangeName || []}
                        />
                      ) : (
                        <SearchSelect
                          ariaLabel={updatedItem.ariaLabel}
                          placeholder={updatedItem.placeholder || ""}
                          value={updatedItem.value || ""}
                          setValue={updatedItem.setValue}
                          values={updatedItem.items || []}
                          searchParams={searchParams}
                          name={updatedItem.name}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </div>
            </div>
            {/* <div className="flex mt-3 justify-between items-center w-full px-8 max-440:px-6"> */}
            <div className="flex flex-col md:flex-row justify-between p-4 bg-white/10 backdrop-blur-sm">
              {/* Bouton Accepter */}
              <button
                onClick={() => handleModalOpen(setOpenModal, "auto", false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center mr-4"
              >
                Accepter
              </button>

              {/* Bouton Save Search */}
              <button
                onClick={saveSearch} // Appeler la fonction pour sauvegarder les filtres
                className="px-4 py-2 bg-green-600 text-white rounded shadow-lg hover:bg-green-700 mb-4 md:mb-0 text-center mr-4"
              >
                Enregistrer
              </button>

              {/* Bouton Effacer les filtres */}
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
      <div className="p-2 pl-20 bg-gradient-to-br sm:p-3 from-sky-400 to-indigo-500 shadow-lg w-full mx-auto">
        {/* Section 1 : Filtres principaux */}
        <div
          key={resetKey}
          className="flex flex-col space-y-4  lg:space-y-8  w-full"
        >
          <div className="flex flex-row gap-2 items-center sm:justify-center">
            <Input
              placeholder="Recherche dans les titres"
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full max-w-md shadow-lg"
              endContent={
                loading ? (
                  <Spinner />
                ) : (
                  <MagnifyingGlassIcon className="w-4 text-slate-500" />
                )
              }
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
