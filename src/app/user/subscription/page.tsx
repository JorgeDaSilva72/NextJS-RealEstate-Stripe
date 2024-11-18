// import PageTitle from "@/app/components/pageTitle";
// import prisma from "@/lib/prisma";
// import { SubscriptionPlan } from "@prisma/client";
// import React from "react";
// import PurchasePlan from "./_components/PurchasePlan";

// const SubscriptionPage = async () => {
//   try {
//     const subscriptionPlansPromise = prisma.subscriptionPlan.findMany();
//     const [subscriptionPlans] = await Promise.all([subscriptionPlansPromise]);

//     // Vérifiez s'il existe des plans d'abonnement
//     if ([subscriptionPlans].length === 0) {
//       throw new Error("Something went wrong with subscription Plans");
//     }

//     return (
//       <div>
//         <PageTitle title="Plans d'abonnement" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-4">
//           {subscriptionPlans.map((item, index) => (
//             <Plan plan={item} key={index} />
//           ))}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     return <></>;
//   }
// };
// export default SubscriptionPage;

// const Plan = ({ plan }: { plan: SubscriptionPlan }) => {
//   return (
//     <div className="border rounded shadow flex flex-col gap-5 justify-between p-5">
//       <h1 className="text-xl font-bold text-primary-500 text-center">
//         {plan.name}
//       </h1>
//       <h1 className="text-2xl lg:text-4xl text-orange-600 font-bold text-center">
//         {plan.price.toString()} F CFA/mois
//       </h1>
//       <hr />
//       <div className="flex flex-col gap-1 text-center">
//         {plan.features.split(",").map((feature, index) => (
//           <p key={index} className="text-slate-500 text-sm">
//             {feature.trim()}
//           </p>
//         ))}
//       </div>
//       <PurchasePlan plan={plan} />
//     </div>
//   );
// };
import React from "react";
import DiamondPack from "./_components/DiamondPack";
import GoldPack from "./_components/GoldPack";
import SilverPack from "./_components/SilverPack";
import BronzePack from "./_components/BronzePack";

import Image from "next/image";
import bronzeImg from "/public/pricing/bronze.jpg";
import silverImg from "/public/pricing/argent.jpg";
import goldImg from "/public/pricing/or.jpg";
import diamondImg from "/public/pricing/diamant.jpg";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <BronzePack />
        <SilverPack />
        <GoldPack />
        <DiamondPack />
      </div>

      {/* Images optimisées */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Image
          src={bronzeImg}
          alt="Pack Bronze"
          width={600}
          height={800}
          className="rounded-lg shadow"
        />
        <Image
          src={silverImg}
          alt="Pack Argent"
          width={600}
          height={800}
          className="rounded-lg shadow"
        />
        <Image
          src={goldImg}
          alt="Pack Or"
          width={600}
          height={800}
          className="rounded-lg shadow"
        />
        <Image
          src={diamondImg}
          alt="Pack Diamant"
          width={600}
          height={800}
          className="rounded-lg shadow"
        />
      </div>
    </div>
  );
}

export default App;
