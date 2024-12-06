import prisma from "@/lib/prisma"; // Assurez-vous d'importer correctement Prisma
import { NextResponse } from "next/server"; // Importer NextResponse de next/server

// Cette fonction gère les requêtes POST envoyées à /api/savedsearch
export async function POST(req: Request) {
    try {
        // Extraction des données du corps de la requête
        const { userId, name, filters } = await req.json();

        const queryStatusFilter = filters.find((filter: any) => filter.name === 'queryStatus');
        const queryTypeFilter = filters.find((filter: any) => filter.name === 'queryType');

        const queryStatus = queryStatusFilter ? queryStatusFilter.value : '0';
        const queryType = queryTypeFilter ? queryTypeFilter.value : '0';
        // Convertir les valeurs en entiers
        const queryStatusInt = parseInt(queryStatus, 10);
        const queryTypeInt = parseInt(queryType, 10);

       

        console.log('queryStatusInt', queryStatusInt);  // Vérifier si la conversion fonctionne correctement
        console.log('queryTypeInt', queryTypeInt);      // Vérifier si la conversion fonctionne correctement

        // Préparer les filtres pour l'insertion ou la mise à jour
        const filterMap = filters.reduce((acc: Record<string, any>, filter: any) => {
            if (filter.name === "price") {
                acc["minPrice"] = filter.range?.[0];
                acc["maxPrice"] = filter.range?.[1];
            } else if (filter.name === "area") {
                acc["minArea"] = filter.range?.[0];
                acc["maxArea"] = filter.range?.[1];
            } else if (filter.name === "room") {
                acc["minRoom"] = filter.range?.[0];
                acc["maxRoom"] = filter.range?.[1];
            } else if (filter.name === "bathroom") {
                acc["minBathroom"] = filter.range?.[0];
                acc["maxBathroom"] = filter.range?.[1];
            } else {
                acc[filter.name] = filter.value;
            }
            return acc;
        }, {});

        // Ajouter queryStatus et queryType aux filtres
        if (!isNaN(queryStatusInt)) {
            filterMap['queryStatus'] = queryStatusInt;
        }
        if (!isNaN(queryTypeInt)) {
            filterMap['queryType'] = queryTypeInt;
        }

        // Vérifier si une entrée avec ce `userId` existe déjà
        const existingEntry = await prisma.savedSearch.findFirst({
            where: { userId }, // Utilisez la colonne `userId` pour trouver l'entrée
        });

        // Déclarez une seule variable pour stocker le résultat
        let savedSearch;

        if (existingEntry) {
            // Mise à jour de l'entrée existante
            savedSearch = await prisma.savedSearch.update({
                where: { id: existingEntry.id },
                data: {
                    name, // Utilisation du nom fourni
                    ...filterMap, // Applique les filtres extraits
                },
            });
        } else {
            // Création d'une nouvelle entrée
            savedSearch = await prisma.savedSearch.create({
                data: {
                    userId,
                    name, // Utilisation du nom fourni
                    ...filterMap, // Applique les filtres extraits
                },
            });
        }

        // Retourner la réponse sous forme de JSON avec un statut 200 en cas de succès
        return NextResponse.json(savedSearch);
    } catch (error) {
        // Retourner une erreur en cas de problème avec un statut 500
        console.error("Erreur lors de la création de la recherche sauvegardée:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
