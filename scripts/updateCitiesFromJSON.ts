import * as fs from 'fs';
import * as path from 'path';

// Mapping des noms de pays du JSON vers les codes ISO du seed
const countryNameToCode: Record<string, string> = {
  "Algeria": "DZ",
  "Angola": "AO",
  "Benin": "BJ",
  "Botswana": "BW",
  "Burkina Faso": "BF",
  "Burundi": "BI",
  "Cameroon": "CM",
  "Cape Verde": "CV",
  "Central African Republic": "CF",
  "Chad": "TD",
  "Comoros": "KM",
  "Democratic Republic of the Congo": "CD",
  "Republic of the Congo": "CG",
  "Côte d'Ivoire": "CI",
  "Djibouti": "DJ",
  "Egypt": "EG",
  "Equatorial Guinea": "GQ",
  "Eritrea": "ER",
  "Eswatini": "SZ",
  "Ethiopia": "ET",
  "Gabon": "GA",
  "The Gambia": "GM",
  "Ghana": "GH",
  "Guinea": "GN",
  "Guinea-Bissau": "GW",
  "Kenya": "KE",
  "Lesotho": "LS",
  "Liberia": "LR",
  "Libya": "LY",
  "Madagascar": "MG",
  "Malawi": "MW",
  "Mali": "ML",
  "Mauritania": "MR",
  "Mauritius": "MU",
  "Morocco": "MA",
  "Mozambique": "MZ",
  "Namibia": "NA",
  "Niger": "NE",
  "Nigeria": "NG",
  "Rwanda": "RW",
  "São Tomé and Príncipe": "ST",
  "Senegal": "SN",
  "Seychelles": "SC",
  "Sierra Leone": "SL",
  "Somalia": "SO",
  "South Africa": "ZA",
  "South Sudan": "SS",
  "Sudan": "SD",
  "Tanzania": "TZ",
  "Togo": "TG",
  "Tunisia": "TN",
  "Uganda": "UG",
  "Western Sahara": "EH",
  "Zambia": "ZM",
  "Zimbabwe": "ZW",
};

// Fonction pour normaliser les noms de villes (enlever les caractères spéciaux, normaliser)
function normalizeCityName(cityName: string): string {
  // Enlever les nombres qui sont parfois dans le JSON (comme "951,216" pour Côte d'Ivoire)
  if (/^\d+[,\d]*$/.test(cityName.trim())) {
    return '';
  }
  return cityName.trim();
}

// Fonction pour obtenir les coordonnées approximatives d'une ville (on utilisera celles du pays par défaut)
function getDefaultCoordinates(countryCode: string): { lat: number; lng: number } {
  // Coordonnées par défaut par pays (centre approximatif)
  const defaultCoords: Record<string, { lat: number; lng: number }> = {
    "AO": { lat: -11.2027, lng: 17.8739 },
    "BF": { lat: 12.2383, lng: -1.5616 },
    "BI": { lat: -3.3731, lng: 29.9189 },
    "BJ": { lat: 9.3077, lng: 2.3158 },
    "BW": { lat: -22.3285, lng: 24.6849 },
    "CD": { lat: -4.0383, lng: 21.7587 },
    "CF": { lat: 6.6111, lng: 20.9394 },
    "CG": { lat: -0.228, lng: 15.8277 },
    "CI": { lat: 7.54, lng: -5.5471 },
    "CM": { lat: 7.3697, lng: 12.3547 },
    "CV": { lat: 16.5388, lng: -23.0418 },
    "DJ": { lat: 11.8251, lng: 42.5903 },
    "DZ": { lat: 28.0339, lng: 1.6596 },
    "EG": { lat: 26.8206, lng: 30.8025 },
    "ER": { lat: 15.1794, lng: 39.7823 },
    "ET": { lat: 9.145, lng: 40.4897 },
    "GA": { lat: -0.8037, lng: 11.6094 },
    "GH": { lat: 7.9465, lng: -1.0232 },
    "GM": { lat: 13.4432, lng: -15.3101 },
    "GN": { lat: 9.9456, lng: -9.6966 },
    "GQ": { lat: 1.6508, lng: 10.2679 },
    "GW": { lat: 11.8037, lng: -15.1804 },
    "KE": { lat: -0.0236, lng: 37.9062 },
    "KM": { lat: -11.6455, lng: 43.3333 },
    "LR": { lat: 6.4281, lng: -9.4295 },
    "LS": { lat: -29.61, lng: 28.2336 },
    "LY": { lat: 26.3351, lng: 17.2283 },
    "MA": { lat: 31.7917, lng: -7.0926 },
    "MG": { lat: -18.7669, lng: 46.8691 },
    "ML": { lat: 17.5707, lng: -3.9962 },
    "MR": { lat: 21.0079, lng: -10.9408 },
    "MU": { lat: -20.3484, lng: 57.5522 },
    "MW": { lat: -13.2543, lng: 34.3015 },
    "MZ": { lat: -18.6657, lng: 35.5296 },
    "NA": { lat: -22.9576, lng: 18.4904 },
    "NE": { lat: 17.6078, lng: 8.0817 },
    "NG": { lat: 9.082, lng: 8.6753 },
    "RW": { lat: -1.9403, lng: 29.8739 },
    "SC": { lat: -4.6796, lng: 55.492 },
    "SD": { lat: 15.5007, lng: 32.5599 },
    "SL": { lat: 8.4606, lng: -11.7799 },
    "SN": { lat: 14.4974, lng: -14.4524 },
    "SO": { lat: 5.1521, lng: 46.1996 },
    "SS": { lat: 6.877, lng: 31.307 },
    "ST": { lat: 0.1864, lng: 6.6131 },
    "SZ": { lat: -26.5225, lng: 31.4659 },
    "TD": { lat: 15.4542, lng: 18.7322 },
    "TG": { lat: 8.6195, lng: 0.8248 },
    "TN": { lat: 33.8869, lng: 9.5375 },
    "TZ": { lat: -6.369, lng: 34.8888 },
    "UG": { lat: 1.3733, lng: 32.2903 },
    "ZA": { lat: -30.5595, lng: 22.9375 },
    "ZM": { lat: -13.1339, lng: 27.8493 },
    "ZW": { lat: -19.0154, lng: 29.1549 },
  };
  return defaultCoords[countryCode] || { lat: 0, lng: 0 };
}

async function updateSeedWithCities() {
  // Lire le fichier JSON
  const jsonPath = path.join(process.cwd(), 'africanCities.json');
  const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
  const citiesData = JSON.parse(jsonContent);

  // Lire le fichier seed actuel
  const seedPath = path.join(process.cwd(), 'prisma', 'seed', '01_reference.ts');
  let seedContent = fs.readFileSync(seedPath, 'utf-8');

  // Pour chaque pays dans le JSON
  for (const [countryName, cities] of Object.entries(citiesData)) {
    const countryCode = countryNameToCode[countryName];
    
    if (!countryCode) {
      console.warn(`⚠️  Pays non trouvé dans le mapping: ${countryName}`);
      continue;
    }

    // Filtrer les villes valides
    const validCities = (cities as string[])
      .map(normalizeCityName)
      .filter(name => name.length > 0);

    if (validCities.length === 0) {
      console.log(`ℹ️  Aucune ville valide pour ${countryName}`);
      continue;
    }

    console.log(`📝 Traitement de ${countryName} (${countryCode}): ${validCities.length} villes`);

    // Trouver le pays dans le seed et mettre à jour ses villes
    const countryRegex = new RegExp(
      `(code:\\s*"${countryCode}"[\\s\\S]*?regions:\\s*\\[[\\s\\S]*?)(\\],\\s*\\})`,
      'm'
    );

    if (countryRegex.test(seedContent)) {
      // Remplacer les régions existantes par une seule région avec toutes les villes
      const defaultCoords = getDefaultCoordinates(countryCode);
      
      const citiesArray = validCities.map((cityName, index) => {
        // Marquer les premières villes comme featured (max 5)
        const isFeatured = index < 5;
        return `          {
            name: { fr: "${cityName}", en: "${cityName}" },
            lat: ${defaultCoords.lat + (Math.random() * 0.5 - 0.25)},
            lng: ${defaultCoords.lng + (Math.random() * 0.5 - 0.25)},
            isFeatured: ${isFeatured},
          }`;
      }).join(',\n');

      const newRegions = `regions: [
      {
        name: { fr: "Principales villes", en: "Main cities" },
        cities: [
${citiesArray}
        ],
      },
    ]`;

      seedContent = seedContent.replace(countryRegex, `$1${newRegions}$2`);
      console.log(`✅ ${countryName}: ${validCities.length} villes ajoutées`);
    } else {
      console.warn(`⚠️  Pays ${countryCode} non trouvé dans le seed`);
    }
  }

  // Écrire le fichier mis à jour
  fs.writeFileSync(seedPath, seedContent, 'utf-8');
  console.log('\n✅ Seed mis à jour avec succès!');
}

updateSeedWithCities().catch(console.error);





