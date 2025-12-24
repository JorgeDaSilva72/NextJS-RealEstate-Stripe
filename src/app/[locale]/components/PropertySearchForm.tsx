"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, ChevronDown, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

type AfricanCitiesData = Record<string, string[]>;

type PropertyType = "appartement" | "maison" | "maison-et-appartement" | "terrain";

interface PropertySearchFormProps {
  defaultMode?: "buy" | "rent";
}

export default function PropertySearchForm({ defaultMode = "buy" }: PropertySearchFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  // Initialize from URL params if available, otherwise use defaults
  const urlMode = searchParams?.get("mode") as "buy" | "rent" | null;
  const urlTypes = searchParams?.getAll("type[]") || searchParams?.getAll("type") || [];
  const urlCountry = searchParams?.get("country[]") || searchParams?.get("country") || null;
  const urlCity = searchParams?.get("city[]") || searchParams?.get("city") || null;
  
  const [mode, setMode] = useState<"buy" | "rent">(urlMode || defaultMode);
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>(urlTypes as PropertyType[] || []);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(urlCountry);
  const [selectedCity, setSelectedCity] = useState<string | null>(urlCity);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citiesData, setCitiesData] = useState<AfricanCitiesData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  // Sync with URL params immediately on mount and when URL changes
  // This ensures form shows correct values on page refresh without delay
  useEffect(() => {
    if (searchParams) {
      const urlModeParam = searchParams.get("mode") as "buy" | "rent" | null;
      const urlTypesParam = searchParams.getAll("type[]").length > 0 
        ? searchParams.getAll("type[]") 
        : searchParams.getAll("type");
      const urlCountryParam = searchParams.get("country[]") || searchParams.get("country");
      const urlCityParam = searchParams.get("city[]") || searchParams.get("city");
      
      // Update mode immediately
      if (urlModeParam) {
        setMode(urlModeParam);
      } else if (!urlModeParam && defaultMode) {
        // If no mode in URL, use defaultMode
        setMode(defaultMode);
      }
      
      // Update types immediately
      if (urlTypesParam.length > 0) {
        setSelectedTypes(urlTypesParam as PropertyType[]);
      } else {
        setSelectedTypes([]);
      }
      
      // Update country immediately
      if (urlCountryParam) {
        setSelectedCountry(urlCountryParam);
      } else {
        setSelectedCountry(null);
      }
      
      // Update city immediately
      if (urlCityParam) {
        setSelectedCity(urlCityParam);
      } else {
        setSelectedCity(null);
      }
    }
  }, [searchParams, defaultMode]);

  // Load JSON data on component mount
  useEffect(() => {
    const loadCitiesData = async () => {
      try {
        const response = await fetch("/api/african-cities");
        if (!response.ok) {
          throw new Error("Failed to load cities data");
        }
        const data = await response.json();
        setCitiesData(data);
      } catch (error) {
        console.error("Error loading cities data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCitiesData();
  }, []);

  // Get all countries from JSON keys
  const countries = useMemo(() => {
    if (!citiesData || Object.keys(citiesData).length === 0) return [];
    return Object.keys(citiesData).sort();
  }, [citiesData]);

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return countries;
    const query = countrySearchQuery.toLowerCase();
    return countries.filter((country) =>
      country.toLowerCase().includes(query)
    );
  }, [countries, countrySearchQuery]);

  // Get cities for selected country
  const citiesForCountry = useMemo(() => {
    if (!selectedCountry) return [];
    return citiesData[selectedCountry] || [];
  }, [selectedCountry, citiesData]);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return citiesForCountry;
    const query = citySearchQuery.toLowerCase();
    return citiesForCountry.filter((city) =>
      city.toLowerCase().includes(query)
    );
  }, [citiesForCountry, citySearchQuery]);

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchQuery("");
    setCitySearchQuery("");
    setSelectedCity(null);
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearchQuery("");
    setIsCityDropdownOpen(false);
  };

  // Handle property type toggle
  const handleTypeToggle = (type: PropertyType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Handle search button click
  const handleSearch = () => {
    setIsSearching(true);
    
    const params = new URLSearchParams();
    
    // Add mode (buy/rent)
    params.set("mode", mode);
    
    // Add property types
    selectedTypes.forEach((type) => {
      params.append("type[]", type);
    });
    
    // Add country
    if (selectedCountry) {
      params.append("country[]", selectedCountry);
    }
    
    // Add city
    const cityToSearch = selectedCity || citySearchQuery.trim();
    if (cityToSearch) {
      params.append("city[]", cityToSearch);
    }
    
    // Build the URL
    const queryString = params.toString();
    const searchUrl = queryString
      ? `/${locale}/search-results?${queryString}`
      : `/${locale}/search-results`;
    
    // Navigate to search results page
    router.push(searchUrl);
    
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".country-dropdown") &&
        !target.closest(".city-dropdown") &&
        !target.closest(".type-dropdown")
      ) {
        setIsCountryDropdownOpen(false);
        setIsCityDropdownOpen(false);
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show loading state - render form immediately, data will load in background
  // This prevents the flash of loading state on page refresh

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 ${isLoading ? 'opacity-75' : ''}`}>
        {/* Buy/Rent Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setMode("buy")}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${mode === "buy"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                }
              `}
            >
              Acheter
            </button>
            <button
              type="button"
              onClick={() => setMode("rent")}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${mode === "rent"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                }
              `}
            >
              Louer
            </button>
          </div>
        </div>

        {/* Property Type Selection - Dropdown */}
        <div className="mb-6 relative type-dropdown">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type de propriété
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTypeDropdownOpen(!isTypeDropdownOpen);
                setIsCountryDropdownOpen(false);
                setIsCityDropdownOpen(false);
              }}
              className="w-full h-12 pl-4 pr-10 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <span className="block truncate">
                {selectedTypes.length === 0
                  ? "Sélectionnez un ou plusieurs types"
                  : selectedTypes.length === 1
                  ? [
                      { value: "appartement", label: "Appartement" },
                      { value: "maison", label: "Maison" },
                      { value: "maison-et-appartement", label: "Maison et Appartement" },
                      { value: "terrain", label: "Terrain" },
                    ].find((t) => t.value === selectedTypes[0])?.label || selectedTypes[0]
                  : `${selectedTypes.length} types sélectionnés`}
              </span>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </button>

            {/* Type Dropdown */}
            {isTypeDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                {[
                  { value: "appartement", label: "Appartement" },
                  { value: "maison", label: "Maison" },
                  { value: "maison-et-appartement", label: "Maison et Appartement" },
                  { value: "terrain", label: "Terrain" },
                ].map((type) => (
                  <div key={type.value} className="p-2">
                    <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value as PropertyType)}
                        onChange={() => handleTypeToggle(type.value as PropertyType)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type.label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Country and City Selection - Same Line, Smaller */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {/* Country Select */}
          <div className="relative country-dropdown">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Pays
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  setIsCountryDropdownOpen(!isCountryDropdownOpen);
                  setIsCityDropdownOpen(false);
                }}
                className="w-full h-10 pl-10 pr-10 text-sm text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <span className="block truncate">
                  {selectedCountry || "Sélectionnez un pays"}
                </span>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Country Dropdown */}
            {isCountryDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher un pays..."
                      value={countrySearchQuery}
                      onChange={(e) => setCountrySearchQuery(e.target.value)}
                      className="pl-8 h-9"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {countrySearchQuery && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCountrySearchQuery("");
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-60">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCountry(null);
                        setIsCountryDropdownOpen(false);
                        setCountrySearchQuery("");
                        setCitySearchQuery("");
                        setSelectedCity(null);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        !selectedCountry ? "bg-orange-50 dark:bg-orange-900/20" : ""
                      }`}
                    >
                      Tous les pays
                    </button>
                  </div>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div key={country} className="p-2">
                        <button
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
                            selectedCountry === country
                              ? "bg-orange-50 dark:bg-orange-900/20 font-medium"
                              : ""
                          }`}
                        >
                          {country}
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      Aucun pays trouvé
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* City Select */}
          <div className="relative city-dropdown">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Ville
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10 pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  if (selectedCountry) {
                    setIsCityDropdownOpen(!isCityDropdownOpen);
                    setIsCountryDropdownOpen(false);
                  }
                }}
                disabled={!selectedCountry}
                className="w-full h-10 pl-10 pr-10 text-sm text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="block truncate">
                  {selectedCity || citySearchQuery || (selectedCountry ? "Sélectionnez une ville" : "Sélectionnez d'abord un pays")}
                </span>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {selectedCity && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCity(null);
                        setCitySearchQuery("");
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            </div>

            {/* City Dropdown with Search */}
            {isCityDropdownOpen && selectedCountry && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher une ville..."
                      value={citySearchQuery}
                      onChange={(e) => {
                        setCitySearchQuery(e.target.value);
                        setSelectedCity(null);
                      }}
                      className="pl-8 h-9"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {citySearchQuery && (
                      <button
                        type="button"
                        onClick={() => setCitySearchQuery("")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="overflow-y-auto max-h-80">
                  {filteredCities.length > 0 ? (
                    <div className="p-2">
                      {filteredCities.map((city, index) => (
                        <button
                          key={`${city}-${index}`}
                          type="button"
                          onClick={() => handleCitySelect(city)}
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      {citySearchQuery
                        ? "Aucune ville trouvée"
                        : citiesForCountry.length === 0
                        ? "Aucune ville disponible pour ce pays"
                        : "Aucune ville disponible"}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            size="lg"
            className="px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 text-base font-medium"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Recherche...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

