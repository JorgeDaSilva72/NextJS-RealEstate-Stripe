import prisma from "@/lib/prisma";
import SubscriptionCarousel from "../user/subscription/_components/SubscriptionCarousel";
import PageTitle from "../components/pageTitle";
import {
  COMPONENT_MAPPING,
  PLAN_ORDER,
  PlanName,
  PUBLIC_PLANS,
} from "@/lib/subscriptions-utils";
import { SubscriptionPlan } from "@prisma/client";

const PublicSubscriptionPage = async (): Promise<JSX.Element> => {
  try {
    const subscriptionPlans: SubscriptionPlan[] =
      await prisma.subscriptionPlan.findMany();

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new Error("Aucun plan d'abonnement disponible.");
    }

    const sortedPlans = subscriptionPlans.sort((a, b) => {
      const orderA = PLAN_ORDER.indexOf(a.namePlan?.toLowerCase() as PlanName);
      const orderB = PLAN_ORDER.indexOf(b.namePlan?.toLowerCase() as PlanName);
      return orderA - orderB;
    });

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <PageTitle title="Découvrez nos offres d'abonnement" />
        <div className="text-center mb-6 text-gray-600">
          {/* <p className="mb-2">
            Connectez-vous pour voir les tarifs détaillés et souscrire à nos
            offres
          </p> */}
          {/* <a
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Se connecter →
          </a> */}
        </div>
        <SubscriptionCarousel
          plans={sortedPlans}
          COMPONENT_MAPPING={COMPONENT_MAPPING}
          isAuthenticated={false}
        />
      </div>
    );
  } catch (error) {
    console.error("PLAN ERROR", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg font-bold">
          Une erreur est survenue : impossible de charger les plans
          d&#39;abonnement.
        </p>
      </div>
    );
  }
};

export default PublicSubscriptionPage;
