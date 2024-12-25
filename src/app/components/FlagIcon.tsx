import React from "react";
import Image from "next/image";

interface FlagIconProps {
  countryCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const FLAG_SIZES = {
  sm: { width: 24, height: 16 },
  md: { width: 32, height: 21 },
  lg: { width: 48, height: 32 },
};

const FlagIcon = ({ countryCode, size = "sm", className }: FlagIconProps) => {
  const { width, height } = FLAG_SIZES[size];

  return (
    <Image
      src={`/flags/${countryCode.toLowerCase()}.svg`} // j'ai renommé  les fichiers en minuscules
      alt={`Drapeau ${countryCode}`}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default FlagIcon;
