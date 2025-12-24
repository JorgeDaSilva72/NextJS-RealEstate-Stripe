"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, Globe, Lock, Loader2 } from "lucide-react";
import { SubscriptionPlan } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";

interface PrimerPaymentProps {
  plan: SubscriptionPlan;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

/**
 * Primer Payment Component
 * 
 * Handles payment through Primer, which orchestrates:
 * - Flutterwave (Mobile Money, Franc CFA, cards)
 * - Paystack (Nigeria, Ghana, cards)
 * - Visa/Mastercard
 * - PayPal (if enabled)
 */
export default function PrimerPayment({
  plan,
  isOpen,
  onClose,
  onSuccess,
}: PrimerPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "african" | null>(null);
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

  const handlePayment = async (method: "card" | "african") => {
    setIsLoading(true);
    setPaymentMethod(method);

    try {
      const numericPrice = getNumericPrice(plan.price);

      // Create Primer payment session
      const response = await fetch("/api/primer/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: numericPrice,
          currency: "EUR",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment session");
      }

      const data = await response.json();

      // If Primer provides a redirect URL, redirect to it
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
        return;
      }

      // If Primer provides a client token, we can embed their checkout
      if (data.clientToken) {
        // Load Primer checkout SDK and initialize
        // This is a placeholder - actual implementation depends on Primer's SDK
        console.log("Primer client token received:", data.clientToken);
        
        // For now, show success message and redirect
        // In production, you would initialize Primer's checkout UI here
        toast.success("Redirection vers le paiement...");
        
        // The actual payment will be handled by Primer's checkout
        // Webhook will confirm the payment
        setTimeout(() => {
          router.push("/user/profile");
        }, 2000);
      } else {
        throw new Error("No payment method provided by Primer");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Erreur lors du paiement");
      setIsLoading(false);
      setPaymentMethod(null);
    }
  };

  const numericPrice = getNumericPrice(plan.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Paiement - Plan {plan.namePlan}
          </DialogTitle>
          <DialogDescription>
            Montant: <span className="font-semibold text-lg">{numericPrice.toFixed(2)} €</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payment Method Selection */}
          {!paymentMethod && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Choisissez votre méthode de paiement
              </p>

              {/* Card Payment (Visa/Mastercard via Primer) */}
              <Button
                onClick={() => handlePayment("card")}
                disabled={isLoading}
                className="w-full h-auto p-4 flex items-center justify-between border-2 hover:border-blue-500 transition-all"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold">Carte bancaire</p>
                    <p className="text-xs text-gray-500">Visa / Mastercard</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                </div>
              </Button>

              {/* African Payments (Flutterwave/Paystack via Primer) */}
              <Button
                onClick={() => handlePayment("african")}
                disabled={isLoading}
                className="w-full h-auto p-4 flex items-center justify-between border-2 hover:border-green-500 transition-all"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-semibold">Paiements africains</p>
                    <p className="text-xs text-gray-500">
                      Mobile Money, Franc CFA, Paystack
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-green-600">Flutterwave</span>
                  <span className="text-xs font-semibold text-green-600">Paystack</span>
                </div>
              </Button>
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




