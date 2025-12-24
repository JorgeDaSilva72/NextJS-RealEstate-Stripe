import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getLanguageIdByCode } from "@/lib/utils";
import BuyPageClient from "./BuyPageClient";
import PropertySearchForm from "../components/PropertySearchForm";
import HeroSection from "../components/HeroSection";
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
      ? "Acheter une Propriété - Afrique Avenir Immobilier"
      : "Buy a Property - Afrique Avenir Immobilier",
    description: locale === "fr"
      ? "Découvrez nos propriétés à vendre en Afrique"
      : "Discover our properties for sale in Africa",
  };
}

export default async function BuyPage({ params, searchParams }: Props) {
  const pagenum = searchParams.pagenum ?? 1;
  const query = searchParams.query ?? "";
  const locale = params.locale || "fr";
  const languageId = await getLanguageIdByCode(locale);

  // Get status ID for "for_sale" (Acheter)
  const saleStatus = await prisma.propertyStatus.findUnique({
    where: { code: "for_sale" },
  });

  if (!saleStatus) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Status 'for_sale' not found in database</p>
      </div>
    );
  }

  // Convert search params to numbers
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

  // Build where clause - ALWAYS filter by for_sale status
  const buildWhereClause = (): Prisma.PropertyWhereInput => {
    const where: Prisma.PropertyWhereInput = {
      isActive: true,
      publishedAt: {
        not: null,
        lte: new Date(),
      },
      statusId: saleStatus.id, // Filter by for_sale status
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

    // Search query
    if (!!query) {
      where.AND = [
        {
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
        },
      ];
    }

    // Filters
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section with Search Form */}
      <HeroSection>
        <div className="mt-8">
          <PropertySearchForm defaultMode="buy" />
        </div>
      </HeroSection>

      {/* Properties List */}
      <BuyPageClient
        properties={transformedProperties}
        totalPages={totalPages}
        currentPage={+pagenum}
        totalProperties={totalProperties}
        locale={locale}
      />
    </div>
  );
}
