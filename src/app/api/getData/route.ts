import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Récupérer les recherches sauvegardées et les propriétés
        const savedSearches = await prisma.savedSearch.findMany();
        // const properties = await prisma.property.findMany();
        const properties = await prisma.property.findMany({
            include: {
                location: true,  // Inclure la localisation de la propriété
            }
        });

        savedSearches.forEach((search) => {
            const matchingProperties = properties.filter((property) => {
                // Comparaison des critères
                const isQueryStatusMatching = search.queryStatus === property.statusId;
                const isQueryTypeMatching = search.queryType === property.typeId;
                // Vérifier que search.country n'est pas null avant de comparer
                const isCountryMatching = !search.country || search.country.toLowerCase() === property.location?.state.toLowerCase();
                // Vérifier si tous les critères sont remplis
                const isCriteriaMatching = isQueryStatusMatching && isQueryTypeMatching && isCountryMatching;

                // Si les critères sont remplis, alerter
                if (isCriteriaMatching) {
                    console.log(`Propriété "${property.name}" correspond aux critères de recherche.`);
                    console.log(`Critères vérifiés : 
                                queryStatus (${search.queryStatus}) == statusId (${property.statusId}), 
                                queryType (${search.queryType}) == typeId (${property.typeId}),
                                country (${search.country}) == state (${property.location?.state})`);
                }

                return isCriteriaMatching;
            });

            if (matchingProperties.length > 0) {
                console.log(`Propriétés correspondantes trouvées pour la recherche "${search.name}" de l'utilisateur ${search.userId}.`);
            }
        });




        return NextResponse.json(
            { message: "Matching properties processed successfully" },
            { status: 200 }
        );
        // return NextResponse.json([properties], { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return NextResponse.json(
            { error: "Failed to process matching properties" },
            { status: 500 }
        );
    }
}
