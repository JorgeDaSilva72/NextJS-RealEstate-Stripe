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
  const city = searchParams.city ?? "";
  const country = searchParams.country ?? "";

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
          parkingSpots: true,
        },
      },
      status: true,
      type: true,
    },
    where: {
      ...(!!query && {
        name: {
          contains: String(query),
          mode: "insensitive", // Rendre la recherche insensible à la casse
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
      ...(!!city && {
        // Ajout du filtre pour la ville
        location: {
          city: {
            equals: String(city), // Vérifie si la ville correspond
          },
        },
      }),
      ...(!!country && {
        // Ajout du filtre pour le pays
        location: {
          state: {
            equals: String(country), // Vérifie si la ville correspond
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
      user: {
        subscriptions: {
          some: {
            //Vérifie si au moins un abonnement lié à l'utilisateur satisfait la condition suivante.
            endDate: {
              gt: new Date(), // Vérifie que endDate est dans le futur
            },
          },
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
      ...(!!city && {
        // Ajout du filtre pour la ville
        location: {
          city: {
            equals: String(city), // Vérifie si la ville correspond
          },
        },
      }),
      ...(!!country && {
        // Ajout du filtre pour le pays
        location: {
          state: {
            equals: String(country), // Vérifie si la ville correspond
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
      user: {
        subscriptions: {
          some: {
            endDate: {
              gt: new Date(),
            },
          },
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

  // const totalPages = Math.floor(totalProperties / PAGE_SIZE + 1);
  const totalPages = Math.ceil(totalProperties / PAGE_SIZE);

  return (
    <div className=" w-full min-h-screen bg-gray-100">
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
