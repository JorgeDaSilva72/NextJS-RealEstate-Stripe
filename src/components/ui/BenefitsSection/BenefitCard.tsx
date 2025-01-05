import React from "react";

export interface BenefitProps {
  title: string;
  description: string;
  className?: string;
}

export const BenefitCard: React.FC<BenefitProps> = ({
  title,
  description,
  className = "",
}) => (
  <div
    className={`p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
  >
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
