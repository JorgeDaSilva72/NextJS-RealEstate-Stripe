import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getLanguageIdByCode } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Search from "../../components/Search";
import PropertyContainer from "../../components/PropertyContainer";
import PropertyCardResult from "../../components/PropertyCardResult";
import NoPropertiesFound from "../../result/_components/noPropertiesFound";

const PAGE_SIZE = 12;

interface Props {
  params: { locale: string; status: string };
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
  const statusSlug = params.status;
  
  const isForSale = statusSlug === "a-vendre";
  const title = isForSale
    ? locale === "fr"
      ? "Propriétés à Vendre - Afrique Avenir Immobilier"
      : "Properties for Sale - Afrique Avenir Immobilier"
    : locale === "fr"
    ? "Propriétés à Louer - Afrique Avenir Immobilier"
    : "Properties for Rent - Afrique Avenir Immobilier";

  return {
    title,
    description: isForSale
      ? locale === "fr"
        ? "Découvrez nos propriétés à vendre en Afrique"
        : "Discover our properties for sale in Africa"
      : locale === "fr"
      ? "Découvrez nos propriétés à louer en Afrique"
      : "Discover our properties for rent in Africa",
  };
}

export default async function StatusPage({ params, searchParams }: Props) {
  const pagenum = searchParams.pagenum ?? 1;
  const locale = params.locale || "fr";
  const statusSlug = params.status;

  // Map slug to status code
  const statusCodeMap: Record<string, string> = {
    "a-vendre": "for_sale",
    "a-louer": "for_rent",
  };

  const statusCode = statusCodeMap[statusSlug];

  if (!statusCode) {
    notFound();
  }

  const languageId = await getLanguageIdByCode(locale);

  // Get status ID
  const propertyStatus = await prisma.propertyStatus.findUnique({
    where: { code: statusCode },
  });

  if (!propertyStatus) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Status '{statusCode}' not found in database</p>
      </div>
    );
  }

  // Convert search params
  const typeId = searchParams.queryType
    ? Number(searchParams.queryType)
    : undefined;
  const cityIdParam = searchParams.cityId as string | undefined;
  const cityId =
    cityIdParam && cityIdParam.toLowerCase() !== "none"
      ? Number(cityIdParam)
      : undefined;
  const countryId = searchParams.countryId
    ? Number(searchParams.countryId)
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
      statusId: propertyStatus.id,
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

    if (typeId !== undefined && !isNaN(typeId)) {
      where.typeId = typeId;
    }

    if (countryId !== undefined && !isNaN(countryId)) {
      where.countryId = countryId;
    }

    if (cityId !== undefined && !isNaN(cityId)) {
      where.location = { cityId: cityId };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(minPrice) && minPrice > 0) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
        where.price.lte = maxPrice;
      }
    }

    const featureFilters: any = {};
    if (minArea !== undefined && !isNaN(minArea) && minArea > 0) {
      featureFilters.area = { gte: minArea };
    }
    if (maxArea !== undefined && !isNaN(maxArea) && maxArea > 0) {
      featureFilters.area = { ...featureFilters.area, lte: maxArea };
    }
    if (minBedrooms !== undefined && !isNaN(minBedrooms) && minBedrooms > 0) {
      featureFilters.bedrooms = { gte: minBedrooms };
    }
    if (maxBedrooms !== undefined && !isNaN(maxBedrooms) && maxBedrooms > 0) {
      featureFilters.bedrooms = { ...featureFilters.bedrooms, lte: maxBedrooms };
    }
    if (minBathrooms !== undefined && !isNaN(minBathrooms) && minBathrooms > 0) {
      featureFilters.bathrooms = { gte: minBathrooms };
    }
    if (maxBathrooms !== undefined && !isNaN(maxBathrooms) && maxBathrooms > 0) {
      featureFilters.bathrooms = { ...featureFilters.bathrooms, lte: maxBathrooms };
    }

    if (Object.keys(featureFilters).length > 0) {
      where.feature = featureFilters;
    }

    return where;
  };

  const whereClause = buildWhereClause();

  // Fetch properties
  const propertiesPromise = prisma.property.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      price: true,
      currency: true,
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
                  languageId: languageId,
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
    <div className="w-full min-h-screen bg-gray-100">
      <Search />
      {transformedProperties.length > 0 ? (
        <PropertyContainer totalPages={totalPages} currentPage={+pagenum}>
          {transformedProperties.map((propertyItem) => (
            <PropertyCardResult property={propertyItem} locale={locale} key={propertyItem.id} />
          ))}
        </PropertyContainer>
      ) : (
        <NoPropertiesFound />
      )}
    </div>
  );
}





