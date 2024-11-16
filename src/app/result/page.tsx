import prisma from "@/lib/prisma";
import Search from "../components/Search";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCard from "../components/PropertyCard";
import NoPropertiesFound from "./_components/noPropertiesFound";
import { Prisma } from "@prisma/client";

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

  // const sortOrder =
  //   searchParams.sortOrder === "desc" || searchParams.sortOrder === "asc"
  //     ? searchParams.sortOrder
  //     : undefined;

  // const sortOrder = searchParams.sortOrder ?? "date-desc"; // Valeur par défaut

  type SortOrder =
    | "price-asc"
    | "price-desc"
    | "date-asc"
    | "date-desc"
    | "surface-asc"
    | "surface-desc";

  const sortOrder = (
    Array.isArray(searchParams.sortOrder)
      ? searchParams.sortOrder[0]
      : searchParams.sortOrder
  ) as SortOrder;

  // const sortOrder = Array.isArray(searchParams.sortOrder)
  //   ? searchParams.sortOrder[0]
  //   : searchParams.sortOrder;

  // let orderBy = [];
  const orderBy: Prisma.PropertyOrderByWithRelationInput[] = [];

  // Définir le champ et l'ordre de tri
  // if (sortOrder && sortOrder.startsWith("price")) {
  //   orderBy.push({
  //     price: sortOrder.endsWith("asc") ? "asc" : "desc",
  //   });
  // } else if (sortOrder && sortOrder.startsWith("surface")) {
  //   orderBy.push({
  //     feature: {
  //       area: sortOrder.endsWith("asc") ? "asc" : "desc",
  //     },
  //   });
  // } else if (sortOrder && sortOrder.startsWith("date")) {
  //   orderBy.push({
  //     createdAt: sortOrder.endsWith("asc") ? "asc" : "desc",
  //   });
  // }

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

  // Si aucun tri n'est défini, triez par date décroissante par défaut
  if (orderBy.length === 0) {
    // orderBy.push({ createdAt: "desc" });
    orderBy.push({ price: "desc" });
  }

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
    // ...(sortOrder && { orderBy: { price: sortOrder } }), // Inclure seulement si sortOrder est défini
    orderBy, // Ajoutez la liste des critères de tri
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
