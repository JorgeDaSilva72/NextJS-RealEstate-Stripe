/**
 * Exchange Rate API Integration
 * 
 * Fetches and caches exchange rates from Fixer.io or OpenExchangeRates
 */

import { CurrencyCode, getBaseCurrency, getCurrency } from "./currencies";

export interface ExchangeRates {
  base: CurrencyCode;
  date: string;
  rates: Record<CurrencyCode, number>;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
let cachedRates: ExchangeRates | null = null;
let cacheTimestamp: number = 0;

/**
 * Fetch exchange rates from API
 */
export async function fetchExchangeRates(baseCurrency: CurrencyCode = "EUR"): Promise<ExchangeRates> {
  // Check cache first
  const now = Date.now();
  if (cachedRates && (now - cacheTimestamp) < CACHE_DURATION && cachedRates.base === baseCurrency) {
    return cachedRates;
  }

  const apiKey = process.env.EXCHANGE_RATE_API_KEY || process.env.FIXER_API_KEY;
  const useFixer = !!process.env.FIXER_API_KEY;

  try {
    let rates: ExchangeRates;

    if (useFixer && apiKey) {
      // Use Fixer.io
      const response = await fetch(
        `https://api.fixer.io/latest?access_key=${apiKey}&base=${baseCurrency}&symbols=EUR,USD,XOF,XAF,MAD,ZAR,NGN,KES,GHS,EGP,RWF,MUR,TZS,CDF,GNF,ETB,UGX`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );

      if (!response.ok) {
        throw new Error(`Fixer API error: ${response.statusText}`);
      }

      const data = await response.json();
      rates = {
        base: baseCurrency,
        date: data.date,
        rates: data.rates,
      };
    } else {
      // Use OpenExchangeRates (free tier)
      const appId = process.env.OPENEXCHANGERATES_APP_ID;
      if (!appId) {
        // Fallback to hardcoded rates (for development)
        console.warn("No exchange rate API key found, using fallback rates");
        return getFallbackRates(baseCurrency);
      }

      const response = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${appId}&base=${baseCurrency}`,
        { next: { revalidate: 3600 } }
      );

      if (!response.ok) {
        throw new Error(`OpenExchangeRates API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Map OpenExchangeRates currency codes to our codes
      rates = {
        base: baseCurrency,
        date: new Date(data.timestamp * 1000).toISOString().split("T")[0],
        rates: {
          EUR: data.rates.EUR || 1,
          USD: data.rates.USD || 1,
          XOF: data.rates.XOF || 655.957, // Approximate
          XAF: data.rates.XAF || 655.957,
          MAD: data.rates.MAD || 10.5,
          ZAR: data.rates.ZAR || 18.5,
          NGN: data.rates.NGN || 1500,
          KES: data.rates.KES || 130,
          GHS: data.rates.GHS || 12.5,
          EGP: data.rates.EGP || 30.5,
          RWF: data.rates.RWF || 1200,
          MUR: data.rates.MUR || 45,
          TZS: data.rates.TZS || 2300,
          CDF: data.rates.CDF || 2500,
          GNF: data.rates.GNF || 8600,
          ETB: data.rates.ETB || 55,
          UGX: data.rates.UGX || 3700,
        },
      };
    }

    // Cache the rates
    cachedRates = rates;
    cacheTimestamp = now;

    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    
    // Return fallback rates on error
    return getFallbackRates(baseCurrency);
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rates = await fetchExchangeRates(fromCurrency);
  const rate = rates.rates[toCurrency];

  if (!rate) {
    console.warn(`Exchange rate not found for ${toCurrency}, using 1:1`);
    return amount;
  }

  return amount * rate;
}

/**
 * Get exchange rate between two currencies
 */
export async function getExchangeRate(
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const rates = await fetchExchangeRates(fromCurrency);
  return rates.rates[toCurrency] || 1;
}

/**
 * Fallback rates for development/testing
 * These are approximate rates (as of late 2024)
 */
function getFallbackRates(baseCurrency: CurrencyCode): ExchangeRates {
  const baseRates: Record<CurrencyCode, number> = {
    EUR: 1,
    USD: 1.08,
    XOF: 655.957,
    XAF: 655.957,
    MAD: 10.5,
    ZAR: 18.5,
    NGN: 1500,
    KES: 130,
    GHS: 12.5,
    EGP: 30.5,
    RWF: 1200,
    MUR: 45,
    TZS: 2300,
    CDF: 2500,
    GNF: 8600,
    ETB: 55,
    UGX: 3700,
  };

  // If base is USD, convert from EUR rates
  if (baseCurrency === "USD") {
    const eurToUsd = 1 / baseRates.USD;
    Object.keys(baseRates).forEach((key) => {
      if (key !== "USD") {
        baseRates[key as CurrencyCode] = baseRates[key as CurrencyCode] * eurToUsd;
      }
    });
    baseRates.EUR = eurToUsd;
    baseRates.USD = 1;
  }

  return {
    base: baseCurrency,
    date: new Date().toISOString().split("T")[0],
    rates: baseRates,
  };
}




