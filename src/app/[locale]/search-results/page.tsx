import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getLanguageIdByCode } from "@/lib/utils";
import NoPropertiesFound from "../result/_components/noPropertiesFound";
import SearchResultsBar from "../components/SearchResultsBar";
import SearchResultsPageClient from "./SearchResultsPageClient";
import { Metadata } from "next";
import { headers } from "next/headers";

const PAGE_SIZE = 12;

interface Props {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale || "fr";
  return {
    title: locale === "fr" 
      ? "Résultats de Recherche - Afrique Avenir Immobilier"
      : "Search Results - Afrique Avenir Immobilier",
    description: locale === "fr"
      ? "Résultats de votre recherche de propriétés"
      : "Your property search results",
  };
}

export default async function SearchResultsPage({ params, searchParams }: Props) {
  const pagenum = searchParams.pagenum ?? 1;
  const locale = params.locale || "fr";
  const languageId = await getLanguageIdByCode(locale);

  // Try to get the full URL from headers for debugging
  const headersList = await headers();
  const referer = headersList.get('referer') || '';
  const fullUrl = headersList.get('x-url') || referer;

  // Extract search parameters
  const modeParam = searchParams.mode as string | undefined;
  const typeParams = searchParams.type;
  
  // Handle country parameter - check multiple possible formats
  // URL format: country[]=Algeria or country=Algeria or country=Algeria&country=Morocco
  let countryParams: string | string[] | undefined = undefined;
  
  // Check all possible keys for country parameter
  const allKeys = Object.keys(searchParams);
  console.log("=== SEARCH DEBUG START ===");
  console.log("All searchParams keys:", allKeys);
  console.log("Full searchParams object:", JSON.stringify(searchParams, null, 2));
  console.log("Referer URL:", referer);
  
  // Try different possible keys - Next.js might store 'country[]' as literal key
  if (searchParams.country) {
    countryParams = searchParams.country;
    console.log("✅ Found country in searchParams.country:", countryParams);
  } else if ((searchParams as any)['country[]']) {
    countryParams = (searchParams as any)['country[]'];
    console.log("✅ Found country in searchParams['country[]']:", countryParams);
  } else {
    // Check if any key contains 'country' (case insensitive)
    const countryKey = allKeys.find(key => key.toLowerCase().includes('country'));
    if (countryKey) {
      countryParams = (searchParams as any)[countryKey];
      console.log(`✅ Found country in key '${countryKey}':`, countryParams);
    } else {
      console.log("❌ No country parameter found in searchParams");
    }
  }
  
  // If still not found, try parsing from referer URL
  if (!countryParams && referer) {
    try {
      const url = new URL(referer);
      const urlParams = url.searchParams;
      if (urlParams.has('country[]')) {
        countryParams = urlParams.get('country[]') || undefined;
        console.log("✅ Found country in referer URL (country[]):", countryParams);
      } else if (urlParams.has('country')) {
        const countryValues = urlParams.getAll('country');
        countryParams = countryValues.length > 0 ? countryValues : undefined;
        console.log("✅ Found country in referer URL (country):", countryParams);
      }
    } catch (e) {
      console.log("Could not parse referer URL:", e);
    }
  }
  
  const cityParams = searchParams.city;
  const minPriceParam = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPriceParam = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;

  // Convert arrays to single values or arrays
  // If no mode specified, return all properties (both buy and rent)
  const mode = modeParam === "rent" ? "rent" : modeParam === "buy" ? "buy" : undefined;
  const types = Array.isArray(typeParams) ? typeParams : typeParams ? [typeParams] : [];
  
  // Handle country params - ensure it's always an array
  let countries: string[] = [];
  if (countryParams) {
    if (Array.isArray(countryParams)) {
      countries = countryParams.filter(Boolean).map(c => String(c).trim());
    } else if (typeof countryParams === 'string') {
      countries = [countryParams.trim()].filter(Boolean);
    }
  }
  
  const cities = Array.isArray(cityParams) ? cityParams : cityParams ? [cityParams] : [];

  // DEBUG: Log search parameters
  console.log("Final parsed Search Params:", { mode, countries, cities, types, locale, languageId });

  // Map property type codes
  const typeCodeMap: Record<string, string> = {
    "appartement": "apartment",
    "maison": "house",
    "maison-et-appartement": "house_and_apartment",
    "terrain": "land",
  };

  // Get status ID based on mode - only if mode is specified
  let propertyStatus: { id: number; code: string } | null = null;
  if (mode) {
    const statusCode = mode === "rent" ? "for_rent" : "for_sale";
    const status = await prisma.propertyStatus.findUnique({
      where: { code: statusCode },
    });

    if (!status) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12 flex items-center justify-center">
          <p className="text-gray-600">Status &apos;{statusCode}&apos; not found in database</p>
        </div>
      );
    }
    propertyStatus = status;
  }

  // Build where clause
  const buildWhereClause = async (): Promise<Prisma.PropertyWhereInput> => {
    const where: Prisma.PropertyWhereInput = {
      isActive: true,
      publishedAt: {
        not: null,
        lte: new Date(),
      },
      // Only filter by status if mode is specified, otherwise return all (buy and rent)
      ...(propertyStatus && { statusId: propertyStatus.id }),
      user: {
        subscriptions: {
          some: {
            endDate: {
              gt: new Date(),
            },
            status: "ACTIVE",
          },
        },
      },
    };

    // Filter by property types
    if (types.length > 0) {
      const typeCodes = types
        .map((t) => typeCodeMap[t as string])
        .filter(Boolean);
      
      if (typeCodes.length > 0) {
        where.type = {
          code: {
            in: typeCodes,
          },
        };
      }
    }

    // Filter by price range
    if (minPriceParam !== undefined && !isNaN(minPriceParam) && minPriceParam > 0) {
      where.price = {
        ...(where.price as any || {}),
        gte: minPriceParam,
      };
    }
    
    if (maxPriceParam !== undefined && !isNaN(maxPriceParam) && maxPriceParam > 0) {
      where.price = {
        ...(where.price as any || {}),
        lte: maxPriceParam,
      };
    }

    // Filter by countries (look up country IDs by name)
    if (countries.length > 0) {
      console.log("🔍 Searching for countries:", countries);
      
      // Try multiple matching strategies: exact match in current language, then try all languages
      // This handles cases where URL has "Algeria" but DB has "Algérie"
      const countryConditions: any[] = [];
      
      // Strategy 1: Exact match in current language
      countries.forEach((country) => {
        countryConditions.push({
          languageId: languageId || undefined,
          name: {
            equals: String(country).trim(),
            mode: "insensitive" as const,
          },
        });
      });
      
      // Strategy 2: Try matching in all languages (fallback)
      // Get all languages to try matching
      const allLanguages = await prisma.language.findMany({
        where: { isActive: true },
        select: { id: true },
      });
      
      countries.forEach((country) => {
        allLanguages.forEach((lang) => {
          countryConditions.push({
            languageId: lang.id,
            name: {
              equals: String(country).trim(),
              mode: "insensitive" as const,
            },
          });
        });
      });

      console.log("🔍 Country conditions count:", countryConditions.length);

      const countryTranslations = await prisma.countryTranslation.findMany({
        where: {
          OR: countryConditions,
        },
        select: {
          countryId: true,
          name: true,
          languageId: true,
        },
      });

      console.log("🔍 Found country translations:", JSON.stringify(countryTranslations, null, 2));

      const countryIds = [...new Set(countryTranslations.map((ct) => ct.countryId))];
      
      console.log("🔍 Resolved country IDs:", countryIds);
      
      // STRICT VALIDATION: If no exact matches found, return empty results
      if (countryIds.length === 0) {
        console.log("❌ No country matches found - returning empty results");
        const existingAND = Array.isArray(where.AND) ? where.AND : (where.AND ? [where.AND] : []);
        where.AND = [
          ...existingAND,
          { id: -1 }, // Impossible condition - no properties will match
        ];
        return where;
      }
      
      // If we also have city filter, combine them
      if (cities.length > 0) {
        const cityConditions = cities.map((city) => ({
          languageId: languageId || undefined,
          city: {
            countryId: {
              in: countryIds, // STRICT: Only cities from selected countries
            },
            isActive: true,
          },
          name: {
            equals: String(city).trim(),
            mode: "insensitive" as const,
          },
        }));

        const cityTranslations = await prisma.cityTranslation.findMany({
          where: {
            OR: cityConditions,
          },
          select: {
            cityId: true,
          },
        });

        const cityIds = [...new Set(cityTranslations.map((ct) => ct.cityId))];
        
        if (cityIds.length > 0) {
          // STRICT: Filter by city AND ensure city belongs to selected country
          const existingAND = Array.isArray(where.AND) ? where.AND : (where.AND ? [where.AND] : []);
          where.AND = [
            ...existingAND,
            {
              location: {
                cityId: {
                  in: cityIds,
                },
                city: {
                  countryId: {
                    in: countryIds, // Double-check: Ensure city belongs to selected country
                  },
                  isActive: true,
                },
              },
            },
          ];
        } else {
          // No matching cities found - return empty result
          const existingAND = Array.isArray(where.AND) ? where.AND : (where.AND ? [where.AND] : []);
          where.AND = [
            ...existingAND,
            { id: -1 }, // Impossible condition
          ];
        }
      } else {
        // Only country filter - STRICT: Properties MUST be from selected country ONLY
        // Use a simple, clear approach: property must match via location.city.countryId OR direct countryId
        // BUT ensure that if countryId exists, it must match (prevents wrong countryId)
        const existingAND = Array.isArray(where.AND) ? where.AND : (where.AND ? [where.AND] : []);
        where.AND = [
          ...existingAND,
          {
            AND: [
              // Property must have location with city from selected country OR direct countryId matching
              {
                OR: [
                  // Case 1: Property has location with city from selected country
                  {
                    location: {
                      city: {
                        countryId: {
                          in: countryIds,
                        },
                        isActive: true,
                      },
                    },
                  },
                  // Case 2: Property has direct countryId matching selected country
                  {
                    countryId: {
                      in: countryIds,
                    },
                  },
                ],
              },
              // CRITICAL: If property has direct countryId set, it MUST match selected country
              // This prevents properties with wrong countryId (e.g., Morocco ID) from appearing
              {
                OR: [
                  { countryId: null }, // No direct countryId, use city's country
                  { countryId: { in: countryIds } }, // Direct countryId matches
                ],
              },
            ],
          },
        ];
        
        console.log("🔒 Applied STRICT country filter with countryIds:", countryIds);
      }
    } else if (cities.length > 0) {
      // Only city filter (no country) - Use exact match for strict filtering
      const cityConditions = cities.map((city) => ({
        languageId: languageId || undefined,
        name: {
          equals: String(city).trim(),
          mode: "insensitive" as const,
        },
      }));

      const cityTranslations = await prisma.cityTranslation.findMany({
        where: {
          OR: cityConditions,
        },
        select: {
          cityId: true,
        },
      });

      const cityIds = [...new Set(cityTranslations.map((ct) => ct.cityId))];
      
      if (cityIds.length > 0) {
        where.location = {
          cityId: {
            in: cityIds,
          },
          city: {
            isActive: true,
          },
        };
      } else {
        // No matching cities found - return empty result
        return {
          ...where,
          id: -1,
        };
      }
    }

    return where;
  };

  const whereClause = await buildWhereClause();

  // Debug: Log the where clause to verify filtering
  console.log("📋 Final Where Clause:", JSON.stringify(whereClause, null, 2));

  // Fetch properties
  const propertiesPromise = prisma.property.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      currency: true,
      countryId: true, // Add direct countryId for debugging
      isFeatured: true,
      createdAt: true,
      images: {
        orderBy: [
          { isMain: "desc" },
          { displayOrder: "asc" },
          { createdAt: "asc" },
        ],
        select: {
          url: true,
          isMain: true,
        },
        take: 1,
      },
      location: {
        select: {
          latitude: true,
          longitude: true,
          neighborhood: true,
          streetAddress: true,
          city: {
            select: {
              id: true,
              countryId: true,
              translations: {
                select: {
                  name: true,
                },
                where: {
                  languageId: languageId || undefined,
                },
                take: 1,
              },
              country: {
                select: {
                  id: true,
                  translations: {
                    select: {
                      name: true,
                    },
                    where: {
                      languageId: languageId || undefined,
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      },
      feature: {
        select: {
          area: true,
          bedrooms: true,
          bathrooms: true,
          parkingSpots: true,
          hasSwimmingPool: true,
          hasGardenYard: true,
          hasBalcony: true,
        },
      },
      status: { select: { code: true } },
      type: { select: { code: true } },
      contact: {
        select: {
          name: true,
          phone: true,
          email: true,
        },
      },
    },
    where: whereClause,
    orderBy: [{ createdAt: "desc" }],
    skip: (+pagenum - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPropertiesPromise = prisma.property.count({
    where: whereClause,
  });

  const [properties, totalProperties] = await Promise.all([
    propertiesPromise,
    totalPropertiesPromise,
  ]);

  // DEBUG: Log properties returned
  console.log("📊 Total properties found:", totalProperties);
  console.log("📊 Properties returned:", properties.length);
  
  // Log country info for each property
  properties.forEach((prop, index) => {
    const countryName = prop.location?.city?.country?.translations?.[0]?.name || "Unknown";
    const cityName = prop.location?.city?.translations?.[0]?.name || "Unknown";
    const cityCountryId = prop.location?.city?.countryId || null;
    const directCountryId = prop.countryId || null;
    console.log(`🏠 Property ${index + 1}:`, {
      id: prop.id,
      countryName,
      cityName,
      directCountryId,
      cityCountryId,
      status: prop.status?.code,
      hasLocation: !!prop.location,
    });
  });

  console.log("=== SEARCH DEBUG END ===");

  // Transform properties to convert Decimal to number for coordinates
  const transformedProperties = properties.map((property) => ({
    ...property,
    location: property.location
      ? {
          ...property.location,
          latitude: property.location.latitude
            ? Number(property.location.latitude)
            : null,
          longitude: property.location.longitude
            ? Number(property.location.longitude)
            : null,
        }
      : null,
  }));

  const totalPages = Math.ceil(totalProperties / PAGE_SIZE);

  // Get active filters for display
  const activeFilters: string[] = [];
  if (mode) {
    activeFilters.push(mode === "buy" ? "À Vendre" : "À Louer");
  }
  if (countries.length > 0) {
    activeFilters.push(`Pays: ${countries.join(", ")}`);
  }
  if (cities.length > 0) {
    activeFilters.push(`Villes: ${cities.join(", ")}`);
  }
  if (types.length > 0) {
    const typeLabels: Record<string, string> = {
      "appartement": "Appartement",
      "maison": "Maison",
      "maison-et-appartement": "Maison et Appartement",
      "terrain": "Terrain",
    };
    activeFilters.push(`Types: ${types.map((t) => typeLabels[t as string] || t).join(", ")}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-4">
        {/* Search Bar */}
        <SearchResultsBar />
      </div>
      
      {/* Results Content with Map */}
      <SearchResultsPageClient
        properties={transformedProperties}
        totalPages={totalPages}
        currentPage={+pagenum}
        totalProperties={totalProperties}
        locale={locale}
      />
    </div>
  );
}

