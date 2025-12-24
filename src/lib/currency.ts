// Currency management and conversion service

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

// All African currencies
export const CURRENCIES: Record<string, Currency> = {
  EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  USD: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  XOF: { code: "XOF", name: "West African CFA Franc", symbol: "FCFA", flag: "🌍" },
  XAF: { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", flag: "🌍" },
  NGN: { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "🇳🇬" },
  KES: { code: "KES", name: "Kenyan Shilling", symbol: "KSh", flag: "🇰🇪" },
  MAD: { code: "MAD", name: "Moroccan Dirham", symbol: "DH", flag: "🇲🇦" },
  ZAR: { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  EGP: { code: "EGP", name: "Egyptian Pound", symbol: "£E", flag: "🇪🇬" },
  TND: { code: "TND", name: "Tunisian Dinar", symbol: "DT", flag: "🇹🇳" },
  DZD: { code: "DZD", name: "Algerian Dinar", symbol: "DA", flag: "🇩🇿" },
  AOA: { code: "AOA", name: "Angolan Kwanza", symbol: "Kz", flag: "🇦🇴" },
  BWP: { code: "BWP", name: "Botswana Pula", symbol: "P", flag: "🇧🇼" },
  BIF: { code: "BIF", name: "Burundian Franc", symbol: "FBu", flag: "🇧🇮" },
  CDF: { code: "CDF", name: "Congolese Franc", symbol: "FC", flag: "🇨🇩" },
  ETB: { code: "ETB", name: "Ethiopian Birr", symbol: "Br", flag: "🇪🇹" },
  GHS: { code: "GHS", name: "Ghanaian Cedi", symbol: "₵", flag: "🇬🇭" },
  GNF: { code: "GNF", name: "Guinean Franc", symbol: "FG", flag: "🇬🇳" },
  LRD: { code: "LRD", name: "Liberian Dollar", symbol: "$", flag: "🇱🇷" },
  LYD: { code: "LYD", name: "Libyan Dinar", symbol: "LD", flag: "🇱🇾" },
  MGA: { code: "MGA", name: "Malagasy Ariary", symbol: "Ar", flag: "🇲🇬" },
  MWK: { code: "MWK", name: "Malawian Kwacha", symbol: "MK", flag: "🇲🇼" },
  MZN: { code: "MZN", name: "Mozambican Metical", symbol: "MT", flag: "🇲🇿" },
  RWF: { code: "RWF", name: "Rwandan Franc", symbol: "RF", flag: "🇷🇼" },
  SLL: { code: "SLL", name: "Sierra Leonean Leone", symbol: "Le", flag: "🇸🇱" },
  SOS: { code: "SOS", name: "Somali Shilling", symbol: "Sh", flag: "🇸🇴" },
  SDG: { code: "SDG", name: "Sudanese Pound", symbol: "SDG", flag: "🇸🇩" },
  SZL: { code: "SZL", name: "Swazi Lilangeni", symbol: "L", flag: "🇸🇿" },
  TZS: { code: "TZS", name: "Tanzanian Shilling", symbol: "TSh", flag: "🇹🇿" },
  UGX: { code: "UGX", name: "Ugandan Shilling", symbol: "USh", flag: "🇺🇬" },
  ZMW: { code: "ZMW", name: "Zambian Kwacha", symbol: "ZK", flag: "🇿🇲" },
  ZWL: { code: "ZWL", name: "Zimbabwean Dollar", symbol: "$", flag: "🇿🇼" },
};

// Default exchange rates (should be updated from an API in production)
// Base currency: USD
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  XOF: 600, // Approximate
  XAF: 600, // Approximate
  NGN: 1500, // Approximate
  KES: 130, // Approximate
  MAD: 10, // Approximate
  ZAR: 18, // Approximate
  EGP: 30, // Approximate
  TND: 3.1, // Approximate
  DZD: 134, // Approximate
  AOA: 830, // Approximate
  BWP: 13.5, // Approximate
  BIF: 2850, // Approximate
  CDF: 2750, // Approximate
  ETB: 55, // Approximate
  GHS: 12, // Approximate
  GNF: 8600, // Approximate
  LRD: 190, // Approximate
  LYD: 4.8, // Approximate
  MGA: 4500, // Approximate
  MWK: 1700, // Approximate
  MZN: 64, // Approximate
  RWF: 1300, // Approximate
  SLL: 22000, // Approximate
  SOS: 570, // Approximate
  SDG: 600, // Approximate
  SZL: 18, // Approximate
  TZS: 2500, // Approximate
  UGX: 3700, // Approximate
  ZMW: 25, // Approximate
  ZWL: 1, // Approximate
};

/**
 * Convert price from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;

  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(
  amount: number,
  currency: string = "EUR",
  locale: string = "fr-FR"
): string {
  const currencyInfo = CURRENCIES[currency];
  if (!currencyInfo) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Use Intl.NumberFormat for proper formatting
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    // Fallback if currency not supported by Intl
    return `${currencyInfo.symbol} ${amount.toLocaleString(locale)}`;
  }
}

/**
 * Format price with conversion
 */
export function formatPriceWithConversion(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  locale: string = "fr-FR"
): string {
  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
  return formatPrice(convertedAmount, toCurrency, locale);
}

/**
 * Get currency info
 */
export function getCurrencyInfo(currencyCode: string): Currency | undefined {
  return CURRENCIES[currencyCode];
}

/**
 * Get all available currencies
 */
export function getAllCurrencies(): Currency[] {
  return Object.values(CURRENCIES);
}

/**
 * Get currencies for Elite Connect packages (EUR and USD only)
 */
export function getEliteCurrencies(): Currency[] {
  return [CURRENCIES.EUR, CURRENCIES.USD];
}





