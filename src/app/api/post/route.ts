// src/app/api/post/route.ts

import prisma from "@/lib/prisma";  // Assurez-vous d'importer correctement Prisma
import { NextResponse } from "next/server";  // Importer NextResponse de next/server

// Cette fonction gère les requêtes POST envoyées à /api/savedsearch
export async function POST(req: Request) {
    try {
        // Extraction des données du corps de la requête
        const { userId, name, filters } = await req.json();

        // Convertir les filtres en chaîne JSON
        const filtersJson = JSON.stringify(filters);
        // Si des filtres sont fournis, les convertir en chaîne JSON, sinon les définir comme une chaîne vide
        // const filtersJson = filters ? JSON.stringify(filters) : "";  // Gérer le cas où `filters` peut être vide

        // Vérifier si une entrée avec ce `userId` existe déjà
        const existingEntry = await prisma.savedSearch.findFirst({
            where: { userId },  // Utilisez la colonne `userId` pour trouver l'entrée
        });

        console.log('existing id', existingEntry)

        let savedSearch;

        if (existingEntry) {
            savedSearch = await prisma.savedSearch.update({
                where: { id: existingEntry.id },
                data: {
                    name,
                    filters: filtersJson,  // Mise à jour des colonnes avec les nouvelles données
                },
            })
        } else {
            // Création de la recherche sauvegardée dans la base de données
            const savedSearch = await prisma.savedSearch.create({
                data: {
                    userId,
                    name,
                    filters: filtersJson,  // Utilisation de la chaîne JSON des filtres
                },
            });
        }


        // Retourner la réponse sous forme de JSON avec un statut 200 en cas de succès
        return NextResponse.json(savedSearch);
    } catch (error) {
        // Retourner une erreur en cas de problème avec un statut 500
        console.error("Erreur lors de la création de la recherche sauvegardée:", error);  // Ajouter un log pour l'erreur
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
