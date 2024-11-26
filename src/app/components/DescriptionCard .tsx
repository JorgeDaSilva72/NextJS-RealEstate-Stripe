"use client";
import { useState } from "react";

interface DescriptionCardProps {
  description: string;
}

const DescriptionCard = ({ description }: DescriptionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // État pour afficher ou tronquer le texte
  const MAX_LENGTH = 400; // Nombre maximum de caractères avant de tronquer

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const truncatedText =
    description.length > MAX_LENGTH && !isExpanded
      ? `${description.slice(0, MAX_LENGTH)}...`
      : description;

  return (
    <div className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <p className="text-gray-700">{truncatedText}</p>
      {description.length > MAX_LENGTH && (
        <button
          onClick={handleToggle}
          className="mt-2 text-blue-500 hover:underline"
        >
          {isExpanded ? "Afficher moins" : "Afficher plus"}
        </button>
      )}
    </div>
  );
};

export default DescriptionCard;
