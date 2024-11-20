"use client";
import React from "react";

interface SilverPackProps {
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

const SilverPack: React.FC<SilverPackProps> = ({
  namePlan = "argent",
  price = 250,
  duration = "AN",
  country = "",
  startDate = "",
  endDate = "",
  premiumAds = 10,
  photosPerAd = 8,
  shortVideosPerAd = 0,
  youtubeVideoDuration = "",
  zoneRadius = 0,
  onSubscribe = () => alert("Souscription au Pack Prestige ARGENT effectuée !"),
}) => {
  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-400 text-black mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl text-center  text-gray-500 font-extrabold bg-clip-text">
          PACK PRESTIGE{" "}
          <span
            className="uppercase bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(192,192,192,0.8)]"
            style={{
              textShadow:
                "0 0 5px rgba(192, 192, 192, 0.8), 0 0 10px rgba(192, 192, 192, 0.9)",
            }}
          >
            {namePlan}
          </span>
        </h1>

        {/* Price and Duration */}
        <h2 className="text-2xl font-bold text-center mt-4">
          <span className="text-6xl">{price} €</span> / {duration}
        </h2>

        {/* Features List */}
        <ul className="mt-6 space-y-4 text-lg">
          <li className="flex items-center">
            <span className="mr-2">💰</span> {premiumAds} annonces pour une
            visibilité accrue
          </li>
          <li className="flex items-center">
            <span className="mr-2">📸</span> {photosPerAd} photos
            professionnelles par annonce
          </li>
          <li className="flex items-center">
            <span className="mr-2">📂</span> Espace dédié pour gérer vos
            annonces
          </li>
        </ul>

        {/* Footer */}
        <p className="text-sm text-center text-black mt-6">
          Visibilité sur le marché immobilier grâce à une communication
          optimisée sur YouTube et les réseaux sociaux.
        </p>
      </div>

      {/* Subscribe Button */}
      <div className="mt-auto">
        <button
          aria-label="Souscrire au Pack Prestige ARGENT"
          onClick={onSubscribe}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-600 transition duration-300"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default SilverPack;
