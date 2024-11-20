// import React from "react";

// export const DiamondPack = ({
//   price = 1500,
//   duration = "AN",
//   country = "Maroc",
//   startDate = "01/12/2024",
//   endDate = "31/01/2025",
//   premiumAds = 25,
//   photosPerAd = 15,
//   shortVideos = 25,
//   youtubeVideoDuration = "30-45 MIN",
//   zoneRadius = 30,
// }) => {
//   return (
//     <div
//       style={{
//         backgroundColor: "#f7f7f7",
//         color: "#000",
//         fontFamily: "Arial, sans-serif",
//         maxWidth: "400px",
//         padding: "20px",
//         borderRadius: "10px",
//         boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//         textAlign: "center",
//       }}
//     >
//       <h1
//         style={{
//           fontSize: "28px",
//           fontWeight: "bold",
//           background: "linear-gradient(to right, #b9f2ff, #d4af37)",
//           WebkitBackgroundClip: "text",
//           WebkitTextFillColor: "transparent",
//         }}
//       >
//         PACK DIAMANT
//       </h1>
//       <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0" }}>
//         {price} EURO / {duration}
//       </h2>
//       <p style={{ fontSize: "12px", marginBottom: "20px" }}>
//         Offre spéciale {country} valable du {startDate} au {endDate}
//       </p>
//       <ul
//         style={{
//           listStyle: "none",
//           padding: 0,
//           textAlign: "left",
//           margin: "0 auto",
//           maxWidth: "320px",
//         }}
//       >
//         <li style={{ marginBottom: "10px" }}>
//           💎 <strong>Visibilité maximale et notoriété renforcée</strong>
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           💎 <strong>{premiumAds} annonces premium</strong> : Mettez en avant
//           vos meilleurs biens.
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           💎 <strong>{photosPerAd} photos professionnelles par annonce</strong>{" "}
//           : Des visuels de qualité pour séduire les acquéreurs.
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           💎 <strong>{shortVideos} vidéos courtes et impactantes (1mn)</strong>{" "}
//           : Présentez vos biens sous tous les angles.
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           💎{" "}
//           <strong>
//             Vidéo de présentation YouTube ({youtubeVideoDuration})
//           </strong>{" "}
//           : Renforcez votre image de marque.
//         </li>
//         <li style={{ marginBottom: "10px" }}>
//           💎 <strong>Zone de chalandise exclusive de {zoneRadius} km</strong>
//         </li>
//       </ul>
//       <p style={{ fontSize: "12px", marginTop: "20px", color: "#555" }}>
//         Suivi personnalisé tout au long de la collaboration. Une visibilité
//         accrue sur le marché immobilier, des ventes plus rapides grâce à des
//         annonces de qualité, un retour sur investissement rapide.
//       </p>
//     </div>
//   );
// };

// export default DiamondPack;

// import React from "react";

// interface DiamondPackProps {
//   price?: number;
//   duration?: string;
//   country?: string;
//   startDate?: string;
//   endDate?: string;
//   premiumAds?: number;
//   photosPerAd?: number;
//   shortVideos?: number;
//   youtubeVideoDuration?: string;
//   zoneRadius?: number;
// }

// const DiamondPack: React.FC<DiamondPackProps> = ({
//   price = 1500,
//   duration = "AN",
//   country = "Maroc",
//   startDate = "01/12/2024",
//   endDate = "31/01/2025",
//   premiumAds = 25,
//   photosPerAd = 15,
//   shortVideos = 25,
//   youtubeVideoDuration = "30-45 MIN",
//   zoneRadius = 30,
// }) => {
//   return (
//     <div className="flex flex-col justify-center items-center bg-black min-h-screen">
//       <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
//         PACK DIAMANT
//       </h1>

//       <h2 className="text-xl font-extrabold mt-4 mb-2">
//         {price} EURO / {duration}
//       </h2>
//       <p className="text-sm text-gray-700 mb-4">
//         Offre spéciale {country} valable du {startDate} au {endDate}
//       </p>
//       <ul className="text-left text-gray-800 text-sm space-y-3">
//         <li>
//           💎 <strong>Visibilité maximale et notoriété renforcée</strong>
//         </li>
//         <li>
//           💎 <strong>{premiumAds} annonces premium</strong> : Mettez en avant
//           vos meilleurs biens sur les portails immobiliers.
//         </li>
//         <li>
//           💎 <strong>{photosPerAd} photos professionnelles par annonce</strong>{" "}
//           : Des visuels de qualité pour séduire les acquéreurs.
//         </li>
//         <li>
//           💎 <strong>{shortVideos} vidéos courtes et impactantes (1mn)</strong>{" "}
//           : Présentez vos biens sous tous les angles.
//         </li>
//         <li>
//           💎{" "}
//           <strong>
//             Vidéo de présentation YouTube ({youtubeVideoDuration})
//           </strong>{" "}
//           : Renforcez votre image de marque.
//         </li>
//         <li>
//           💎 <strong>Zone de chalandise exclusive de {zoneRadius} km</strong>
//         </li>
//       </ul>
//       <p className="text-xs text-gray-600 mt-6">
//         Suivi personnalisé tout au long de la collaboration. Une visibilité
//         accrue sur le marché immobilier, des ventes plus rapides grâce à des
//         annonces de qualité, un retour sur investissement rapide.
//       </p>
//     </div>
//   );
// };

// export default DiamondPack;
//

"use client";
import React from "react";

interface DiamondPackProps {
  namePlan?: string;
  price?: number;
  duration?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  premiumAds?: number;
  photosPerAd?: number;
  shortVideosPerAd?: number;
  youtubeVideoDuration?: string;
  zoneRadius?: number;
  onSubscribe?: () => void;
}

const DiamondPack: React.FC<DiamondPackProps> = ({
  namePlan = "diamant",
  price = 1500,
  duration = "AN",
  country = "Maroc",
  startDate = "01/12/2024",
  endDate = "31/01/2025",
  premiumAds = 25,
  photosPerAd = 15,
  shortVideosPerAd = 1,
  youtubeVideoDuration = "30-45 MIN",
  zoneRadius = 30,
  onSubscribe = () => alert("Souscription au Pack diamand effectuée !"),
}) => {
  return (
    <div className="bg-black text-white mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full">
      {/* Title */}
      <h1 className="uppercase text-3xl sm:text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
        PACK ELITE <span className="text-5xl">{namePlan} </span>
      </h1>

      {/* Price and Duration */}
      <h2 className="text-lg sm:text-xl font-bold text-center mt-4">
        <span className="text-6xl">{price} €</span> / {duration}
      </h2>
      <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
        Offre spéciale {country} valable du {startDate} au {endDate}
      </p>

      {/* Features List */}
      <ul className="mt-6 space-y-3 text-xs sm:text-sm">
        <li>
          💎 <strong>Visibilité maximale et notoriété renforcée</strong>
        </li>
        <li>
          💎 <strong>{premiumAds} annonces premium</strong> : Mettez en avant
          vos meilleurs biens.
        </li>
        <li>
          💎 <strong>{photosPerAd} photos professionnelles par annonce</strong>{" "}
          : Des visuels de qualité pour séduire les acquéreurs.
        </li>
        <li>
          💎{" "}
          <strong>
            {shortVideosPerAd} vidéo courte et impactante (1mn) par annonce
          </strong>{" "}
          : Présentez vos biens sous tous les angles.
        </li>
        <li>
          💎{" "}
          <strong>
            1 Vidéo de présentation YouTube ({youtubeVideoDuration})
          </strong>{" "}
          : Renforcez votre image de marque.
        </li>
        <li>
          💎{" "}
          <strong>
            Zone de chalandise exclusive de {zoneRadius} km ou 100 000
            habitants.
          </strong>
        </li>
      </ul>

      {/* Footer and Subscribe Button */}
      <p className="text-[10px] sm:text-xs text-gray-400 mt-6 text-center">
        Suivi personnalisé tout au long de la collaboration. Une visibilité
        accrue sur le marché immobilier, des ventes plus rapides grâce à des
        annonces de qualité, un retour sur investissement rapide.
      </p>

      <button
        aria-label="Souscrire au Pack Diamant"
        onClick={onSubscribe}
        className="mt-6 w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-black font-bold py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-yellow-600 transition duration-300 text-sm sm:text-base"
      >
        Souscrire
      </button>
    </div>
  );
};

export default DiamondPack;
