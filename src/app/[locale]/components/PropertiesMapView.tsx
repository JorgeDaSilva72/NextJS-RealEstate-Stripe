"use client";

import React, { useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps/config";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, X } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

interface Property {
  id: number;
  name: any; // JSON object
  price: number;
  currency: string;
  images: Array<{ url: string; isMain: boolean }>;
  location: {
    latitude: number | null;
    longitude: number | null;
    city: {
      id: number;
      countryId?: number;
      translations: Array<{ name: string }>;
    } | null;
  } | null;
  feature: {
    bedrooms: number | null;
    bathrooms: number | null;
    area: number | null;
  } | null;
  coordinates?: { lat: number; lng: number } | null;
}

interface PropertiesMapViewProps {
  properties: Property[];
  locale: string;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const PropertiesMapView: React.FC<PropertiesMapViewProps> = ({
  properties,
  locale,
  defaultCenter,
  defaultZoom = 7,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // Filter properties with valid coordinates
  const propertiesWithCoords = useMemo(() => {
    return properties
      .map((prop) => {
        const lat = prop.location?.latitude
          ? Number(prop.location.latitude)
          : null;
        const lng = prop.location?.longitude
          ? Number(prop.location.longitude)
          : null;

        if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
          return {
            ...prop,
            coordinates: { lat, lng },
          };
        }
        return null;
      })
      .filter((prop): prop is NonNullable<typeof prop> => prop !== null);
  }, [properties]);

  // Calculate center from properties or use default
  const center = useMemo(() => {
    if (defaultCenter) return defaultCenter;

    if (propertiesWithCoords.length === 0) {
      return { lat: 14.4974, lng: -14.4524 }; // Default: Dakar, Senegal
    }

    const avgLat =
      propertiesWithCoords.reduce(
        (sum, prop) => sum + (prop.coordinates?.lat || 0),
        0
      ) / propertiesWithCoords.length;
    const avgLng =
      propertiesWithCoords.reduce(
        (sum, prop) => sum + (prop.coordinates?.lng || 0),
        0
      ) / propertiesWithCoords.length;

    return { lat: avgLat, lng: avgLng };
  }, [propertiesWithCoords, defaultCenter]);

  // Get property name
  const getPropertyName = (property: Property): string => {
    if (!property.name) return "";
    if (typeof property.name === "string") return property.name;
    if (typeof property.name === "object") {
      return (
        (property.name as any)[locale] ||
        property.name.fr ||
        property.name.en ||
        ""
      );
    }
    return String(property.name);
  };

  // Get city name
  const getCityName = (property: Property): string => {
    return property.location?.city?.translations?.[0]?.name || "";
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
  const getMainImage = (property: Property): string => {
    if (property.images && property.images.length > 0) {
      const mainImage =
        property.images.find((img) => img.isMain) || property.images[0];
      return mainImage?.url || "/Hero1.jpg";
    }
    return "/Hero1.jpg";
  };

  if (!apiKey) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-gray-600">Google Maps API key is missing</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
        <p className="text-red-600">Error loading map: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (propertiesWithCoords.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {locale === "fr"
              ? "Aucune propriété avec coordonnées disponibles"
              : "No properties with coordinates available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative rounded-lg overflow-hidden border border-gray-200 shadow-lg bg-gray-100">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={defaultZoom}
        onLoad={(map) => setMapInstance(map)}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          backgroundColor: "#f3f4f6",
          styles: [
            {
              featureType: "all",
              elementType: "geometry",
              stylers: [{ color: "#f3f4f6" }],
            },
          ],
        }}
      >
        {propertiesWithCoords.map((property) => {
          if (!property.coordinates) return null;

          return (
            <Marker
              key={property.id}
              position={property.coordinates}
              onClick={() => setSelectedProperty(property)}
              title={getPropertyName(property)}
            />
          );
        })}

        {selectedProperty && selectedProperty.coordinates && (
          <InfoWindow
            position={selectedProperty.coordinates}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="max-w-xs">
              <Link
                href={`/${locale}/property/${selectedProperty.id}`}
                className="block"
              >
                <Card className="border-0 shadow-none">
                  <div className="relative h-32 w-full mb-2 rounded overflow-hidden">
                    <Image
                      src={getMainImage(selectedProperty)}
                      alt={getPropertyName(selectedProperty)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <CardContent className="p-2">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">
                      {getPropertyName(selectedProperty)}
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-1">
                      {formatPrice(selectedProperty.price, selectedProperty.currency)}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      {getCityName(selectedProperty)}
                    </p>
                    {selectedProperty.feature && (
                      <div className="flex gap-2 text-xs text-gray-500">
                        {selectedProperty.feature.bedrooms !== null && (
                          <span>{selectedProperty.feature.bedrooms} ch.</span>
                        )}
                        {selectedProperty.feature.bathrooms !== null && (
                          <span>{selectedProperty.feature.bathrooms} sdb</span>
                        )}
                        {selectedProperty.feature.area !== null && (
                          <span>{selectedProperty.feature.area}m²</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default PropertiesMapView;

