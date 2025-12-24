"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCurrencies, getCurrencyInfo, type Currency } from "@/lib/currency";
import { useLocale } from "next-intl";

interface CurrencySelectorProps {
  value?: string;
  onValueChange?: (currency: string) => void;
  className?: string;
  showEliteOnly?: boolean; // For Elite Connect packages
}

export default function CurrencySelector({
  value,
  onValueChange,
  className = "",
  showEliteOnly = false,
}: CurrencySelectorProps) {
  const locale = useLocale();
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    value || (typeof window !== "undefined" ? localStorage.getItem("selectedCurrency") || "EUR" : "EUR")
  );

  useEffect(() => {
    // Load from localStorage on mount
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency && !value) {
      setSelectedCurrency(savedCurrency);
    }
  }, [value]);

  const handleValueChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
    onValueChange?.(newCurrency);
    
    // Dispatch custom event for currency change
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("currencyChanged", { detail: newCurrency }));
    }
  };

  const currencies = showEliteOnly
    ? getAllCurrencies().filter((c) => c.code === "EUR" || c.code === "USD")
    : getAllCurrencies();

  const currentCurrency = getCurrencyInfo(selectedCurrency);

  return (
    <Select value={selectedCurrency} onValueChange={handleValueChange}>
      <SelectTrigger className={`h-9 w-[140px] ${className}`}>
        <SelectValue>
          {currentCurrency && (
            <div className="flex items-center gap-2">
              <span>{currentCurrency.flag || currentCurrency.symbol}</span>
              <span className="text-sm font-medium">{currentCurrency.code}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center gap-2">
              <span>{currency.flag || currency.symbol}</span>
              <span>{currency.code}</span>
              <span className="text-muted-foreground text-xs">
                {currency.name}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}





