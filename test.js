import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const countries = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
  "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros",
  "Democratic Republic of the Congo", "Republic of the Congo", "Côte d'Ivoire",
  "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini",
  "Ethiopia", "Gabon", "The Gambia", "Ghana", "Guinea", "Guinea-Bissau",
  "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi",
  "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia",
  "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal",
  "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan",
  "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Western Sahara",
  "Zambia", "Zimbabwe"
];

const baseUrl = "https://en.wikipedia.org/wiki/List_of_cities_in_";

const scrapeCities = async () => {
  const result = {};

  for (const country of countries) {
    const url = `${baseUrl}${encodeURIComponent(country.replace(/ /g, "_"))}`;
    console.log(`Fetching ${country}...`);

    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const $ = cheerio.load(data);
      const cities = new Set();

      $("table.wikitable").each((i, table) => {
        const headers = $(table).find("tr").first().find("th");
        let cityIndex = 0;

        // Detect which column is "City"
        headers.each((i, th) => {
          if (/city/i.test($(th).text())) cityIndex = i;
        });

        $(table).find("tr").slice(1).each((i, row) => {
          const tds = $(row).find("td");
          if (tds.length > cityIndex) {
            let city = tds.eq(cityIndex).find("a").first().text().trim();
            if (!city) city = tds.eq(cityIndex).text().trim();

            // Remove references [1], [2] etc
            city = city.replace(/\[\d+\]/g, "").trim();

            // Ignore numbers or empty cells
            if (city && !/^\d+\.?$/.test(city)) {
              cities.add(city);
            }
          }
        });
      });

      result[country] = Array.from(cities);
      console.log(`Found ${cities.size} cities for ${country}`);
    } catch (err) {
      console.error(`Error fetching ${country}: ${err.message}`);
      result[country] = [];
    }
  }

  fs.writeFileSync("africanCities.json", JSON.stringify(result, null, 2), "utf8");
  console.log("Saved africanCities.json!");
};

scrapeCities();
