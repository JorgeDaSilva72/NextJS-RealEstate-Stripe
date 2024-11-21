// "use client";
// import React from "react";

// interface GoldPackProps {
//   namePlan?: string;
//   price?: number;
//   duration?: string;
//   country?: string;
//   startDate?: string;
//   endDate?: string;
//   premiumAds?: number;
//   photosPerAd?: number;
//   shortVideosPerAd?: number;
//   youtubeVideoDuration?: string;
//   zoneRadius?: number;
//   onSubscribe?: () => void;
// }

// const GoldPack: React.FC<GoldPackProps> = ({
//   namePlan = "or",
//   price = 400,
//   duration = "AN",
//   country = "",
//   startDate = "",
//   endDate = "",
//   premiumAds = 20,
//   photosPerAd = 10,
//   shortVideosPerAd = 0,
//   youtubeVideoDuration = "",
//   zoneRadius = 0,
//   onSubscribe = () => alert("Souscription au Pack Privilège OR effectuée !"),
// }) => {
//   return (
//     <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 text-black mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
//       {/* Title */}
//       <div>
//         <h1 className="text-3xl sm:text-4xl text-center text-yellow-500 font-extrabold bg-clip-text">
//           PACK PRIVILÈGE{" "}
//           <span
//             className="uppercase bg-gradient-to-r from-yellow-700 via-yellow-800 to-yellow-900 text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
//             style={{
//               textShadow:
//                 "0 0 5px rgba(255, 215, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.9)",
//             }}
//           >
//             {namePlan}
//           </span>
//         </h1>

//         {/* Price and Duration */}
//         <h2 className="text-2xl font-bold text-center mt-4">
//           <span className="text-6xl">{price} €</span> / {duration}
//         </h2>

//         {/* Features List */}
//         <ul className="mt-6 space-y-4 text-lg">
//           <li className="flex items-center">
//             <span className="mr-2">💰</span> {premiumAds} annonces pour un
//             impact maximal
//           </li>
//           <li className="flex items-center">
//             <span className="mr-2">📸</span> {photosPerAd} photos
//             professionnelles par annonce
//           </li>
//           <li className="flex items-center">
//             <span className="mr-2">📂</span> Espace dédié pour gérer vos
//             annonces
//           </li>
//         </ul>

//         {/* Footer */}
//         <p className="text-sm text-center text-black mt-6">
//           Visibilité sur le marché immobilier grâce à une communication
//           optimisée sur YouTube et les réseaux sociaux.
//         </p>
//       </div>

//       {/* Subscribe Button */}
//       <div className="mt-auto">
//         <button
//           aria-label="Souscrire au Pack Privilège OR"
//           onClick={onSubscribe}
//           className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
//         >
//           Souscrire
//         </button>
//       </div>
//     </div>
//   );
// };

// export default GoldPack;
"use client";

import React from "react";
import { SubscriptionPlan } from "@prisma/client";

interface GoldPackProps {
  data: SubscriptionPlan;
  onSubscribe?: () => void; // Ajout d'une action personnalisée au clic
}

const GoldPack: React.FC<GoldPackProps> = ({
  data,
  onSubscribe = () =>
    alert(`Souscription au Pack ${data.namePlan} effectuée !`),
}) => {
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

  return (
    <div className="bg-gradient-to-b from-yellow-300 to-yellow-400 text-black mx-auto p-6 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
      {/* Titre */}
      <div>
        <h1 className="text-3xl sm:text-4xl text-center text-yellow-500 font-extrabold bg-clip-text">
          PACK PRIVILÈGE
          <br />
          <span
            className="uppercase bg-gradient-to-r from-yellow-700 via-yellow-800 to-yellow-900 text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
            style={{
              textShadow:
                "0 0 5px rgba(255, 215, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.9)",
            }}
          >
            {namePlan}
          </span>
        </h1>

        {/* Prix */}
        <h2 className="text-2xl font-bold text-center mt-4">
          <span className="text-6xl">{price} €</span> / {duration}
        </h2>

        {/* Liste des caractéristiques */}
        <ul className="mt-6 space-y-4 text-lg">
          <li className="flex items-center">
            <span className="mr-2">💰</span> {premiumAds} annonces pour un
            démarrage en douceur
          </li>
          <li className="flex items-center">
            <span className="mr-2">📸</span> {photosPerAd} photos
            professionnelles par annonce
          </li>
          <li className="flex items-center">
            <span className="mr-2">📂</span> Espace dédié pour gérer vos
            annonces
          </li>
          {shortVideosPerAd > 0 && (
            <li className="flex items-center">
              <span className="mr-2">🎥</span> {shortVideosPerAd} vidéo courte
              (1mn) par annonce.
            </li>
          )}
          {youtubeVideoDuration && (
            <li className="flex items-center">
              <span className="mr-2">⏳</span> 1 Vidéo de présentation YouTube
              de {youtubeVideoDuration}
            </li>
          )}
          {zoneRadius > 0 && (
            <li className="flex items-center">
              <span className="mr-2">📍</span> Zone de chalandise exclusive de:{" "}
              {zoneRadius} km
            </li>
          )}
        </ul>

        {/* Footer */}
        <p className="text-sm text-center text-black mt-6">
          Visibilité sur le marché immobilier grâce à une communication
          optimisée sur YouTube et les réseaux sociaux.
        </p>
      </div>

      {/* Bouton de souscription */}
      <div className="mt-6">
        <button
          aria-label={`Souscrire au Pack ${namePlan}`}
          onClick={onSubscribe}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default GoldPack;
