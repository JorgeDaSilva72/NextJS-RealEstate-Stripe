import prisma from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Crown } from "lucide-react";
import { Link } from "@/i18n/routing";
import SubscriptionPlansClient from "./_components/SubscriptionPlansClient";

type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant" | "visite3d";

interface Props {
  params: { locale: string };
}

const SubscriptionPage = async ({ params }: Props): Promise<JSX.Element> => {
  // Check authentication
  const { getUser } = await getKindeServerSession();
  const user = await getUser();
  
  if (!user || !user.id) {
    redirect('/api/auth/login');
  }

  try {
    // Get subscription plans
    const subscriptionPlans: SubscriptionPlan[] =
      await prisma.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' }
      });

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new Error("Aucun plan d'abonnement disponible.");
    }

    // Get current user subscription
    const currentSubscription = await prisma.subscriptions.findFirst({
      where: {
        userId: user!.id,
        status: "ACTIVE",
        endDate: {
          gt: new Date(),
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const currentPlanId = currentSubscription?.planId || null;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
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
                Choisissez votre plan d&apos;abonnement
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Sélectionnez le plan qui correspond le mieux à vos besoins et bénéficiez de nos offres exclusives
              </p>
            </div>
          </div>
        </section>

        {/* Subscription Plans - Client Component */}
        <SubscriptionPlansClient 
          plans={subscriptionPlans} 
          currentPlanId={currentPlanId}
        />

        {/* Info Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-lg">
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
                    Nos plans d&apos;abonnement vous offrent une visibilité optimale sur le marché immobilier grâce à une communication professionnelle sur YouTube et les réseaux sociaux. 
                    Bénéficiez de fonctionnalités premium et augmentez votre portée pour trouver plus rapidement les bons clients.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  } catch (error) {
    console.error("PLAN ERROR", error);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardHeader>
              <CardTitle className="text-red-600">Erreur</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                Une erreur est survenue : impossible de charger les plans d&apos;abonnement.
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
      </div>
    );
  }
};

export default SubscriptionPage;
