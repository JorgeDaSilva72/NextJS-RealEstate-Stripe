"use client";

import React, { useState, useCallback } from "react";
import PropertyFilterForm from "../components/PropertyFilterForm";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCardResult from "../components/PropertyCardResult";
import NoPropertiesFound from "../result/_components/noPropertiesFound";
import PropertiesMapView from "../components/PropertiesMapView";
import ViewToggle from "../components/ViewToggle";
import BackToTop from "../components/BackToTop";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    neighborhood?: string | null;
    streetAddress?: string | null;
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
    hasSwimmingPool?: boolean | null;
    hasGardenYard?: boolean | null;
    hasBalcony?: boolean | null;
  } | null;
  status: { code: string } | null;
  type: { code: string } | null;
  contact?: {
    phone?: string;
    email?: string;
    name?: string;
  } | null;
}

interface BuyPageClientProps {
  properties: Property[];
  totalPages: number;
  currentPage: number;
  totalProperties: number;
  locale: string;
}

const BuyPageClient: React.FC<BuyPageClientProps> = ({
  properties,
  totalPages,
  currentPage,
  totalProperties,
  locale,
}) => {
  const t = useTranslations("BuyPage");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filterKey, setFilterKey] = useState(0);

  const handleFilterChange = useCallback(() => {
    // Force re-render when filters change
    setFilterKey((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("title")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {totalProperties} {t("propertiesAvailable")}
                </p>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {t("forSale")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div className="mb-8" key={filterKey}>
          <PropertyFilterForm statusFilter="for_sale" onFilterChange={handleFilterChange} />
        </div>

        {/* View Toggle */}
        <div className="mb-6 flex justify-end">
          <ViewToggle view={viewMode} onViewChange={setViewMode} />
        </div>

        {/* Properties Section */}
        {properties.length > 0 ? (
          viewMode === "list" ? (
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
            <PropertiesMapView properties={properties} locale={locale} />
          )
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <NoPropertiesFound />
            </CardContent>
          </Card>
        )}

        <BackToTop />
      </div>
    </div>
  );
};

export default BuyPageClient;

