"use client";

import React from "react";
import { SubscriptionPlan } from "@prisma/client";

interface SilverPackProps {
  data: SubscriptionPlan;
  onSubscribe?: () => void; // Ajout d'une action personnalisée au clic
}

const SilverPack: React.FC<SilverPackProps> = ({
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
    <div className="bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 text-black mx-auto p-6 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
      {/* Titre */}
      <div>
        <h1 className="text-3xl sm:text-4xl text-center text-gray-500 font-extrabold bg-clip-text">
          PACK PRESTIGE
          <br />
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
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-600 transition duration-300"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default SilverPack;
