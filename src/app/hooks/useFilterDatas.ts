/* eslint-disable react-hooks/exhaustive-deps */
import { PropertyStatus, PropertyType } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { citiesOfMorocco } from "../../data/cities";
import { AFRICAN_FRANCOPHONE_COUNTRIES, countries } from "../../data/countries";
import useFetchValues from "./useFetchValues";
import { FilterValueTypes } from "./useFilterChange";
import { transformCountries } from "@/lib/utils";

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
  const citiesOfMoroccoWithNoneOption = [
    { id: "none", value: "Toutes les villes" },
    ...citiesOfMorocco,
  ];
  // const countriesWithNoneOption = [
  //   { id: "none", value: "Tous les pays" },
  //   ...countries,
  // ];
  const AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED = transformCountries(
    AFRICAN_FRANCOPHONE_COUNTRIES
  );
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [areaRange, setAreaRange] = useState([0, 1000]);
  const [bedroomsRange, setBedroomsRange] = useState([0, 10]);
  const [bathroomsRange, setBathroomsRange] = useState([0, 10]);
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    searchParams.get("country") ?? ""
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") ?? ""
  );
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
    const selectFilters: SelectFilterTypes = [
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
        // items: countriesWithNoneOption,
        items: AFRICAN_FRANCOPHONE_COUNTRIES_TRANSFORMED,
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
