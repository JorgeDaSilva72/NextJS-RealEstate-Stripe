/**
 * Payment Provider Integration
 * 
 * Handles Flutterwave, Paystack, and PayPal integrations
 */

import { CurrencyCode } from "./currencies";

export type PaymentProvider = "primer" | "flutterwave" | "paystack" | "paypal";

export interface PaymentProviderConfig {
  provider: PaymentProvider;
  name: string;
  supportedCurrencies: CurrencyCode[];
  supportedCountries: string[];
  logo?: string;
}

export const PAYMENT_PROVIDERS: PaymentProviderConfig[] = [
  {
    provider: "primer",
    name: "Primer",
    supportedCurrencies: ["EUR", "USD", "XOF", "XAF", "NGN", "KES", "GHS", "ZAR", "MAD"],
    supportedCountries: ["*"], // All countries
  },
  {
    provider: "flutterwave",
    name: "Flutterwave",
    supportedCurrencies: ["XOF", "XAF", "NGN", "KES", "GHS", "ZAR", "UGX", "TZS", "RWF"],
    supportedCountries: ["SN", "CI", "BJ", "TG", "CM", "GA", "NG", "KE", "GH", "ZA", "UG", "TZ", "RW"],
  },
  {
    provider: "paystack",
    name: "Paystack",
    supportedCurrencies: ["NGN", "GHS", "ZAR", "KES"],
    supportedCountries: ["NG", "GH"],
  },
  {
    provider: "paypal",
    name: "PayPal",
    supportedCurrencies: ["EUR", "USD"],
    supportedCountries: ["*"], // International
  },
];

/**
 * Get available payment providers for a currency and country
 */
export function getAvailableProviders(
  currency: CurrencyCode,
  countryCode: string
): PaymentProviderConfig[] {
  return PAYMENT_PROVIDERS.filter((provider) => {
    const supportsCurrency = provider.supportedCurrencies.includes(currency);
    const supportsCountry =
      provider.supportedCountries.includes("*") ||
      provider.supportedCountries.includes(countryCode.toUpperCase());

    return supportsCurrency && supportsCountry;
  });
}

/**
 * Get recommended payment provider for currency and country
 */
export function getRecommendedProvider(
  currency: CurrencyCode,
  countryCode: string
): PaymentProvider {
  // Priority: Primer > Flutterwave/Paystack > PayPal
  const providers = getAvailableProviders(currency, countryCode);

  // Prefer Primer if available
  const primer = providers.find((p) => p.provider === "primer");
  if (primer) return "primer";

  // For Nigeria/Ghana, prefer Paystack
  if (["NG", "GH"].includes(countryCode.toUpperCase())) {
    const paystack = providers.find((p) => p.provider === "paystack");
    if (paystack) return "paystack";
  }

  // For African countries, prefer Flutterwave
  const flutterwave = providers.find((p) => p.provider === "flutterwave");
  if (flutterwave) return "flutterwave";

  // Fallback to PayPal for EUR/USD
  const paypal = providers.find((p) => p.provider === "paypal");
  if (paypal) return "paypal";

  // Default to Primer
  return "primer";
}




