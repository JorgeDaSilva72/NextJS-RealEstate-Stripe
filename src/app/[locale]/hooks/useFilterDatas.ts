// /* eslint-disable react-hooks/exhaustive-deps */
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import { useSearchParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { AFRICAN_FRANCOPHONE_COUNTRIES } from "../../../data/countries";
// import useFetchValues from "./useFetchValues";
// import { FilterValueTypes } from "./useFilterChange";
// import { transformCountries } from "@/lib/utils";

// export type SelectNameType =
//   | "queryStatus"
//   | "queryType"
//   | "city"
//   | "sortOrder"
//   | "price"
//   | "area"
//   | "room"
//   | "bathroom"
//   | "country";

// export interface SelectFilterType {
//   ariaLabel: string;
//   placeholder?: string;
//   name: SelectNameType;
//   items?: FilterValueTypes;
//   type?: "slider" | "text";
//   rangeName?: string[];
//   rangeValue?: number[];
//   step?: number;
//   formatOptions?: Intl.NumberFormatOptions;
//   value?: string;
//   setValue?: React.Dispatch<React.SetStateAction<string>>;
//   range?: number[];
//   setRange?: React.Dispatch<React.SetStateAction<number[]>>;
// }

// export type SelectFilterTypes = SelectFilterType[];

// const useFilterDatas = () => {
//   const searchParams = useSearchParams();
//   const fetchValue = useFetchValues();
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
//   // const citiesOfMoroccoWithNoneOption = [
//   //   { id: "none", value: "Toutes les villes" },
//   //   ...citiesOfMorocco,
//   // ];
//   // const countriesWithNoneOption = [
//   //   { id: "none", value: "Tous les pays" },
//   //   ...countries,
//   // ];
//   const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED = transformCountries(
//     AFRICAN_FRANCOPHONE_COUNTRIES
//   );

//   const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED_WITH_NONE_OPTION = [
//     { id: "none", value: "Tous les pays" },
//     ...AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED,
//   ];
//   const [priceRange, setPriceRange] = useState([0, 1000000]);
//   const [areaRange, setAreaRange] = useState([0, 1000]);
//   const [bedroomsRange, setBedroomsRange] = useState([0, 10]);
//   const [bathroomsRange, setBathroomsRange] = useState([0, 10]);
//   const [sortOrder, setSortOrder] = useState("");
//   const [selectedCountry, setSelectedCountry] = useState(
//     searchParams.get("country") ?? ""
//   );
//   const [selectedCity, setSelectedCity] = useState(
//     searchParams.get("city") ?? ""
//   );
//   const [filterDatas, setFilterDatas] = useState<SelectFilterTypes>([]);

//   useEffect(() => {
//     fetchValue(
//       setStatuses,
//       "/api/searchStatuses",
//       "Erreur lors de la récupération des statuts:"
//     );
//     fetchValue(
//       setTypes,
//       "/api/searchTypes",
//       "Erreur lors de la récupération des types:"
//     );
//   }, []);

//   useEffect(() => {
//     const selectFilters: SelectFilterTypes = [
//       {
//         ariaLabel: "Opération",
//         placeholder: "Choisir l'opération",
//         name: "queryStatus",
//         items: statusWithNoneOption,
//         value: selectedStatus,
//         setValue: setSelectedStatus,
//       },
//       {
//         ariaLabel: "Type de bien",
//         placeholder: "Choisir le type de bien",
//         name: "queryType",
//         items: typesWithNoneOption,
//         value: selectedType,
//         setValue: setSelectedType,
//       },
//       {
//         ariaLabel: "Pays",
//         placeholder: "Choisir un pays",
//         name: "country",
//         // items: countriesWithNoneOption,
//         items: AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED_WITH_NONE_OPTION,
//         value: selectedCountry,
//         setValue: setSelectedCountry,
//       },

//       {
//         ariaLabel: "Trier par",
//         placeholder: "Trier par",
//         name: "sortOrder",
//         items: [
//           { id: "none", value: "Aucun tri" },
//           { id: "price-asc", value: "Prix croissant" },
//           { id: "price-desc", value: "Prix décroissant" },
//           { id: "surface-asc", value: "Surface croissante" },
//           { id: "surface-desc", value: "Surface décroissante" },
//           { id: "date-asc", value: "Plus ancien" },
//           { id: "date-desc", value: "Plus récent" },
//         ],
//         value: sortOrder,
//         setValue: setSortOrder,
//       },
//       {
//         ariaLabel: "Prix (€)",
//         name: "price",
//         type: "slider",
//         rangeName: ["minPrice", "maxPrice"],
//         rangeValue: [0, 1000000],
//         step: 10000,
//         formatOptions: { style: "currency", currency: "EUR" },
//         range: priceRange,
//         setRange: setPriceRange,
//       },
//       {
//         ariaLabel: "Surface habitable (m²)",
//         name: "area",
//         type: "slider",
//         rangeName: ["minArea", "maxArea"],
//         rangeValue: [0, 1000],
//         step: 10,
//         range: areaRange,
//         setRange: setAreaRange,
//       },
//       {
//         ariaLabel: "Chambres",
//         name: "room",
//         type: "slider",
//         rangeName: ["minBedrooms", "maxBedrooms"],
//         rangeValue: [0, 10],
//         step: 1,
//         range: bedroomsRange,
//         setRange: setBedroomsRange,
//       },
//       {
//         ariaLabel: "Salles de bain",
//         name: "bathroom",
//         type: "slider",
//         rangeName: ["minBathrooms", "maxBathrooms"],
//         rangeValue: [0, 10],
//         step: 1,
//         range: bathroomsRange,
//         setRange: setBathroomsRange,
//       },
//     ];
//     setFilterDatas(selectFilters);
//   }, [
//     selectedCity,
//     selectedCountry,
//     selectedStatus,
//     selectedType,
//     sortOrder,
//     priceRange,
//     areaRange,
//     bedroomsRange,
//     bathroomsRange,
//     statuses,
//     types,
//   ]);

//   return filterDatas;
// };

// export default useFilterDatas;
// // end ----------------------------------------------------------
// // next-intl with chatgpt

// /* eslint-disable react-hooks/exhaustive-deps */
// // import { PropertyStatus, PropertyType } from "@prisma/client";
// // import { useSearchParams } from "next/navigation";
// // import { useEffect, useState } from "react";
// // import { useTranslations } from "next-intl";
// // import { AFRICAN_FRANCOPHONE_COUNTRIES } from "../../../data/countries";
// // import useFetchValues from "./useFetchValues";
// // import { FilterValueTypes } from "./useFilterChange";
// // import { transformCountries } from "@/lib/utils";

// // export type SelectNameType =
// //   | "queryStatus"
// //   | "queryType"
// //   | "city"
// //   | "sortOrder"
// //   | "price"
// //   | "area"
// //   | "room"
// //   | "bathroom"
// //   | "country";

// // export interface SelectFilterType {
// //   ariaLabel: string;
// //   placeholder?: string;
// //   name: SelectNameType;
// //   items?: FilterValueTypes;
// //   type?: "slider" | "text";
// //   rangeName?: string[];
// //   rangeValue?: number[];
// //   step?: number;
// //   formatOptions?: Intl.NumberFormatOptions;
// //   value?: string;
// //   setValue?: React.Dispatch<React.SetStateAction<string>>;
// //   range?: number[];
// //   setRange?: React.Dispatch<React.SetStateAction<number[]>>;
// // }

// // export type SelectFilterTypes = SelectFilterType[];

// // const useFilterDatas = () => {
// //   const t = useTranslations("filters");
// //   const searchParams = useSearchParams();
// //   const fetchValue = useFetchValues();
// //   const [selectedStatus, setSelectedStatus] = useState(
// //     searchParams.get("queryStatus") ?? ""
// //   );
// //   const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
// //   const [selectedType, setSelectedType] = useState(
// //     searchParams.get("queryType") ?? ""
// //   );
// //   const [types, setTypes] = useState<PropertyType[]>([]);
// //   const typesWithNoneOption = [
// //     { id: "none", value: t("allPropertyTypes") },
// //     ...types,
// //   ];
// //   const statusWithNoneOption = [
// //     { id: "none", value: t("allOperations") },
// //     ...statuses,
// //   ];

// //   const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED = transformCountries(
// //     AFRICAN_FRANCOPHONE_COUNTRIES
// //   );

// //   const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED_WITH_NONE_OPTION = [
// //     { id: "none", value: t("allCountries") },
// //     ...AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED,
// //   ];
// //   const [priceRange, setPriceRange] = useState([0, 1000000]);
// //   const [areaRange, setAreaRange] = useState([0, 1000]);
// //   const [bedroomsRange, setBedroomsRange] = useState([0, 10]);
// //   const [bathroomsRange, setBathroomsRange] = useState([0, 10]);
// //   const [sortOrder, setSortOrder] = useState("");
// //   const [selectedCountry, setSelectedCountry] = useState(
// //     searchParams.get("country") ?? ""
// //   );
// //   const [selectedCity, setSelectedCity] = useState(
// //     searchParams.get("city") ?? ""
// //   );
// //   const [filterDatas, setFilterDatas] = useState<SelectFilterTypes>([]);

// //   useEffect(() => {
// //     fetchValue(setStatuses, "/api/searchStatuses", t("fetchErrorStatuses"));
// //     fetchValue(setTypes, "/api/searchTypes", t("fetchErrorTypes"));
// //   }, []);

// //   useEffect(() => {
// //     const selectFilters: SelectFilterTypes = [
// //       {
// //         ariaLabel: t("operation"),
// //         placeholder: t("chooseOperation"),
// //         name: "queryStatus",
// //         items: statusWithNoneOption,
// //         value: selectedStatus,
// //         setValue: setSelectedStatus,
// //       },
// //       {
// //         ariaLabel: t("propertyType"),
// //         placeholder: t("choosePropertyType"),
// //         name: "queryType",
// //         items: typesWithNoneOption,
// //         value: selectedType,
// //         setValue: setSelectedType,
// //       },
// //       {
// //         ariaLabel: t("country"),
// //         placeholder: t("chooseCountry"),
// //         name: "country",
// //         items: AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED_WITH_NONE_OPTION,
// //         value: selectedCountry,
// //         setValue: setSelectedCountry,
// //       },
// //       {
// //         ariaLabel: t("sortBy"),
// //         placeholder: t("sortBy"),
// //         name: "sortOrder",
// //         items: [
// //           { id: "none", value: t("noSorting") },
// //           { id: "price-asc", value: t("priceAsc") },
// //           { id: "price-desc", value: t("priceDesc") },
// //           { id: "surface-asc", value: t("surfaceAsc") },
// //           { id: "surface-desc", value: t("surfaceDesc") },
// //           { id: "date-asc", value: t("oldest") },
// //           { id: "date-desc", value: t("newest") },
// //         ],
// //         value: sortOrder,
// //         setValue: setSortOrder,
// //       },
// //     ];
// //     setFilterDatas(selectFilters);
// //   }, [
// //     selectedCity,
// //     selectedCountry,
// //     selectedStatus,
// //     selectedType,
// //     sortOrder,
// //     statuses,
// //     types,
// //   ]);

// //   return filterDatas;
// // };

// // export default useFilterDatas;
// end ----------------------------------------------------------
// next-intl with claude

// 07/12 code modifié pour s adapter au nouveau prisma feature/multilingual-countries

"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

// import { AFRICAN_FRANCOPHONE_COUNTRIES } from "../../../data/countries";
import useFetchValues from "./useFetchValues";
import { FilterValueTypes } from "./useFilterChange";
import { transformCountries } from "@/lib/utils";
import { useLocale } from "next-intl"; // AJOUT: Pour récupérer la langue active

// AJOUT: Interface pour les données qui viennent du backend avec traduction
interface TranslatedItem {
  id: number; // ID de la table principale (Type, Status, City)
  value: string; // La traduction (ex: "Maison", "À vendre")
}

export type SelectNameType =
  | "queryStatus"
  | "queryType"
  | "cityId" // CHANGEMENT: City devient cityId (ID numérique)
  | "sortOrder"
  | "price"
  | "area"
  | "room"
  | "bathroom"
  | "country";

export interface SelectFilterType {
  ariaLabel: string;
  placeholder?: string;
  name: SelectNameType;
  items?: FilterValueTypes | TranslatedItem[]; // Mise à jour du type items
  type?: "slider" | "text";
  rangeName?: string[];
  rangeValue?: number[];
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  range?: number[];
  setRange?: React.Dispatch<React.SetStateAction<number[]>>;
}

export type SelectFilterTypes = SelectFilterType[];

const useFilterDatas = () => {
  const t = useTranslations("filters");
  const searchParams = useSearchParams();
  const fetchValue = useFetchValues();
  const locale = useLocale(); // AJOUT: Récupérer la langue active

  // États pour les sélecteurs
  const [selectedStatus, setSelectedStatus] = useState(
    searchParams.get("queryStatus") ?? ""
  );
  // CHANGEMENT: setStatuses stocke les items traduits (id: number, value: string)
  const [statuses, setStatuses] = useState<TranslatedItem[]>([]);
  const [selectedType, setSelectedType] = useState(
    searchParams.get("queryType") ?? ""
  );
  // CHANGEMENT: setTypes stocke les items traduits
  const [types, setTypes] = useState<TranslatedItem[]>([]);

  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") ?? ""
  );

  // NOUVEAU: État pour la ville (ID de la ville)
  const [selectedCityId, setSelectedCityId] = useState(
    searchParams.get("cityId") ?? "" // CHANGEMENT: On cherche 'cityId' dans l'URL
  );
  // NOUVEAU: État pour les données des villes (traduites)
  const [cities, setCities] = useState<TranslatedItem[]>([]);

  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") ?? ""
  );

  // États pour les sliders (Aucun changement nécessaire)
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000000,
  ]);
  const [areaRange, setAreaRange] = useState([
    Number(searchParams.get("minArea")) || 0,
    Number(searchParams.get("maxArea")) || 1000,
  ]);
  const [bedroomsRange, setBedroomsRange] = useState([
    Number(searchParams.get("minBedrooms")) || 0,
    Number(searchParams.get("maxBedrooms")) || 10,
  ]);
  const [bathroomsRange, setBathroomsRange] = useState([
    Number(searchParams.get("minBathrooms")) || 0,
    Number(searchParams.get("maxBathrooms")) || 10,
  ]);

  // NOUVEAU: État pour les données des pays
  const [countries, setCountries] = useState<TranslatedItem[]>([]);

  // const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED = transformCountries(
  //   AFRICAN_FRANCOPHONE_COUNTRIES
  // );

  // Options avec traductions

  const typesWithNoneOption = React.useMemo(
    () => [
      { id: "none", value: t("allPropertyTypes") },
      ...types.map((item) => ({ id: item.id.toString(), value: item.value })),
    ],
    [types, t]
  ); // Dépend de 'types' et 't'

  const statusWithNoneOption = React.useMemo(
    () => [
      { id: "none", value: t("allOperations") },
      ...statuses.map((item) => ({
        id: item.id.toString(),
        value: item.value,
      })),
    ],
    [statuses, t]
  ); // Dépend de 'statuses' et 't'

  const citiesWithNoneOption = React.useMemo(
    () => [
      { id: "none", value: t("allCities") },
      ...cities.map((item) => ({ id: item.id.toString(), value: item.value })),
    ],
    [cities, t]
  ); // Dépend de 'cities' et 't'

  // const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED_WITH_NONE_OPTION =
  //   React.useMemo(
  //     () => [
  //       { id: "none", value: t("allCountries") },
  //       ...transformCountries(AFRICAN_FRANCOPHONE_COUNTRIES),
  //     ],
  //     [t]
  //   ); // Dépend uniquement de 't'

  // NOUVEAU: Options des pays basées sur la BDD
  const countriesWithNoneOption = useMemo(
    () => [
      { id: "none", value: t("allCountries") },
      ...countries.map((item) => ({
        id: item.id.toString(),
        value: item.value,
      })),
    ],
    [countries, t]
  );

  const [filterDatas, setFilterDatas] = useState<SelectFilterTypes>([]);

  // Fetch initial data (et traductions)
  useEffect(() => {
    // Changement de l'API pour récupérer les traductions
    fetchValue(
      setStatuses,
      `/api/searchStatuses?lang=${locale}`,
      t("fetchErrorStatuses")
    );
    fetchValue(
      setTypes,
      `/api/searchTypes?lang=${locale}`,
      t("fetchErrorTypes")
    );

    // NOUVEAU: Fetch des villes traduites
    fetchValue(
      setCities,
      `/api/searchCities?lang=${locale}&countryId=${selectedCountry}`,
      t("fetchErrorCities")
    );
    // NOUVEAU: Fetch des pays traduits
    fetchValue(
      setCountries,
      `/api/searchCountries?lang=${locale}`,
      t("fetchErrorCountries")
    );
  }, [locale, selectedCountry, fetchValue, t]); // Re-fetch quand la langue ou le pays change. Les setters (setStatuses, setTypes, setCities) n'ont pas besoin d'être inclus car ils sont stables.

  // Update filter data when dependencies change
  useEffect(() => {
    const selectFilters: SelectFilterTypes = [
      {
        ariaLabel: t("operation"),
        placeholder: t("chooseOperation"),
        name: "queryStatus",
        items: statusWithNoneOption,
        value: selectedStatus,
        setValue: setSelectedStatus,
      },
      {
        ariaLabel: t("propertyType"),
        placeholder: t("choosePropertyType"),
        name: "queryType",
        items: typesWithNoneOption,
        value: selectedType,
        setValue: setSelectedType,
      },
      {
        ariaLabel: t("country"),
        placeholder: t("chooseCountry"),
        name: "country",
        // items: AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED_WITH_NONE_OPTION,
        // Utilisation du nouveau tableau dynamique
        items: countriesWithNoneOption,
        value: selectedCountry,
        setValue: setSelectedCountry,
      },
      // NOUVEAU: Filtre de la ville (SearchSelect)
      {
        ariaLabel: t("city"),
        placeholder: t("chooseCity"),
        name: "cityId", // CHANGEMENT: Nom de la variable dans l'URL
        items: citiesWithNoneOption,
        value: selectedCityId,
        setValue: setSelectedCityId,
      },
      // ... (Le reste des filtres est inchangé)
      {
        ariaLabel: t("sortBy"),
        placeholder: t("sortBy"),
        name: "sortOrder",
        items: [
          { id: "none", value: t("noSorting") },
          { id: "price-asc", value: t("priceAsc") },
          { id: "price-desc", value: t("priceDesc") },
          { id: "surface-asc", value: t("surfaceAsc") },
          { id: "surface-desc", value: t("surfaceDesc") },
          { id: "date-asc", value: t("oldest") },
          { id: "date-desc", value: t("newest") },
        ],
        value: sortOrder,
        setValue: setSortOrder,
      },
      // Sliders (inchangés)
      {
        ariaLabel: t("price"),
        name: "price",
        type: "slider",
        rangeName: ["minPrice", "maxPrice"],
        rangeValue: [0, 1000000],
        step: 10000,
        formatOptions: { style: "currency", currency: "EUR" },
        range: priceRange,
        setRange: setPriceRange,
      },
      {
        ariaLabel: t("area"),
        name: "area",
        type: "slider",
        rangeName: ["minArea", "maxArea"],
        rangeValue: [0, 1000],
        step: 10,
        range: areaRange,
        setRange: setAreaRange,
      },
      {
        ariaLabel: t("bedrooms"),
        name: "room",
        type: "slider",
        rangeName: ["minBedrooms", "maxBedrooms"],
        rangeValue: [0, 10],
        step: 1,
        range: bedroomsRange,
        setRange: setBedroomsRange,
      },
      {
        ariaLabel: t("bathrooms"),
        name: "bathroom",
        type: "slider",
        rangeName: ["minBathrooms", "maxBathrooms"],
        rangeValue: [0, 10],
        step: 1,
        range: bathroomsRange,
        setRange: setBathroomsRange,
      },
    ];
    setFilterDatas(selectFilters);
  }, [
    selectedCityId, // CHANGEMENT: dépend de cityId
    selectedCountry,
    selectedStatus,
    selectedType,
    sortOrder,
    priceRange,
    areaRange,
    bedroomsRange,
    bathroomsRange,
    statuses,
    types,
    cities, // NOUVEAU: dépend des données des villes
    citiesWithNoneOption, // <-- AJOUT
    statusWithNoneOption, // <-- AJOUT
    t, // <-- AJOUT
    typesWithNoneOption, // <-- AJOUT
    countriesWithNoneOption, // <-- AJOUT
  ]);

  return filterDatas;
};

export default useFilterDatas;
