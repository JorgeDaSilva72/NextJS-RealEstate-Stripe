"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronDown, X, Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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

interface SearchResultsBarProps {
  onFilterChange?: () => void;
}

export default function SearchResultsBar({ onFilterChange }: SearchResultsBarProps) {
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyType | null>(null);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [citySearchQuery, setCitySearchQuery] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citiesData, setCitiesData] = useState<AfricanCitiesData>({});
  const [minPriceBound, setMinPriceBound] = useState<number>(0);
  const [maxPriceBound, setMaxPriceBound] = useState<number>(1000000);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);

  // Load JSON data and price range
  useEffect(() => {
    const loadCitiesData = async () => {
      try {
        const response = await fetch("/api/african-cities");
        if (response.ok) {
          const data = await response.json();
          setCitiesData(data);
        }
      } catch (error) {
        console.error("Error loading cities data:", error);
      }
    };

    const loadPriceRange = async () => {
      try {
        const response = await fetch("/api/price-range");
        if (response.ok) {
          const data = await response.json();
          const min = data.minPrice ?? 0;
          const max = data.maxPrice ?? 1000000;
          setMinPriceBound(min);
          setMaxPriceBound(max);
          // Initialize price range with actual min and max from database
          setPriceRange([min, max]);
        }
      } catch (error) {
        // Silently handle errors and use defaults
      }
    };

    loadCitiesData();
    loadPriceRange();
  }, []);

  // Sync with URL params
  useEffect(() => {
    if (searchParams) {
      const urlMode = searchParams.get("mode");
      const urlTypes = searchParams.getAll("type[]").length > 0 
        ? searchParams.getAll("type[]") 
        : searchParams.getAll("type");
      const urlCountry = searchParams.get("country[]") || searchParams.get("country");
      const urlCity = searchParams.get("city[]") || searchParams.get("city");
      
      if (urlMode) {
        setSelectedStatus([urlMode === "rent" ? "À Louer" : "À vendre"]);
      }
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

  // Get all countries
  const countries = useMemo(() => {
    if (!citiesData || Object.keys(citiesData).length === 0) return [];
    return Object.keys(citiesData).sort();
  }, [citiesData]);

  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return countries;
    return countries.filter((country) =>
      country.toLowerCase().includes(countrySearchQuery.toLowerCase())
    );
  }, [countries, countrySearchQuery]);

  const citiesForCountry = useMemo(() => {
    if (!selectedCountry) return [];
    return citiesData[selectedCountry] || [];
  }, [selectedCountry, citiesData]);

  const filteredCities = useMemo(() => {
    if (!citySearchQuery.trim()) return citiesForCountry;
    return citiesForCountry.filter((city) =>
      city.toLowerCase().includes(citySearchQuery.toLowerCase())
    );
  }, [citiesForCountry, citySearchQuery]);

  const handleStatusToggle = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleSelectAllStatus = () => {
    setSelectedStatus(["À Louer", "À vendre"]);
  };

  const handleDeselectAllStatus = () => {
    setSelectedStatus([]);
  };

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    
    // Update mode based on status
    if (selectedStatus.length > 0) {
      if (selectedStatus.includes("À vendre")) {
        params.set("mode", "buy");
      } else if (selectedStatus.includes("À Louer")) {
        params.set("mode", "rent");
      }
    } else {
      params.delete("mode");
    }
    
    // Update type
    if (selectedType) {
      params.set("type[]", selectedType);
    } else {
      params.delete("type[]");
    }
    
    // Update country
    if (selectedCountry) {
      params.set("country[]", selectedCountry);
    } else {
      params.delete("country[]");
    }
    
    // Update city
    if (selectedCity || citySearchQuery.trim()) {
      params.set("city[]", selectedCity || citySearchQuery.trim());
    } else {
      params.delete("city[]");
    }
    
    // Update price filters
    if (priceRange[0] > minPriceBound) {
      params.set("minPrice", priceRange[0].toString());
    } else {
      params.delete("minPrice");
    }
    
    if (priceRange[1] < maxPriceBound) {
      params.set("maxPrice", priceRange[1].toString());
    } else {
      params.delete("maxPrice");
    }
    
    router.push(`/${locale}/search-results?${params.toString()}`);
    onFilterChange?.();
  };

  // Sync price filters from URL
  useEffect(() => {
    if (searchParams) {
      const urlMinPrice = searchParams.get("minPrice");
      const urlMaxPrice = searchParams.get("maxPrice");
      // Use URL params if available, otherwise use actual min/max from database
      setPriceRange([
        urlMinPrice ? Math.max(minPriceBound, Number(urlMinPrice)) : minPriceBound,
        urlMaxPrice ? Math.min(maxPriceBound, Number(urlMaxPrice)) : maxPriceBound,
      ]);
    }
  }, [searchParams, minPriceBound, maxPriceBound]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".status-dropdown") &&
        !target.closest(".type-dropdown") &&
        !target.closest(".country-dropdown") &&
        !target.closest(".city-dropdown")
      ) {
        setIsStatusDropdownOpen(false);
        setIsTypeDropdownOpen(false);
        setIsCountryDropdownOpen(false);
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-2">
        <div className="flex flex-wrap gap-3 items-end">
        {/* Statut Dropdown */}
        <div className="flex-1 min-w-[150px] relative status-dropdown">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Statut
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsTypeDropdownOpen(false);
                setIsCountryDropdownOpen(false);
                setIsCityDropdownOpen(false);
              }}
              className="w-full h-10 pl-3 pr-8 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
            >
              <span className="block truncate">
                {selectedStatus.length === 0
                  ? "Statut"
                  : selectedStatus.length === 1
                  ? selectedStatus[0]
                  : `${selectedStatus.length} sélectionnés`}
              </span>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b border-gray-200 flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllStatus}
                    className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    Tout sélec.
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAllStatus}
                    className="flex-1 px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
                  >
                    Tout déselec.
                  </button>
                </div>
                <div className="p-2">
                  {["À Louer", "À vendre"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded p-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatus.includes(status)}
                        onChange={() => handleStatusToggle(status)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Type Dropdown */}
        <div className="flex-1 min-w-[150px] relative type-dropdown">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Type
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsTypeDropdownOpen(!isTypeDropdownOpen);
                setIsStatusDropdownOpen(false);
                setIsCountryDropdownOpen(false);
                setIsCityDropdownOpen(false);
              }}
              className="w-full h-10 pl-3 pr-8 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
            >
              <span className="block truncate">
                {selectedType ? propertyTypeLabels[selectedType] : "Type"}
              </span>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </button>

            {isTypeDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedType(null);
                      setIsTypeDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                  >
                    Tous les types
                  </button>
                  {Object.entries(propertyTypeLabels).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setSelectedType(value as PropertyType);
                        setIsTypeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm ${
                        selectedType === value ? "bg-blue-50 font-medium" : ""
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pays Dropdown */}
        <div className="flex-1 min-w-[150px] relative country-dropdown">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Pays
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCountryDropdownOpen(!isCountryDropdownOpen);
                setIsStatusDropdownOpen(false);
                setIsTypeDropdownOpen(false);
                setIsCityDropdownOpen(false);
              }}
              className="w-full h-10 pl-3 pr-8 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
            >
              <span className="block truncate">
                {selectedCountry || "Tous les pays"}
              </span>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={countrySearchQuery}
                      onChange={(e) => setCountrySearchQuery(e.target.value)}
                      className="pl-8 h-8 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-60">
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCountry(null);
                        setIsCountryDropdownOpen(false);
                        setCitySearchQuery("");
                        setSelectedCity(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                    >
                      Tous les pays
                    </button>
                  </div>
                  {filteredCountries.map((country) => (
                    <div key={country} className="p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsCountryDropdownOpen(false);
                          setCountrySearchQuery("");
                        }}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm ${
                          selectedCountry === country ? "bg-blue-50 font-medium" : ""
                        }`}
                      >
                        {country}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ville Dropdown */}
        <div className="flex-1 min-w-[150px] relative city-dropdown">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Ville
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                if (selectedCountry) {
                  setIsCityDropdownOpen(!isCityDropdownOpen);
                  setIsStatusDropdownOpen(false);
                  setIsTypeDropdownOpen(false);
                  setIsCountryDropdownOpen(false);
                }
              }}
              disabled={!selectedCountry}
              className="w-full h-10 pl-3 pr-8 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-700"
            >
              <span className="block truncate">
                {selectedCity || citySearchQuery || (selectedCountry ? "Toutes les villes" : "Toutes les villes")}
              </span>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </button>

            {isCityDropdownOpen && selectedCountry && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher..."
                      value={citySearchQuery}
                      onChange={(e) => {
                        setCitySearchQuery(e.target.value);
                        setSelectedCity(null);
                      }}
                      className="pl-8 h-8 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-60">
                  {filteredCities.length > 0 ? (
                    <div className="p-2">
                      {filteredCities.map((city, index) => (
                        <button
                          key={`${city}-${index}`}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city);
                            setIsCityDropdownOpen(false);
                            setCitySearchQuery("");
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Aucune ville trouvée
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Filter - Range Slider */}
        <div className="flex-1 min-w-[250px] max-w-[400px]">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">
            Prix
          </label>
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
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
        </div>
      </div>
    </>
  );
}

