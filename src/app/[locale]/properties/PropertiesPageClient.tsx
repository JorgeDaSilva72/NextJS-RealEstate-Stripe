"use client";

import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCardResult from "../components/PropertyCardResult";
import NoPropertiesFound from "../result/_components/noPropertiesFound";
import PropertiesMapView from "../components/PropertiesMapView";
import ViewToggle from "../components/ViewToggle";
import BackToTop from "../components/BackToTop";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "@/i18n/routing";

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
    } | null;
  } | null;
  feature: {
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    parkingSpots: number | null;
  } | null;
  status: { code: string } | null;
  type: { code: string } | null;
  contact?: {
    phone?: string;
    email?: string;
    name?: string;
  } | null;
}

interface PropertiesPageClientProps {
  properties: Property[];
  totalPages: number;
  currentPage: number;
  totalProperties: number;
  locale: string;
}

const PropertiesPageClient: React.FC<PropertiesPageClientProps> = ({
  properties,
  totalPages,
  currentPage,
  totalProperties,
  locale,
}) => {
  const [view, setView] = useState<"list" | "map">("list");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current status filter - check both ID and code
  const currentStatusParam = searchParams?.get("queryStatus") || "";
  const [currentStatusCode, setCurrentStatusCode] = useState<string>("");
  const [statuses, setStatuses] = useState<Array<{ id: number; code: string; value: string }>>([]);

  // Fetch statuses on mount to determine current filter
  useEffect(() => {
    fetch(`/api/searchStatuses?lang=${locale}`)
      .then((res) => res.json())
      .then((data) => {
        setStatuses(data);
        if (currentStatusParam) {
          const status = data.find((s: any) => s.id.toString() === currentStatusParam);
          if (status) {
            setCurrentStatusCode(status.code);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching statuses:", error);
      });
  }, [locale, currentStatusParam]);

  // Handle Acheter/Louer filter
  const handleStatusFilter = (statusCode: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (statusCode === "all") {
      params.delete("queryStatus");
      setCurrentStatusCode("");
    } else {
      const status = statuses.find((s) => s.code === statusCode);
      if (status) {
        params.set("queryStatus", status.id.toString());
        setCurrentStatusCode(statusCode);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {locale === "fr" ? "Toutes les Propriétés" : "All Properties"}
              </h1>
              <p className="text-gray-600">
                {totalProperties} {locale === "fr" ? "propriétés trouvées" : "properties found"}
              </p>
            </div>
            <ViewToggle view={view} onViewChange={setView} />
          </div>

          {/* Acheter/Louer Filter Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={currentStatusCode === "" ? "default" : "outline"}
              onClick={() => handleStatusFilter("all")}
              className="flex-1"
            >
              {locale === "fr" ? "Tous" : "All"}
            </Button>
            <Button
              variant={currentStatusCode === "for_sale" ? "default" : "outline"}
              onClick={() => handleStatusFilter("for_sale")}
              className="flex-1"
            >
              {locale === "fr" ? "Acheter" : "Buy"}
            </Button>
            <Button
              variant={currentStatusCode === "for_rent" ? "default" : "outline"}
              onClick={() => handleStatusFilter("for_rent")}
              className="flex-1"
            >
              {locale === "fr" ? "Louer" : "Rent"}
            </Button>
          </div>
        </div>
        <Search />
        {properties.length > 0 ? (
          <>
            {view === "list" ? (
              <PropertyContainer totalPages={totalPages} currentPage={currentPage}>
                {properties.map((propertyItem) => (
                  <PropertyCardResult
                    property={propertyItem}
                    key={propertyItem.id}
                    locale={locale}
                    showContactButtons={true}
                  />
                ))}
              </PropertyContainer>
            ) : (
              <div className="mt-6">
                <PropertiesMapView
                  properties={properties}
                  locale={locale}
                />
              </div>
            )}
          </>
        ) : (
          <NoPropertiesFound />
        )}
        <BackToTop />
      </div>
    </div>
  );
};

export default PropertiesPageClient;

