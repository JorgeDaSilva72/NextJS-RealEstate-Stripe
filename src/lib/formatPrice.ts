import { formatPrice as formatPriceWithCurrency, getCurrencyInfo } from "./currency";

/**
 * Format price using selected currency from localStorage or default to EUR
 */
export const formatPrice = (
  price: number,
  originalCurrency: string = "EUR",
  locale: string = "fr-FR"
): string => {
  // Get selected currency from localStorage (client-side only)
  let selectedCurrency = "EUR";
  if (typeof window !== "undefined") {
    selectedCurrency = localStorage.getItem("selectedCurrency") || "EUR";
  }

  // If same currency, just format
  if (originalCurrency === selectedCurrency) {
    return formatPriceWithCurrency(price, selectedCurrency, locale);
  }

  // Otherwise, convert and format
  const { convertCurrency } = require("./currency");
  const convertedPrice = convertCurrency(price, originalCurrency, selectedCurrency);
  return formatPriceWithCurrency(convertedPrice, selectedCurrency, locale);
};

/**
 * Format price without conversion (original currency)
 */
export const formatPriceOriginal = (
  price: number,
  currency: string = "EUR",
  locale: string = "fr-FR"
): string => {
  return formatPriceWithCurrency(price, currency, locale);
};
