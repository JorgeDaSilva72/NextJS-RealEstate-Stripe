import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/app/services/searchService";

export async function GET() {
    try {
        // Récupérer les recherches sauvegardées
        const savedSearches = await prisma.savedSearch.findMany();

        // Récupérer toutes les propriétés avec leur localisation
        const properties = await prisma.property.findMany({
            include: {
                location: true,
            }
        });

        for (const search of savedSearches) {
            // Filtrer les propriétés en fonction des critères de recherche
            const matchingProperties = properties.filter((property) => {
                const isQueryStatusMatching = search.queryStatus === property.statusId;
                const isQueryTypeMatching = search.queryType === property.typeId;
                const isCountryMatching = !search.country || search.country.toLowerCase() === property.location?.state.toLowerCase();

                // Vérification finale de tous les critères
                return isQueryStatusMatching && isQueryTypeMatching && isCountryMatching;
            });

            // Si des propriétés correspondent, envoyer un email
            if (matchingProperties.length > 0) {
                console.log(`Propriétés correspondantes trouvées pour la recherche "${search.name}" de l'utilisateur ${search.userId}.`);

                // Récupérer l'utilisateur associé à la recherche sauvegardée
                const user = await prisma.savedSearch.findUnique({
                    where: {
                        id: search.id, // Utilisez l'ID de la recherche pour trouver l'utilisateur
                    },
                    include: {
                        user: true, // Inclure l'utilisateur
                    }
                });

                if (user && user.user) {
                    const userEmail = user.user.email;
                    console.log('Email de l\'utilisateur:', userEmail);  // Accédez correctement à l'email

                    // Envoi de l'email
                    await sendEmail(userEmail);  // Appel à la fonction d'envoi d'email
                    console.log(`Email envoyé à ${userEmail}`);
                } else {
                    console.log('Aucun utilisateur trouvé pour cette recherche sauvegardée.');
                }
            }
        }

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
