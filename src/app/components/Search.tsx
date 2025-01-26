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

  // useEffect(() => {
  //   const cityParam = searchParams.get("city") ?? "";
  //   const queryParam = searchParams.get("query") ?? "";

  //   if (cityParam !== cityValue) setCityValue(cityParam);
  //   if (queryParam !== searchQuery) setSearchQuery(queryParam);

  //   // handleChange(queryParam, cityParam); // Mises à jour de l'URL au besoin
  // }, [searchParams, cityValue, searchQuery]);

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

            <div
              className="px-6 mt-8 overflow-y-auto overflow-x-hidden max-h-[calc(90vh-200px)] 
  [&::-webkit-scrollbar]:hidden 
  [-ms-overflow-style:none] 
  [scrollbar-width:none]"
            >
              <div className="flex flex-col gap-4 justify-center items-center">
                {selectFilters.map((item, index) => (
                  <Fragment key={index}>
                    {item.type === "text" ? (
                      <></>
                    ) : // <Input
                    //   placeholder={item.placeholder}
                    //   value={item.value}
                    //   onChange={(e) => item.setValue?.(e.target.value)}
                    //   className="w-full"
                    // />
                    item.type === "slider" ? (
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
                  className="w-full max-w-md"
                />
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
