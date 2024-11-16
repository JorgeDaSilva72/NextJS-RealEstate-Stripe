import prisma from "@/lib/prisma";
import Search from "../components/Search";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCard from "../components/PropertyCard";
import NoPropertiesFound from "./_components/noPropertiesFound";

const PAGE_SIZE = 12;

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}
export default async function Home({ searchParams }: Props) {
  const pagenum = searchParams.pagenum ?? 1;
  const query = searchParams.query ?? "";
  const queryStatus = searchParams.queryStatus ?? "";
  const queryType = searchParams.queryType ?? "";

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

  const sortOrder =
    searchParams.sortOrder === "desc" || searchParams.sortOrder === "asc"
      ? searchParams.sortOrder
      : undefined;

  const propertiesPromise = prisma.property.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      images: {
        select: {
          url: true,
        },
      },
      location: {
        select: {
          city: true,
          state: true,
        },
      },
      feature: {
        select: {
          area: true,
          bedrooms: true,
          bathrooms: true,
        },
      },
      status: true,
      type: true,
    },
    where: {
      ...(!!query && {
        name: {
          contains: String(query),
        },
      }),
      ...(!!queryStatus && {
        status: {
          is: {
            value: {
              equals: String(queryStatus),
            },
          },
        },
      }),
      ...(!!queryType && {
        type: {
          is: {
            value: {
              equals: String(queryType),
            },
          },
        },
      }),

      price: {
        ...(minPrice !== undefined &&
          !isNaN(minPrice) && { gte: minPrice || 0 }),
        ...(maxPrice !== undefined &&
          !isNaN(maxPrice) && { lte: maxPrice || 1000000 }),
      },

      feature: {
        area: {
          ...(minArea !== undefined && { gte: minArea }),
          ...(maxArea !== undefined && { lte: maxArea }),
        },
        bedrooms: {
          ...(minBedrooms !== undefined && { gte: minBedrooms }),
          ...(maxBedrooms !== undefined && { lte: maxBedrooms }),
        },
        bathrooms: {
          ...(minBathrooms !== undefined && { gte: minBathrooms }),
          ...(maxBathrooms !== undefined && { lte: maxBathrooms }),
        },
      },
    },
    ...(sortOrder && { orderBy: { price: sortOrder } }), // Inclure seulement si sortOrder est défini
    skip: (+pagenum - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPropertiesPromise = prisma.property.count({
    where: {
      ...(!!query && {
        name: {
          contains: String(query),
        },
      }),
      ...(!!queryStatus && {
        status: {
          is: {
            value: {
              equals: String(queryStatus),
            },
          },
        },
      }),
      ...(!!queryType && {
        type: {
          is: {
            value: {
              equals: String(queryType),
            },
          },
        },
      }),

      price: {
        ...(minPrice !== undefined &&
          !isNaN(minPrice) && { gte: minPrice || 0 }),
        ...(maxPrice !== undefined &&
          !isNaN(maxPrice) && { lte: maxPrice || 1000000 }),
      },

      feature: {
        area: {
          ...(minArea !== undefined && { gte: minArea }),
          ...(maxArea !== undefined && { lte: maxArea }),
        },
        bedrooms: {
          ...(minBedrooms !== undefined && { gte: minBedrooms }),
          ...(maxBedrooms !== undefined && { lte: maxBedrooms }),
        },
        bathrooms: {
          ...(minBathrooms !== undefined && { gte: minBathrooms }),
          ...(maxBathrooms !== undefined && { lte: maxBathrooms }),
        },
      },
    },
  });

  // console.log(
  //   "query",
  //   query,
  //   "queryType",
  //   queryType,
  //   "minPrice:",
  //   minPrice,
  //   "maxPrice:",
  //   maxPrice,
  //   "queryStatus,",
  //   queryStatus
  // );

  const [properties, totalProperties] = await Promise.all([
    propertiesPromise,
    totalPropertiesPromise,
  ]);

  const totalPages = Math.floor(totalProperties / PAGE_SIZE + 1);

  return (
    <div>
      <Search />
      {/* <div>
        <p>Query: {query}</p>
        <p>QueryType: {queryType}</p>
        <p>Min Price: {minPrice}</p>
        <p>Max Price: {maxPrice}</p>
        <p>QueryStatus: {queryStatus}</p>
      </div> */}
      {properties.length > 0 ? (
        <PropertyContainer totalPages={totalPages} currentPage={+pagenum}>
          {properties.map((propertyItem) => (
            <PropertyCard property={propertyItem} key={propertyItem.id} />
          ))}
        </PropertyContainer>
      ) : (
        <NoPropertiesFound /> // Affichage du composant NoPropertiesFound si aucune propriété n'est trouvée
      )}
    </div>
  );
}
