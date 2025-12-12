// src/components/UnderConstruction.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface UnderConstructionProps {
  className?: string;
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({
  className = "",
}) => {
  // Charge les traductions depuis la namespace "UnderConstruction"
  const t = useTranslations("UnderConstruction");

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 bg-gray-50 border border-yellow-300 rounded-lg shadow-md text-center max-w-lg mx-auto ${className}`}
    >
      <div className="text-4xl mb-4" role="img" aria-label="Construction sign">
        🏗️
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        {/* Utilise la clé 'title' du fichier de traduction */}
        {t("title")}
      </h2>
      <p className="text-gray-600">
        {/* Utilise la clé 'message' du fichier de traduction */}
        {t("message")}
      </p>
      <div className="mt-4 text-sm text-gray-500"></div>
    </div>
  );
};

export default UnderConstruction;
