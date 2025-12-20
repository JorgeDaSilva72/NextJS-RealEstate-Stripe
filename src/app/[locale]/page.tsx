import HomeNavbar from "./components/HomeNavbar";
import SearchBar from "./components/SearchBar";
import HomeFooter from "./components/HomeFooter";
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
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
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

    // Filter by max price
    if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
      where.price = {
        lte: maxPrice,
      };
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
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Increased limit for better results
    });

    // Transform properties to include coordinates
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
        ...prop,
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
        {/* Navbar */}
        <HomeNavbar />

        {/* Hero Section with Search Bar */}
        <HeroSection>
          <div className="mt-8">
            <SearchBar />
          </div>
        </HeroSection>

        {/* Main Content - Map and Properties */}
        <HomePageClient
          properties={propertiesWithCoordinates}
          locale={locale}
        />

        {/* Footer */}
        <HomeFooter />
      </div>
    );
  } catch (error) {
    console.error("Error fetching properties:", error);

    // Return page with empty state on error
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <HomeNavbar />
        <HeroSection>
          <div className="mt-8">
            <SearchBar />
          </div>
        </HeroSection>
        <HomePageClient properties={[]} locale={locale} />
        <HomeFooter />
      </div>
    );
  }
}
