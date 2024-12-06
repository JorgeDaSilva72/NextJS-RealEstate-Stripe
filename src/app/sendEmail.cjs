"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer = require("nodemailer");
// Créer un transporteur pour envoyer l'email
var transporter = nodemailer.createTransport({
    service: 'gmail', // Service de messagerie (ici Gmail, mais peut être changé)
    auth: {
        user: 'rravoniainarivah@gmail.com', // Remplacez par votre adresse e-mail
        pass: 'iayf hpuk zzwv ebmo', // Remplacez par votre mot de passe (ou mot de passe d'application si vous avez l'authentification à 2 facteurs)
    },
});
// Définir les options de l'e-mail
var mailOptions = {
    from: 'rravoniainarivah@gmail.com', // Votre adresse e-mail
    to: 'tahirynirina001@gmail.com', // L'adresse du destinataire
    subject: 'Test Nodemailer',
    text: 'Ceci est un e-mail de test envoyé avec Nodemailer.',
};
// Envoyer l'e-mail
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log('Erreur : ', error);
    }
    else {
        console.log('E-mail envoyé : ' + info.response);
    }
});
