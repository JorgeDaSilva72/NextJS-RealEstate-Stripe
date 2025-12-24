"use client";

import React from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Phone, Heart, Plus, Ruler, User, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import WhatsAppContactButton from "./WhatsAppContactButton";
import FavoriteButton from "./FavoriteButton";
import { useFavorites, FavoriteProperty } from "../hooks/useFavorites";

interface PropertyCardResultProps {
  property: {
    id: number;
    name: any; // JSON object {fr: string, en: string, ...}
    description?: any; // JSON object for description
    price: number;
    currency: string;
    images: Array<{ url: string; isMain: boolean }>;
    location: {
      latitude?: number | null;
      longitude?: number | null;
      neighborhood?: string | null;
      streetAddress?: string | null;
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
  };
  locale: string;
  showContactButtons?: boolean;
}

export default function PropertyCardResult({ property, locale, showContactButtons = true }: PropertyCardResultProps) {
  const router = useRouter();
  const [imageError, setImageError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string>("/Hero1.jpg");

  // Extract property name from JSON or string
  const getPropertyName = (): string => {
    if (!property.name) return "";
    if (typeof property.name === "string") return property.name;
    if (typeof property.name === "object") {
      return (property.name as any)[locale] || property.name.fr || property.name.en || "";
    }
    return String(property.name);
  };

  // Get city name
  const getCityName = (): string => {
    if (!property.location?.city?.translations?.[0]?.name) return "";
    return property.location.city.translations[0].name;
  };

  // Get country name
  const getCountryName = (): string => {
    if (!property.location?.city?.country?.translations?.[0]?.name) return "";
    return property.location.city.country.translations[0].name;
  };

  // Get description
  const getDescription = (): string => {
    if (!property.description) return "";
    if (typeof property.description === "string") return property.description;
    if (typeof property.description === "object") {
      return (property.description as any)[locale] || property.description.fr || property.description.en || "";
    }
    return String(property.description);
  };

  // Get status text
  const getStatusText = (): string => {
    if (!property.status) return "";
    const code = property.status.code;
    if (code === "for_sale" || code === "VENTE") return locale === "fr" ? "À Vendre" : "For Sale";
    if (code === "for_rent" || code === "LOCATION") return locale === "fr" ? "À Louer" : "For Rent";
    return code;
  };

  // Get type text
  const getTypeText = (): string => {
    if (!property.type) return "";
    const code = property.type.code;
    // Map common type codes to readable text
    const typeMap: Record<string, string> = {
      apartment: locale === "fr" ? "Appartement" : "Apartment",
      house: locale === "fr" ? "Maison" : "House",
      villa: locale === "fr" ? "Villa" : "Villa",
      studio: locale === "fr" ? "Studio" : "Studio",
    };
    return typeMap[code] || code;
  };

  // Calculate rooms (pièces) - typically bedrooms + 1 (living room)
  const getRooms = (): number | null => {
    if (property.feature?.bedrooms !== null && property.feature?.bedrooms !== undefined) {
      return property.feature.bedrooms + 1; // Add living room
    }
    return null;
  };

  // Format price
  const formatPrice = (price: number, currency: string = "XOF") => {
    try {
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: currency || "XOF",
        maximumFractionDigits: 0,
      }).format(price);
    } catch {
      return `${price} ${currency}`;
    }
  };

  // Get main image
  React.useEffect(() => {
    if (property.images && property.images.length > 0) {
      const mainImage = property.images.find((img) => img.isMain) || property.images[0];
      if (mainImage?.url) {
        try {
          // Validate and normalize URL
          let imageUrl = mainImage.url;
          
          // If it's a relative path, ensure it starts with /
          if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
            imageUrl = `/${imageUrl}`;
          }
          
          // If it's an external URL, use as is
          // If it's a relative path, use as is
          setImageSrc(imageUrl);
        } catch {
          setImageSrc("/Hero1.jpg");
        }
      } else {
        setImageSrc("/Hero1.jpg");
      }
    } else {
      setImageSrc("/Hero1.jpg");
    }
  }, [property.images]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc("/Hero1.jpg");
    }
  };

  const propertyName = getPropertyName();
  const cityName = getCityName();
  const countryName = getCountryName();
  const description = getDescription();
  const statusText = getStatusText();
  const typeText = getTypeText();
  const rooms = getRooms();
  const phoneNumber = property.contact?.phone;

  // Prepare property data for favorites
  const favoriteProperty: FavoriteProperty = {
    id: property.id,
    name: propertyName,
    price: property.price,
    currency: property.currency,
    imageUrl: imageSrc,
    city: cityName,
    country: countryName,
    status: statusText,
    type: typeText || undefined,
    area: property.feature?.area || undefined,
    addedAt: new Date().toISOString(),
  };

  // Format date posted
  const getDatePosted = () => {
    if (!property.createdAt) return "il y a 2 mois";
    
    try {
      const createdDate = typeof property.createdAt === 'string' 
        ? new Date(property.createdAt) 
        : property.createdAt;
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - createdDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 1) return "Aujourd'hui";
      if (diffDays === 1) return "il y a 1 jour";
      if (diffDays < 7) return `il y a ${diffDays} jours`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return weeks === 1 ? "il y a 1 semaine" : `il y a ${weeks} semaines`;
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return months === 1 ? "il y a 1 mois" : `il y a ${months} mois`;
      }
      const years = Math.floor(diffDays / 365);
      return years === 1 ? "il y a 1 an" : `il y a ${years} ans`;
    } catch {
      return "il y a 2 mois";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col border border-gray-200 bg-white">
      <Link href={`/${locale}/property/${property.id}`} className="block flex-1">
        <div className="relative h-64 w-full overflow-hidden bg-gray-200">
          <Image
            src={imageSrc}
            alt={propertyName || "Property"}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            onError={handleImageError}
            unoptimized={imageSrc.startsWith("http") || imageSrc.startsWith("data:")}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Labels on Image */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {/* Featured Badge */}
            {(property as any).isFeatured && (
              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                À LA UNE
              </span>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
            {/* Status Badge */}
            {property.status && (
              <div className="flex items-center gap-1">
                <span className="bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold">
                  {statusText}
                </span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  MISE À JOUR
                </span>
              </div>
            )}
          </div>
          
          {/* Price in bottom-left */}
          <div className="absolute bottom-2 left-2">
            <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded text-lg font-bold text-gray-900">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
          
          {/* Icons in bottom-right */}
          <div className="absolute bottom-2 right-2 flex gap-2">
            <FavoriteButton property={favoriteProperty} variant="icon" />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle add to list
              }}
              className="bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
            >
              <Plus className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
        
        <CardContent className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-base text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {propertyName || `${statusText} ${typeText ? typeText : ""}`}
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {cityName || "Ville non spécifiée"}
            </span>
          </div>
          
          {/* Property Details Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            {/* Area */}
            {property.feature && property.feature.area !== null && (
              <div className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span>{property.feature.area} m²</span>
              </div>
            )}
            
            {/* Type */}
            {typeText && (
              <span className="font-medium">{typeText.toUpperCase()}</span>
            )}
            
            {/* Agent */}
            {property.contact?.name && (
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{property.contact.name}</span>
              </div>
            )}
            
            {/* Date Posted */}
            <div className="flex items-center gap-1">
              <Paperclip className="h-4 w-4" />
              <span>{getDatePosted()}</span>
            </div>
          </div>
          
          {/* Details Button */}
          <div className="flex flex-col gap-2 mt-auto">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/${locale}/property/${property.id}`);
              }}
            >
              Détails
            </Button>
            {/* Favorite Button */}
            <FavoriteButton
              property={favoriteProperty}
              variant="button"
              showLabel={true}
              className="w-full"
            />
          </div>
        </CardContent>
      </Link>

      {/* Contact Buttons */}
      {showContactButtons && phoneNumber && (
        <div className="p-4 pt-0 border-t space-y-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/${locale}/property/${property.id}`);
              }}
            >
              {locale === "fr" ? "Contacter" : "Contact"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${phoneNumber}`;
              }}
            >
              <Phone className="h-4 w-4 mr-1" />
              {locale === "fr" ? "Appelez" : "Call"}
            </Button>
          </div>
          <WhatsAppContactButton
            phoneNumber={phoneNumber}
            propertyId={property.id}
            propertyName={propertyName}
            propertyPrice={formatPrice(property.price, property.currency)}
            propertyUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/property/${property.id}`}
            variant="button"
            size="sm"
            className="w-full"
            buttonType="contact_agent"
            requireGDPRConsent={false}
          />
        </div>
      )}
    </Card>
  );
}

