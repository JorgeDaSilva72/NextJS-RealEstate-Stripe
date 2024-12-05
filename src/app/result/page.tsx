import prisma from "@/lib/prisma";
import { cookies } from 'next/headers';
import Search from "../components/Search";
import PropertyContainer from "../components/PropertyContainer";
import PropertyCard from "../components/PropertyCard";
import NoPropertiesFound from "./_components/noPropertiesFound";
import { Prisma } from "@prisma/client";
import { jwtDecode } from 'jwt-decode';

const PAGE_SIZE = 12;
const getUserIdFromToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value || '';

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub;
    } catch (error) {
      console.error("Token invalide ou erreur lors du décodage:", error);
      return null;
    }
  }

  return null;
};

const getSavedSearch = async (userId: string | null) => {
  if (userId) {
    return await prisma.savedSearch.findFirst({
      where: { userId: userId },
    });
  }
  return null;
};

const getFilterValues = (savedSearch: any) => {
  return savedSearch?.filters ? JSON.parse(savedSearch.filters) : {};
};


interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: Props) {

  const userId = await getUserIdFromToken();
  const savedSearch = await getSavedSearch(userId);
  // console.log('table savedSearch', savedSearch)

  // const filterValues = getFilterValues(savedSearch);


  interface FilterValue {
    name: string;
    value?: string;
    type?: string;
    range?: number[];
  }
  const filterValues: FilterValue[] = getFilterValues(savedSearch);


  const namesAndValues = filterValues.map(item => {
    // Ajouter une valeur par défaut pour les champs où "value" est vide
    if (!item.value && item.name) {
      return {
        ...item,
        value: '', // Par exemple : valeur par défaut
      };
    }
    // Si aucune transformation n'est nécessaire, renvoyer l'objet tel quel
    return item;
  });

  const keyValueObject = namesAndValues.reduce((acc: Record<string, string | number[] | undefined>, item) => {
    acc[item.name] = item.value || item.range; // Priorité à `value`, sinon utiliser `range`
    return acc;
  }, {});
  // console.log("Objet clé-valeur :", keyValueObject);

  const queryTypeFilter = keyValueObject.queryType ?? "";
  const queryStatusFilter = keyValueObject.queryStatus ?? "";
  const queryCountryFilter = keyValueObject.country ?? "";
  const queryCityFilter = keyValueObject.city ?? "";

  const firstPrice = keyValueObject?.price?.[0];
  const firstArea = keyValueObject?.area?.[0];
  const firstRoom = keyValueObject?.room?.[0];
  const firstBathroom = keyValueObject?.bathroom?.[0];

  const secondPrice = keyValueObject?.price?.[1];
  const secondArea = keyValueObject?.area?.[1];
  const secondRoom = keyValueObject?.room?.[1];
  const secondBathroom = keyValueObject?.bathroom?.[1];


  // Récupérer le PropertyType correspondant à queryType
  const propertyTypeValue = await prisma.propertyType.findUnique({
    where: { id: Number(queryTypeFilter) },
    select: {
      value: true
    }
  });

  const propertyStatusValue = await prisma.propertyStatus.findUnique({
    where: { id: Number(queryStatusFilter) },
    select: {
      value: true
    }
  });


  const hasUserSelected = Object.keys(searchParams).some(
    key => searchParams[key] !== undefined && searchParams[key] !== null
  );
  // console.log('user selected', hasUserSelected)

  // Si l'utilisateur a sélectionné un champ, on utilise uniquement `searchParams`. Sinon, on prend les valeurs par défaut.
  const pagenum = hasUserSelected ? searchParams.pagenum ?? 1 : 1;
  const query = hasUserSelected ? searchParams.query ?? "" : "";

  const queryStatus = hasUserSelected
    ? searchParams.queryStatus ?? ""
    : propertyStatusValue?.value ?? "";

  const queryType = hasUserSelected
    ? searchParams.queryType ?? ""
    : propertyTypeValue?.value ?? "";

  const city = hasUserSelected
    ? searchParams.city ?? ""
    : queryCityFilter ?? "";

  const country = hasUserSelected
    ? searchParams.country ?? ""
    : queryCountryFilter ?? "";



  // const pagenum = searchParams.pagenum ?? 1;
  // const query = searchParams.query ?? "";
  // const queryStatus = searchParams.queryStatus ?? "";
  // const queryType = searchParams.queryType ?? "";
  // const city = searchParams.city ?? "";
  // const country = searchParams.country ?? "";

  const minPrice = searchParams.minPrice

    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;

  // const minPrice = hasUserSelected
  //   ? searchParams.minPrice
  //     ? Number(searchParams.minPrice)
  //     : firstPrice ?? undefined
  //   : undefined;

  // const maxPrice = hasUserSelected
  //   ? searchParams.maxPrice
  //     ? Number(searchParams.maxPrice)
  //     : secondPrice ?? undefined
  //   : undefined;

  const minArea = searchParams.minArea
    ? Number(searchParams.minArea)
    : undefined;
  const maxArea = searchParams.maxArea
    ? Number(searchParams.maxArea)
    : undefined;

  // const minArea = hasUserSelected
  //   ? searchParams.minArea
  //     ? Number(searchParams.minArea)
  //     : firstArea ?? undefined
  //   : undefined;

  // const maxArea = hasUserSelected
  //   ? searchParams.maxArea
  //     ? Number(searchParams.maxArea)
  //     : secondArea ?? undefined
  //   : undefined;

  const minBedrooms = searchParams.minBedrooms
    ? Number(searchParams.minBedrooms)
    : undefined;
  const maxBedrooms = searchParams.maxBedrooms
    ? Number(searchParams.maxBedrooms)
    : undefined;

  // const minBedrooms = hasUserSelected
  //   ? searchParams.minBedrooms
  //     ? Number(searchParams.minBedrooms)
  //     : firstRoom ?? undefined
  //   : undefined;

  // const maxBedrooms = hasUserSelected
  //   ? searchParams.maxBedrooms
  //     ? Number(searchParams.maxBedrooms)
  //     : secondRoom ?? undefined
  //   : undefined;

  const minBathrooms = searchParams.minBathrooms
    ? Number(searchParams.minBathrooms)
    : undefined;
  const maxBathrooms = searchParams.maxBathrooms
    ? Number(searchParams.maxBathrooms)
    : undefined;

  // const minBathrooms = hasUserSelected
  //   ? searchParams.minBathrooms
  //     ? Number(searchParams.minBathrooms)
  //     : firstBathroom ?? undefined
  //   : undefined;

  // const maxBathrooms = hasUserSelected
  //   ? searchParams.maxBathrooms
  //     ? Number(searchParams.maxBathrooms)
  //     : secondBathroom ?? undefined
  //   : undefined;




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
    },
  });

  console.log('queryStatus', queryStatus);
  console.log('queryType', queryType);
  console.log('country', country);
  console.log('city', city);
  console.log('price', firstPrice);
  console.log('area', firstArea);
  console.log('price', firstRoom);
  console.log('area', firstBathroom);

  const [properties, totalProperties] = await Promise.all([
    propertiesPromise,
    totalPropertiesPromise,
  ]);


  const totalPages = Math.floor(totalProperties / PAGE_SIZE + 1);


  // Récupération du token depuis les cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('id_token')?.value || ''; // Assurez-vous que le token est bien présent ici

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Passez le token récupéré à Search */}
      <Search token={token} />
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
