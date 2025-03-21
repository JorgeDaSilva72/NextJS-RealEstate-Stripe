// import PageTitle from "@/app/components/pageTitle";
// import prisma from "@/lib/prisma";
// import { SubscriptionPlan } from "@prisma/client";
// import React from "react";
// import PurchasePlan from "./_components/PurchasePlan";

// import DiamondPack from "./_components/DiamondPack";
// import GoldPack from "./_components/GoldPack";
// import SilverPack from "./_components/SilverPack";
// import BronzePack from "./_components/BronzePack";
// import GratuitPack from "./_components/GratuitPack";

// type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant";

// const COMPONENT_MAPPING: Record<PlanName, React.FC<any>> = {
//   gratuit: GratuitPack,
//   bronze: BronzePack,
//   argent: SilverPack,
//   or: GoldPack,
//   diamant: DiamondPack,
// };

// const SubscriptionPage = async (): Promise<JSX.Element> => {
//   try {
//     const subscriptionPlans: SubscriptionPlan[] =
//       await prisma.subscriptionPlan.findMany();
//     // const [subscriptionPlans] = await Promise.all([subscriptionPlansPromise]);

//     // Vérifiez s'il existe des plans d'abonnement

//     if (!subscriptionPlans || subscriptionPlans.length === 0) {
//       throw new Error("Aucun plan d'abonnement disponible.");
//     }

//     // Définir l'ordre des plans
//     const PLAN_ORDER: PlanName[] = [
//       "gratuit",
//       "bronze",
//       "argent",
//       "or",
//       "diamant",
//     ];

//     // Trier les plans selon l'ordre défini
//     const sortedPlans = subscriptionPlans.sort((a, b) => {
//       const orderA = PLAN_ORDER.indexOf(a.namePlan.toLowerCase() as PlanName);
//       const orderB = PLAN_ORDER.indexOf(b.namePlan.toLowerCase() as PlanName);
//       return orderA - orderB;
//     });

//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <PageTitle title="Sélectionnez un plan pour bénéficier de nos offres exclusives:" />

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//           {sortedPlans.map((plan) => {
//             const PackComponent =
//               COMPONENT_MAPPING[plan.namePlan.toLowerCase() as PlanName];
//             return PackComponent ? (
//               <PackComponent key={plan.id} data={plan} />
//             ) : null;
//           })}
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.log("PLAN ERROR", error)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <p className="text-red-500 text-lg font-bold">
//           Une erreur est survenue : impossible de charger les plans
//           d&#39;abonnement.
//         </p>
//       </div>
//     );
//   }
// };
// export default SubscriptionPage;
// import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { SubscriptionPlan } from "@prisma/client";
import React from "react";

import DiamondPack from "./_components/DiamondPack";
import GoldPack from "./_components/GoldPack";
import SilverPack from "./_components/SilverPack";
import BronzePack from "./_components/BronzePack";
import GratuitPack from "./_components/GratuitPack";
import SubscriptionCarousel from "./_components/SubscriptionCarousel";
import PageTitle from "../../components/pageTitle";
import Visit3DPack from "./_components/Visit3DPack";

// type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant";
type PlanName = "gratuit" | "bronze" | "argent" | "or" | "diamant" | "visite3d";

const COMPONENT_MAPPING: Record<PlanName, React.FC<any>> = {
  gratuit: GratuitPack,
  bronze: BronzePack,
  argent: SilverPack,
  or: GoldPack,
  diamant: DiamondPack,
  visite3d: Visit3DPack, //ajout
};

const SubscriptionPage = async (): Promise<JSX.Element> => {
  try {
    const subscriptionPlans: SubscriptionPlan[] =
      await prisma.subscriptionPlan.findMany();

    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      throw new Error("Aucun plan d'abonnement disponible.");
    }

    // Créer les données en dur pour le plan visite3d

    // const visit3dPlan = {
    //   id: 21212112,
    //   namePlan: "VISITE 3D",
    //   price: null,
    //   country: null,
    //   startDate: null,
    //   endDate: null,
    //   duration: null,
    //   premiumAds: "10",
    //   photosPerAd: "10",
    //   shortVideosPerAd: "1",
    //   youtubeVideoDuration: 60,
    //   zoneRadius: null,
    //   createdAt: null,
    //   updatedAt: null,
    //   features: [
    //     // ajout du tableau features
    //     "Vues panoramiques 360°",
    //     "Photos HD incluses",
    //     "Vidéo de présentation",
    //     "Hébergement et partage inclus",
    //   ],
    // };

    const PLAN_ORDER: PlanName[] = [
      "gratuit",
      "bronze",
      "argent",
      "or",
      "diamant",
      "visite3d", // ajout
    ];

    const sortedPlans = subscriptionPlans.sort((a, b) => {
      const orderA = PLAN_ORDER.indexOf(a.namePlan.toLowerCase() as PlanName);
      const orderB = PLAN_ORDER.indexOf(b.namePlan.toLowerCase() as PlanName);
      return orderA - orderB;
    });

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <PageTitle title="Sélectionnez un plan pour bénéficier de nos offres exclusives:" />
        <SubscriptionCarousel
          plans={sortedPlans}
          COMPONENT_MAPPING={COMPONENT_MAPPING}
          isAuthenticated={true}
        />
      </div>
    );
  } catch (error) {
    console.log("PLAN ERROR", error);
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
