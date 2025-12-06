import { TranslationServiceClient } from "@google-cloud/translate";

const options = {
    projectId: process.env.GOOGLE_PROJECT_ID,
};

// If GOOGLE_API_KEY is present, use it (simplest for Vercel)
if (process.env.GOOGLE_API_KEY) {
    options.apiKey = process.env.GOOGLE_API_KEY;
}
// Otherwise, try Service Account credentials (if available)
else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    options.credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    };
}

const client = new TranslationServiceClient(options);

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
        throw error; // Re-throw to let the API route handle it and return 500
    }
}
