const { v2 } = require('@google-cloud/translate');
const { Translate } = v2;

const options = {
    projectId: process.env.GOOGLE_PROJECT_ID,
};

// 1. If GOOGLE_API_KEY is present, use it (simplest for Vercel)
if (process.env.GOOGLE_API_KEY) {
    options.key = process.env.GOOGLE_API_KEY;
}
// 2. If Workload Identity Federation is configured (Vercel OIDC)
else if (process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER_ID && process.env.GOOGLE_PROJECT_NUMBER) {
    const fs = require('fs');
    const path = require('path');

    // Generate the configuration content expected by Google Cloud libraries
    const wifConfig = {
        type: 'external_account',
        audience: `//iam.googleapis.com/projects/${process.env.GOOGLE_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${process.env.GOOGLE_WORKLOAD_IDENTITY_POOL_ID || 'vercel-pool'}/providers/${process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER_ID}`,
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: 'https://sts.googleapis.com/v1/token',
        service_account_impersonation_url: `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}:generateAccessToken`,
        credential_source: {
            environment_id: 'VERCEL_OIDC_TOKEN'
        }
    };

    // Write to a temporary file
    const credsPath = path.join('/tmp', 'gcp_wif_config.json');
    try {
        fs.writeFileSync(credsPath, JSON.stringify(wifConfig));
        // Tell Google Cloud SDK to use this file
        process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;
        console.log("Using Workload Identity Federation credentials");
    } catch (e) {
        console.error("Failed to write WIF config:", e);
    }

    options.projectId = process.env.GOOGLE_PROJECT_ID;
}
// 3. Otherwise, try Service Account credentials from env vars (legacy method)
else if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    options.credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    };
}

const translate = new Translate(options);

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
        const [translation] = await translate.translate(text, targetLanguage);
        return translation;
    } catch (error) {
        console.error("Translation error:", error);
        throw error; // Re-throw to let the API route handle it and return 500
    }
}
