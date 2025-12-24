import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getLanguageIdByCode } from "@/lib/utils";
import Search from "../components/Search";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCardResult from "../components/PropertyCardResult";
import NoPropertiesFound from "../result/_components/noPropertiesFound";
import PropertiesMapView from "../components/PropertiesMapView";
import ViewToggle from "../components/ViewToggle";
import PropertiesPageClient from "./PropertiesPageClient";
import { Metadata } from "next";

const PAGE_SIZE = 12;

interface Props {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

type SortOrder =
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc"
  | "surface-asc"
  | "surface-desc";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale || "fr";
  return {
    title: locale === "fr" 
      ? "Toutes les Propriétés - Afrique Avenir Immobilier"
      : "All Properties - Afrique Avenir Immobilier",
    description: locale === "fr"
      ? "Découvrez toutes nos propriétés disponibles à l'achat et à la location en Afrique"
      : "Discover all our available properties for sale and rent in Africa",
  };
}

export default async function AllPropertiesPage({ params, searchParams }: Props) {
  const pagenum = searchParams.pagenum ?? 1;
  const query = searchParams.query ?? "";
  const locale = params.locale || "fr";
  const languageId = await getLanguageIdByCode(locale);

  // Convert search params to numbers
  const statusId = searchParams.queryStatus
    ? Number(searchParams.queryStatus)
    : undefined;
  const typeId = searchParams.queryType
    ? Number(searchParams.queryType)
    : undefined;
  const cityIdParam = searchParams.cityId as string | undefined;
  const cityId =
    cityIdParam && cityIdParam.toLowerCase() !== "none"
      ? Number(cityIdParam)
      : undefined;
  const countryId = searchParams.country
    ? Number(searchParams.country)
    : undefined;

  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;
  const minArea = searchParams.minArea
    ? Number(searchParams.minArea)
    : undefined;
  const maxArea = searchParams.maxArea
    ? Number(searchParams.maxArea)
    : undefined;
  const minBedrooms = searchParams.minBedrooms
    ? Number(searchParams.minBedrooms)
    : undefined;
  const maxBedrooms = searchParams.maxBedrooms
    ? Number(searchParams.maxBedrooms)
    : undefined;
  const minBathrooms = searchParams.minBathrooms
    ? Number(searchParams.minBathrooms)
    : undefined;
  const maxBathrooms = searchParams.maxBathrooms
    ? Number(searchParams.maxBathrooms)
    : undefined;

  // Sort order
  const sortOrder = (
    Array.isArray(searchParams.sortOrder)
      ? searchParams.sortOrder[0]
      : searchParams.sortOrder
  ) as SortOrder;

  const orderBy: Prisma.PropertyOrderByWithRelationInput[] = [];

  if (typeof sortOrder === "string" && sortOrder.startsWith("price")) {
    orderBy.push({
      price: sortOrder.endsWith("asc") ? "asc" : "desc",
    });
  } else if (typeof sortOrder === "string" && sortOrder.startsWith("surface")) {
    orderBy.push({
      feature: {
        area: sortOrder.endsWith("asc") ? "asc" : "desc",
      },
    });
  } else if (typeof sortOrder === "string" && sortOrder.startsWith("date")) {
    orderBy.push({
      createdAt: sortOrder.endsWith("asc") ? "asc" : "desc",
    });
  }

  if (orderBy.length === 0) {
    orderBy.push({ createdAt: "desc" });
  }

  // Build where clause
  const buildWhereClause = (): Prisma.PropertyWhereInput => {
    const where: Prisma.PropertyWhereInput = {
      isActive: true,
      publishedAt: {
        not: null,
        lte: new Date(),
      },
      // Show ALL properties with active subscriptions (including user's own)
      // Use OR condition to ensure properties are visible if they meet the basic criteria
      // and have an active subscription OR if they were recently created (within last 24 hours)
      AND: [
        {
          OR: [
            {
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
            },
            // Allow properties created in the last 24 hours to be visible even if subscription check fails
            // This handles edge cases where subscription might not be immediately available
            {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
          ],
        },
      ],
    };

    // Search query
    if (!!query) {
      if (!Array.isArray(where.AND)) {
        where.AND = where.AND ? [where.AND] : [];
      }
      where.AND.push({
        OR: [
          {
            name: {
              path: [locale],
              string_contains: String(query),
              mode: "insensitive",
            } as any,
          },
          {
            description: {
              path: [locale],
              string_contains: String(query),
              mode: "insensitive",
            } as any,
          },
        ],
      });
    }

    // Filters
    if (statusId !== undefined && !isNaN(statusId)) {
      where.statusId = statusId;
    }

    if (typeId !== undefined && !isNaN(typeId)) {
      where.typeId = typeId;
    }

    if (countryId !== undefined && !isNaN(countryId)) {
      where.countryId = countryId;
    }

    if (cityId !== undefined && !isNaN(cityId)) {
      where.location = { cityId: cityId };
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined && !isNaN(minPrice) && { gte: minPrice }),
        ...(maxPrice !== undefined && !isNaN(maxPrice) && { lte: maxPrice }),
      };
    }

    // Feature filters
    const featureWhere: Prisma.PropertyFeatureWhereInput = {};
    let hasFeatureFilter = false;

    if (minArea !== undefined || maxArea !== undefined) {
      featureWhere.area = {
        ...(minArea !== undefined && { gte: minArea }),
        ...(maxArea !== undefined && { lte: maxArea }),
      };
      hasFeatureFilter = true;
    }

    if (minBedrooms !== undefined || maxBedrooms !== undefined) {
      featureWhere.bedrooms = {
        ...(minBedrooms !== undefined && { gte: minBedrooms }),
        ...(maxBedrooms !== undefined && { lte: maxBedrooms }),
      };
      hasFeatureFilter = true;
    }

    if (minBathrooms !== undefined || maxBathrooms !== undefined) {
      featureWhere.bathrooms = {
        ...(minBathrooms !== undefined && { gte: minBathrooms }),
        ...(maxBathrooms !== undefined && { lte: maxBathrooms }),
      };
      hasFeatureFilter = true;
    }

    if (hasFeatureFilter) {
      where.feature = featureWhere;
    }

    return where;
  };

  const whereClause = buildWhereClause();

  const propertiesPromise = prisma.property.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      currency: true,
      contact: {
        select: {
          phone: true,
          email: true,
          name: true,
        },
      },
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
        },
      },
      status: { select: { code: true } },
      type: { select: { code: true } },
    },
    where: whereClause,
    orderBy,
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

  return (
    <PropertiesPageClient
      properties={transformedProperties}
      totalPages={totalPages}
      currentPage={+pagenum}
      totalProperties={totalProperties}
      locale={locale}
    />
  );
}

