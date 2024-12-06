// cronJob.js
// import cron from 'node-cron';  // Importez la librairie
import * as cron from 'node-cron';
import prisma from "@/lib/prisma";  // Utilisez prisma pour accéder à la base de données
import { sendEmail } from "@/app/services/searchService";  // Importez la fonction d'envoi d'email

// Cette fonction contient la logique de recherche des propriétés et d'envoi des emails
async function sendEmailsOnMatching() {
    try {
        const savedSearches = await prisma.savedSearch.findMany();
        const properties = await prisma.property.findMany({
            include: { location: true },
        });

        for (const search of savedSearches) {
            const matchingProperties = properties.filter((property) => {
                const isQueryStatusMatching = search.queryStatus === property.statusId;
                const isQueryTypeMatching = search.queryType === property.typeId;
                const isCountryMatching = !search.country || search.country.toLowerCase() === property.location?.state.toLowerCase();
                return isQueryStatusMatching && isQueryTypeMatching && isCountryMatching;
            });

            if (matchingProperties.length > 0) {
                console.log(`Propriétés correspondantes trouvées pour la recherche "${search.name}" de l'utilisateur ${search.userId}.`);

                const user = await prisma.savedSearch.findUnique({
                    where: { id: search.id },
                    include: { user: true },
                });

                if (user && user.user) {
                    const userEmail = user.user.email;
                    console.log('Email de l\'utilisateur:', userEmail);

                    await sendEmail(userEmail);  // Envoi de l'email
                    console.log(`Email envoyé à ${userEmail}`);
                } else {
                    console.log('Aucun utilisateur trouvé pour cette recherche sauvegardée.');
                }
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi des emails :", error);
    }
}

// Planifier l'exécution de cette fonction toutes les 5 minutes
cron.schedule('*/5 * * * *', async () => {
    console.log('Exécution du job pour envoyer des emails...');
    await sendEmailsOnMatching();
});
