/**
 * Multi-Currency Support System
 * 
 * Handles currency detection, conversion, and display for African and international markets
 */

export type CurrencyCode = 
  | "EUR" | "USD" | "XOF" | "XAF" | "MAD" | "ZAR" | "NGN" | "KES" 
  | "GHS" | "EGP" | "RWF" | "MUR" | "TZS" | "CDF" | "GNF" | "ETB" | "UGX";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  countryCodes: string[]; // ISO country codes
  isBaseCurrency: boolean; // EUR or USD
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    countryCodes: ["FR", "BE", "LU", "IT", "ES", "PT", "DE", "AT", "NL", "IE", "FI", "GR"],
    isBaseCurrency: true,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    countryCodes: ["US"],
    isBaseCurrency: true,
  },
  XOF: {
    code: "XOF",
    symbol: "CFA",
    name: "West African CFA Franc",
    countryCodes: ["SN", "CI", "BJ", "TG", "BF", "ML", "NE", "GW"],
    isBaseCurrency: false,
  },
  XAF: {
    code: "XAF",
    symbol: "FCFA",
    name: "Central African CFA Franc",
    countryCodes: ["CM", "GA", "CF", "TD", "CG", "GQ"],
    isBaseCurrency: false,
  },
  MAD: {
    code: "MAD",
    symbol: "MAD",
    name: "Moroccan Dirham",
    countryCodes: ["MA"],
    isBaseCurrency: false,
  },
  ZAR: {
    code: "ZAR",
    symbol: "R",
    name: "South African Rand",
    countryCodes: ["ZA", "NA"],
    isBaseCurrency: false,
  },
  NGN: {
    code: "NGN",
    symbol: "₦",
    name: "Nigerian Naira",
    countryCodes: ["NG"],
    isBaseCurrency: false,
  },
  KES: {
    code: "KES",
    symbol: "KSh",
    name: "Kenyan Shilling",
    countryCodes: ["KE"],
    isBaseCurrency: false,
  },
  GHS: {
    code: "GHS",
    symbol: "₵",
    name: "Ghanaian Cedi",
    countryCodes: ["GH"],
    isBaseCurrency: false,
  },
  EGP: {
    code: "EGP",
    symbol: "E£",
    name: "Egyptian Pound",
    countryCodes: ["EG"],
    isBaseCurrency: false,
  },
  RWF: {
    code: "RWF",
    symbol: "RF",
    name: "Rwandan Franc",
    countryCodes: ["RW"],
    isBaseCurrency: false,
  },
  MUR: {
    code: "MUR",
    symbol: "₨",
    name: "Mauritian Rupee",
    countryCodes: ["MU"],
    isBaseCurrency: false,
  },
  TZS: {
    code: "TZS",
    symbol: "TSh",
    name: "Tanzanian Shilling",
    countryCodes: ["TZ"],
    isBaseCurrency: false,
  },
  CDF: {
    code: "CDF",
    symbol: "FC",
    name: "Congolese Franc",
    countryCodes: ["CD"],
    isBaseCurrency: false,
  },
  GNF: {
    code: "GNF",
    symbol: "FG",
    name: "Guinean Franc",
    countryCodes: ["GN"],
    isBaseCurrency: false,
  },
  ETB: {
    code: "ETB",
    symbol: "Br",
    name: "Ethiopian Birr",
    countryCodes: ["ET"],
    isBaseCurrency: false,
  },
  UGX: {
    code: "UGX",
    symbol: "USh",
    name: "Ugandan Shilling",
    countryCodes: ["UG"],
    isBaseCurrency: false,
  },
};

/**
 * Get currency by country code
 */
export function getCurrencyByCountry(countryCode: string): Currency {
  const upperCountryCode = countryCode.toUpperCase();
  
  for (const currency of Object.values(CURRENCIES)) {
    if (currency.countryCodes.includes(upperCountryCode)) {
      return currency;
    }
  }
  
  // Default to EUR for unknown countries
  return CURRENCIES.EUR;
}

/**
 * Get currency by currency code
 */
export function getCurrency(code: string): Currency {
  const upperCode = code.toUpperCase() as CurrencyCode;
  return CURRENCIES[upperCode] || CURRENCIES.EUR;
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: Currency, showDecimals: boolean = true): string {
  const formatted = showDecimals ? amount.toFixed(2) : amount.toFixed(0);
  
  // Some currencies don't use decimals
  const noDecimalCurrencies: CurrencyCode[] = ["XOF", "XAF", "NGN", "KES", "GHS", "RWF", "TZS", "CDF", "GNF", "ETB", "UGX"];
  const finalAmount = noDecimalCurrencies.includes(currency.code) 
    ? Math.round(amount).toString()
    : formatted;
  
  // Format with thousand separators
  const parts = finalAmount.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  return `${parts.join(".")} ${currency.symbol}`;
}

/**
 * Get base currency (EUR or USD) for a given currency
 * Used for storing base prices in database
 */
export function getBaseCurrency(currency: Currency): CurrencyCode {
  // For African currencies, use EUR as base
  // For international, prefer USD for luxury properties
  return currency.code === "USD" ? "USD" : "EUR";
}




