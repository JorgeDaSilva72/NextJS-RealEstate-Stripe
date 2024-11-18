"use client";
import React from "react";

const BronzePack: React.FC = () => {
  const handleSubscribe = () => {
    alert("Souscription au Pack Confort BRONZE effectuée !");
  };

  return (
    <div className="bg-gradient-to-b from-orange-300 to-orange-500 text-black mx-auto p-6 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md  flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-center text-white uppercase">
          PACK CONFORT{" "}
          <span
            className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-orange-800"
            style={{
              textShadow:
                "0 0 5px rgba(255, 165, 0, 0.8), 0 0 10px rgba(255, 140, 0, 0.9)",
            }}
          >
            BRONZE
          </span>
        </h1>

        {/* Price */}
        <h2 className="text-2xl font-bold text-center mt-4">150 EUROS/AN</h2>

        {/* Features List */}
        <ul className="mt-6 space-y-4 text-lg">
          <li className="flex items-center">
            <span className="mr-2">💰</span> 5 annonces pour un démarrage en
            douceur
          </li>
          <li className="flex items-center">
            <span className="mr-2">📸</span> 8 photos professionnelles par
            annonce
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
      <div className="mt-6">
        <button
          aria-label="Souscrire au Pack Confort Bronze"
          onClick={handleSubscribe}
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-orange-500 hover:to-orange-600 transition duration-300"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default BronzePack;
