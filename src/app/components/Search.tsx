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
        formatOptions={{ style: "currency", currency: "EUR" }}
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

      <Slider
        label="Nombre de chambres"
        value={bedroomsRange}
        step={1}
        minValue={0}
        maxValue={10}
        onChange={handleBedroomsChange}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        showTooltip
      />

      <Slider
        label="Nombre de salles de bain"
        value={bathroomsRange}
        step={1}
        minValue={0}
        maxValue={10}
        onChange={handleBathroomsChange}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
        showTooltip
      />
    </div>
  );
};

export default Search;
