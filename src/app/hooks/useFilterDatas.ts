/* eslint-disable react-hooks/exhaustive-deps */
import { PropertyStatus, PropertyType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { citiesOfMorocco } from "../data/cities";
import { countries } from "../data/countries";
import useFetchValues from "./useFetchValues";
import { FilterValueTypes } from "./useFilterChange";

// Récupérer les données de LocalStorage (si elles existent)
const getSavedSearches = () => {
  const savedSearches = localStorage.getItem("savedSearches");
  if (savedSearches) {
    try {
      const parsedSearches = JSON.parse(savedSearches);
      // Vérifier que c'est bien un tableau et qu'il contient les bonnes informations
      if (Array.isArray(parsedSearches) && parsedSearches.length > 0) {
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





export type SelectNameType =
  | "queryStatus"
  | "queryType"
  | "city"
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
  items?: FilterValueTypes;
  type?: "slider";
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
  const searchParams = useSearchParams();
  const fetchValue = useFetchValues();

  // const [selectedStatus, setSelectedStatus] = useState(
  //   searchParams.get("queryStatus") ?? ""
  // );

  //Riv
  // Initialiser les états avec les valeurs de LocalStorage ou des valeurs par défaut
  interface Filter {
    name: string;
    value: string;
    type?: string;
    range?: number[];
  }
  const savedFilters: Filter[][] = getSavedSearches() || [];

  // Accédez à l'élément dans le sous-tableau à l'index 0
  const filters = savedFilters[0] || []; // Le premier sous-tableau

  // Si savedFilters est un tableau et contient des objets
  const defaultStatus =
    filters.find((filter) => filter.name === "queryStatus")?.value ||
    searchParams.get("queryStatus") ||
    "";

  const defaultType =
    filters.find((filter) => filter.name === "queryType")?.value ||
    searchParams.get("queryType") ||
    "";

  const defaultCountry =
    filters.find((filter) => filter.name === "country")?.value ||
    searchParams.get("country") ||
    "";

  const defaultCity =
    filters.find((filter) => filter.name === "city")?.value ||
    searchParams.get("city") ||
    "";

  const [selectedStatus, setSelectedStatus] = useState(defaultStatus);
  const [selectedType, setSelectedType] = useState(defaultType);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [selectedCity, setSelectedCity] = useState(defaultCity)
  // const [selectedStatus, setSelectedStatus] = useState(
  //   (savedFilters.find((filter: Filter) => filter.name === "queryStatus")?.value
  //     || searchParams.get("queryStatus")) ?? ""
  // );

  const [statuses, setStatuses] = useState<PropertyStatus[]>([]);
  // const [selectedType, setSelectedType] = useState(
  //   searchParams.get("queryType") ?? ""
  // );

  // const [selectedType, setSelectedType] = useState(
  //   (savedFilters.find((filter: Filter) => filter.name === "queryType")?.value
  //     || searchParams.get("queryType")) ?? ""
  // );
  const [types, setTypes] = useState<PropertyType[]>([]);
  const typesWithNoneOption = [
    { id: "none", value: "Tout Type de bien" },
    ...types,
  ];

  const [statutestsesTest, setStatusesTest] = useState<any[]>([
    { id: "Statut_1", value: "Statut 1" },
    { id: "Statut_2", value: "Statut 2" }
  ]);

  const statusWithNoneOptionTest = [
    { id: "none", value: "Toute opération Test" },
    ...statutestsesTest,
  ];
  const statusWithNoneOption = [
    { id: "none", value: "Toute opération" },
    ...statuses,
  ];

  const citiesOfMoroccoWithNoneOption = [
    { id: "none", value: "Toutes les villes" },
    ...citiesOfMorocco,
  ];
  const countriesWithNoneOption = [
    { id: "none", value: "Tous les pays" },
    ...countries,
  ];
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [areaRange, setAreaRange] = useState([0, 1000]);
  const [bedroomsRange, setBedroomsRange] = useState([0, 10]);
  const [bathroomsRange, setBathroomsRange] = useState([0, 10]);
  const [sortOrder, setSortOrder] = useState("");
  // const [selectedCountry, setSelectedCountry] = useState(
  //   searchParams.get("country") ?? ""
  // );
  // const [selectedCountry, setSelectedCountry] = useState(
  //   (savedFilters.find((filter: Filter) => filter.name === "country")?.value
  //     || searchParams.get("country")) ?? ""
  // );
  // const [selectedCity, setSelectedCity] = useState(
  //   searchParams.get("city") ?? ""
  // );
  // const [selectedCity, setSelectedCity] = useState(
  //   (savedFilters.find((filter: Filter) => filter.name === "city")?.value
  //     || searchParams.get("city")) ?? ""
  // );
  // const [filterDatas, setFilterDatas] = useState<SelectFilterTypes>([]);
  const [filterDatas, setFilterDatas] = useState<SelectFilterTypes>([]);



  useEffect(() => {
    fetchValue(
      setStatuses,
      "/api/searchStatuses",
      "Erreur lors de la récupération des statuts:"
    );
    fetchValue(
      setTypes,
      "/api/searchTypes",
      "Erreur lors de la récupération des types:"
    );
  }, []);

  useEffect(() => {
    console.log('status updated', selectedCity);
    const selectFilters: SelectFilterTypes = [

      //Rivah
      // {
      //   ariaLabel: "Opération",
      //   placeholder: "Test",
      //   name: "queryStatus",
      //   items: statusWithNoneOptionTest,
      //   value: selectedStatus,
      //   setValue: setSelectedStatus,
      // },


      {
        ariaLabel: "Opération",
        placeholder: "Choisir l'opération",
        name: "queryStatus",
        items: statusWithNoneOption,
        value: selectedStatus,
        setValue: setSelectedStatus,
      },
      {
        ariaLabel: "Type de bien",
        placeholder: "Choisir le type de bien",
        name: "queryType",
        items: typesWithNoneOption,
        value: selectedType,
        setValue: setSelectedType,
      },
      {
        ariaLabel: "Pays",
        placeholder: "Choisir un pays",
        name: "country",
        items: countriesWithNoneOption,
        value: selectedCountry,
        setValue: setSelectedCountry,
      },
      {
        ariaLabel: "Ville",
        placeholder: "Choisir une ville",
        name: "city",
        items: citiesOfMoroccoWithNoneOption,
        value: selectedCity,
        setValue: setSelectedCity,
      },
      {
        ariaLabel: "Trier par",
        placeholder: "Trier par",
        name: "sortOrder",
        items: [
          { id: "none", value: "Aucun tri" },
          { id: "price-asc", value: "Prix croissant" },
          { id: "price-desc", value: "Prix décroissant" },
          { id: "surface-asc", value: "Surface croissante" },
          { id: "surface-desc", value: "Surface décroissante" },
          { id: "date-asc", value: "Plus ancien" },
          { id: "date-desc", value: "Plus récent" },
        ],
        value: sortOrder,
        setValue: setSortOrder,
      },
      {
        ariaLabel: "Prix (€)",
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
        ariaLabel: "Surface habitable (m²)",
        name: "area",
        type: "slider",
        rangeName: ["minArea", "maxArea"],
        rangeValue: [0, 1000],
        step: 10,
        range: areaRange,
        setRange: setAreaRange,
      },
      {
        ariaLabel: "Chambres",
        name: "room",
        type: "slider",
        rangeName: ["minBedrooms", "maxBedrooms"],
        rangeValue: [0, 10],
        step: 1,
        range: bedroomsRange,
        setRange: setBedroomsRange,
      },
      {
        ariaLabel: "Salles de bain",
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
    selectedCity,
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
  ]);

  return filterDatas;
};

export default useFilterDatas;
