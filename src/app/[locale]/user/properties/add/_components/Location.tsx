"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { useTranslations, useLocale } from "next-intl";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps/config";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const methods = useFormContext<AddPropertyInputType>();
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
    watch,
    control,
  } = methods;

  // Suppress Google Maps deprecation warnings (they're just warnings, not errors)
  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args: any[]) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("google.maps.places.Autocomplete") ||
         args[0].includes("google.maps.Marker") ||
         args[0].includes("deprecated"))
      ) {
        // Suppress deprecation warnings
        return;
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

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
  const availableCitiesRef = useRef<TranslatedClientItem[]>(props.cities);
  
  // Keep ref in sync with state
  useEffect(() => {
    availableCitiesRef.current = availableCities;
  }, [availableCities]);

  // Default center (Casablanca, Morocco)
  const defaultCenter = { lat: 33.5731, lng: -7.5898 };
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(12);

  // Helper function to extract and fill all address components
  const fillAddressFromComponents = useCallback(async (
    addressComponents: google.maps.GeocoderResult["address_components"] | google.maps.places.PlaceResult["address_components"] | undefined,
    formattedAddress: string,
    lat: number,
    lng: number
  ) => {
    if (!addressComponents || addressComponents.length === 0) {
      // At least set coordinates even if no address components
      setValue("location.latitude", lat, { shouldValidate: true });
      setValue("location.longitude", lng, { shouldValidate: true });
      setValue("location.streetAddress", formattedAddress || "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setSearchValue(formattedAddress || "");
      return;
    }

    let countryName = "";
    let countryCode = "";
    let cityName = "";
    let zipCode = "";
    let streetNumber = "";
    let route = "";
    let landmark = "";

    // Extract all address components
    addressComponents.forEach((component) => {
      const types = component.types;

      if (types.includes("country")) {
        countryName = component.long_name;
        countryCode = component.short_name;
      }
      if (types.includes("locality") || types.includes("administrative_area_level_2")) {
        cityName = component.long_name;
      }
      if (types.includes("postal_code")) {
        zipCode = component.long_name;
      }
      if (types.includes("street_number")) {
        streetNumber = component.long_name;
      }
      if (types.includes("route")) {
        route = component.long_name;
      }
      if (types.includes("neighborhood") || types.includes("sublocality")) {
        landmark = component.long_name;
      }
    });

    // Update coordinates
    setValue("location.latitude", lat, { shouldValidate: true });
    setValue("location.longitude", lng, { shouldValidate: true });

    // Update street address
    const fullStreetAddress = formattedAddress || (streetNumber && route ? `${streetNumber} ${route}` : route || formattedAddress);
    setValue("location.streetAddress", fullStreetAddress, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setSearchValue(fullStreetAddress);

    // Update zip code
    if (zipCode) {
      setValue("location.zip", zipCode, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Update landmark
    if (landmark) {
      setValue("location.landmark", landmark, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Try to match and set country
    if (countryName || countryCode) {
      const matchedCountry = props.countries.find(
        (country) => {
          const countryNameLower = country.name.toLowerCase();
          const searchName = countryName.toLowerCase();
          const searchCode = countryCode.toLowerCase();
          return countryNameLower.includes(searchName) ||
                 searchName.includes(countryNameLower) ||
                 country.code?.toLowerCase() === searchCode ||
                 countryNameLower === searchName;
        }
      );

      if (matchedCountry) {
        setSelectedCountryId(String(matchedCountry.id));
        setValue("location.countryId", String(matchedCountry.id), {
          shouldValidate: true,
          shouldDirty: true,
        });

        // Fetch cities for the matched country
        if (matchedCountry.id) {
          setIsLoadingCities(true);
          try {
            const response = await fetch(
              `/api/searchCities?lang=${locale}&countryId=${matchedCountry.id}`
            );
            if (response.ok) {
              const cities = await response.json();
              const fetchedCities = cities.map((city: { id: number; value: string; countryId?: number }) => ({
                id: city.id,
                code: "",
                name: city.value,
                countryId: city.countryId,
              }));
              setAvailableCities(fetchedCities);
              availableCitiesRef.current = fetchedCities;

              // Try to match city after cities are loaded
              if (cityName && fetchedCities.length > 0) {
                const matchedCity = fetchedCities.find(
                  (city: TranslatedClientItem) => {
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
                }
              }
            }
          } catch (error) {
            console.error("Error fetching cities:", error);
          } finally {
            setIsLoadingCities(false);
          }
        }
      }
    } else if (cityName && selectedCountryId) {
      // If country is already selected, try to match city
      // Use ref to get current availableCities to avoid stale closure
      const currentCities = availableCitiesRef.current;
      if (currentCities.length > 0) {
        const matchedCity = currentCities.find(
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
        }
      } else {
        // If no cities loaded yet, fetch them for the selected country
        setIsLoadingCities(true);
        fetch(`/api/searchCities?lang=${locale}&countryId=${selectedCountryId}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error("Failed to fetch cities");
          })
          .then((cities) => {
            const fetchedCities = cities.map((city: { id: number; value: string; countryId?: number }) => ({
              id: city.id,
              code: "",
              name: city.value,
              countryId: city.countryId,
            }));
            setAvailableCities(fetchedCities);
            availableCitiesRef.current = fetchedCities;

            // Try to match city after cities are loaded
            if (cityName && fetchedCities.length > 0) {
              const matchedCity = fetchedCities.find(
                (city: TranslatedClientItem) => {
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
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching cities:", error);
          })
          .finally(() => {
            setIsLoadingCities(false);
          });
      }
    }
  }, [setValue, props.countries, locale]);

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

      // Update map center and marker
      setCenter({ lat, lng });
      setZoom(16);

      // Fill all address fields
      fillAddressFromComponents(
        place.address_components,
        place.formatted_address || "",
        lat,
        lng
      );
    });

    setAutocomplete(autocompleteInstance);

    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [isLoaded, fillAddressFromComponents]);

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

          // Reverse geocode to get full address details
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat, lng } },
            async (results, status) => {
              if (status === "OK" && results && results.length > 0) {
                const result = results[0];
                // Fill all address fields from geocoding result
                try {
                  await fillAddressFromComponents(
                    result.address_components,
                    result.formatted_address || "",
                    lat,
                    lng
                  );
                } catch (error) {
                  console.error("Error filling address components:", error);
                  // At least set coordinates and address
                  setValue("location.latitude", lat, { shouldValidate: true });
                  setValue("location.longitude", lng, { shouldValidate: true });
                  setValue("location.streetAddress", result.formatted_address || "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  setSearchValue(result.formatted_address || "");
                }
              } else {
                console.warn("Geocoding failed:", status);
                // If geocoding fails, at least set coordinates
                setValue("location.latitude", lat, { shouldValidate: true });
                setValue("location.longitude", lng, { shouldValidate: true });
              }
            }
          );
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
    <Card className={cn("w-full", props.className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("title") || "Emplacement"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
      {/* Google Maps Search */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
          {t("searchAddress") || "Rechercher une adresse"}
          </Label>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <Input
            ref={searchInputRef}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={t("searchAddressPlaceholder") || "Tapez une adresse..."}
            className="w-full pl-10"
            disabled={!isLoaded}
          />
        </div>
          <p className="text-xs text-gray-500">
          {t("searchAddressHint") || "Recherchez une adresse ou cliquez/déplacez le marqueur sur la carte"}
        </p>
      </div>

      {/* Google Map */}
      {isLoaded && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t("map") || "Carte interactive"}
            </Label>
            <div ref={mapRef} className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 shadow-md">
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

                  // Reverse geocode to get full address details
                  const geocoder = new google.maps.Geocoder();
                  geocoder.geocode(
                    { location: { lat, lng } },
                    async (results, status) => {
                      if (status === "OK" && results && results.length > 0) {
                        const result = results[0];
                        // Fill all address fields from geocoding result
                        try {
                          await fillAddressFromComponents(
                            result.address_components,
                            result.formatted_address || "",
                            lat,
                            lng
                          );
                        } catch (error) {
                          console.error("Error filling address components:", error);
                          // At least set coordinates and address
                          setValue("location.latitude", lat, { shouldValidate: true });
                          setValue("location.longitude", lng, { shouldValidate: true });
                          setValue("location.streetAddress", result.formatted_address || "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setSearchValue(result.formatted_address || "");
                        }
                      } else {
                        console.warn("Geocoding failed:", status);
                        // If geocoding fails, at least set coordinates
                        setValue("location.latitude", lat, { shouldValidate: true });
                        setValue("location.longitude", lng, { shouldValidate: true });
                      }
                    }
                  );
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
            <p className="text-xs text-gray-500">
              {t("mapHint") || "Cliquez sur la carte pour sélectionner l'emplacement exact"}
            </p>
        </div>
      )}

        {/* Complementary Information Fields - Always Visible Below Map */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("complementaryInfo") || "Informations complémentaires"}
          </h3>
          
          {/* Country and City Selection in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Country Selection */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium">
          {t("country") || "Pays"} <span className="text-red-500">*</span>
              </Label>
              <Select
          value={selectedCountryId}
                onValueChange={handleCountryChange}
              >
                <SelectTrigger
                  id="country"
          className={cn(
                    "w-full",
                    errors.location?.countryId && "border-red-500 focus:ring-red-500"
          )}
        >
                  <SelectValue placeholder={t("chooseCountry") || "Choisir un pays"} />
                </SelectTrigger>
                <SelectContent>
          {props.countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
              {country.name}
                    </SelectItem>
          ))}
                </SelectContent>
              </Select>
        {errors.location?.countryId && (
                <p className="text-sm text-red-500 mt-1">
            {errors.location.countryId.message}
          </p>
        )}
      </div>

      {/* City Selection */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
          {t("city") || "Ville"} <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="location.cityId"
                control={methods.control}
                render={({ field }) => (
                  <Select
                    value={typeof field.value === 'string' && field.value ? field.value : ""}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCityChange(value);
                    }}
          disabled={!selectedCountryId && availableCities.length === 0}
                  >
                    <SelectTrigger
                      id="city"
          className={cn(
                        "w-full",
                        errors.location?.cityId && "border-red-500 focus:ring-red-500",
                        (!selectedCountryId && availableCities.length === 0) && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <SelectValue 
                        placeholder={
                          isLoadingCities
              ? t("loading") || "Chargement..."
              : selectedCountryId
              ? t("chooseCity") || "Choisir une ville"
                            : t("selectCountryFirst") || "Sélectionnez d'abord un pays"
                        } 
                      />
                    </SelectTrigger>
                    <SelectContent>
          {availableCities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
              {city.name}
                        </SelectItem>
          ))}
                    </SelectContent>
                  </Select>
                )}
              />
        {errors.location?.cityId && (
                <p className="text-sm text-red-500 mt-1">
            {errors.location.cityId.message}
          </p>
        )}
            </div>
      </div>

      {/* Street Address */}
          <div className="space-y-2">
            <Label htmlFor="streetAddress" className="text-sm font-medium">
              {t("address") || "Adresse"} <span className="text-red-500">*</span>
            </Label>
        <Input
              id="streetAddress"
          {...register("location.streetAddress", {
            setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
          })}
          placeholder={t("streetAddressPlaceholder") || "Adresse complète"}
              className={cn(
                "w-full",
                errors.location?.streetAddress && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.location?.streetAddress && (
              <p className="text-sm text-red-500 mt-1">
                {errors.location.streetAddress.message}
              </p>
            )}
      </div>

      {/* ZIP Code */}
          <div className="space-y-2">
            <Label htmlFor="zip" className="text-sm font-medium">
              {t("zipCode") || "Code postal"}
            </Label>
        <Input
              id="zip"
          {...register("location.zip", {
            setValueAs: (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined),
          })}
              placeholder={t("zipCodePlaceholder") || "Code postal"}
              className={cn(
                "w-full",
                errors.location?.zip && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.location?.zip && (
              <p className="text-sm text-red-500 mt-1">
                {errors.location.zip.message}
              </p>
            )}
      </div>

      {/* Landmark / Additional Info */}
          <div className="space-y-2">
            <Label htmlFor="landmark" className="text-sm font-medium">
              {t("additionalInfo") || "Informations complémentaires"}
            </Label>
        <Textarea
              id="landmark"
          {...register("location.landmark", {
            setValueAs: (v) => (typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined),
          })}
          placeholder={t("landmarkPlaceholder") || "Points de repère, instructions spéciales..."}
              className={cn(
                "w-full min-h-[100px]",
                errors.location?.landmark && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.location?.landmark && (
              <p className="text-sm text-red-500 mt-1">
                {errors.location.landmark.message}
              </p>
            )}
          </div>
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
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t">
        <Button
            onPress={props.prev}
            startContent={<ChevronLeftIcon className="w-5 h-5" />}
          color="primary"
            className="w-full md:w-auto"
        >
          {t("previous") || "Précédent"}
        </Button>
        <Button
            onPress={handleNext}
            endContent={<ChevronRightIcon className="w-5 h-5" />}
          color="primary"
            className="w-full md:w-auto"
        >
          {t("next") || "Suivant"}
        </Button>
      </div>
      </CardContent>
    </Card>
  );
};

export default Location;
