"use client";
export default async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result.split(",")[1]);
            } else {
                reject(new Error("Erreur : Le fichier n'a pas pu être lu en tant que chaîne."));
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}