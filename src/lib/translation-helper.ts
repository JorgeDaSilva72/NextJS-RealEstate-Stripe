/**
 * Frontend helper function to translate text via the API
 * @param text - The text to translate
 * @param targetLang - Target language code ('en' or 'fr')
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
