import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";


import { sendEmail } from "@/app/services/searchService";

export async function GET() {
    try {
        const savedSearches = await prisma.savedSearch.findMany();
        const properties = await prisma.property.findMany({
            include: {
                location: true,
            }
        });

        savedSearches.forEach((search) => {
            const matchingProperties = properties.filter((property) => {
                const isQueryStatusMatching = search.queryStatus === property.statusId;
                const isQueryTypeMatching = search.queryType === property.typeId;
                const isCountryMatching = !search.country || search.country.toLowerCase() === property.location?.state.toLowerCase();
                const isCriteriaMatching = isQueryStatusMatching && isQueryTypeMatching && isCountryMatching;

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

                // Envoi de l'email si des propriétés correspondent
                // const userEmail = "user@example.com";  // Vous devez récupérer l'email de l'utilisateur depuis la base de données
                // sendEmail(userEmail);  // Appel à la fonction d'envoi d'email
            }
        });

        return NextResponse.json(
            { message: "Matching properties processed successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return NextResponse.json(
            { error: "Failed to process matching properties" },
            { status: 500 }
        );
    }
}