"use client";

import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCardResult from "../components/PropertyCardResult";
import NoPropertiesFound from "./_components/noPropertiesFound";
import PropertiesMapView from "../components/PropertiesMapView";
import ViewToggle from "../components/ViewToggle";
import BackToTop from "../components/BackToTop";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";

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
    };
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

interface ResultPageClientProps {
  properties: Property[];
  totalPages: number;
  currentPage: number;
  locale: string;
}

const ResultPageClient: React.FC<ResultPageClientProps> = ({
  properties,
  totalPages,
  currentPage,
  locale,
}) => {
  const [view, setView] = useState<"list" | "map">("list");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("ResultPage");

  // Get current status filter - check both ID and code
  const currentStatusParam = searchParams?.get("queryStatus") || "";
  const [currentStatusCode, setCurrentStatusCode] = React.useState<string>("");
  const [statuses, setStatuses] = React.useState<Array<{ id: number; code: string; value: string }>>([]);

  // Fetch statuses on mount to determine current filter
  React.useEffect(() => {
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
    // Use replace to update URL without redirecting away from result page
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t("title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {properties.length} {t("propertiesFound")}
              </p>
            </div>
            {properties.length > 0 && (
              <ViewToggle view={view} onViewChange={setView} />
            )}
          </div>

          {/* Acheter/Louer Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={currentStatusCode === "" ? "default" : "outline"}
              onClick={() => handleStatusFilter("all")}
              className="flex-1 sm:flex-none"
            >
              {t("all")}
            </Button>
            <Button
              variant={currentStatusCode === "for_sale" ? "default" : "outline"}
              onClick={() => handleStatusFilter("for_sale")}
              className="flex-1 sm:flex-none"
            >
              {t("buy")}
            </Button>
            <Button
              variant={currentStatusCode === "for_rent" ? "default" : "outline"}
              onClick={() => handleStatusFilter("for_rent")}
              className="flex-1 sm:flex-none"
            >
              {t("rent")}
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Search />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

export default ResultPageClient;

