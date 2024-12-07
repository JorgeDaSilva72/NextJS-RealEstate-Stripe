import Link from 'next/link';
import { cookies } from 'next/headers';
import prisma from "@/lib/prisma";
import PropertyContainer from '@/app/components/PropertyContainer';
import PropertyCard from '@/app/components/PropertyCard';
import NoPropertiesFound from '@/app/result/_components/noPropertiesFound';
import { Prisma } from "@prisma/client";
import { getUserIdFromToken, getSavedSearchTest, getFilterValues, SavedSearch } from '@/app/components/savedSearch';


const PAGE_SIZE = 12;

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

const SavedSearchesPage = async ({ searchParams }: Props) => {


    const userId = await getUserIdFromToken();
    const savedSearch = await getSavedSearchTest(userId) ?? null;
    console.log('user id avec savedsearch', savedSearch)
    console.log('table savedSearch', savedSearch)


    // Crée un objet pour stocker les valeurs
    const searchValues: { [key: string]: any } = {};

    // Vérification de l'existence de 'savedSearch' et itération sur les clés
    if (savedSearch) {
        // Parcours de chaque propriété de 'savedSearch' et affecte à searchValues
        for (const key in savedSearch) {
            if (savedSearch?.hasOwnProperty(key)) {
                // Utilisation d'un cast explicite pour éviter l'erreur TypeScript
                searchValues[key] = savedSearch[key as keyof SavedSearch];
            }
        }
    }

    const pagenum = searchParams.pagenum ?? 1;
    const query = searchParams.query ?? "";

    const queryStatusGet = savedSearch?.status?.value ?? '';
    const queryTypeGet = savedSearch?.type?.value ?? '';
    const sortOrderGet = savedSearch?.sortOrder ?? '';
    const cityGet = savedSearch?.city ?? '';
    const countryGet = savedSearch?.country ?? '';
    // const minPriceGet = savedSearch?.minPrice ?? '';
    // const maxPriceGet = savedSearch?.maxPrice ?? '';
    const minPriceGet = savedSearch?.minPrice !== undefined && savedSearch?.minPrice !== null
        ? Number(savedSearch?.minPrice)
        : undefined;

    const maxPriceGet = savedSearch?.maxPrice !== undefined && savedSearch?.maxPrice !== null
        ? Number(savedSearch?.maxPrice)
        : undefined;

    const minAreaGet = savedSearch?.minArea !== undefined && savedSearch?.minArea !== null
        ? Number(savedSearch?.minArea)
        : undefined;

    const maxAreaGet = savedSearch?.maxArea !== undefined && savedSearch?.maxArea !== null
        ? Number(savedSearch?.maxArea)
        : undefined;

    const minRoomGet = savedSearch?.minRoom !== undefined && savedSearch?.minRoom !== null
        ? Number(savedSearch?.minRoom)
        : undefined;

    const maxRoomGet = savedSearch?.maxRoom !== undefined && savedSearch?.maxRoom !== null
        ? Number(savedSearch?.maxRoom)
        : undefined;

    const minBathroomGet = savedSearch?.minBathroom !== undefined && savedSearch?.minBathroom !== null
        ? Number(savedSearch?.minBathroom)
        : undefined;

    const maxBathroomGet = savedSearch?.maxBathroom !== undefined && savedSearch?.maxBathroom !== null
        ? Number(savedSearch?.maxBathroom)
        : undefined;



    interface FilterValue {
        name: string;
        value?: string;
        type?: string;
        range?: number[];
    }
    // const filterValues: FilterValue[] = getFilterValues(savedSearch);
    const filterValues: FilterValue[] = Array.isArray(getFilterValues(savedSearch)) ?
        getFilterValues(savedSearch) : [];


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


    const queryStatus = queryStatusGet ?? "";
    const queryType = queryTypeGet ?? "";
    const city = cityGet ?? "";

    const country = countryGet ?? "";

    // Utiliser les valeurs de minPriceTest et maxPriceTest en fonction de hasUserSelected
    const minPrice = minPriceGet !== undefined ? minPriceGet : undefined;
    const maxPrice = maxPriceGet !== undefined ? maxPriceGet : undefined;
    const minArea = minAreaGet !== undefined ? minPriceGet : undefined;
    const maxArea = maxAreaGet !== undefined ? maxPriceGet : undefined;
    const minBedrooms = minRoomGet !== undefined ? minPriceGet : undefined;
    const maxBedrooms = maxRoomGet !== undefined ? maxPriceGet : undefined;
    const minBathrooms = minBathroomGet !== undefined ? minPriceGet : undefined;
    const maxBathrooms = maxBathroomGet !== undefined ? maxPriceGet : undefined;

    console.log('query minArea', minArea)
    console.log('query maxArea', maxArea)
    console.log('query minPrice', minPrice)
    console.log('query maxPrice', maxPrice)
    console.log('query minBathrooms', minBathrooms)
    console.log('query maxBathrooms', maxBathrooms)
    console.log('query minBedrooms', minBedrooms)
    console.log('query maxBedrooms', maxBedrooms)



    // const pagenum = searchParams.pagenum ?? 1;
    // const query = searchParams.query ?? "";
    // const queryStatus = searchParams.queryStatus ?? "";
    // const queryType = searchParams.queryType ?? "";
    // const city = searchParams.city ?? "";
    // const country = searchParams.country ?? "";




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

    // console.log('queryStatus', queryStatus);
    // console.log('queryType', queryType);
    // console.log('country', country);
    // console.log('city', city);
    // console.log('min price', firstPrice);
    // console.log('max price', maxPrice);
    // console.log('area', firstBathroom);

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
};

export default SavedSearchesPage;
