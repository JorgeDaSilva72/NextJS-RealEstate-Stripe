// emailService.ts
import nodemailer from "nodemailer";

// Créez un transporteur pour envoyer des e-mails
const transporter = nodemailer.createTransport({
    service: "gmail", // Exemple avec Gmail, vous pouvez utiliser d'autres services
    auth: {
        user: process.env.EMAIL_USER,  // Email d'expéditeur
        pass: process.env.EMAIL_PASS   // Mot de passe de l'expéditeur
    }
});

// Fonction d'envoi d'email
export async function sendEmail(userEmail: string) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Nouvelle annonce correspondant à votre profil",
        text: `Bonjour,

        Nous avons une nouvelle annonce qui correspond à vos critères de recherche. N'hésitez pas à consulter les détails sur notre plateforme.

        Cordialement,
        L'équipe`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail envoyé à ${userEmail}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
    }
}
