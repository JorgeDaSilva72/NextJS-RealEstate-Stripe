"use client";

import FavoriteButton from "../../components/FavoriteButton";
import { FavoriteProperty } from "../../hooks/useFavorites";

interface FavoriteButtonWrapperProps {
  property: FavoriteProperty;
}

export default function FavoriteButtonWrapper({ property }: FavoriteButtonWrapperProps) {
  return (
    <FavoriteButton
      property={property}
      variant="button"
      showLabel={true}
      className="w-full"
    />
  );
}





