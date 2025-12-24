"use client";

import { useCurrency } from "@/hooks/useCurrency";
import { formatPriceWithConversion, convertCurrency } from "@/lib/currency";
import CurrencySelector from "./CurrencySelector";

interface ElitePackagePriceProps {
  price: number;
  originalCurrency?: string;
  duration?: string;
  className?: string;
}

/**
 * Component to display Elite Connect package prices
 * Always shows EUR/USD only, with currency selector
 */
export default function ElitePackagePrice({
  price,
  originalCurrency = "EUR",
  duration,
  className = "",
}: ElitePackagePriceProps) {
  const { currencyCode, isLoading } = useCurrency();

  // Force EUR or USD for Elite packages
  const displayCurrency = currencyCode === "EUR" || currencyCode === "USD" 
    ? currencyCode 
    : "EUR";

  if (isLoading) {
    // SSR fallback
    return (
      <div className={className}>
        <span className="text-5xl">{price}</span>
        <span className="text-lg">€</span>
        {duration && <span className="text-lg">/ {duration}</span>}
      </div>
    );
  }

  const convertedPrice = convertCurrency(price, originalCurrency, displayCurrency);
  const formattedPrice = formatPriceWithConversion(
    price,
    originalCurrency,
    displayCurrency
  );

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-5xl font-bold">{Math.round(convertedPrice)}</span>
        <span className="text-lg">{displayCurrency === "EUR" ? "€" : "$"}</span>
        {duration && <span className="text-lg">/ {duration}</span>}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Afficher en:</span>
        <CurrencySelector showEliteOnly={true} value={displayCurrency} />
      </div>
    </div>
  );
}





