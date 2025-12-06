/**
 * Frontend helper function to translate text via the API
 * @param text - The text to translate
 * @param targetLang - Target language code ('en', 'ar', 'pt', etc.)
 * @returns Promise with the translated text
 */
export async function translateField(
    text: string,
    targetLang: string
): Promise<string> {
    if (!text || !text.trim()) {
        return text;
    }

    try {
        const res = await fetch("/api/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text, target: targetLang }),
        });

        if (!res.ok) {
            console.error("Translation API failed:", await res.text());
            return text;
        }

        const data = await res.json();
        return data.translation || text;
    } catch (error) {
        console.error("Translation error:", error);
        // Return original text if translation fails
        return text;
    }
}

/**
 * Translate text to multiple languages at once
 * @param text - The text to translate
 * @param targetLangs - Array of target language codes ['en', 'ar', 'pt']
 * @returns Promise with object containing all translations
 */
export async function translateToMultipleLanguages(
    text: string,
    targetLangs: string[]
): Promise<Record<string, string>> {
    if (!text || !text.trim()) {
        return targetLangs.reduce((acc, lang) => ({ ...acc, [lang]: text }), {});
    }

    try {
        const translations = await Promise.all(
            targetLangs.map(lang => translateField(text, lang))
        );

        return targetLangs.reduce((acc, lang, index) => ({
            ...acc,
            [lang]: translations[index]
        }), {});
    } catch (error) {
        console.error("Multi-language translation error:", error);
        return targetLangs.reduce((acc, lang) => ({ ...acc, [lang]: text }), {});
    }
}
