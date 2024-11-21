// "use client";
// import React from "react";

// interface DiamondPackProps {
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

// const DiamondPack: React.FC<DiamondPackProps> = ({
//   namePlan = "diamant",
//   price = 1500,
//   duration = "AN",
//   country = "Maroc",
//   startDate = "01/12/2024",
//   endDate = "31/01/2025",
//   premiumAds = 25,
//   photosPerAd = 15,
//   shortVideosPerAd = 1,
//   youtubeVideoDuration = "30-45 MIN",
//   zoneRadius = 30,
//   onSubscribe = () => alert("Souscription au Pack diamand effectuée !"),
// }) => {
//   return (
//     <div className="bg-black text-white mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full">
//       {/* Title */}
//       <h1 className="uppercase text-3xl sm:text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
//         PACK ELITE <span className="text-5xl">{namePlan} </span>
//       </h1>

//       {/* Price and Duration */}
//       <h2 className="text-lg sm:text-xl font-bold text-center mt-4">
//         <span className="text-6xl">{price} €</span> / {duration}
//       </h2>
//       <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
//         Offre spéciale {country} valable du {startDate} au {endDate}
//       </p>

//       {/* Features List */}
//       <ul className="mt-6 space-y-3 text-xs sm:text-sm">
//         <li>
//           💎 <strong>Visibilité maximale et notoriété renforcée</strong>
//         </li>
//         <li>
//           💎 <strong>{premiumAds} annonces premium</strong> : Mettez en avant
//           vos meilleurs biens.
//         </li>
//         <li>
//           💎 <strong>{photosPerAd} photos professionnelles par annonce</strong>{" "}
//           : Des visuels de qualité pour séduire les acquéreurs.
//         </li>
//         <li>
//           💎{" "}
//           <strong>
//             {shortVideosPerAd} vidéo courte et impactante (1mn) par annonce
//           </strong>{" "}
//           : Présentez vos biens sous tous les angles.
//         </li>
//         <li>
//           💎{" "}
//           <strong>
//             1 Vidéo de présentation YouTube ({youtubeVideoDuration})
//           </strong>{" "}
//           : Renforcez votre image de marque.
//         </li>
//         <li>
//           💎{" "}
//           <strong>
//             Zone de chalandise exclusive de {zoneRadius} km ou 100 000
//             habitants.
//           </strong>
//         </li>
//       </ul>

//       {/* Footer and Subscribe Button */}
//       <p className="text-[10px] sm:text-xs text-gray-400 mt-6 text-center">
//         Suivi personnalisé tout au long de la collaboration. Une visibilité
//         accrue sur le marché immobilier, des ventes plus rapides grâce à des
//         annonces de qualité, un retour sur investissement rapide.
//       </p>

//       <button
//         aria-label="Souscrire au Pack Diamant"
//         onClick={onSubscribe}
//         className="mt-6 w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-black font-bold py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-yellow-600 transition duration-300 text-sm sm:text-base"
//       >
//         Souscrire
//       </button>
//     </div>
//   );
// };

// export default DiamondPack;
"use client";

import React from "react";
import { SubscriptionPlan } from "@prisma/client";

interface DiamondPackProps {
  data: SubscriptionPlan;
  onSubscribe?: () => void; // Ajout d'une action personnalisée au clic
}

const DiamondPack: React.FC<DiamondPackProps> = ({
  data,
  onSubscribe = () =>
    alert(`Souscription au Pack ${data.namePlan} effectuée !`),
}) => {
  const {
    namePlan,
    price,
    country,
    startDate,
    endDate,
    duration,
    premiumAds,
    photosPerAd,
    shortVideosPerAd,
    youtubeVideoDuration,
    zoneRadius,
  } = data;

  return (
    <div className="bg-black text-white mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full">
      {/* Titre */}
      <div>
        <h1 className="uppercase text-3xl sm:text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
          PACK ELITE <br />
          <span className="text-5xl">{namePlan} </span>
        </h1>

        {/* Price and Duration */}
        <h2 className="text-lg sm:text-xl font-bold text-center mt-4">
          <span className="text-6xl">{price} €</span> / {duration}
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
          Offre spéciale {country} valable du{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(startDate))}{" "}
          au{" "}
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(endDate))}
        </p>

        {/* Liste des caractéristiques */}
        <ul className="mt-6 space-y-3 text-xs sm:text-sm">
          <li>
            💎 <strong>Visibilité maximale et notoriété renforcée</strong>
          </li>
          <li>
            💎 <strong>{premiumAds} annonces premium</strong> : Mettez en avant
            vos meilleurs biens.
          </li>
          <li>
            💎{" "}
            <strong>{photosPerAd} photos professionnelles par annonce</strong> :
            Des visuels de qualité pour séduire les acquéreurs.
          </li>

          {shortVideosPerAd > 0 && (
            <li>
              💎{" "}
              <strong>
                {shortVideosPerAd} vidéo courte et impactante (1mn) par annonce
              </strong>{" "}
              : Présentez vos biens sous tous les angles.
            </li>
          )}
          {youtubeVideoDuration && (
            <li>
              💎{" "}
              <strong>
                1 Vidéo de présentation YouTube de ({youtubeVideoDuration})
              </strong>{" "}
              : Renforcez votre image de marque.
            </li>
          )}
          {zoneRadius > 0 && (
            <li>
              💎{" "}
              <strong>
                Zone de chalandise exclusive de {zoneRadius} km ou 100 000
                habitants.
              </strong>
            </li>
          )}
        </ul>

        {/* Footer */}
        <p className="text-[10px] sm:text-xs text-gray-400 mt-6 text-center">
          Suivi personnalisé tout au long de la collaboration. Une visibilité
          accrue sur le marché immobilier, des ventes plus rapides grâce à des
          annonces de qualité, un retour sur investissement rapide.
        </p>
      </div>

      {/* Bouton de souscription */}
      <div className="mt-6">
        <button
          aria-label={`Souscrire au Pack ${namePlan}`}
          onClick={onSubscribe}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-black font-bold py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-yellow-600 transition duration-300 text-sm sm:text-base"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default DiamondPack;
