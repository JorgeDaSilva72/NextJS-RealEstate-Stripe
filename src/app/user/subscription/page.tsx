import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import React from "react";
import PurchasePlan from "./_components/PurchasePlan";

import DiamondPack from "./_components/DiamondPack";
import GoldPack from "./_components/GoldPack";
import SilverPack from "./_components/SilverPack";
import BronzePack from "./_components/BronzePack";

const SubscriptionPage = async () => {
  try {
    const subscriptionPlansPromise = prisma.subscriptionPlan.findMany();
    const [subscriptionPlans] = await Promise.all([subscriptionPlansPromise]);

    // Vérifiez s'il existe des plans d'abonnement
    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new Error("Aucun plan d'abonnement disponible.");
    }

    return (
      // <div className="min-h-screen bg-gray-50 p-6">
      //   {/* Title of the page */}
      //   <PageTitle title="Choisissez votre plan d'abonnement" />
      //   {/* Subtitle */}
      //   <p className="text-center text-gray-600 mt-4 mb-8 text-lg">
      //     Sélectionnez le plan qui correspond le mieux à vos besoins et
      //     débloquez des avantages exclusifs.
      //   </p>
      //   {/* Plans grid */}
      //   <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
      //     {subscriptionPlans.map((item, index) => (
      //       <Plan plan={item} key={index} />
      //     ))}
      //   </div>
      // </div>

      <div className="min-h-screen bg-gray-50 p-6">
        <PageTitle title="Choisissez votre plan d'abonnement" />
        <p className="text-center text-gray-600 mt-4 mb-8 text-lg">
          Sélectionnez un plan pour bénéficier de nos offres exclusives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {subscriptionPlans.map((plan) => {
            switch (plan.name.toLowerCase()) {
              case "bronze":
                // return <BronzePack key={plan.id} data={plan} />;
                return <BronzePack key={plan.id} />;

              case "argent":
                // return <SilverPack key={plan.id} data={plan} />;
                return <SilverPack key={plan.id} />;

              case "or":
                // return <GoldPack key={plan.id} data={plan} />;
                return <GoldPack key={plan.id} />;

              case "diamand":
                // return <DiamondPack key={plan.id} data={plan} />;
                return <DiamondPack key={plan.id} />;

              default:
                return null;
            }
          })}
        </div>
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

// Individual plan component
const Plan = ({ plan }: { plan: SubscriptionPlan }) => {
  return (
    <div className="bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between">
      {/* Plan name */}
      <h2 className="text-2xl font-bold text-center text-primary-500 mb-4">
        {plan.name}
      </h2>

      {/* Plan price */}
      <div className="text-center">
        {/* <p className="text-gray-600 text-sm">À partir de</p> */}
        <p className="text-4xl font-extrabold text-orange-600">
          {plan.price.toLocaleString()} F CFA
          <span className="text-lg">/mois</span>
        </p>
      </div>

      <hr className="my-4" />

      {/* Plan features */}
      <ul className="space-y-2 text-gray-600 text-sm text-center">
        {plan.features.split(",").map((feature, index) => (
          <li key={index} className="before:content-['✔️'] before:mr-2">
            {feature.trim()}
          </li>
        ))}
      </ul>

      {/* Purchase button */}
      <div className="mt-6 text-center">
        <PurchasePlan plan={plan} />
      </div>
    </div>
  );
};

// import React from "react";
// import DiamondPack from "./_components/DiamondPack";
// import GoldPack from "./_components/GoldPack";
// import SilverPack from "./_components/SilverPack";
// import BronzePack from "./_components/BronzePack";

// function App() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         <BronzePack />
//         <SilverPack />
//         <GoldPack />
//         <DiamondPack />
//       </div>
//     </div>
//   );
// }

// export default App;
