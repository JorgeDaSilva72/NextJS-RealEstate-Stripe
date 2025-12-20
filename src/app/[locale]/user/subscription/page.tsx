import prisma from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import { redirect } from "@/i18n/routing";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  ArrowLeft,
  Check,
  Sparkles,
  Star,
  Zap,
  Gift
} from "lucide-react";
import { Link } from "@/i18n/routing";
import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";
import PurchasePlan from "./_components/PurchasePlan";

type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant" | "visite3d";

const SubscriptionPage = async (): Promise<JSX.Element> => {
  // Check authentication
  const { getUser } = await getKindeServerSession();
  const user = await getUser();
  
  if (!user || !user.id) {
    redirect('/api/auth/login');
  }

  try {
    const subscriptionPlans: SubscriptionPlan[] =
      await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      });

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new Error("Aucun plan d'abonnement disponible.");
    }

    const PLAN_ORDER: PlanName[] = [
      "gratuit",
      "bronze",
      "argent",
      "or",
      "diamant",
      "visite3d",
    ];

    const sortedPlans = subscriptionPlans.sort((a, b) => {
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

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Navbar */}
        <HomeNavbar />

        {/* Hero Section */}
        <section className="relative pt-24 pb-12 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="absolute inset-0 bg-[url('/Hero1.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/user/profile">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au profil
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choisissez votre plan d'abonnement
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Sélectionnez le plan qui correspond le mieux à vos besoins et bénéficiez de nos offres exclusives
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Plans */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlans.map((plan) => {
              const config = getPlanConfig(plan.namePlan);
              const Icon = config.icon;
              const price = formatPrice(plan.price);
              const features = parseFeatures(plan.features || "");
              const numericPrice = typeof plan.price === "number" ? plan.price : Number(plan.price || 0);

              return (
                <Card
                  key={plan.id}
                  className={`relative shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    config.popular ? "ring-2 ring-yellow-400 scale-105" : ""
                  }`}
                >
                  {config.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1">
                        <Star className="mr-1 h-3 w-3" />
                        Populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={`bg-gradient-to-r ${config.headerGradient} text-white rounded-t-lg`}>
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

                  <CardFooter className="p-6 pt-0">
                    <PurchasePlan
                      plan={plan}
                      buttonClassName={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg`}
                      defaultPaymentProvider="stripe"
                    />
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Crown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Pourquoi choisir un abonnement ?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Nos plans d'abonnement vous offrent une visibilité optimale sur le marché immobilier grâce à une communication professionnelle sur YouTube et les réseaux sociaux. 
                      Bénéficiez de fonctionnalités premium et augmentez votre portée pour trouver plus rapidement les bons clients.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <HomeFooter />
      </div>
    );
  } catch (error) {
    console.error("PLAN ERROR", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <HomeNavbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Une erreur est survenue : impossible de charger les plans d'abonnement.
                Veuillez réessayer plus tard.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/user/profile">
                <Button>Retour au profil</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        <HomeFooter />
      </div>
    );
  }
};

export default SubscriptionPage;
