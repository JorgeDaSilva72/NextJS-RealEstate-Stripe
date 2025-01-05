import React from "react";

interface SectionHeaderProps {
  id: string;
  title: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  id,
  title,
  className = "text-3xl font-bold mb-8 text-center",
}) => (
  <h2 id={id} className={className}>
    {title}
  </h2>
);

export default SectionHeader;
