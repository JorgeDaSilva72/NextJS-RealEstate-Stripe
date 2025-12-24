import HomeSearchForm from "./components/HomeSearchForm";
import HomePageClient from "./_components/HomePageClient";
import HeroSection from "./components/HeroSection";
import prisma from "@/lib/prisma";
import { getLanguageIdByCode } from "@/lib/utils";
import { Prisma } from "@prisma/client";

interface Props {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function HomePage({ params, searchParams }: Props) {
  const locale = params.locale || "fr";

  // Get language ID for translations
  let languageId: number | null = null;
  try {
    const language = await prisma.language.findFirst({
      where: { code: locale },
    });
    languageId = language?.id || null;
    if (!languageId) {
      const fallbackLang = await prisma.language.findFirst({
        where: { code: "fr" },
      });
      languageId = fallbackLang?.id || null;
    }
  } catch (error) {
    console.error("Error fetching language ID:", error);
  }

  // Extract search parameters
  const cityId = searchParams.cityId
    ? Number(searchParams.cityId)
    : undefined;
  const typeId = searchParams.typeId
    ? Number(searchParams.typeId)
    : undefined;
  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;
  const bedrooms = searchParams.bedrooms
    ? Number(searchParams.bedrooms)
    : undefined;
  const bathrooms = searchParams.bathrooms
    ? Number(searchParams.bathrooms)
    : undefined;
  const minArea = searchParams.minArea
    ? Number(searchParams.minArea)
    : undefined;

  // Build where clause with filters
  const buildWhereClause = (): Prisma.PropertyWhereInput => {
    const where: Prisma.PropertyWhereInput = {
      isActive: true,
      publishedAt: {
        not: null,
        lte: new Date(),
      },
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

    // Filter by city
    if (cityId !== undefined && !isNaN(cityId)) {
      where.location = { cityId: cityId };
    }

    // Filter by property type
    if (typeId !== undefined && !isNaN(typeId)) {
      where.typeId = typeId;
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined && !isNaN(minPrice) && minPrice > 0) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
        where.price.lte = maxPrice;
      }
    }

    // Build feature filters
    const featureFilters: any = {};
    if (bedrooms !== undefined && !isNaN(bedrooms) && bedrooms > 0) {
      featureFilters.bedrooms = { gte: bedrooms };
    }
    if (bathrooms !== undefined && !isNaN(bathrooms) && bathrooms > 0) {
      featureFilters.bathrooms = { gte: bathrooms };
    }
    if (minArea !== undefined && !isNaN(minArea) && minArea > 0) {
      featureFilters.area = { gte: minArea };
    }

    // Apply feature filters if any exist
    if (Object.keys(featureFilters).length > 0) {
      where.feature = featureFilters;
    }

    return where;
  };

  const whereClause = buildWhereClause();

  // Fetch published properties with active subscriptions and filters
  try {
    const properties = await prisma.property.findMany({
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
            city: {
              select: {
                translations: languageId
                  ? {
                      where: { languageId },
                      select: {
                        name: true,
                      },
                      take: 1,
                    }
                  : {
                      select: {
                        name: true,
                      },
                      take: 1,
                    },
              },
            },
            latitude: true,
            longitude: true,
          },
        },
        feature: {
          select: {
            bedrooms: true,
            bathrooms: true,
            area: true,
          },
        },
      },
      orderBy: [
        { isFeatured: "desc" }, // Featured properties first
        { createdAt: "desc" },
      ],
      take: 4, // Show only 4 featured properties on homepage
    });

    // Transform properties to include coordinates and convert Decimal to numbers
    const propertiesWithCoordinates = properties.map((prop) => {
      const lat = prop.location?.latitude
        ? typeof prop.location.latitude === "number"
          ? prop.location.latitude
          : Number(prop.location.latitude)
        : null;
      const lng = prop.location?.longitude
        ? typeof prop.location.longitude === "number"
          ? prop.location.longitude
          : Number(prop.location.longitude)
        : null;

      return {
        id: prop.id,
        name: prop.name,
        price: prop.price,
        currency: prop.currency,
        images: prop.images,
        location: prop.location?.city && prop.location.city.translations
          ? {
              city: {
                translations: Array.isArray(prop.location.city.translations)
                  ? prop.location.city.translations
                  : [],
              },
            }
          : null,
        coordinates:
          lat !== null && lng !== null
            ? {
                lat,
                lng,
              }
            : undefined,
      };
    });

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section with Search Form */}
        <HeroSection>
          <div className="mt-8">
            <HomeSearchForm />
          </div>
        </HeroSection>

        {/* Main Content - Featured Properties */}
        <HomePageClient
          properties={propertiesWithCoordinates}
          locale={locale}
          showViewAll={true}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching properties:", error);

    // Return page with empty state on error
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section with Search Form */}
        <HeroSection>
          <div className="mt-8">
            <HomeSearchForm />
          </div>
        </HeroSection>
        {/* Main Content - Map and Properties */}
        <HomePageClient properties={[]} locale={locale} showViewAll={true} />
      </div>
    );
  }
}
