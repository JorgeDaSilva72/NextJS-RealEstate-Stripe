"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface PropertyType {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("SearchBar");
  
  // Extract locale from pathname to avoid duplicates (e.g., /fr/fr/result -> fr)
  const getLocaleFromPath = () => {
    if (!pathname) return locale;
    const pathParts = pathname.split('/').filter(Boolean);
    // If pathname has duplicate locale (e.g., /fr/fr/result), use the first one
    if (pathParts.length > 1 && pathParts[0] === pathParts[1]) {
      return pathParts[0];
    }
    return pathParts[0] || locale;
  };
  
  const currentLocale = getLocaleFromPath();
  
  const [location, setLocation] = useState(searchParams?.get("cityId") || "");
  const [propertyType, setPropertyType] = useState(
    searchParams?.get("typeId") || ""
  );
  const [minPriceBound, setMinPriceBound] = useState<number>(0);
  const [maxPriceBound, setMaxPriceBound] = useState<number>(1000000);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);
  const [bedrooms, setBedrooms] = useState(searchParams?.get("bedrooms") || "");
  const [bathrooms, setBathrooms] = useState(searchParams?.get("bathrooms") || "");
  const [minArea, setMinArea] = useState(searchParams?.get("minArea") || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Helper to convert empty string to "all" for Select component
  const getSelectValue = (value: string) => value || "all";
  
  // Helper to handle Select change (convert "all" back to empty string)
  const handleLocationChange = (value: string) => {
    setLocation(value === "all" ? "" : value);
  };
  
  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value === "all" ? "" : value);
  };
  
  // Fetch property types and cities
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    // Fetch property types and cities from API
    // Always use French (fr) as the default language for cities and property types
    const fetchOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [typesRes, citiesRes, priceRangeRes] = await Promise.all([
          fetch(`/api/searchTypes?lang=fr`), // Always use French for property types
          fetch(`/api/searchCities?lang=fr`), // Always use French for cities
          fetch(`/api/price-range`), // Fetch real price range
        ]);

        if (typesRes.ok) {
          const typesData = await typesRes.json();
          setPropertyTypes(typesData.map((item: any) => ({
            id: item.id,
            name: item.value,
          })));
        }

        if (citiesRes.ok) {
          const citiesData = await citiesRes.json();
          setCities(citiesData.map((item: any) => ({
            id: item.id,
            name: item.value || item.name, // Use value from API response
          })));
        }

        if (priceRangeRes.ok) {
          const priceData = await priceRangeRes.json();
          const min = priceData.minPrice || 0;
          const max = priceData.maxPrice || 1000000;
          setMinPriceBound(min);
          setMaxPriceBound(max);
          // Initialize with URL params or use actual min/max from database
          const urlMin = searchParams?.get("minPrice") ? Number(searchParams.get("minPrice")) : min;
          const urlMax = searchParams?.get("maxPrice") ? Number(searchParams.get("maxPrice")) : max;
          // Ensure values are within bounds
          setPriceRange([
            Math.max(min, urlMin),
            Math.min(max, urlMax)
          ]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []); // Remove locale dependency - always fetch in French

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setIsLoading(true);
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (location) {
      params.set("cityId", location);
    }
    if (propertyType) {
      params.set("typeId", propertyType);
    }
    if (priceRange[0] > minPriceBound) {
      params.set("minPrice", priceRange[0].toString());
    }
    if (priceRange[1] < maxPriceBound) {
      params.set("maxPrice", priceRange[1].toString());
    }
    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    }
    if (bathrooms) {
      params.set("bathrooms", bathrooms);
    }
    if (minArea) {
      const parsedMinArea = parseInt(minArea.replace(/\D/g, ""), 10);
      if (!isNaN(parsedMinArea) && parsedMinArea > 0) {
        params.set("minArea", parsedMinArea.toString());
      }
    }

    // Always redirect to /result page with search params - use replace to avoid redirect loops
    const queryString = params.toString();
    // Use currentLocale to avoid duplicate locale in URL
    const resultUrl = queryString
      ? `/${currentLocale}/result?${queryString}`
      : `/${currentLocale}/result`;
    
    // Use replace instead of push to avoid adding to history and potential redirect loops
    router.replace(resultUrl);
    
    // Reset loading state after navigation
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative z-10 w-full max-w-6xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
            {isLoadingOptions ? (
              <div className="flex items-center justify-center h-12 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select value={getSelectValue(location)} onValueChange={handleLocationChange}>
                <SelectTrigger className="h-12 pl-10">
                  <SelectValue placeholder={t("locationPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allCities")}</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Property Type Select */}
          <div>
            {isLoadingOptions ? (
              <div className="flex items-center justify-center h-12 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select value={getSelectValue(propertyType)} onValueChange={handlePropertyTypeChange}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("propertyTypePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allTypes")}</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Budget Range Slider */}
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
              min={minPriceBound}
              max={maxPriceBound}
              step={Math.max(1, Math.floor((maxPriceBound - minPriceBound) / 1000))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-600 px-2">
              <span>{priceRange[0].toLocaleString()}</span>
              <span>{priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="h-12 bg-orange-500 hover:bg-orange-600 text-white flex-1 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {t("searchButton")}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                {t("bedroomsLabel")}
              </label>
              <Select value={getSelectValue(bedrooms)} onValueChange={(value) => setBedrooms(value === "all" ? "" : value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("bedroomsPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                {t("bathroomsLabel")}
              </label>
              <Select value={getSelectValue(bathrooms)} onValueChange={(value) => setBathrooms(value === "all" ? "" : value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("bathroomsPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("all")}</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                {t("minAreaLabel")}
              </label>
              <Input
                type="text"
                placeholder={t("minAreaPlaceholder")}
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
