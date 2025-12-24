"use client";

import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useFavorites, FavoriteProperty } from "../../hooks/useFavorites";
import PropertyCardResult from "../../components/PropertyCardResult";
import NoPropertiesFound from "../../result/_components/noPropertiesFound";
import { Heart } from "lucide-react";

export default function FavoritePropertiesPage() {
  const locale = useLocale();
  const { favorites, isLoading, removeFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert favorites to property card format
  const properties = favorites.map((fav) => ({
    id: fav.id,
    name: fav.name,
    description: undefined,
    price: fav.price,
    currency: fav.currency,
    images: [{ url: fav.imageUrl, isMain: true }],
    location: fav.city || fav.country
      ? {
          city: {
            id: 0,
            countryId: 0,
            translations: fav.city ? [{ name: fav.city }] : [],
            country: fav.country
              ? {
                  id: 0,
                  translations: [{ name: fav.country }],
                }
              : undefined,
          },
        }
      : null,
    feature: fav.area
      ? {
          area: fav.area,
          bedrooms: null,
          bathrooms: null,
          parkingSpots: null,
          hasSwimmingPool: null,
          hasGardenYard: null,
          hasBalcony: null,
        }
      : null,
    status: fav.status ? { code: fav.status === "À Vendre" ? "for_sale" : "for_rent" } : null,
    type: fav.type ? { code: fav.type.toLowerCase().replace(" ", "_") } : null,
    isFeatured: false,
    createdAt: fav.addedAt,
    contact: null,
  }));

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-600 fill-red-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Mes Favoris
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {favorites.length} {favorites.length === 1 ? "propriété sauvegardée" : "propriétés sauvegardées"}
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCardResult
                key={property.id}
                property={property}
                locale={locale}
                showContactButtons={false}
              />
            ))}
          </div>
        ) : (
          <NoPropertiesFound />
        )}
      </div>
    </div>
  );
}
