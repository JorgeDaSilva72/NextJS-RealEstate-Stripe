"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search, X, Filter } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

interface City {
  id: number;
  value: string;
  countryId?: number;
}

interface Type {
  id: number;
  value: string;
}

interface Status {
  id: number;
  code: string;
  value: string;
}

interface PropertyFilterFormProps {
  statusFilter?: "for_sale" | "for_rent"; // Pre-filter by status
  onFilterChange?: () => void;
}

export default function PropertyFilterForm({
  statusFilter,
  onFilterChange,
}: PropertyFilterFormProps) {
  const t = useTranslations("filters");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("query") || ""
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    searchParams?.get("cityId") || ""
  );
  const [selectedType, setSelectedType] = useState<string>(
    searchParams?.get("queryType") || ""
  );
  const [selectedCountry, setSelectedCountry] = useState<string>(
    searchParams?.get("country") || ""
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    Number(searchParams?.get("minPrice")) || 0,
    Number(searchParams?.get("maxPrice")) || 1000000,
  ]);
  const [areaRange, setAreaRange] = useState<number[]>([
    Number(searchParams?.get("minArea")) || 0,
    Number(searchParams?.get("maxArea")) || 1000,
  ]);
  const [bedroomsRange, setBedroomsRange] = useState<number[]>([
    Number(searchParams?.get("minBedrooms")) || 0,
    Number(searchParams?.get("maxBedrooms")) || 10,
  ]);
  const [bathroomsRange, setBathroomsRange] = useState<number[]>([
    Number(searchParams?.get("minBathrooms")) || 0,
    Number(searchParams?.get("maxBathrooms")) || 10,
  ]);
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams?.get("sortOrder") || "date-desc"
  );

  // Data
  const [cities, setCities] = useState<City[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch cities
  const fetchCities = useCallback(async () => {
    try {
      const countryParam = selectedCountry ? `&countryId=${selectedCountry}` : "";
      const response = await fetch(
        `/api/searchCities?lang=${locale}${countryParam}`
      );
      if (response.ok) {
        const data = await response.json();
        setCities(data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }, [locale, selectedCountry]);

  // Fetch types
  const fetchTypes = useCallback(async () => {
    try {
      const response = await fetch(`/api/searchTypes?lang=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setTypes(data);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  }, [locale]);

  // Fetch statuses
  const fetchStatuses = useCallback(async () => {
    try {
      const response = await fetch(`/api/searchStatuses?lang=${locale}`);
      if (response.ok) {
        const data = await response.json();
        setStatuses(data);
      }
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  }, [locale]);

  useEffect(() => {
    fetchCities();
    fetchTypes();
    fetchStatuses();
  }, [fetchCities, fetchTypes, fetchStatuses]);

  // Update cities when country changes
  useEffect(() => {
    fetchCities();
  }, [selectedCountry, fetchCities]);

  // Update URL params without redirecting - stays on same page
  const updateURL = useCallback(
    (params: URLSearchParams) => {
      const queryString = params.toString();
      const newUrl = queryString
        ? `${pathname}?${queryString}`
        : pathname;
      // Use replace with scroll: false to stay on same page
      router.replace(newUrl, { scroll: false });
      if (onFilterChange) {
        onFilterChange();
      }
    },
    [pathname, router, onFilterChange]
  );

  // Debounced search
  const debouncedSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    params.delete("pagenum"); // Reset to first page
    updateURL(params);
  }, 500);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleFilterChange = (
    key: string,
    value: string | number[],
    resetPage = true
  ) => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    // If statusFilter is set, ensure it's maintained in URL
    if (statusFilter) {
      // Find the status ID from statuses
      const status = statuses.find((s) => s.code === statusFilter);
      if (status) {
        params.set("queryStatus", status.id.toString());
      }
    }

    if (Array.isArray(value)) {
      // Range values
      if (value[0] !== undefined && value[0] > 0) {
        params.set(`min${key}`, value[0].toString());
      } else {
        params.delete(`min${key}`);
      }
      if (value[1] !== undefined && value[1] < getMaxValue(key)) {
        params.set(`max${key}`, value[1].toString());
      } else {
        params.delete(`max${key}`);
      }
    } else {
      // Single values
      if (value && value !== "none" && value !== "") {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    }

    if (resetPage) {
      params.delete("pagenum");
    }
    updateURL(params);
  };

  const getMaxValue = (key: string): number => {
    switch (key) {
      case "Price":
        return 1000000;
      case "Area":
        return 1000;
      case "Bedrooms":
      case "Bathrooms":
        return 10;
      default:
        return 1000;
    }
  };

  // Reset filters
  const handleReset = () => {
    setSearchQuery("");
    setSelectedCity("");
    setSelectedType("");
    setSelectedCountry("");
    setPriceRange([0, 1000000]);
    setAreaRange([0, 1000]);
    setBedroomsRange([0, 10]);
    setBathroomsRange([0, 10]);
    setSortOrder("date-desc");

    const params = new URLSearchParams();
    // Maintain statusFilter if set
    if (statusFilter && statuses.length > 0) {
      const status = statuses.find((s) => s.code === statusFilter);
      if (status) {
        params.set("queryStatus", status.id.toString());
      }
    }
    
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    if (onFilterChange) {
      onFilterChange();
    }
  };

  // Count active filters
  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (selectedCity ? 1 : 0) +
    (selectedType ? 1 : 0) +
    (selectedCountry ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 1000000 ? 1 : 0) +
    (areaRange[0] > 0 || areaRange[1] < 1000 ? 1 : 0) +
    (bedroomsRange[0] > 0 || bedroomsRange[1] < 10 ? 1 : 0) +
    (bathroomsRange[0] > 0 || bathroomsRange[1] < 10 ? 1 : 0) +
    (sortOrder !== "date-desc" ? 1 : 0);

  return (
    <Card className="w-full shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-5 w-5" />
            {t("searchProperties") || "Rechercher des propriétés"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {activeFiltersCount} {t("activeFilters") || "filtres actifs"}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? t("hideFilters") || "Masquer" : t("showFilters") || "Filtres"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchPlaceholder") || "Rechercher par nom, description..."}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={handleReset} size="icon">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
            {/* City */}
            <div className="space-y-2">
              <Label>{t("city") || "Ville"}</Label>
              <Select
                value={selectedCity}
                onValueChange={(value) => {
                  setSelectedCity(value);
                  handleFilterChange("cityId", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("allCities") || "Toutes les villes"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("allCities") || "Toutes les villes"}
                  </SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label>{t("type") || "Type"}</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value);
                  handleFilterChange("queryType", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("allTypes") || "Tous les types"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("allTypes") || "Tous les types"}
                  </SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label>{t("sortBy") || "Trier par"}</Label>
              <Select
                value={sortOrder}
                onValueChange={(value) => {
                  setSortOrder(value);
                  handleFilterChange("sortOrder", value);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">
                    {t("newest") || "Plus récent"}
                  </SelectItem>
                  <SelectItem value="date-asc">
                    {t("oldest") || "Plus ancien"}
                  </SelectItem>
                  <SelectItem value="price-asc">
                    {t("priceLowToHigh") || "Prix croissant"}
                  </SelectItem>
                  <SelectItem value="price-desc">
                    {t("priceHighToLow") || "Prix décroissant"}
                  </SelectItem>
                  <SelectItem value="surface-asc">
                    {t("surfaceAsc") || "Surface croissante"}
                  </SelectItem>
                  <SelectItem value="surface-desc">
                    {t("surfaceDesc") || "Surface décroissante"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>
                {t("price") || "Prix"} ({priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()})
              </Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value);
                  handleFilterChange("Price", value);
                }}
                min={0}
                max={1000000}
                step={10000}
                className="w-full"
              />
            </div>

            {/* Area Range */}
            <div className="space-y-2">
              <Label>
                {t("area") || "Surface"} ({areaRange[0]} - {areaRange[1]} m²)
              </Label>
              <Slider
                value={areaRange}
                onValueChange={(value) => {
                  setAreaRange(value);
                  handleFilterChange("Area", value);
                }}
                min={0}
                max={1000}
                step={10}
                className="w-full"
              />
            </div>

            {/* Bedrooms Range */}
            <div className="space-y-2">
              <Label>
                {t("bedrooms") || "Chambres"} ({bedroomsRange[0]} - {bedroomsRange[1]})
              </Label>
              <Slider
                value={bedroomsRange}
                onValueChange={(value) => {
                  setBedroomsRange(value);
                  handleFilterChange("Bedrooms", value);
                }}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            {/* Bathrooms Range */}
            <div className="space-y-2">
              <Label>
                {t("bathrooms") || "Salles de bain"} ({bathroomsRange[0]} - {bathroomsRange[1]})
              </Label>
              <Slider
                value={bathroomsRange}
                onValueChange={(value) => {
                  setBathroomsRange(value);
                  handleFilterChange("Bathrooms", value);
                }}
                min={0}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

