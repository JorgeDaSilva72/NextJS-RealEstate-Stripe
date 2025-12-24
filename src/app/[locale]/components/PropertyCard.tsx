"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/data/mockProperties";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState(property.image || "/Hero1.jpg");

  const formatPrice = (price: number, currency: string = "EUR") => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency || "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc("/Hero1.jpg");
    }
  };

  // Validate and normalize image URL
  React.useEffect(() => {
    if (property.image) {
      // Check if URL is valid
      try {
        new URL(property.image);
        setImageSrc(property.image);
      } catch {
        // If not a valid URL, use default
        setImageSrc("/Hero1.jpg");
      }
    }
  }, [property.image]);

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 group"
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={imageSrc}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
          unoptimized={imageSrc.startsWith("http")}
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">
            {formatPrice(property.price, property.currency || "EUR")}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" />
          <span>
            {property.location.city}, {property.location.country}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
