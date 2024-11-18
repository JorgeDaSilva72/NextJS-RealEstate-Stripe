"use client";
import React from "react";

const GoldPack: React.FC = () => {
  const handleSubscribe = () => {
    alert("Souscription au Pack Privilège OR effectuée !");
  };

  return (
    <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 text-black mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col justify-between h-full">
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl text-center font-extrabold text-white bg-clip-text">
          PACK PRIVILÈGE{" "}
          <span
            className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 text-transparent bg-clip-text font-extrabold text-5xl drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]"
            style={{
              textShadow:
                "0 0 5px rgba(255, 215, 0, 0.8), 0 0 10px rgba(255, 215, 0, 0.9)",
            }}
          >
            OR
          </span>
        </h1>

        {/* Price and Duration */}
        <h2 className="text-2xl font-bold text-center mt-4">400 EUROS/AN</h2>

        {/* Features List */}
        <ul className="mt-6 space-y-4 text-lg">
          <li className="flex items-center">
            <span className="mr-2">💰</span> 20 annonces pour un impact maximal
          </li>
          <li className="flex items-center">
            <span className="mr-2">📸</span> 10 photos professionnelles par
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
          aria-label="Souscrire au Pack Privilège OR"
          onClick={handleSubscribe}
          className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition duration-300"
        >
          Souscrire
        </button>
      </div>
    </div>
  );
};

export default GoldPack;
