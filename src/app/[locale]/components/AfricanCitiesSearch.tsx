"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPin, Search, ChevronDown, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";

type AfricanCitiesData = Record<string, string[]>;

export default function AfricanCitiesSearch() {
  const router = useRouter();
  const locale = useLocale();
  const [status, setStatus] = useState<"a-vendre" | "a-louer">("a-vendre");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citiesData, setCitiesData] = useState<AfricanCitiesData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

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

  // Get all cities from all countries (for search without country selection)
  const allCities = useMemo(() => {
    const all: string[] = [];
    Object.values(citiesData).forEach((cities) => {
      all.push(...cities);
    });
    return [...new Set(all)].sort(); // Remove duplicates and sort
  }, [citiesData]);

  // Filter cities based on search query
  const filteredCities = useMemo(() => {
    const citiesToSearch = selectedCountry ? citiesForCountry : allCities;
    if (!citySearchQuery.trim()) return citiesToSearch;
    const query = citySearchQuery.toLowerCase();
    return citiesToSearch.filter((city) =>
        city.toLowerCase().includes(query)
      );
  }, [citiesForCountry, allCities, selectedCountry, citySearchQuery]);

  // Handle country selection
  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setCountrySearchQuery(""); // Reset country search
    setCitySearchQuery(""); // Reset city search when country changes
    setSelectedCity(null); // Reset selected city
  };

  // Handle city selection
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearchQuery(""); // Clear search query when city is selected
    // You can add navigation logic here
    console.log("Selected city:", city, "in country:", selectedCountry);
    setIsCityDropdownOpen(false);
  };

  // Handle search button click
  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      
      // Get city to search (prefer selected city, otherwise use search query)
      const cityToSearch = selectedCity || citySearchQuery.trim();
      
      // Look up IDs if we have country or city names
      if (selectedCountry || cityToSearch) {
        const lookupParams = new URLSearchParams();
        lookupParams.set("lang", locale);
        if (selectedCountry) {
          lookupParams.set("countryName", selectedCountry);
        }
        if (cityToSearch) {
          lookupParams.set("cityName", cityToSearch);
        }
        
        try {
          const lookupResponse = await fetch(`/api/lookup-location-ids?${lookupParams.toString()}`);
          if (lookupResponse.ok) {
            const { countryId, cityId } = await lookupResponse.json();
            
            if (countryId) {
              params.set("countryId", countryId.toString());
            }
            if (cityId) {
              params.set("cityId", cityId.toString());
            }
          }
        } catch (error) {
          console.error("Error looking up location IDs:", error);
          // Continue with search even if lookup fails
        }
      }
      
      // Add query parameter for city search if no ID was found
      if (cityToSearch && !params.has("cityId")) {
        params.set("query", cityToSearch);
      }
      
      // Build the URL
      const queryString = params.toString();
      const statusUrl = queryString
        ? `/${locale}/status/${status}?${queryString}`
        : `/${locale}/status/${status}`;
      
      // Navigate to status page
      router.push(statusUrl);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      // Reset loading state after a short delay
      setTimeout(() => {
        setIsSearching(false);
      }, 500);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".country-dropdown") && !target.closest(".city-dropdown")) {
        setIsCountryDropdownOpen(false);
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-5xl mx-auto px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 md:p-6">
        {/* Status Toggle */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-300 bg-white dark:bg-gray-700 p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setStatus("a-vendre")}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${status === "a-vendre"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                }
              `}
            >
              A vendre
            </button>
            <button
              type="button"
              onClick={() => setStatus("a-louer")}
              className={`
                px-6 py-2 rounded-md text-sm font-medium transition-colors
                ${status === "a-louer"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
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
          <div className="relative country-dropdown">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  setIsCountryDropdownOpen(!isCountryDropdownOpen);
                  setIsCityDropdownOpen(false);
                }}
                className="w-full h-12 pl-10 pr-10 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <span className="block truncate">
                  {selectedCountry || "Tous les pays"}
                </span>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Country Dropdown */}
            {isCountryDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                {/* Country Search Input */}
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

                {/* Countries List */}
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

                {/* Country Count */}
                {filteredCountries.length > 0 && (
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    {filteredCountries.length} {filteredCountries.length === 1 ? "pays" : "pays"}
                    {countrySearchQuery && ` trouvé${filteredCountries.length > 1 ? "s" : ""}`}
                      </div>
                    )}
                  </div>
            )}
          </div>

          {/* City Select */}
          <div className="relative city-dropdown">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setIsCountryDropdownOpen(false);
                }}
                className="w-full h-12 pl-10 pr-10 text-left bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <span className="block truncate">
                  {selectedCity || citySearchQuery || "Toutes les villes"}
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
            {isCityDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                {/* City Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                      placeholder={selectedCountry ? "Rechercher une ville..." : "Rechercher une ville dans tous les pays..."}
                value={citySearchQuery}
                      onChange={(e) => {
                        setCitySearchQuery(e.target.value);
                        setSelectedCity(null); // Clear selected city when typing
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

                {/* Cities List */}
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
                        : selectedCountry && citiesForCountry.length === 0
                        ? "Aucune ville disponible pour ce pays"
                        : "Aucune ville disponible"}
                    </div>
                  )}
                </div>

                {/* City Count */}
                {filteredCities.length > 0 && (
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                    {filteredCities.length} {filteredCities.length === 1 ? "ville" : "villes"}
                    {citySearchQuery && ` trouvée${filteredCities.length > 1 ? "s" : ""}`}
                    {!selectedCountry && !citySearchQuery && " (tous les pays)"}
                  </div>
                )}
          </div>
        )}
          </div>

        {/* Search Button */}
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="h-12 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
            <Search className="h-4 w-4 mr-2" />
            )}
            {isSearching ? "Recherche..." : "Rechercher"}
          </Button>
      </div>

        {/* Selected Country Cities Display */}
        {selectedCountry && citiesForCountry && citiesForCountry.length > 0 && !isCityDropdownOpen && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Villes de {selectedCountry} ({citiesForCountry.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedCountry(null);
                  setCitySearchQuery("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto">
              {citiesForCountry.slice(0, 20).map((city, index) => (
                <button
                  key={`${city}-${index}`}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors truncate"
                  title={city}
                >
                        {city}
                </button>
              ))}
              {citiesForCountry.length > 20 && (
                <button
                  type="button"
                  onClick={() => setIsCityDropdownOpen(true)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition-colors text-orange-500 font-medium"
                >
                  +{citiesForCountry.length - 20} autres...
                </button>
              )}
            </div>
        </div>
      )}
        </div>
    </div>
  );
}
