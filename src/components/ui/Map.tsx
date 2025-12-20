"use client";

import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { AlertCircle } from "lucide-react";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps/config";

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google?: {
      maps?: any;
      marker?: {
        AdvancedMarkerElement?: any;
        PinElement?: any;
      };
    };
  }
}

interface Property {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  title?: string;
}

interface MapProps {
  properties: Property[];
  onMarkerClick?: (property: Property) => void;
  defaultCenter?: { lat: number; lng: number };
  defaultZoom?: number;
}

const Map: React.FC<MapProps> = ({
  properties,
  onMarkerClick,
  defaultCenter,
  defaultZoom = 7,
}) => {
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP LEVEL
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Hook 1: useJsApiLoader - must be called unconditionally
  // Using shared GOOGLE_MAPS_LIBRARIES to ensure consistent configuration across all components
  const { isLoaded, loadError: jsLoadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Hook 2: useState - must be called unconditionally
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  const [useAdvancedMarkers, setUseAdvancedMarkers] = useState(false);

  // Hook 3: useRef - must be called unconditionally (using object instead of Map to avoid constructor error)
  const advancedMarkersRef = useRef<{ [key: string]: any }>({});

  // Hook 4: useMemo - must be called unconditionally
  const center = useMemo(() => {
    if (defaultCenter) return defaultCenter;
    
    if (properties.length === 0) {
      return { lat: 33.5731, lng: -7.5898 }; // Casablanca, Morocco
    }

    const avgLat =
      properties.reduce((sum, prop) => sum + prop.coordinates.lat, 0) /
      properties.length;
    const avgLng =
      properties.reduce((sum, prop) => sum + prop.coordinates.lng, 0) /
      properties.length;

    return { lat: avgLat, lng: avgLng };
  }, [properties, defaultCenter]);

  const mapContainerStyle: React.CSSProperties = useMemo(
    () => ({
      width: "100%",
      height: "100%",
      borderRadius: "0.5rem",
    }),
    []
  );

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
    }),
    []
  );

  // Hook 5: useCallback - must be called unconditionally
  const handleMarkerClick = useCallback(
    (property: Property) => {
      onMarkerClick?.(property);
    },
    [onMarkerClick]
  );

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log("[Map Component] Google Maps loaded successfully");
    console.log("[Map Component] Rendering", properties.length, "markers");
    setMapInstance(map);
  }, [properties.length]);

  // Hook 6: useEffect - must be called unconditionally
  // Debug logging
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    console.log("[Map Component] Properties received:", properties.length);
    properties.forEach((prop, index) => {
      console.log(`[Map Component] Marker ${index + 1}:`, {
        id: prop.id,
        title: prop.title,
        lat: prop.coordinates.lat,
        lng: prop.coordinates.lng,
      });
    });
  }, [properties]);

  // Check if AdvancedMarkerElement is available
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    if (
      window.google?.maps &&
      window.google.marker?.AdvancedMarkerElement
    ) {
      setUseAdvancedMarkers(true);
      console.log("[Map Component] AdvancedMarkerElement available - using new API");
    } else {
      console.log("[Map Component] Using legacy Marker API");
    }
  }, [isLoaded]);

  // Handle load errors
  useEffect(() => {
    if (jsLoadError) {
      const errorMessage = jsLoadError.message || "";
      if (
        errorMessage.includes("RefererNotAllowedMapError") ||
        errorMessage.includes("referer-not-allowed")
      ) {
        setLoadError("REFERER_NOT_ALLOWED");
      } else if (errorMessage.includes("ApiNotActivatedMapError")) {
        setLoadError("API_NOT_ACTIVATED");
      } else if (errorMessage.includes("InvalidKeyMapError")) {
        setLoadError("INVALID_KEY");
      } else {
        setLoadError("UNKNOWN_ERROR");
      }
    }
  }, [jsLoadError]);

  // Create AdvancedMarkerElement markers
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !isLoaded ||
      !useAdvancedMarkers ||
      !mapInstance ||
      !window.google?.marker?.AdvancedMarkerElement
    ) {
      return;
    }

    const { AdvancedMarkerElement } = window.google.marker;

    // Clean up existing markers
    Object.values(advancedMarkersRef.current).forEach((marker) => {
      if (marker && marker.map) {
        marker.map = null;
      }
    });
    advancedMarkersRef.current = {};

    // Create new AdvancedMarkerElement markers
    properties.forEach((property) => {
      if (
        !property.coordinates ||
        typeof property.coordinates.lat !== "number" ||
        typeof property.coordinates.lng !== "number"
      ) {
        console.warn(
          `[Map Component] Invalid coordinates for property ${property.id}:`,
          property.coordinates
        );
        return;
      }

      try {
        const position = {
          lat: property.coordinates.lat,
          lng: property.coordinates.lng,
        };

        const marker = new AdvancedMarkerElement({
          map: mapInstance,
          position: position,
          title: property.title || `Property ${property.id}`,
        });

        marker.addListener("click", () => {
          console.log("[Map Component] AdvancedMarker clicked:", property.title);
          handleMarkerClick(property);
        });

        advancedMarkersRef.current[property.id] = marker;
      } catch (error) {
        console.error(`[Map Component] Error creating marker for property ${property.id}:`, error);
      }
    });

    return () => {
      Object.values(advancedMarkersRef.current).forEach((marker) => {
        if (marker && marker.map) {
          marker.map = null;
        }
      });
      advancedMarkersRef.current = {};
    };
  }, [properties, useAdvancedMarkers, mapInstance, handleMarkerClick, isLoaded]);

  // NOW WE CAN DO CONDITIONAL RENDERING - All hooks have been called
  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-medium text-lg mb-2">
            Google Maps API key is missing
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    const errorMessages = {
      REFERER_NOT_ALLOWED: {
        title: "Referrer Not Allowed",
        message: "Your API key needs to allow requests from this domain.",
        instructions: (
          <div className="mt-4 text-left text-sm space-y-2">
            <p className="font-semibold">Fix this issue:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to Google Cloud Console</li>
              <li>Navigate to APIs & Services → Credentials</li>
              <li>Edit your API key</li>
              <li>Under "Application restrictions", select "HTTP referrers"</li>
              <li>Add: <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">http://localhost:3000/*</code></li>
              <li>Save and wait 1-2 minutes</li>
            </ol>
            <p className="mt-3 text-xs text-gray-500">
              See GOOGLE_MAPS_API_SETUP.md for detailed instructions
            </p>
          </div>
        ),
      },
      API_NOT_ACTIVATED: {
        title: "API Not Activated",
        message: "Maps JavaScript API is not enabled for this project.",
        instructions: (
          <div className="mt-4 text-left text-sm">
            <p>Enable the Maps JavaScript API in Google Cloud Console:</p>
            <p className="mt-2">APIs & Services → Library → Maps JavaScript API → Enable</p>
          </div>
        ),
      },
      INVALID_KEY: {
        title: "Invalid API Key",
        message: "The provided API key is invalid or has been deleted.",
        instructions: (
          <div className="mt-4 text-left text-sm">
            <p>Please check your API key in .env.local and Google Cloud Console.</p>
          </div>
        ),
      },
      UNKNOWN_ERROR: {
        title: "Loading Error",
        message: "Failed to load Google Maps. Please check your browser console for details.",
        instructions: (
          <div className="mt-4 text-left text-sm">
            <p>Try disabling ad blockers or browser extensions that might block Google Maps.</p>
          </div>
        ),
      },
    };

    const errorInfo = errorMessages[loadError as keyof typeof errorMessages] || errorMessages.UNKNOWN_ERROR;

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
        <div className="text-center p-6 max-w-lg">
          <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-orange-600 dark:text-orange-400 font-medium text-lg mb-2">
            {errorInfo.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {errorInfo.message}
          </p>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg mt-4">
            {errorInfo.instructions}
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  // Render the map - all hooks have been called unconditionally
  return (
    <div className="relative w-full h-full">
      {/* Marker count indicator for testing */}
      {properties.length > 0 && (
        <div className="absolute top-2 right-2 z-20 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {properties.length} {properties.length === 1 ? "property" : "properties"}
          </p>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={defaultZoom}
        options={mapOptions}
        onLoad={handleMapLoad}
      >
        {/* Use legacy Marker component if AdvancedMarkerElement is not available */}
        {!useAdvancedMarkers && properties.length > 0 && (
          properties.map((property) => {
            // Validate coordinates
            if (
              !property.coordinates ||
              typeof property.coordinates.lat !== "number" ||
              typeof property.coordinates.lng !== "number"
            ) {
              console.warn(
                `[Map Component] Invalid coordinates for property ${property.id}:`,
                property.coordinates
              );
              return null;
            }

            return (
              <Marker
                key={property.id}
                position={property.coordinates}
                onClick={() => {
                  console.log("[Map Component] Marker clicked:", property.title);
                  handleMarkerClick(property);
                }}
                title={property.title || `Property ${property.id}`}
              />
            );
          })
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
