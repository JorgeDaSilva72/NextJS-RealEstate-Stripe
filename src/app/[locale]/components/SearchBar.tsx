"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

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
  
  const [location, setLocation] = useState(searchParams.get("cityId") || "");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("typeId") || ""
  );
  
  // Helper to convert empty string to "all" for Select component
  const getSelectValue = (value: string) => value || "all";
  
  // Helper to handle Select change (convert "all" back to empty string)
  const handleLocationChange = (value: string) => {
    setLocation(value === "all" ? "" : value);
  };
  
  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value === "all" ? "" : value);
  };
  const [budget, setBudget] = useState(searchParams.get("maxPrice") || "");
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch property types and cities
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    // Fetch property types and cities from API
    const fetchOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [typesRes, citiesRes] = await Promise.all([
          fetch(`/api/searchTypes?lang=${locale}`),
          fetch(`/api/searchCities?lang=${locale}`),
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
            name: item.name,
          })));
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [locale]);

  const handleSearch = () => {
    setIsLoading(true);
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (location) {
      params.set("cityId", location);
    }
    if (propertyType) {
      params.set("typeId", propertyType);
    }
    if (budget) {
      // Parse budget - assume it's max price for now
      const maxPrice = parseInt(budget.replace(/\D/g, ""), 10);
      if (!isNaN(maxPrice) && maxPrice > 0) {
        params.set("maxPrice", maxPrice.toString());
      }
    }

    // Navigate with search params
    const queryString = params.toString();
    const newUrl = queryString
      ? `${pathname}?${queryString}`
      : pathname;
    
    router.push(newUrl);
    router.refresh();
    
    // Reset loading state after navigation
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Location Select */}
          <div className="lg:col-span-2 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
            {isLoadingOptions ? (
              <div className="flex items-center justify-center h-12 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select value={getSelectValue(location)} onValueChange={handleLocationChange}>
                <SelectTrigger className="h-12 pl-10">
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
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
                  <SelectValue placeholder="Type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Budget Input */}
          <div>
            <Input
              type="text"
              placeholder="Budget max."
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              onKeyPress={handleKeyPress}
              className="h-12"
            />
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
              Rechercher
            </Button>
          </div>
        </div>

        {/* Advanced Filters Link */}
        <div className="mt-4 flex justify-end">
          <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            Filtres avancés
          </button>
        </div>
      </div>
    </div>
  );
}
