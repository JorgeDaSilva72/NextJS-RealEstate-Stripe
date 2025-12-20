"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Pencil, 
  Trash2, 
  Calendar, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { isUserDiamant } from "@/lib/actions/user";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

interface Property {
  id: number;
  name: any;
  price: number;
  currency: string;
  images: Array<{ url: string; isMain: boolean }>;
  type: { value: string };
  status: { value: string };
  location?: {
    city?: {
      translations?: Array<{ name: string }>;
    };
    streetAddress?: string;
  };
  feature?: {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };
  appointments?: Array<any>;
}

interface PropertiesGridProps {
  properties: Property[];
  totalPages: number;
  currentPage: number;
}

export default function PropertiesGrid({ 
  properties, 
  totalPages, 
  currentPage 
}: PropertiesGridProps) {
  const [mounted, setMounted] = useState(false);
  const [isDiamant, setIsDiamant] = useState(false);
  
  // Only use hooks after component is mounted (client-side only)
  const locale = useLocale();
  const t = useTranslations("PropertiesTable");
  const router = useRouter();
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    (async () => {
      if (user?.id) {
        try {
          const userFound = await isUserDiamant(undefined, user?.id);
          setIsDiamant(userFound);
        } catch (error) {
          console.error("Error checking user diamant status:", error);
        }
      }
    })();
  }, [user?.id, mounted]);

  const getLocalizedText = (field: any, locale: string = 'fr'): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (typeof field === 'object') {
      return field[locale] || field.fr || field.en || field.ar || field.pt || '';
    }
    return String(field);
  };

  const formatPrice = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyImage = (property: Property) => {
    const mainImage = property.images?.find(img => img.isMain);
    return mainImage?.url || property.images?.[0]?.url || '/Hero1.jpg';
  };

  const getCityName = (property: Property) => {
    return property.location?.city?.translations?.[0]?.name || 
           property.location?.streetAddress || 
           'Location';
  };

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <MapPin className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t("noProperties") || "Aucune propriété"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          {t("noPropertiesDescription") || "Vous n'avez pas encore ajouté de propriétés. Commencez par ajouter votre première annonce."}
        </p>
        <Button asChild>
          <Link href="/user/properties/add">
            {t("addFirstProperty") || "Ajouter ma première propriété"}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("myProperties") || "Mes Propriétés"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {properties.length} {properties.length === 1 ? t("property") : t("properties")}
          </p>
        </div>
        <Button asChild>
          <Link href="/user/properties/add">
            {t("addProperty") || "+ Ajouter une propriété"}
          </Link>
        </Button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => {
          const propertyName = getLocalizedText(property.name, locale);
          const cityName = getCityName(property);
          const imageUrl = getPropertyImage(property);
          const pendingAppointments = property.appointments?.length || 0;

          return (
            <Card
              key={property.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                <Image
                  src={imageUrl}
                  alt={propertyName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/90 text-gray-900 backdrop-blur-sm"
                  >
                    {property.status?.value || 'Active'}
                  </Badge>
                </div>
                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-500/90 text-white backdrop-blur-sm"
                  >
                    {property.type?.value || 'Type'}
                  </Badge>
                </div>
                {/* Actions Dropdown */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/property/${property.id}`} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          {t("details") || "Détails"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/user/properties/${property.id}/edit`} className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          {t("edit") || "Modifier"}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          href={`/user/properties/${property.id}/delete`} 
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("delete") || "Supprimer"}
                        </Link>
                      </DropdownMenuItem>
                      {isDiamant && (
                        <DropdownMenuItem asChild>
                          <Link 
                            href={`/user/properties/${property.id}/appointment`} 
                            className="flex items-center gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            {t("appointment") || "Rendez-vous"}
                            {pendingAppointments > 0 && (
                              <Badge variant="destructive" className="ml-auto">
                                {pendingAppointments}
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-4">
                {/* Price */}
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(property.price, property.currency)}
                  </h3>
                </div>

                {/* Title */}
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {propertyName}
                </h4>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="line-clamp-1">{cityName}</span>
                </div>

                {/* Features */}
                {property.feature && (
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-3 border-t">
                    {property.feature.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{property.feature.bedrooms}</span>
                      </div>
                    )}
                    {property.feature.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{property.feature.bathrooms}</span>
                      </div>
                    )}
                    {property.feature.area && (
                      <div className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        <span>{property.feature.area} m²</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/property/${property.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      {t("view") || "Voir"}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/user/properties/${property.id}/edit`}>
                      <Pencil className="h-4 w-4 mr-1" />
                      {t("edit") || "Modifier"}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => router.push(`/user/properties?pagenum=${currentPage - 1}`)}
          >
            Précédent
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => router.push(`/user/properties?pagenum=${page}`)}
                className="w-10"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => router.push(`/user/properties?pagenum=${currentPage + 1}`)}
          >
            Suivant
          </Button>
        </div>
      )}
    </div>
  );
}

