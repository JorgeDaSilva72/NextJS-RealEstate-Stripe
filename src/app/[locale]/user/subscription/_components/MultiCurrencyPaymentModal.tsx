"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Globe,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { SubscriptionPlan } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { Currency, CurrencyCode, formatPrice, getCurrency } from "@/lib/currencies";
import { convertCurrency } from "@/lib/exchange-rates";
import { getAvailableProviders, PaymentProvider } from "@/lib/payment-providers";
import { detectCountryFromIP, getDefaultCountry, CountryInfo } from "@/lib/country-detection";
import { cn } from "@/lib/utils";

interface MultiCurrencyPaymentModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Multi-Currency Payment Modal
 * 
 * Handles payment with currency selection and multiple payment providers
 */
export default function MultiCurrencyPaymentModal({
  plan,
  isOpen,
  onClose,
  onSuccess,
}: MultiCurrencyPaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("EUR");
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const router = useRouter();

  // Helper to convert plan.price to number
  const getNumericPrice = (price: any): number => {
    if (typeof price === "number") return price;
    if (typeof price === "string") return parseFloat(price);
    if (price && typeof price === "object" && "toNumber" in price) {
      return (price as any).toNumber();
    }
    return Number(price) || 0;
  };

  const baseAmount = getNumericPrice(plan.price);
  const baseCurrency: CurrencyCode = "EUR"; // Plans are priced in EUR

  // Detect country and set default currency on mount
  useEffect(() => {
    const detectCountry = async () => {
      const detected = await detectCountryFromIP();
      const country = detected || getDefaultCountry();
      setCountryInfo(country);
      setSelectedCurrency(country.currency.code);
    };

    if (isOpen) {
      detectCountry();
    }
  }, [isOpen]);

  // Convert amount when currency changes
  useEffect(() => {
    const convertAmount = async () => {
      if (selectedCurrency === baseCurrency) {
        setConvertedAmount(baseAmount);
        return;
      }

      try {
        const converted = await convertCurrency(baseAmount, baseCurrency, selectedCurrency);
        setConvertedAmount(converted);
      } catch (error) {
        console.error("Error converting currency:", error);
        toast.error("Erreur lors de la conversion de devise");
        setConvertedAmount(baseAmount);
      }
    };

    convertAmount();
  }, [selectedCurrency, baseAmount, baseCurrency]);

  // Update available providers when currency or country changes
  useEffect(() => {
    if (countryInfo) {
      const providers = getAvailableProviders(selectedCurrency, countryInfo.code);
      setAvailableProviders(providers);
      
      // Auto-select first provider
      if (providers.length > 0 && !selectedProvider) {
        setSelectedProvider(providers[0].provider as PaymentProvider);
      }
    }
  }, [selectedCurrency, countryInfo, selectedProvider]);

  const handlePayment = async () => {
    if (!selectedProvider || !countryInfo) {
      toast.error("Veuillez sélectionner une méthode de paiement");
      return;
    }

    setIsLoading(true);

    try {
      // Create payment intent
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: baseAmount,
          currency: selectedCurrency,
          planId: plan.id,
          userCountry: countryInfo.code,
          paymentType: "subscription",
          paymentProvider: selectedProvider,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment intent");
      }

      const data = await response.json();

      // Redirect to payment provider
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else if (data.clientToken) {
        // For Primer, might need to initialize checkout
        toast.success("Redirection vers le paiement...");
        setTimeout(() => {
          router.push("/user/profile");
        }, 2000);
      } else {
        throw new Error("No payment URL provided");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Erreur lors du paiement");
      setIsLoading(false);
    }
  };

  const currency = getCurrency(selectedCurrency);
  const allCurrencies: CurrencyCode[] = [
    "EUR", "USD", "XOF", "XAF", "MAD", "ZAR", "NGN", "KES",
    "GHS", "EGP", "RWF", "MUR", "TZS", "CDF", "GNF", "ETB", "UGX",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Paiement - Plan {plan.namePlan}
          </DialogTitle>
          <DialogDescription>
            Montant de base: {formatPrice(baseAmount, getCurrency(baseCurrency))}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Currency Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Devise de paiement
            </label>
            <Select
              value={selectedCurrency}
              onValueChange={(value) => setSelectedCurrency(value as CurrencyCode)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCurrencies.map((code) => {
                  const curr = getCurrency(code);
                  return (
                    <SelectItem key={code} value={code}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{curr.symbol}</span>
                        <span className="text-sm text-gray-500">{curr.name}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Montant: <span className="font-bold text-lg">{formatPrice(convertedAmount, currency)}</span>
            </div>
          </div>

          {/* Payment Provider Selection */}
          {availableProviders.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-1 gap-2">
                {availableProviders.map((provider) => (
                  <Button
                    key={provider.provider}
                    onClick={() => setSelectedProvider(provider.provider as PaymentProvider)}
                    disabled={isLoading}
                    variant={selectedProvider === provider.provider ? "default" : "outline"}
                    className={cn(
                      "w-full h-auto p-4 flex items-center justify-between transition-all",
                      selectedProvider === provider.provider && "ring-2 ring-blue-500"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {provider.provider === "primer" && (
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      )}
                      {provider.provider === "flutterwave" && (
                        <Globe className="h-5 w-5 text-green-600" />
                      )}
                      {provider.provider === "paystack" && (
                        <Globe className="h-5 w-5 text-purple-600" />
                      )}
                      {provider.provider === "paypal" && (
                        <div className="relative w-16 h-4">
                          <Image
                            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                            alt="PayPal"
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-semibold">{provider.name}</p>
                        <p className="text-xs text-gray-500">
                          {provider.supportedCurrencies.join(", ")}
                        </p>
                      </div>
                    </div>
                    {selectedProvider === provider.provider && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {availableProviders.length === 0 && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Aucune méthode de paiement disponible pour cette devise et ce pays.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Préparation du paiement...
              </p>
            </div>
          )}

          {/* Payment Button */}
          {!isLoading && selectedProvider && (
            <Button
              onClick={handlePayment}
              disabled={!selectedProvider || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Payer {formatPrice(convertedAmount, currency)}
            </Button>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-4 border-t">
            <Lock className="h-3 w-3" />
            <span>Paiement sécurisé SSL 256 bits</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}




