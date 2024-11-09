import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import React from "react";
import PurchasePlan from "./_components/PurchasePlan";

const SubscriptionPage = async () => {
  try {
    const subscriptionPlansPromise = prisma.subscriptionPlan.findMany();
    const [subscriptionPlans] = await Promise.all([subscriptionPlansPromise]);

    // Vérifiez s'il existe des plans d'abonnement
    if ([subscriptionPlans].length === 0) {
      throw new Error("Something went wrong with subscription Plans");
    }

    return (
      <div>
        <PageTitle title="Plans d'abonnement" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-4">
          {subscriptionPlans.map((item, index) => (
            <Plan plan={item} key={index} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <></>;
  }
};
export default SubscriptionPage;

const Plan = ({ plan }: { plan: SubscriptionPlan }) => {
  return (
    <div className="border rounded shadow flex flex-col gap-5 justify-between p-5">
      <h1 className="text-xl font-bold text-primary-500 text-center">
        {plan.name}
      </h1>
      <h1 className="text-2xl lg:text-4xl text-orange-600 font-bold text-center">
        {plan.price.toString()} F CFA/mois
      </h1>
      <hr />
      <div className="flex flex-col gap-1 text-center">
        {plan.features.split(",").map((feature, index) => (
          <p key={index} className="text-slate-500 text-sm">
            {feature.trim()}
          </p>
        ))}
      </div>
      <PurchasePlan plan={plan} />
    </div>
  );
};
