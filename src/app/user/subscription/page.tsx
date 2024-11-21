import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import React from "react";
import PurchasePlan from "./_components/PurchasePlan";

import DiamondPack from "./_components/DiamondPack";
import GoldPack from "./_components/GoldPack";
import SilverPack from "./_components/SilverPack";
import BronzePack from "./_components/BronzePack";

type PlanName = "bronze" | "argent" | "or" | "diamant";

const COMPONENT_MAPPING: Record<PlanName, React.FC<any>> = {
  bronze: BronzePack,
  argent: SilverPack,
  or: GoldPack,
  diamant: DiamondPack,
};

const SubscriptionPage = async (): Promise<JSX.Element> => {
  try {
    const subscriptionPlans: SubscriptionPlan[] =
      await prisma.subscriptionPlan.findMany();
    // const [subscriptionPlans] = await Promise.all([subscriptionPlansPromise]);

    // Vérifiez s'il existe des plans d'abonnement

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new Error("Aucun plan d'abonnement disponible.");
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <PageTitle title="Choisissez votre plan d'abonnement" />
        <p className="text-center text-gray-600 mt-4 mb-8 text-lg">
          Sélectionnez un plan pour bénéficier de nos offres exclusives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => {
            const PackComponent =
              COMPONENT_MAPPING[plan.namePlan.toLowerCase() as PlanName];
            return PackComponent ? (
              <PackComponent key={plan.id} data={plan} />
            ) : null;
          })}
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => {
            switch (plan.namePlan.toLowerCase()) {
              case "bronze":
                // return <BronzePack key={plan.id} data={plan} />;
                return <BronzePack key={plan.id} />;

              case "argent":
                // return <SilverPack key={plan.id} data={plan} />;
                return <SilverPack key={plan.id} />;

              case "or":
                // return <GoldPack key={plan.id} data={plan} />;
                return <GoldPack key={plan.id} />;

              case "diamant":
                // return <DiamondPack key={plan.id} data={plan} />;
                return <DiamondPack key={plan.id} />;

              default:
                return null;
            }
          })}
        </div> */}
      </div>
    );
  } catch (error) {
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
export default SubscriptionPage;
