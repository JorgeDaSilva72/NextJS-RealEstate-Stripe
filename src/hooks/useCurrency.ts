"use client";

import { useState, useEffect } from "react";
import { Currency, CurrencyCode, getCurrency, getCurrencyByCountry } from "@/lib/currencies";
import { convertCurrency } from "@/lib/exchange-rates";
import { detectCountryFromIP, getDefaultCountry, CountryInfo } from "@/lib/country-detection";

export interface UseCurrencyReturn {
  currency: Currency;
  currencyCode: CurrencyCode;
  countryInfo: CountryInfo | null;
  isLoading: boolean;
  convertPrice: (amount: number, fromCurrency?: CurrencyCode) => Promise<number>;
  setCurrency: (code: CurrencyCode) => void;
}

/**
 * Hook for managing currency selection and conversion
 */
export function useCurrency(): UseCurrencyReturn {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("EUR");
  const [currency, setCurrencyState] = useState<Currency>(getCurrency("EUR"));
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Detect country and set default currency on mount
  useEffect(() => {
    const initializeCurrency = async () => {
      setIsLoading(true);
      try {
        const detected = await detectCountryFromIP();
        const country = detected || getDefaultCountry();
        setCountryInfo(country);
        setCurrencyCode(country.currency.code);
        setCurrencyState(country.currency);
      } catch (error) {
        console.error("Error initializing currency:", error);
        const defaultCountry = getDefaultCountry();
        setCountryInfo(defaultCountry);
        setCurrencyCode(defaultCountry.currency.code);
        setCurrencyState(defaultCountry.currency);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCurrency();
  }, []);

  // Update currency when code changes
  useEffect(() => {
    const newCurrency = getCurrency(currencyCode);
    setCurrencyState(newCurrency);
  }, [currencyCode]);

  const convertPrice = async (
    amount: number,
    fromCurrency: CurrencyCode = "EUR"
  ): Promise<number> => {
    if (fromCurrency === currencyCode) {
      return amount;
    }

    try {
      return await convertCurrency(amount, fromCurrency, currencyCode);
    } catch (error) {
      console.error("Error converting price:", error);
      return amount; // Fallback to original amount
    }
  };

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyCode(code);
  };

  return {
    currency,
    currencyCode,
    countryInfo,
    isLoading,
    convertPrice,
    setCurrency,
  };
}
