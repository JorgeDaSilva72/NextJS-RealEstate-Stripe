import { TranslationServiceClient } from "@google-cloud/translate";

const client = new TranslationServiceClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    },
});

/**
 * Translate text to a target language using Google Cloud Translation API
 * @param {string} text - The text to translate
 * @param {string} targetLanguage - Target language code (e.g., 'en', 'fr')
 * @returns {Promise<string>} The translated text
 */
export async function translateText(text, targetLanguage) {
    if (!text || !text.trim()) {
        return text;
    }

    try {
        const request = {
            parent: `projects/${process.env.GOOGLE_PROJECT_ID}/locations/global`,
            contents: [text],
            mimeType: "text/plain",
            targetLanguageCode: targetLanguage,
        };

        const [response] = await client.translateText(request);
        return response.translations[0]?.translatedText || text;
    } catch (error) {
        console.error("Translation error:", error);
        // Return original text if translation fails
        return text;
    }
}
