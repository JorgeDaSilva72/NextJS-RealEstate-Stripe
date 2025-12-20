"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button, Card, Input, Textarea, cn } from "@nextui-org/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { useTranslations, useLocale } from "next-intl";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps/config";

// Définition de la structure des options traduites
interface TranslatedClientItem {
  id: number;
  code: string;
  name: string;
  countryId?: number; // Optional countryId if available from API
}

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
  countries: TranslatedClientItem[];
  cities: TranslatedClientItem[];
}

const Location = (props: Props) => {
  const t = useTranslations("PropertyForm.Location");
  const locale = useLocale();
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
  } = useFormContext<AddPropertyInputType>();

  // Google Maps API loader
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Form values
  const watchedCityId = watch("location.cityId");
  const watchedStreetAddress = watch("location.streetAddress");
  const watchedLat = watch("location.latitude");
  const watchedLng = watch("location.longitude");

  // Local state
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [availableCities, setAvailableCities] = useState<TranslatedClientItem[]>(props.cities);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>(String(watchedCityId || ""));
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Default center (Casablanca, Morocco)
  const defaultCenter = { lat: 33.5731, lng: -7.5898 };
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(12);

  // Initialize Google Maps Places Autocomplete
  useEffect(() => {
    if (!isLoaded || !searchInputRef.current) return;

    const autocompleteInstance = new google.maps.places.Autocomplete(
      searchInputRef.current,
      {
        fields: ["address_components", "formatted_address", "geometry", "name"],
        types: ["address", "establishment"],
      }
    );

    autocompleteInstance.addListener("place_changed", () => {
      const place = autocompleteInstance.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error("No geometry available for selected place");
        return;
      }

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Update form values
      setValue("location.latitude", lat, { shouldValidate: true });
      setValue("location.longitude", lng, { shouldValidate: true });
      setValue("location.streetAddress", place.formatted_address || "", {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Update map center and marker
      setCenter({ lat, lng });
      setZoom(16);

        // Try to match city from address components
        if (place.address_components) {
          let cityName = "";
          let countryName = "";

          place.address_components.forEach((component) => {
            if (component.types.includes("locality") || component.types.includes("administrative_area_level_2")) {
              cityName = component.long_name;
            }
            if (component.types.includes("country")) {
              countryName = component.long_name;
            }
          });

          // Try to find matching city in our database
          if (cityName && availableCities.length > 0) {
            const matchedCity = availableCities.find(
              (city) => {
                const cityNameLower = cityName.toLowerCase();
                const dbCityNameLower = city.name.toLowerCase();
                return cityNameLower.includes(dbCityNameLower) || 
                       dbCityNameLower.includes(cityNameLower) ||
                       cityNameLower === dbCityNameLower;
              }
            );

            if (matchedCity) {
              setSelectedCityId(String(matchedCity.id));
              setValue("location.cityId", String(matchedCity.id), {
                shouldValidate: true,
                shouldDirty: true,
              });

              // Set countryId from city if available
              if (matchedCity.countryId) {
                setSelectedCountryId(String(matchedCity.countryId));
                setValue("location.countryId", String(matchedCity.countryId), {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }
            // Note: If no match found, user must manually select city from dropdown
            // This is acceptable as Google Maps city names may differ from our DB
          }
        }

      setSearchValue(place.formatted_address || "");
    });

    setAutocomplete(autocompleteInstance);

    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [isLoaded, setValue, availableCities, props.countries]);

  // Update marker position when center changes
  useEffect(() => {
    if (!map || !center) return;

    if (marker) {
      marker.setPosition(center);
    } else {
      const newMarker = new google.maps.Marker({
        position: center,
        map: map,
        draggable: true,
        title: "Emplacement de la propriété",
      });

      newMarker.addListener("dragend", () => {
        const position = newMarker.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();
          setCenter({ lat, lng });
          setValue("location.latitude", lat, { shouldValidate: true });
          setValue("location.longitude", lng, { shouldValidate: true });

          // Reverse geocode to get address
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              setValue("location.streetAddress", results[0].formatted_address, {
                shouldValidate: true,
                shouldDirty: true,
              });
              setSearchValue(results[0].formatted_address);
            }
          });
        }
      });

      setMarker(newMarker);
    }
  }, [map, center, setValue]);

  // Initialize map
  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  // Handle country selection - fetch cities for that country
  const handleCountryChange = async (countryId: string) => {
    setSelectedCountryId(countryId);
    setValue("location.countryId", countryId, { shouldValidate: true });
    setValue("location.cityId", "", { shouldValidate: true });
    setSelectedCityId("");

    if (!countryId) {
      setAvailableCities(props.cities);
      return;
    }

    setIsLoadingCities(true);
    try {
      const response = await fetch(
        `/api/searchCities?lang=${locale}&countryId=${countryId}`
      );
      if (response.ok) {
        const cities = await response.json();
        setAvailableCities(
          cities.map((city: { id: number; value: string; countryId?: number }) => ({
            id: city.id,
            code: "",
            name: city.value,
            countryId: city.countryId,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Handle city selection
  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setValue("location.cityId", cityId, { shouldValidate: true, shouldDirty: true });

    // Find city to get its countryId
    const city = availableCities.find((c) => String(c.id) === cityId);
    if (city && city.countryId) {
      // Automatically set countryId when city is selected
      setSelectedCountryId(String(city.countryId));
      setValue("location.countryId", String(city.countryId), {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  // Handle next button click
  const handleNext = async () => {
    const isValid = await trigger([
      "location.cityId",
      "location.streetAddress",
    ]);
    if (isValid) {
      props.next();
    } else {
      // Scroll to first error
      const firstError = Object.keys(errors.location || {})[0];
      if (firstError) {
        const element = document.querySelector(`[name="location.${firstError}"]`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  if (loadError) {
    return (
      <Card className={cn("p-6", props.className)}>
        <div className="text-center text-red-500">
          {t("googleMapsError") || "Erreur de chargement de Google Maps. Veuillez réessayer plus tard."}
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "p-4 grid grid-cols-1 gap-4",
        props.className
      )}
    >
      {/* Google Maps Search */}
      <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("searchAddress") || "Rechercher une adresse"}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={searchInputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("searchAddressPlaceholder") || "Tapez une adresse..."}
            className="w-full pl-10"
            disabled={!isLoaded}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {t("searchAddressHint") || "Recherchez une adresse ou cliquez/déplacez le marqueur sur la carte"}
        </p>
      </div>

      {/* Google Map */}
      {isLoaded && (
        <div className="col-span-1 md:col-span-2">
          <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={zoom}
              onLoad={onMapLoad}
              onClick={(e) => {
                if (e.latLng) {
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setCenter({ lat, lng });
                  setValue("location.latitude", lat, { shouldValidate: true });
                  setValue("location.longitude", lng, { shouldValidate: true });

                  // Reverse geocode
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK" && results && results[0]) {
                      setValue("location.streetAddress", results[0].formatted_address, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setSearchValue(results[0].formatted_address);
                    }
                  });
                }
              }}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {marker && <Marker position={center} draggable />}
            </GoogleMap>
          </div>
        </div>
      )}

      {/* Country Selection */}
      <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("country") || "Pays"} <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCountryId}
          onChange={(e) => handleCountryChange(e.target.value)}
          className={cn(
            "w-full p-3 border rounded-lg bg-gray-50 appearance-none",
            "focus:border-blue-500 focus:ring-blue-500",
            { "border-red-500": !!errors.location?.countryId }
          )}
        >
          <option value="">{t("chooseCountry") || "Choisir un pays"}</option>
          {props.countries.map((country) => (
            <option key={country.id} value={country.id.toString()}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.location?.countryId && (
          <p className="text-red-500 text-xs mt-1">
            {errors.location.countryId.message}
          </p>
        )}
      </div>

      {/* City Selection */}
      <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("city") || "Ville"} <span className="text-red-500">*</span>
        </label>
        <select
          {...register("location.cityId", {
            setValueAs: (v) => (v === "" ? "" : String(v).trim()),
          })}
          value={selectedCityId}
          onChange={(e) => handleCityChange(e.target.value)}
          disabled={!selectedCountryId && availableCities.length === 0}
          className={cn(
            "w-full p-3 border rounded-lg bg-gray-50 appearance-none",
            "focus:border-blue-500 focus:ring-blue-500",
            {
              "border-red-500": !!errors.location?.cityId,
              "opacity-50 cursor-not-allowed": !selectedCountryId && availableCities.length === 0,
            }
          )}
          name="location.cityId"
        >
          <option value="" disabled>
            {isLoadingCities
              ? t("loading") || "Chargement..."
              : selectedCountryId
              ? t("chooseCity") || "Choisir une ville"
              : t("selectCountryFirst") || "Sélectionnez d'abord un pays"}
          </option>
          {availableCities.map((city) => (
            <option key={city.id} value={city.id.toString()}>
              {city.name}
            </option>
          ))}
        </select>
        {errors.location?.cityId && (
          <p className="text-red-500 text-xs mt-1">
            {errors.location.cityId.message}
          </p>
        )}
      </div>

      {/* Street Address */}
      <div className="col-span-1 md:col-span-2">
        <Input
          {...register("location.streetAddress", {
            setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
          })}
          label={t("address") || "Adresse"}
          placeholder={t("streetAddressPlaceholder") || "Adresse complète"}
          errorMessage={errors.location?.streetAddress?.message}
          isInvalid={!!errors.location?.streetAddress}
        />
      </div>

      {/* ZIP Code */}
      <div className="col-span-1">
        <Input
          {...register("location.zip", {
            setValueAs: (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined),
          })}
          label={t("zipCode") || "Code postal"}
          errorMessage={errors.location?.zip?.message}
          isInvalid={!!errors.location?.zip}
        />
      </div>

      {/* Landmark / Additional Info */}
      <div className="col-span-1 md:col-span-2">
        <Textarea
          {...register("location.landmark", {
            setValueAs: (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined),
          })}
          label={t("additionalInfo") || "Informations complémentaires"}
          errorMessage={errors.location?.landmark?.message}
          isInvalid={!!errors.location?.landmark}
          minRows={3}
          placeholder={t("landmarkPlaceholder") || "Points de repère, instructions spéciales..."}
        />
      </div>

      {/* Hidden fields for coordinates */}
      <input
        type="hidden"
        {...register("location.latitude", {
          setValueAs: (v) => {
            const num = Number(v);
            return isNaN(num) ? undefined : num;
          },
        })}
      />
      <input
        type="hidden"
        {...register("location.longitude", {
          setValueAs: (v) => {
            const num = Number(v);
            return isNaN(num) ? undefined : num;
          },
        })}
      />

      {/* Navigation Buttons */}
      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-4 mt-4">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          {t("previous") || "Précédent"}
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          {t("next") || "Suivant"}
        </Button>
      </div>
    </Card>
  );
};

export default Location;
