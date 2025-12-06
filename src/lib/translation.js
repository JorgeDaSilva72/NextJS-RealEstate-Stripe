import { TranslationServiceClient } from "@google-cloud/translate";

const client = new TranslationServiceClient({
    // Do NOT use credentials (no private key or client email)
    // Use Application Default Credentials or service account impersonation
    projectId: process.env.GOOGLE_PROJECT_ID,
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
