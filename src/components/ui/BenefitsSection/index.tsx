import React from "react";
import { BenefitCard, BenefitProps } from "./BenefitCard";

interface BenefitsSectionProps {
  title: string;
  benefits: BenefitProps[];
  className?: string;
  gridClassName?: string;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  title,
  benefits,
  className = "",
  gridClassName = "grid md:grid-cols-3 gap-8",
}) => (
  <section
    className={`text-center ${className}`}
    aria-labelledby="benefits-title"
  >
    <h2 id="benefits-title" className="text-3xl font-bold mb-8">
      {title}
    </h2>
    <div className={gridClassName}>
      {benefits.map((benefit) => (
        <BenefitCard key={benefit.title} {...benefit} />
      ))}
    </div>
  </section>
);

export default BenefitsSection;
