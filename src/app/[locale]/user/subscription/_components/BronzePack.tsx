// "use client";

// import React from "react";
// import { SubscriptionPlan } from "@prisma/client";
// import PurchasePlan from "./PurchasePlan";

// interface BronzePackProps {
//   data: SubscriptionPlan;
//   // onSubscribe?: () => void; // Ajout d'une action personnalisée au clic
// }

// const BronzePack: React.FC<BronzePackProps> = ({
//   data,
// }) => {
//   const {
//     namePlan,
//     price,
//     duration,
//     premiumAds,
//     photosPerAd,
//     shortVideosPerAd,
//     youtubeVideoDuration,
//     zoneRadius,
//   } = data;

//   return (
//     <div className="bg-gradient-to-b from-orange-300 to-orange-500 text-black mx-auto p-6 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
//       {/* Titre */}
//       <div>
//         <h1 className="text-3xl sm:text-4xl text-center text-orange-500 font-extrabold bg-clip-text">
//           PACK CONFORT
//           <br />
//           <span
//             className="uppercase bg-gradient-to-r from-orange-700 via-orange-800 to-orange-900 text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(192,192,192,0.8)]"
//             style={{
//               textShadow:
//                 "0 0 5px rgba(255, 165, 0, 0.8), 0 0 10px rgba(255, 140, 0, 0.9)",
//             }}
//           >
//             {namePlan}
//           </span>
//         </h1>

//         {/* Prix */}
//         <h2 className="text-2xl font-bold text-center mt-4">
//           <span className="text-6xl">{price} €</span> / {duration}
//         </h2>

//         {/* Liste des caractéristiques */}
//         <ul className="mt-6 space-y-4 text-lg">
//           <li className="flex items-center">
//             <span className="mr-2">💰</span> {premiumAds} annonces pour un
//             démarrage en douceur
//           </li>
//           <li className="flex items-center">
//             <span className="mr-2">📸</span> {photosPerAd} photos
//             professionnelles par annonce
//           </li>
//           <li className="flex items-center">
//             <span className="mr-2">📂</span> Espace dédié pour gérer vos
//             annonces
//           </li>
//           {shortVideosPerAd > 0 && (
//             <li className="flex items-center">
//               <span className="mr-2">🎥</span> {shortVideosPerAd} vidéo courte
//               (1mn) par annonce.
//             </li>
//           )}
//           {youtubeVideoDuration && (
//             <li className="flex items-center">
//               <span className="mr-2">⏳</span> 1 Vidéo de présentation YouTube
//               de {youtubeVideoDuration}
//             </li>
//           )}
//           {zoneRadius > 0 && (
//             <li className="flex items-center">
//               <span className="mr-2">📍</span> Zone de chalandise exclusive de:{" "}
//               {zoneRadius} km
//             </li>
//           )}
//         </ul>

//         {/* Footer */}
//         <p className="text-sm text-center text-black mt-6">
//           Visibilité sur le marché immobilier grâce à une communication
//           optimisée sur YouTube et les réseaux sociaux.
//         </p>
//       </div>

//       {/* Bouton de souscription */}
//       <div className="mt-6">
//         <PurchasePlan
//           plan={data}
//           buttonClassName="bg-gradient-to-r from-orange-600 to-orange-700  hover:from-orange-500 hover:to-orange-600"
//         />
//       </div>
//     </div>
//   );
// };

// export default BronzePack;
//------------------------------------------------------------------
// "use client";

// import React from "react";
// import { SubscriptionPlan } from "@prisma/client";
// import PurchasePlan from "./PurchasePlan";

// interface BronzePackProps {
//   data: SubscriptionPlan;
// }

// const BronzePack: React.FC<BronzePackProps> = ({ data }) => {
//   const {
//     namePlan,
//     price,
//     duration,
//     premiumAds,
//     photosPerAd,
//     shortVideosPerAd,
//     youtubeVideoDuration,
//     zoneRadius,
//   } = data;

//   return (
//     <div className="bg-white h-full rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden">
//       {/* En-tête */}
//       <div className="bg-gradient-to-b from-orange-100 to-orange-200 p-6">
//         <h1 className="text-2xl sm:text-3xl text-center text-orange-800 font-extrabold">
//           PACK CONFORT
//           <br />
//           <span
//             className="uppercase bg-gradient-to-r from-orange-700 via-orange-800 to-orange-900 text-transparent bg-clip-text font-extrabold text-4xl mt-2 block"
//             style={{
//               textShadow:
//                 "0 0 5px rgba(255, 165, 0, 0.8), 0 0 10px rgba(255, 140, 0, 0.9)",
//             }}
//           >
//             {namePlan}
//           </span>
//         </h1>

//         {/* Prix */}
//         <h2 className="text-2xl font-bold text-center mt-4">
//           <span className="text-5xl">{price} €</span>
//           <span className="text-lg">/ {duration}</span>
//         </h2>
//       </div>

//       {/* Corps - utilisation de flex-grow pour remplir l'espace */}
//       <div className="flex-grow p-6 flex flex-col">
//         {/* Liste des caractéristiques */}
//         <ul className="space-y-4 text-base flex-grow">
//           <li className="flex items-center">
//             <span className="mr-2">💰</span> {premiumAds} annonces pour un
//             démarrage en douceur
//           </li>
//           <li className="flex items-center">
//             <span className="mr-2">📸</span> {photosPerAd} photos
//             professionnelles par annonce
//           </li>
//           <li className="flex items-center">
//             <span className="mr-2">📂</span> Espace dédié pour gérer vos
//             annonces
//           </li>
//           {shortVideosPerAd > 0 && (
//             <li className="flex items-center">
//               <span className="mr-2">🎥</span> {shortVideosPerAd} vidéo courte
//               (1mn) par annonce
//             </li>
//           )}
//           {youtubeVideoDuration && (
//             <li className="flex items-center">
//               <span className="mr-2">⏳</span> 1 Vidéo de présentation YouTube
//               de {youtubeVideoDuration}
//             </li>
//           )}
//           {zoneRadius > 0 && (
//             <li className="flex items-center">
//               <span className="mr-2">📍</span> Zone de chalandise exclusive de{" "}
//               {zoneRadius} km
//             </li>
//           )}
//         </ul>

//         {/* Description en bas */}
//         <p className="text-sm text-center text-gray-600 mt-4">
//           Visibilité sur le marché immobilier grâce à une communication
//           optimisée sur YouTube et les réseaux sociaux.
//         </p>
//       </div>

//       {/* Pied avec bouton - toujours en bas */}
//       <div className="p-6 bg-orange-50">
//         <PurchasePlan
//           plan={data}
//           buttonClassName="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition duration-300"
//         />
//       </div>
//     </div>
//   );
// };

// export default BronzePack;
// ----------------------------------------------------------
// next-intl with claude

"use client";

import React from "react";
import { SubscriptionPlan } from "@prisma/client";
import { useTranslations } from "next-intl";
import PurchasePlan from "./PurchasePlan";
import { Link } from "@/i18n/routing";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@nextui-org/react";

interface BronzePackProps {
  data: SubscriptionPlan;
  isAuthenticated?: boolean;
}

const BronzePack: React.FC<BronzePackProps> = ({
  data,
  isAuthenticated = false,
}) => {
  const t = useTranslations("BronzePack");

  const {
    namePlan,
    price,
    duration,
    premiumAds,
    photosPerAd,
    shortVideosPerAd,
    youtubeVideoDuration,
    zoneRadius,
  } = data;

  // Bouton de connexion pour les utilisateurs non authentifiés
  const LoginButton = () => (
    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 text-center block">
      <LoginLink>Se connecter pour souscrire</LoginLink>
    </Button>
  );

  return (
    <div className="bg-white h-full rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-b from-orange-100 to-orange-200 p-6">
        <h1 className="text-2xl sm:text-3xl text-center text-orange-800 font-extrabold">
          {t("header.title")}
          <br />
          <span
            className="uppercase bg-gradient-to-r from-orange-700 via-orange-800 to-orange-900 text-transparent bg-clip-text font-extrabold text-4xl mt-2 block"
            style={{
              textShadow:
                "0 0 5px rgba(255, 165, 0, 0.8), 0 0 10px rgba(255, 140, 0, 0.9)",
            }}
          >
            {namePlan}
          </span>
        </h1>

        {/* Price */}
        <h2 className="text-2xl font-bold text-center mt-4">
          <span className="text-5xl">{price} €</span>
          <span className="text-lg">/ {duration}</span>
        </h2>
      </div>

      {/* Body - using flex-grow to fill space */}
      <div className="flex-grow p-6 flex flex-col">
        {/* Features list */}
        <ul className="space-y-4 text-base flex-grow">
          <li className="flex items-center">
            <span className="mr-2">💰</span>{" "}
            {t("features.premiumAds", { count: premiumAds })}
          </li>
          <li className="flex items-center">
            <span className="mr-2">📸</span>{" "}
            {t("features.photosPerAd", { count: photosPerAd })}
          </li>
          <li className="flex items-center">
            <span className="mr-2">📂</span> {t("features.dedicatedSpace")}
          </li>
          {shortVideosPerAd > 0 && (
            <li className="flex items-center">
              <span className="mr-2">🎥</span>{" "}
              {t("features.shortVideo", { count: shortVideosPerAd })}
            </li>
          )}
          {youtubeVideoDuration && (
            <li className="flex items-center">
              <span className="mr-2">⏳</span>{" "}
              {t("features.youtubeVideo", { duration: youtubeVideoDuration })}
            </li>
          )}
          {zoneRadius > 0 && (
            <li className="flex items-center">
              <span className="mr-2">📍</span>{" "}
              {t("features.exclusiveZone", { radius: zoneRadius })}
            </li>
          )}
        </ul>

        {/* Bottom description */}
        <p className="text-sm text-center text-gray-600 mt-4">
          {t("footer.description")}
        </p>
      </div>

      {/* Footer with button - always at bottom */}
      <div className="p-6 bg-orange-50">
        {isAuthenticated ? (
          <PurchasePlan
            plan={data}
            buttonClassName="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition duration-300"
          />
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};

export default BronzePack;
