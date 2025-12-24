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
import { useLocale, useTranslations } from "next-intl";

interface PropertyType {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

export default function HomepageSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("SearchBar");
  
  const getLocaleFromPath = () => {
    if (!pathname) return locale;
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 1 && pathParts[0] === pathParts[1]) {
      return pathParts[0];
    }
    return pathParts[0] || locale;
  };
  
  const currentLocale = getLocaleFromPath();
  
  const [status, setStatus] = useState<"a-vendre" | "a-louer">("a-vendre");
  const [country, setCountry] = useState(searchParams?.get("countryId") || "");
  const [city, setCity] = useState(searchParams?.get("cityId") || "");
  const [isLoading, setIsLoading] = useState(false);
  
  const getSelectValue = (value: string) => value || "all";
  
  const handleStatusChange = (value: string) => {
    setStatus(value as "a-vendre" | "a-louer");
  };
  
  const handleCountryChange = (value: string) => {
    setCountry(value === "all" ? "" : value);
    // Reset city when country changes
    setCity("");
  };
  
  const handleCityChange = (value: string) => {
    setCity(value === "all" ? "" : value);
  };
  
  // Fetch countries and cities
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setIsLoadingOptions(true);
        const [countriesRes, citiesRes] = await Promise.all([
          fetch(`/api/searchCountries?lang=fr`),
          country ? fetch(`/api/searchCities?lang=fr&countryId=${country}`) : Promise.resolve(null),
        ]);

        if (countriesRes.ok) {
          const countriesData = await countriesRes.json();
          setCountries(countriesData.map((item: any) => ({
            id: item.id,
            name: item.value,
          })));
        }

        if (citiesRes?.ok) {
          const citiesData = await citiesRes.json();
          setCities(citiesData.map((item: any) => ({
            id: item.id,
            name: item.value || item.name,
          })));
        } else if (!country) {
          setCities([]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [country]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setIsLoading(true);
    
    const params = new URLSearchParams();
    
    if (country) {
      params.set("countryId", country);
    }
    if (city) {
      params.set("cityId", city);
    }

    // Redirect to status page instead of result page
    const queryString = params.toString();
    const statusUrl = queryString
      ? `/${currentLocale}/status/${status}?${queryString}`
      : `/${currentLocale}/status/${status}`;
    
    router.replace(statusUrl);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <form onSubmit={handleSearch} className="relative z-10 w-full max-w-5xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
        {/* Status Toggle */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => handleStatusChange("a-vendre")}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${status === "a-vendre"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              A vendre
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("a-louer")}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${status === "a-louer"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              A louer
            </button>
          </div>
        </div>

        {/* Search Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country Select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
            {isLoadingOptions ? (
              <div className="flex items-center justify-center h-12 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select value={getSelectValue(country)} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-12 pl-10">
                  <SelectValue placeholder="Pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les pays</SelectItem>
                  {countries.map((countryItem) => (
                    <SelectItem key={countryItem.id} value={countryItem.id.toString()}>
                      {countryItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* City Select */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
            {isLoadingOptions ? (
              <div className="flex items-center justify-center h-12 border rounded-md">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <Select 
                value={getSelectValue(city)} 
                onValueChange={handleCityChange}
                disabled={!country}
              >
                <SelectTrigger className="h-12 pl-10" disabled={!country}>
                  <SelectValue placeholder={country ? "Ville" : "Sélectionnez d'abord un pays"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {cities.map((cityItem) => (
                    <SelectItem key={cityItem.id} value={cityItem.id.toString()}>
                      {cityItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            onClick={handleSearch}
            disabled={isLoading}
            className="h-12 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {t("searchButton") || "Rechercher"}
          </Button>
        </div>
      </div>
    </form>
  );
}

