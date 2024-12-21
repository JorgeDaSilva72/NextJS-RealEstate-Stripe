"use client";

import React from "react";
import { SubscriptionPlan } from "@prisma/client";
import PurchasePlan from "./PurchasePlan";

interface GratuitPackProps {
  data: SubscriptionPlan;
  // onSubscribe?: () => void; // Ajout d'une action personnalisée au clic
}

const GratuitPack: React.FC<GratuitPackProps> = ({
  data,
  // onSubscribe = () =>
  //   alert(`Souscription au Pack ${data.namePlan} effectuée !`),
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
    <div className="bg-gradient-to-b from-white-300 to-white-500 text-black mx-auto p-6 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
      {/* Titre */}
      <div>
        <h1 className="text-3xl sm:text-4xl text-center text-black-500 font-extrabold bg-clip-text">
          PACK DEBUTANT
          <br />
          <span
            className="uppercase text-black-500 bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(192,192,192,0.8)]"
            style={{
              textShadow:
                "0 0 5px rgba(255, 165, 0, 0.8), 0 0 10px rgba(255, 140, 0, 0.9)",
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
            {/* <span className="mr-2">💰</span> {premiumAds} annonces pour un
            démarrage en douceur */}
            <span className="mr-2">💰</span> Annonces illimitées
          </li>
          <li className="flex items-center">
            <span className="mr-2">📸</span> Limité à {photosPerAd} photos par
            annonce
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
        {/* <button
          aria-label={`Souscrire au Pack ${namePlan}`}
          onClick={onSubscribe}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-600 transition duration-300"
        >
          Souscrire
        </button> */}

        <PurchasePlan
          plan={data}
          buttonClassName="bg-gradient-to-r from-white-600 to-white-700  hover:from-white-500 hover:to-white-600 text-black"
        />
      </div>
    </div>
  );
};

export default GratuitPack;
