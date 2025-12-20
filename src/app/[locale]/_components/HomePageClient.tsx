"use client";

import { useState, useMemo } from "react";
import PropertyCard from "../components/PropertyCard";
import PropertyDialog from "../components/PropertyDialog";
import { Card } from "@/components/ui/card";
import Map from "@/components/ui/Map";

interface Property {
  id: number;
  name: any; // JSON field
  price: number;
  currency: string;
  images: Array<{ url: string; isMain: boolean }>;
  location: {
    city: {
      translations: Array<{ name: string }>;
    };
  } | null;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface HomePageClientProps {
  properties: Property[];
  locale: string;
}

export default function HomePageClient({ properties, locale }: HomePageClientProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDialogOpen(true);
  };

  // Helper to get localized text from JSON field
  const getLocalizedText = (field: any, locale: string): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return field[locale] || field.fr || field.en || Object.values(field)[0] || "";
    }
    return String(field);
  };

  // Prepare properties for Map component
  const mapProperties = useMemo(() => {
    return properties
      .filter((prop) => prop.coordinates)
      .map((prop) => ({
        id: prop.id.toString(),
        coordinates: prop.coordinates!,
        title: getLocalizedText(prop.name, locale),
      }));
  }, [properties, locale]);

  // Prepare properties for display
  const displayProperties = useMemo(() => {
    return properties.map((prop) => ({
      id: prop.id.toString(),
      title: getLocalizedText(prop.name, locale),
      price: prop.price,
      currency: prop.currency || "EUR",
      image: prop.images?.[0]?.url || "/Hero1.jpg",
      location: {
        city: prop.location?.city?.translations?.[0]?.name || "Unknown",
        country: "Morocco", // You might want to get this from the property
      },
    }));
  }, [properties, locale]);

  return (
    <>
      {/* Main Content - Map and Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Map */}
          <div className="order-2 lg:order-1">
            <Card className="h-[600px] lg:h-[800px] overflow-hidden p-0">
              <div className="relative w-full h-full">
                <Map
                  properties={mapProperties}
                  defaultCenter={{ lat: 33.5731, lng: -7.5898 }} // Casablanca, Morocco
                  defaultZoom={7}
                  onMarkerClick={(property) => {
                    const fullProperty = properties.find(
                      (p) => p.id.toString() === property.id
                    );
                    if (fullProperty) {
                      handlePropertyClick(fullProperty);
                    }
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Right Side - Property Grid */}
          <div className="order-1 lg:order-2">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Propriétés disponibles
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {displayProperties.length} {displayProperties.length === 1 ? "propriété trouvée" : "propriétés trouvées"}
              </p>
            </div>
            {displayProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => {
                      const fullProperty = properties.find(
                        (p) => p.id.toString() === property.id
                      );
                      if (fullProperty) {
                        handlePropertyClick(fullProperty);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  Aucune propriété disponible
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                  Revenez plus tard pour découvrir nos nouvelles annonces
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Property Dialog */}
      {selectedProperty && (
        <PropertyDialog
          property={{
            id: selectedProperty.id.toString(),
            title: getLocalizedText(selectedProperty.name, locale),
            price: selectedProperty.price,
            location: {
              city: selectedProperty.location?.city?.translations?.[0]?.name || "Unknown",
              country: "Morocco",
            },
            image: selectedProperty.images?.[0]?.url || "/Hero1.jpg",
            characteristics: {
              bedrooms: 0,
              bathrooms: 0,
              rooms: 0,
              area: 0,
            },
            description: "",
            coordinates: selectedProperty.coordinates,
          }}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}




