"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check,
  Sparkles,
  Star,
  Zap,
  Gift,
  Shield,
  CreditCard,
  Lock,
  CheckCircle2
} from "lucide-react";
import { SubscriptionPlan } from "@prisma/client";
import PurchasePlan from "./PurchasePlan";
import PrimerPayment from "./PrimerPayment";
import MultiCurrencyPaymentModal from "./MultiCurrencyPaymentModal";
import EnhancedPaymentModal from "./EnhancedPaymentModal";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant" | "visite3d";

interface SubscriptionPlansClientProps {
  plans: SubscriptionPlan[];
  currentPlanId?: number | null;
}

export default function SubscriptionPlansClient({ 
  plans, 
  currentPlanId 
}: SubscriptionPlansClientProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<Record<number, "card" | "paypal">>({});
  const [primerPaymentOpen, setPrimerPaymentOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);
  const [multiCurrencyModalOpen, setMultiCurrencyModalOpen] = useState(false);

  const PLAN_ORDER: PlanName[] = [
    "gratuit",
    "bronze",
    "argent",
    "or",
    "diamant",
    "visite3d",
  ];

  const sortedPlans = plans.sort((a, b) => {
    const orderA = PLAN_ORDER.indexOf(a.namePlan.toLowerCase() as PlanName);
    const orderB = PLAN_ORDER.indexOf(b.namePlan.toLowerCase() as PlanName);
    return orderA - orderB;
  });

  // Get plan colors and icons
  const getPlanConfig = (planName: string) => {
    const name = planName.toLowerCase();
    if (name === "gratuit") {
      return {
        gradient: "from-gray-500 to-gray-700",
        headerGradient: "from-gray-600 to-gray-800",
        icon: Gift,
        popular: false,
      };
    }
    if (name === "bronze") {
      return {
        gradient: "from-orange-400 to-orange-600",
        headerGradient: "from-orange-500 to-orange-700",
        icon: Star,
        popular: false,
      };
    }
    if (name === "argent") {
      return {
        gradient: "from-slate-400 to-slate-600",
        headerGradient: "from-slate-500 to-slate-700",
        icon: Zap,
        popular: false,
      };
    }
    if (name === "or") {
      return {
        gradient: "from-yellow-400 to-yellow-600",
        headerGradient: "from-yellow-500 to-yellow-700",
        icon: Crown,
        popular: true,
      };
    }
    if (name === "diamant") {
      return {
        gradient: "from-blue-400 via-purple-500 to-pink-500",
        headerGradient: "from-blue-500 via-purple-600 to-pink-600",
        icon: Sparkles,
        popular: false,
      };
    }
    return {
      gradient: "from-indigo-500 to-purple-600",
      headerGradient: "from-indigo-600 to-purple-700",
      icon: Crown,
      popular: false,
    };
  };

  const formatPrice = (price: any) => {
    if (!price) return "0";
    const numericPrice = typeof price === "number" ? price : Number(price);
    return numericPrice.toFixed(0);
  };

  const parseFeatures = (featuresString: string) => {
    try {
      if (featuresString.startsWith('[') || featuresString.startsWith('{')) {
        return JSON.parse(featuresString);
      }
      return featuresString.split(',').map(f => f.trim()).filter(f => f);
    } catch {
      return featuresString.split(',').map(f => f.trim()).filter(f => f);
    }
  };

  const handlePlanSelect = (planId: number) => {
    if (planId === currentPlanId) return; // Don't allow selecting current plan
    const newSelectedId = planId === selectedPlanId ? null : planId;
    setSelectedPlanId(newSelectedId);
    // Initialize payment method for this plan if not set
    if (newSelectedId && !paymentMethods[newSelectedId]) {
      setPaymentMethods(prev => ({ ...prev, [newSelectedId]: "paypal" }));
    }
  };

  const handlePaymentMethodChange = (planId: number, method: "card" | "paypal") => {
    setPaymentMethods(prev => ({ ...prev, [planId]: method }));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlans.map((plan) => {
          const config = getPlanConfig(plan.namePlan);
          const Icon = config.icon;
          const price = formatPrice(plan.price);
          const features = parseFeatures(plan.features || "");
          const numericPrice = typeof plan.price === "number" ? plan.price : Number(plan.price || 0);
          const isCurrentPlan = currentPlanId === plan.id;
          const isSelected = selectedPlanId === plan.id;
          const isSelectable = !isCurrentPlan;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative shadow-lg transition-all duration-300",
                isSelected && "ring-2 ring-blue-500 shadow-2xl scale-105",
                isCurrentPlan && "ring-2 ring-green-500 bg-green-50/50 dark:bg-green-950/20",
                !isSelected && !isCurrentPlan && "hover:shadow-xl"
              )}
            >
              {/* Popular Badge */}
              {config.popular && !isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1">
                    <Star className="mr-1 h-3 w-3" />
                    Populaire
                  </Badge>
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Plan actuel
                  </Badge>
                </div>
              )}

              <CardHeader className={cn(
                `bg-gradient-to-r ${config.headerGradient} text-white rounded-t-lg`,
                isCurrentPlan && "opacity-90"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-8 w-8" />
                  {numericPrice === 0 && (
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      Gratuit
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.namePlan}</CardTitle>
                <CardDescription className="text-white/80">
                  Plan {plan.namePlan}
                </CardDescription>
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{price} €</span>
                    <span className="text-lg ml-2 text-white/80">/ {plan.duration || "AN"}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Plan Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {plan.premiumAds > 0 && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{plan.premiumAds}</p>
                        <p className="text-gray-600 dark:text-gray-400">Annonces</p>
                      </div>
                    )}
                    {plan.photosPerAd > 0 && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{plan.photosPerAd}</p>
                        <p className="text-gray-600 dark:text-gray-400">Photos/Annonce</p>
                      </div>
                    )}
                    {plan.shortVideosPerAd > 0 && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{plan.shortVideosPerAd}</p>
                        <p className="text-gray-600 dark:text-gray-400">Vidéos</p>
                      </div>
                    )}
                    {plan.zoneRadius > 0 && (
                      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <p className="font-semibold text-gray-900 dark:text-white">{plan.zoneRadius} km</p>
                        <p className="text-gray-600 dark:text-gray-400">Zone</p>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  {features && features.length > 0 && (
                    <div className="pt-4 border-t">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Fonctionnalités incluses:
                      </p>
                      <ul className="space-y-2">
                        {features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Additional Info */}
                  {plan.youtubeVideoDuration && (
                    <div className="pt-2 text-sm text-gray-600 dark:text-gray-400">
                      <p>🎥 Vidéo YouTube: {plan.youtubeVideoDuration} min</p>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 flex flex-col gap-4">
                {/* Select Plan Button */}
                {isSelectable && (
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "w-full font-semibold transition-all duration-300",
                      isSelected 
                        ? `bg-gradient-to-r ${config.gradient} text-white hover:opacity-90` 
                        : "border-2 hover:border-blue-500"
                    )}
                  >
                    {isSelected ? "Plan sélectionné" : "Choisir ce plan"}
                  </Button>
                )}

                {/* Current Plan Indicator */}
                {isCurrentPlan && (
                  <div className="w-full p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-300 dark:border-green-700">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200 text-center">
                      ✓ Vous êtes actuellement sur ce plan
                    </p>
                  </div>
                )}

                {/* Payment Options - Only show for selected plan */}
                {isSelected && !isCurrentPlan && (
                  <div className="w-full space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                        Choisissez votre méthode de paiement
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={paymentMethods[plan.id] === "card" ? "default" : "outline"}
                          onClick={() => handlePaymentMethodChange(plan.id, "card")}
                          className={cn(
                            "flex-1 transition-all duration-200",
                            paymentMethods[plan.id] === "card" && "bg-blue-600 hover:bg-blue-700 text-white"
                          )}
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          Carte
                        </Button>
                        <Button
                          type="button"
                          variant={paymentMethods[plan.id] === "paypal" ? "default" : "outline"}
                          onClick={() => handlePaymentMethodChange(plan.id, "paypal")}
                          className={cn(
                            "flex-1 transition-all duration-200",
                            paymentMethods[plan.id] === "paypal" && "bg-blue-600 hover:bg-blue-700 text-white"
                          )}
                        >
                          <div className="relative w-16 h-4 mr-2 inline-block">
                            <Image
                              src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                              alt="PayPal"
                              fill
                              className="object-contain"
                              sizes="64px"
                            />
                          </div>
                          PayPal
                        </Button>
                      </div>
                    </div>

                    {/* Payment Logos */}
                    <div className="flex items-center justify-center gap-3 pt-2 border-t">
                      {paymentMethods[plan.id] === "card" && (
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Accepté:</div>
                          <div className="flex gap-1">
                            <div className="w-10 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              VISA
                            </div>
                            <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                              MC
                            </div>
                          </div>
                        </div>
                      )}
                      {paymentMethods[plan.id] === "paypal" && (
                        <div className="relative w-20 h-6">
                          <Image
                            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                            alt="PayPal"
                            fill
                            className="object-contain"
                            sizes="80px"
                          />
                        </div>
                      )}
                    </div>

                    {/* Purchase Button - Opens Multi-Currency Payment Modal */}
                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          setSelectedPlanForPayment(plan);
                          setMultiCurrencyModalOpen(true);
                        }}
                        className={cn(
                          "w-full bg-gradient-to-r text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl",
                          config.gradient
                        )}
                      >
                        Choisir ce plan
                      </Button>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Lock className="h-3 w-3" />
                      <span>Paiement sécurisé SSL 256 bits</span>
                    </div>
                  </div>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Payment Modal */}
      {selectedPlanForPayment && (
        <EnhancedPaymentModal
          plan={selectedPlanForPayment}
          isOpen={multiCurrencyModalOpen}
          onClose={() => {
            setMultiCurrencyModalOpen(false);
            setSelectedPlanForPayment(null);
          }}
          onSuccess={() => {
            setMultiCurrencyModalOpen(false);
            setSelectedPlanForPayment(null);
            setSelectedPlanId(null);
            // Refresh page to show updated subscription
            window.location.reload();
          }}
        />
      )}

      {/* Payment Methods Info Section */}
      <div className="mt-12">
        <Card className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6" />
              <CardTitle className="text-xl">Méthodes de paiement sécurisées</CardTitle>
            </div>
            <CardDescription className="text-white/90">
              Paiements 100% sécurisés et cryptés
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Card Payment */}
              <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-colors">
                <div className="flex gap-2">
                  <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                    MC
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Carte bancaire</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Sécurisé</span>
                </div>
              </div>

              {/* PayPal Logo */}
              <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 transition-colors">
                <div className="relative w-32 h-10">
                  <Image
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                    alt="PayPal"
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Lock className="h-4 w-4 text-green-500" />
                  <span>Sécurisé</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <CreditCard className="h-4 w-4" />
                Toutes les transactions sont protégées par un cryptage SSL 256 bits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

