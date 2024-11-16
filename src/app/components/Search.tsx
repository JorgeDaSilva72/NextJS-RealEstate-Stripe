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
  const [bedroomsRange, setBedroomsRange] = useState([0, 10]);
  const [bathroomsRange, setBathroomsRange] = useState([0, 10]);
  const [sortOrder, setSortOrder] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false); // Gestion de l'affichage des filtres avancés

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") ?? ""
  );

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

    const minArea = searchParams.get("minArea");
    const maxArea = searchParams.get("maxArea");
    if (minArea && maxArea) {
      setAreaRange([Number(minArea), Number(maxArea)]);
    }

    const minBedrooms = searchParams.get("minBedrooms");
    const maxBedrooms = searchParams.get("maxBedrooms");
    if (minBedrooms && maxBedrooms) {
      setBedroomsRange([Number(minBedrooms), Number(maxBedrooms)]);
    }

    const minBathrooms = searchParams.get("minBathrooms");
    const maxBathrooms = searchParams.get("maxBathrooms");
    if (minBathrooms && maxBathrooms) {
      setBathroomsRange([Number(minBathrooms), Number(maxBathrooms)]);
    }

    const sortOrder = searchParams.get("sortOrder");
    if (sortOrder) {
      setSortOrder(sortOrder);
    } else {
      setSortOrder(""); // Pas de tri
    }
  }, [searchParams]);

  useEffect(() => {
    // Afficher les filtres avancés si des critères avancés sont présents dans l'URL
    const hasAdvancedFilters =
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice") ||
      searchParams.get("minArea") ||
      searchParams.get("maxArea") ||
      searchParams.get("minBedrooms") ||
      searchParams.get("maxBedrooms") ||
      searchParams.get("minBathrooms") ||
      searchParams.get("maxBathrooms");

    setShowAdvancedFilters(Boolean(hasAdvancedFilters));
  }, [searchParams]);

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

  const handleBedroomsChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setBedroomsRange(value);
      const params = new URLSearchParams(searchParams);
      params.set("minBedrooms", value[0].toString());
      params.set("maxBedrooms", value[1].toString());
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  const handleBathroomsChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setBathroomsRange(value);
      const params = new URLSearchParams(searchParams);
      params.set("minBathrooms", value[0].toString());
      params.set("maxBathrooms", value[1].toString());
      router.replace(`${pathName}?${params.toString()}`);
    }
  };

  const handleSortOrderChange = (value: string | Set<string>) => {
    const sortOrder = value instanceof Set ? Array.from(value)[0] : value; // Conversion du Set en chaîne
    console.log("Sort order selected:", sortOrder); // Debugging
    const params = new URLSearchParams(searchParams);

    if (sortOrder === "none") {
      params.delete("sortOrder"); // Supprime le tri de l'URL
      setSortOrder(""); // Réinitialise l'état du tri
    } else {
      params.set("sortOrder", sortOrder); // Définit le critère de tri
      setSortOrder(sortOrder); // Met à jour l'état
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters((prev) => !prev); // Toggle de l'affichage
  };

  // j utilise une clé dynamique pour synchroniser les select avec les states
  const [resetKey, setResetKey] = useState(0);
  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchQuery(""); // Réinitialise la recherche
    setSelectedStatus("");
    setSelectedType("");
    setResetKey((prev) => prev + 1);
    setSortOrder("");
    setPriceRange([0, 1000000]);
    setAreaRange([0, 1000]);
    setBedroomsRange([0, 10]);
    setBathroomsRange([0, 10]);

    // Supprime tous les paramètres de l'URL
    router.replace(pathName);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg shadow-lg max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl text-white font-semibold">
        Critères de sélection
      </h2>

      <div
        key={resetKey}
        className="flex flex-col lg:flex-row lg:space-x-8 lg:items-start w-full"
      >
        {/* Section 1 : Filtres principaux */}
        <div className="flex flex-col w-full lg:w-1/2 space-y-4">
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

          <Select
            aria-label="Choisir l'opération"
            placeholder="Opération"
            value={selectedStatus || ""}
            className="w-full max-w-md p-2 shadow-lg bg-white text-gray-700 rounded"
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
            aria-label="Choisir le type de bien"
            placeholder="Type de bien"
            value={selectedType}
            className="w-full max-w-md p-2 shadow-lg bg-white text-gray-700 rounded"
            selectionMode="single"
            onSelectionChange={(value) => handleTypeChange(value as string)}
          >
            {typesWithNoneOption.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.value}
              </SelectItem>
            ))}
          </Select>

          <Select
            aria-label="Trier par"
            placeholder="Trier par"
            value={sortOrder}
            className="w-full max-w-md p-2 shadow-lg bg-white text-gray-700 rounded"
            selectionMode="single"
            // onSelectionChange retourne un objet Set dans lequel se trouve la valeur sélectionnée ("desc") au lieu de simplement renvoyer la chaîne elle-même.
            onSelectionChange={(value) =>
              handleSortOrderChange(value as string)
            }
          >
            <SelectItem key={"none"} value="none">
              Aucun tri
            </SelectItem>
            <SelectItem key={"price-asc"} value="price-asc">
              Prix croissant
            </SelectItem>
            <SelectItem key={"price-desc"} value="price-desc">
              Prix décroissant
            </SelectItem>
            <SelectItem key={"surface-asc"} value="surface-asc">
              Surface croissante
            </SelectItem>
            <SelectItem key={"surface-desc"} value="surface-desc">
              Surface décroissante
            </SelectItem>
            <SelectItem key={"date-asc"} value="date-asc">
              Plus ancien
            </SelectItem>
            <SelectItem key={"date-desc"} value="date-desc">
              Plus récent
            </SelectItem>
          </Select>
          <button
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700"
            onClick={toggleAdvancedFilters}
          >
            {showAdvancedFilters
              ? "Masquer les filtres avancés"
              : "Plus de critères"}
          </button>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700"
            onClick={resetFilters}
          >
            Réinitialiser les filtres
          </button>
        </div>

        {/* Section 2 : Filtres avancés (affichage conditionnel) */}
        {showAdvancedFilters && (
          <div className="flex flex-col w-full lg:w-1/2 space-y-4 mt-6 lg:mt-0">
            <Slider
              label="Prix (€)"
              value={priceRange}
              step={10000}
              minValue={0}
              maxValue={1000000}
              onChange={handlePriceChange}
              formatOptions={{ style: "currency", currency: "EUR" }}
              className="w-full shadow-lg bg-white p-2 rounded"
              showTooltip
            />

            <Slider
              label="Surface habitable (m²)"
              value={areaRange}
              step={10}
              minValue={0}
              maxValue={1000}
              onChange={handleAreaChange}
              className="w-full shadow-lg bg-white p-2 rounded"
              showTooltip
            />

            <Slider
              label="Chambres"
              value={bedroomsRange}
              step={1}
              minValue={0}
              maxValue={10}
              onChange={handleBedroomsChange}
              className="w-full shadow-lg bg-white p-2 rounded"
              showTooltip
            />

            <Slider
              label="Salles de bain"
              value={bathroomsRange}
              step={1}
              minValue={0}
              maxValue={10}
              onChange={handleBathroomsChange}
              className="w-full shadow-lg bg-white p-2 rounded"
              showTooltip
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
