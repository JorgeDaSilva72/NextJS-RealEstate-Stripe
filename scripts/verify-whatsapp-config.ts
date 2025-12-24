/**
 * Script de Vérification de la Configuration WhatsApp
 * 
 * Ce script vérifie que toutes les variables d'environnement nécessaires
 * pour l'intégration WhatsApp sont correctement configurées.
 * 
 * Usage: npm run whatsapp:verify
 * 
 * Note: Les variables d'environnement sont chargées automatiquement par Next.js
 * Assurez-vous que votre fichier .env.local existe et contient les variables nécessaires
 */

interface ConfigCheck {
  name: string;
  value: string | undefined;
  required: boolean;
  valid: boolean;
  message: string;
}

const checks: ConfigCheck[] = [];

// Fonction pour vérifier une variable
function checkVariable(name: string, required: boolean = true): ConfigCheck {
  const value = process.env[name];
  const valid = required ? !!value : true;
  
  let message = '';
  if (!value && required) {
    message = `❌ Manquant - Ajoutez ${name} dans .env.local`;
  } else if (!value && !required) {
    message = `⚠️ Optionnel - Non configuré`;
  } else if (value && (value.includes('your_') || value.includes('votre_'))) {
    message = `⚠️ Valeur par défaut détectée - Remplacez par votre vraie valeur`;
  } else {
    message = `✅ Configuré`;
  }

  return {
    name,
    value: value ? (name.includes('TOKEN') || name.includes('SECRET') || name.includes('KEY') 
      ? `${value.substring(0, 10)}...` 
      : value) : undefined,
    required,
    valid,
    message,
  };
}

// Vérifier toutes les variables nécessaires
console.log('\n🔍 Vérification de la Configuration WhatsApp\n');
console.log('=' .repeat(60));

// Variables requises
checks.push(checkVariable('WHATSAPP_API_VERSION'));
checks.push(checkVariable('WHATSAPP_BUSINESS_ACCOUNT_ID'));
checks.push(checkVariable('WHATSAPP_PHONE_NUMBER_ID'));
checks.push(checkVariable('WHATSAPP_ACCESS_TOKEN'));
checks.push(checkVariable('WHATSAPP_APP_ID'));
checks.push(checkVariable('WHATSAPP_APP_SECRET'));
checks.push(checkVariable('WHATSAPP_WEBHOOK_VERIFY_TOKEN'));
checks.push(checkVariable('WHATSAPP_WEBHOOK_URL'));

// Variables optionnelles mais recommandées
checks.push(checkVariable('WHATSAPP_ENCRYPTION_KEY', false));
checks.push(checkVariable('WHATSAPP_ENABLED', false));
checks.push(checkVariable('WHATSAPP_DEBUG_MODE', false));
checks.push(checkVariable('NEXT_PUBLIC_BASE_URL', false));

// Afficher les résultats
let allValid = true;
let hasWarnings = false;

checks.forEach((check) => {
  const status = check.valid ? '✅' : check.required ? '❌' : '⚠️';
  console.log(`${status} ${check.name.padEnd(35)} ${check.message}`);
  
  if (check.value && !check.value.includes('your_') && !check.value.includes('votre_')) {
    console.log(`   Valeur: ${check.value}`);
  }
  
  if (!check.valid && check.required) {
    allValid = false;
  }
  if (!check.valid && !check.required) {
    hasWarnings = true;
  }
});

console.log('\n' + '='.repeat(60));

// Vérifications supplémentaires
console.log('\n📋 Vérifications Supplémentaires\n');

// Vérifier le format de l'URL webhook
const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
if (webhookUrl) {
  if (!webhookUrl.startsWith('https://')) {
    console.log('⚠️ WHATSAPP_WEBHOOK_URL doit commencer par https://');
    hasWarnings = true;
  } else {
    console.log('✅ URL Webhook valide (HTTPS)');
  }
}

// Vérifier la longueur du token de vérification
const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
if (verifyToken) {
  if (verifyToken.length < 32) {
    console.log('⚠️ WHATSAPP_WEBHOOK_VERIFY_TOKEN devrait faire au moins 32 caractères pour la sécurité');
    hasWarnings = true;
  } else {
    console.log('✅ Token de vérification webhook sécurisé');
  }
}

// Vérifier la longueur de la clé de chiffrement
const encryptionKey = process.env.WHATSAPP_ENCRYPTION_KEY;
if (encryptionKey) {
  if (encryptionKey.length < 32) {
    console.log('⚠️ WHATSAPP_ENCRYPTION_KEY devrait faire au moins 32 caractères');
    hasWarnings = true;
  } else {
    console.log('✅ Clé de chiffrement sécurisée');
  }
}

// Vérifier la version de l'API
const apiVersion = process.env.WHATSAPP_API_VERSION;
if (apiVersion) {
  const versionMatch = apiVersion.match(/^v(\d+)\.(\d+)$/);
  if (!versionMatch) {
    console.log('⚠️ WHATSAPP_API_VERSION format invalide (devrait être v18.0, v19.0, etc.)');
    hasWarnings = true;
  } else {
    const major = parseInt(versionMatch[1]);
    if (major < 18) {
      console.log('⚠️ Version API ancienne détectée. Recommandé: v18.0 ou supérieur');
      hasWarnings = true;
    } else {
      console.log(`✅ Version API valide: ${apiVersion}`);
    }
  }
}

// Résumé final
console.log('\n' + '='.repeat(60));
console.log('\n📊 RÉSUMÉ\n');

if (allValid && !hasWarnings) {
  console.log('✅ Toutes les configurations sont valides !');
  console.log('🚀 Vous êtes prêt à utiliser WhatsApp Cloud API\n');
  process.exit(0);
} else if (allValid && hasWarnings) {
  console.log('⚠️ Configuration valide mais avec des avertissements');
  console.log('💡 Consultez les messages ci-dessus pour les améliorations\n');
  process.exit(0);
} else {
  console.log('❌ Configuration incomplète');
  console.log('📖 Consultez GUIDE_INTEGRATION_WHATSAPP_FR.md pour les instructions\n');
  process.exit(1);
}

