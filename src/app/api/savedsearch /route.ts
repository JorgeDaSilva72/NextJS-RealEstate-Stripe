// src/app/api/savedsearch/route.ts

import prisma from "@/lib/prisma"; // Assurez-vous d'importer correctement Prisma

export async function POST(req: Request) {
    try {
        const { userId, name, filters } = await req.json();  // Extraction des données du corps de la requête

        // Vérifier que les données requises sont présentes
        if (!userId || !name || !filters) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                { status: 400 }
            );
        }

        // Convertir les filtres en chaîne JSON
        const filtersJson = JSON.stringify(filters);

        // Créer la recherche sauvegardée dans la base de données
        const savedSearch = await prisma.savedSearch.create({
            data: {
                userId,
                name,
                filters: filtersJson,
            },
        });

        // Retourner la réponse sous forme de JSON
        return new Response(JSON.stringify(savedSearch), { status: 200 });
    } catch (error) {
        console.error("Error in POST request:", error);
        // Retourner une erreur en cas de problème
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            { status: 500 }
        );
    }
}
