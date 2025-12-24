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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Globe,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Euro,
  DollarSign,
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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

type PaymentMethod = "card" | "paypal" | "flutterwave" | "paystack";

interface EnhancedPaymentModalProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Enhanced Payment Modal with Clean UX
 * 
 * Flow:
 * 1. Show plan summary and total
 * 2. User selects payment method (Card, PayPal, or African aggregators)
 * 3. Show relevant fields based on selection
 * 4. Process payment
 */
export default function EnhancedPaymentModal({
  plan,
  isOpen,
  onClose,
  onSuccess,
}: EnhancedPaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const router = useRouter();
  const { user } = useKindeBrowserClient();

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

  // Detect country on mount
  useEffect(() => {
    const detectCountry = async () => {
      const detected = await detectCountryFromIP();
      const country = detected || getDefaultCountry();
      setCountryInfo(country);
      
      // Set default currency based on country
      // For PayPal, default to EUR or USD
      if (country.currency.code === "USD") {
        setSelectedCurrency("USD");
      } else {
        setSelectedCurrency("EUR");
      }
    };

    if (isOpen) {
      detectCountry();
      setSelectedMethod(null); // Reset selection when modal opens
    }
  }, [isOpen]);

  // Convert amount when currency changes
  useEffect(() => {
    const convertAmount = async () => {
      if (selectedCurrency === baseCurrency) {
        setConvertedAmount(baseAmount);
        return;
      }

      setIsConverting(true);
      try {
        const converted = await convertCurrency(baseAmount, baseCurrency, selectedCurrency);
        setConvertedAmount(converted);
      } catch (error) {
        console.error("Error converting currency:", error);
        toast.error("Erreur lors de la conversion de devise");
        setConvertedAmount(baseAmount);
      } finally {
        setIsConverting(false);
      }
    };

    convertAmount();
  }, [selectedCurrency, baseAmount, baseCurrency]);

  // Get available currencies for selected payment method
  const getAvailableCurrencies = (method: PaymentMethod): CurrencyCode[] => {
    switch (method) {
      case "paypal":
        return ["EUR", "USD"];
      case "card":
        return ["EUR", "USD", "XOF", "XAF", "MAD", "ZAR", "NGN", "KES", "GHS", "EGP", "RWF", "MUR", "TZS", "CDF", "GNF", "ETB", "UGX"];
      case "flutterwave":
      case "paystack":
        // Show currencies based on country
        if (countryInfo) {
          const providers = getAvailableProviders(countryInfo.currency.code, countryInfo.code);
          const provider = providers.find(p => p.provider === method);
          return provider?.supportedCurrencies || [];
        }
        return [];
      default:
        return [];
    }
  };

  // Handle payment method selection
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    
    // Auto-adjust currency if needed
    const availableCurrencies = getAvailableCurrencies(method);
    if (availableCurrencies.length > 0 && !availableCurrencies.includes(selectedCurrency)) {
      // Set to first available currency or EUR/USD for PayPal
      if (method === "paypal") {
        setSelectedCurrency(availableCurrencies.includes("EUR") ? "EUR" : "USD");
      } else {
        setSelectedCurrency(availableCurrencies[0]);
      }
    }
  };

  // Handle card payment
  const handleCardPayment = async () => {
    if (!countryInfo) {
      toast.error("Impossible de détecter votre pays");
      return;
    }

    setIsLoading(true);
    try {
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
          paymentProvider: "primer", // Use Primer for card payments
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment intent");
      }

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No payment URL provided");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Erreur lors du paiement");
      setIsLoading(false);
    }
  };

  // Handle Flutterwave/Paystack payment
  const handleAfricanPayment = async (provider: "flutterwave" | "paystack") => {
    if (!countryInfo) {
      toast.error("Impossible de détecter votre pays");
      return;
    }

    setIsLoading(true);
    try {
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
          paymentProvider: provider,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment intent");
      }

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error("No payment URL provided");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Erreur lors du paiement");
      setIsLoading(false);
    }
  };

  // Handle PayPal payment success
  const handlePayPalSuccess = async (details: any) => {
    try {
      // Save subscription via API
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          paymentId: details.id,
          paymentProvider: "PayPal",
          amount: convertedAmount,
          currency: selectedCurrency,
          baseAmount: baseAmount,
          baseCurrency: baseCurrency,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      toast.success("Paiement réussi! Votre abonnement est activé.");
      onSuccess?.();
      onClose();
      router.push("/user/profile");
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      toast.error("Erreur lors de l'activation de l'abonnement");
    }
  };

  const currency = getCurrency(selectedCurrency);
  const availableCurrencies = selectedMethod ? getAvailableCurrencies(selectedMethod) : [];

  // Check if African aggregators should be shown
  const shouldShowAfricanAggregators = countryInfo && (
    countryInfo.code === "NG" || // Nigeria
    countryInfo.code === "GH" || // Ghana
    countryInfo.code === "KE" || // Kenya
    countryInfo.code === "ZA" || // South Africa
    ["SN", "CI", "BJ", "TG", "CM", "GA"].includes(countryInfo.code) // Franc CFA countries
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Paiement - Plan {plan.namePlan}
          </DialogTitle>
          <DialogDescription>
            Abonnement annuel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Plan Summary */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg">Résumé de l'abonnement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{plan.namePlan}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.premiumAds === 999 ? "Illimité" : plan.premiumAds} annonces • {plan.photosPerAd} photos/annonce
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isConverting ? (
                      <Loader2 className="h-6 w-6 animate-spin inline" />
                    ) : (
                      formatPrice(convertedAmount, currency, false)
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">/ an</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          {!selectedMethod && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Choisissez votre méthode de paiement
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card Payment */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg border-2",
                    "hover:border-blue-500"
                  )}
                  onClick={() => handleMethodSelect("card")}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-lg">Carte bancaire</CardTitle>
                    </div>
                    <CardDescription>
                      Visa, Mastercard • Multi-devises
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* PayPal - Direct to PayPal screen */}
                <Card
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-lg border-2",
                    "hover:border-blue-500"
                  )}
                  onClick={() => {
                    // Directly set PayPal and show PayPal screen
                    setSelectedMethod("paypal");
                    setSelectedCurrency("EUR"); // Default to EUR for PayPal
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="relative w-20 h-6">
                        <Image
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                          alt="PayPal"
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>
                    </div>
                    <CardDescription>
                      EUR, USD uniquement
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Flutterwave (if applicable) */}
                {shouldShowAfricanAggregators && (
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg border-2",
                      "hover:border-green-500"
                    )}
                    onClick={() => handleMethodSelect("flutterwave")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-green-600" />
                        <CardTitle className="text-lg">Flutterwave</CardTitle>
                      </div>
                      <CardDescription>
                        Mobile Money, Cartes locales
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                {/* Paystack (if applicable) */}
                {shouldShowAfricanAggregators && (countryInfo?.code === "NG" || countryInfo?.code === "GH") && (
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg border-2",
                      "hover:border-purple-500"
                    )}
                    onClick={() => handleMethodSelect("paystack")}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Globe className="h-6 w-6 text-purple-600" />
                        <CardTitle className="text-lg">Paystack</CardTitle>
                      </div>
                      <CardDescription>
                        Nigeria, Ghana • Cartes & Virements
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Payment Method Details */}
          {selectedMethod && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Détails du paiement
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMethod(null)}
                >
                  Changer de méthode
                </Button>
              </div>

              {/* Currency Selection (only for Card, Flutterwave, Paystack - NOT PayPal) */}
              {selectedMethod && selectedMethod !== "paypal" && availableCurrencies.length > 1 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Devise
                  </label>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) => setSelectedCurrency(value as CurrencyCode)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((code) => {
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
                </div>
              )}

              {/* Currency Selection for PayPal (EUR or USD only) */}
              {selectedMethod === "paypal" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Devise
                  </label>
                  <Select
                    value={selectedCurrency}
                    onValueChange={(value) => setSelectedCurrency(value as CurrencyCode)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4" />
                          <span className="font-semibold">€</span>
                          <span className="text-sm text-gray-500">Euro</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="USD">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">$</span>
                          <span className="text-sm text-gray-500">US Dollar</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Card Payment Form - NO PayPal option here */}
              {selectedMethod === "card" && (
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      Paiement par carte bancaire
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Montant: <span className="font-bold text-lg">{formatPrice(convertedAmount, currency)}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        VISA
                      </div>
                      <div className="w-12 h-8 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        MC
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        Cartes acceptées
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vous serez redirigé vers une page de paiement sécurisée pour saisir vos informations de carte.
                    </p>
                    <Button
                      onClick={handleCardPayment}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payer {formatPrice(convertedAmount, currency)}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* PayPal Payment - Direct PayPal Screen Only */}
              {selectedMethod === "paypal" && (
                <Card className="border-2 border-blue-200 dark:border-blue-800">
                  <CardHeader className="bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className="relative w-24 h-7">
                            <Image
                              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                              alt="PayPal"
                              fill
                              className="object-contain"
                              sizes="96px"
                            />
                          </div>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Montant: <span className="font-bold text-lg">{formatPrice(convertedAmount, currency)}</span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? (
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          Cliquez sur le bouton PayPal ci-dessous pour finaliser votre paiement
                        </p>
                        <PayPalScriptProvider
                          options={{
                            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                            currency: selectedCurrency,
                          }}
                        >
                          <PayPalButtons
                            style={{
                              layout: "vertical",
                              color: "blue",
                              shape: "rect",
                              label: "paypal",
                            }}
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                intent: "CAPTURE",
                                purchase_units: [
                                  {
                                    amount: {
                                      currency_code: selectedCurrency,
                                      value: convertedAmount.toFixed(2),
                                    },
                                    description: `Abonnement ${plan.namePlan} - Annuel`,
                                  },
                                ],
                              });
                            }}
                            onApprove={async (data, actions) => {
                              if (!actions.order) {
                                toast.error("Erreur lors de la création de la commande");
                                return;
                              }
                              try {
                                setIsLoading(true);
                                const details = await actions.order.capture();
                                await handlePayPalSuccess(details);
                              } catch (error) {
                                console.error("PayPal payment error:", error);
                                toast.error("Erreur lors du paiement PayPal");
                                setIsLoading(false);
                              }
                            }}
                            onError={(error) => {
                              console.error("PayPal error:", error);
                              toast.error("Erreur lors du paiement PayPal");
                              setIsLoading(false);
                            }}
                            onCancel={() => {
                              setIsLoading(false);
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          PayPal n'est pas configuré. Veuillez contacter le support.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Flutterwave Payment */}
              {selectedMethod === "flutterwave" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paiement Flutterwave</CardTitle>
                    <CardDescription>
                      Montant: {formatPrice(convertedAmount, currency)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mobile Money, Cartes bancaires locales, et autres méthodes de paiement disponibles.
                    </p>
                    <Button
                      onClick={() => handleAfricanPayment("flutterwave")}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Globe className="mr-2 h-4 w-4" />
                          Payer avec Flutterwave
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Paystack Payment */}
              {selectedMethod === "paystack" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Paiement Paystack</CardTitle>
                    <CardDescription>
                      Montant: {formatPrice(convertedAmount, currency)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cartes bancaires et virements bancaires pour le Nigeria et le Ghana.
                    </p>
                    <Button
                      onClick={() => handleAfricanPayment("paystack")}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Traitement...
                        </>
                      ) : (
                        <>
                          <Globe className="mr-2 h-4 w-4" />
                          Payer avec Paystack
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
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

