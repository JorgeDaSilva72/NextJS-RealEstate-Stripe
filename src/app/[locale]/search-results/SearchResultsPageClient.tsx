"use client";

import React, { useState } from "react";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCardResult from "../components/PropertyCardResult";
import NoPropertiesFound from "../result/_components/noPropertiesFound";
import PropertiesMapView from "../components/PropertiesMapView";
import ViewToggle from "../components/ViewToggle";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface Property {
  id: number;
  name: any;
  description?: any;
  price: number;
  currency: string;
  images: Array<{ url: string; isMain: boolean }>;
  location: {
    latitude: number | null;
    longitude: number | null;
    city: {
      id: number;
      countryId: number;
      translations: Array<{ name: string }>;
      country?: {
        id: number;
        translations: Array<{ name: string }>;
      };
    } | null;
  } | null;
  feature: {
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    parkingSpots: number | null;
    hasSwimmingPool?: boolean | null;
    hasGardenYard?: boolean | null;
    hasBalcony?: boolean | null;
  } | null;
  status: { code: string } | null;
  type: { code: string } | null;
  isFeatured?: boolean;
  createdAt?: Date | string;
  contact?: {
    phone?: string;
    email?: string;
    name?: string;
  } | null;
}

interface SearchResultsPageClientProps {
  properties: Property[];
  totalPages: number;
  currentPage: number;
  totalProperties: number;
  locale: string;
}

const SearchResultsPageClient: React.FC<SearchResultsPageClientProps> = ({
  properties,
  totalPages,
  currentPage,
  totalProperties,
  locale,
}) => {
  const [view, setView] = useState<"list" | "map">("list");
  const [savedSearches, setSavedSearches] = useState<string[]>([]);

  const handleSaveSearch = () => {
    const currentUrl = window.location.href;
    const searches = JSON.parse(localStorage.getItem("savedSearches") || "[]");
    if (!searches.includes(currentUrl)) {
      searches.push(currentUrl);
      localStorage.setItem("savedSearches", JSON.stringify(searches));
      setSavedSearches(searches);
      alert(locale === "fr" ? "Recherche enregistrée!" : "Search saved!");
    } else {
      alert(locale === "fr" ? "Cette recherche est déjà enregistrée" : "This search is already saved");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">{totalProperties}</span> résultat{totalProperties > 1 ? "s" : ""} trouvé{totalProperties > 1 ? "s" : ""}
            </p>
            {/* Sort Dropdown */}
            <div className="relative">
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Trier par: Ordre par défaut</option>
                <option>Prix: Croissant</option>
                <option>Prix: Décroissant</option>
                <option>Date: Plus récent</option>
                <option>Date: Plus ancien</option>
                <option>Surface: Croissant</option>
                <option>Surface: Décroissant</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            {properties.length > 0 && (
              <ViewToggle view={view} onViewChange={setView} />
            )}
            
            {/* Save Search Button */}
            <Button 
              onClick={handleSaveSearch}
              className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2"
            >
              <Bell className="h-4 w-4 mr-2" />
              Enregistrer la recherche
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {properties.length > 0 ? (
          <div className="mt-4">
            {view === "list" ? (
              <PropertyContainer
                totalPages={totalPages}
                currentPage={currentPage}
              >
                {properties.map((property) => (
                  <PropertyCardResult
                    key={property.id}
                    property={property}
                    locale={locale}
                    showContactButtons={true}
                  />
                ))}
              </PropertyContainer>
            ) : (
              <div className="w-full">
                <PropertiesMapView
                  properties={properties}
                  locale={locale}
                />
              </div>
            )}
          </div>
        ) : (
          <NoPropertiesFound />
        )}
      </div>
    </div>
  );
};

export default SearchResultsPageClient;

