"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";

type AfricanCitiesData = Record<string, string[]>;

type PropertyType = "appartement" | "maison" | "maison-et-appartement" | "terrain";

const propertyTypeLabels: Record<PropertyType, string> = {
  appartement: "Appartement",
  maison: "Maison",
  "maison-et-appartement": "Maison et Appartement",
  terrain: "Terrain",
};

export default function HomeSearchForm() {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citiesData, setCitiesData] = useState<AfricanCitiesData>({});
  const [isLoading, setIsLoading] = useState(true);

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

  // Sync with URL params
  useEffect(() => {
    if (searchParams) {
      const urlTypes = searchParams.getAll("type[]").length > 0 
        ? searchParams.getAll("type[]") 
        : searchParams.getAll("type");
      const urlCountry = searchParams.get("country[]") || searchParams.get("country");
      const urlCity = searchParams.get("city[]") || searchParams.get("city");
      
      if (urlTypes.length > 0) {
        setSelectedType(urlTypes[0] as PropertyType);
      }
      if (urlCountry) {
        setSelectedCountry(urlCountry);
      }
      if (urlCity) {
        setSelectedCity(urlCity);
      }
    }
  }, [searchParams]);

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

  // Handle search button click
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // Add property type
    if (selectedType) {
      params.append("type[]", selectedType);
    }
    
    // Add country
    if (selectedCountry) {
      params.append("country[]", selectedCountry);
    }
    
    // Add city
    const cityToSearch = selectedCity || citySearchQuery.trim();
    if (cityToSearch) {
      params.append("city[]", cityToSearch);
    }
    
    // Build the URL - route to search-results page
    const queryString = params.toString();
    const searchUrl = queryString
      ? `/${locale}/search-results?${queryString}`
      : `/${locale}/search-results`;
    
    // Navigate to search results page
    router.push(searchUrl);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".type-dropdown") &&
        !target.closest(".country-dropdown") &&
        !target.closest(".city-dropdown")
      ) {
        setIsTypeDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Type de propriété */}
          <div className="flex-1 w-full md:w-auto relative type-dropdown">
            <label className="block text-xs font-bold text-gray-900 uppercase mb-2">
              À LA RECHERCHE DE
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsTypeDropdownOpen(!isTypeDropdownOpen);
                  setIsCountryDropdownOpen(false);
                  setIsCityDropdownOpen(false);
                }}
                className="w-full h-12 pl-4 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              >
                <span className="block truncate text-sm">
                  {selectedType ? propertyTypeLabels[selectedType] : "Type de propriété"}
                </span>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </button>

              {isTypeDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedType(value as PropertyType);
                        setIsTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                        selectedType === value ? "bg-blue-50 font-medium" : ""
                      }`}
                    >
                      <span className="text-sm text-gray-700">{label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pays and Ville - Same Line */}
          <div className="flex-1 w-full md:w-auto grid grid-cols-2 gap-3">
            {/* Pays */}
            <div className="relative country-dropdown">
              <label className="block text-xs font-bold text-gray-900 uppercase mb-2">
                PAYS
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCountryDropdownOpen(!isCountryDropdownOpen);
                    setIsCityDropdownOpen(false);
                    setIsTypeDropdownOpen(false);
                  }}
                  className="w-full h-12 pl-4 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700"
                >
                  <span className="block truncate">
                    {selectedCountry || "Tous les pays"}
                  </span>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Rechercher un pays..."
                          value={countrySearchQuery}
                          onChange={(e) => setCountrySearchQuery(e.target.value)}
                          className="pl-8 h-9 text-sm"
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
                          className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                            !selectedCountry ? "bg-blue-50 font-medium" : ""
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
                              className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm ${
                                selectedCountry === country
                                  ? "bg-blue-50 font-medium"
                                  : ""
                              }`}
                            >
                              {country}
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Aucun pays trouvé
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Ville */}
            <div className="relative city-dropdown">
              <label className="block text-xs font-bold text-gray-900 uppercase mb-2">
                VILLE
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedCountry) {
                      setIsCityDropdownOpen(!isCityDropdownOpen);
                      setIsCountryDropdownOpen(false);
                      setIsTypeDropdownOpen(false);
                    }
                  }}
                  disabled={!selectedCountry}
                  className="w-full h-12 pl-4 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-700"
                >
                  <span className="block truncate">
                    {selectedCity || citySearchQuery || (selectedCountry ? "Toutes les villes" : "Sélectionnez d'abord un pays")}
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
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </button>

                {isCityDropdownOpen && selectedCountry && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-200">
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
                          className="pl-8 h-9 text-sm"
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
                              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
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
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto">
            <Button
              type="button"
              onClick={handleSearch}
              className="w-full md:w-auto h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-md"
            >
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}





