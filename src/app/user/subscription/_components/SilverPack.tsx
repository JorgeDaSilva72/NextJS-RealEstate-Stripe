"use client";
import React from "react";

const SilverPack: React.FC = () => {
  const handleSubscribe = () => {
    alert("Souscription au Pack Prestige ARGENT effectuée !");
  };

  return (
    <div className="bg-gradient-to-b from-blue-200 to-blue-400 text-black mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl text-center font-extrabold text-white bg-clip-text">
          PACK PRESTIGE{" "}
          <span
            className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(192,192,192,0.8)]"
            style={{
              textShadow:
                "0 0 5px rgba(192, 192, 192, 0.8), 0 0 10px rgba(192, 192, 192, 0.9)",
            }}
          >
            ARGENT
          </span>
        </h1>

        {/* Price and Duration */}
        <h2 className="text-2xl font-bold text-center mt-4">250 EUROS/AN</h2>

        {/* Features List */}
        <ul className="mt-6 space-y-4 text-lg">
          <li className="flex items-center">
            <span className="mr-2">💰</span> 10 annonces pour une visibilité
            accrue
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
      <div className="mt-auto">
        <button
          aria-label="Souscrire au Pack Prestige ARGENT"
          onClick={handleSubscribe}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-gray-500 hover:to-gray-600 transition duration-300"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default SilverPack;
