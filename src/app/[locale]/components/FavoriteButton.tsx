"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useFavorites, FavoriteProperty } from "../hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  property: FavoriteProperty;
  variant?: "icon" | "button";
  className?: string;
  showLabel?: boolean;
}

export default function FavoriteButton({
  property,
  variant = "icon",
  className,
  showLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property);
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          favorited
            ? "bg-red-50 text-red-600 hover:bg-red-100"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          className
        )}
      >
        <Heart className={cn("h-5 w-5", favorited && "fill-red-600")} />
        {showLabel && (
          <span>{favorited ? "Retirer des favoris" : "Ajouter aux favoris ❤️"}</span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "p-2 rounded-full transition-colors",
        favorited
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white",
        className
      )}
      aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart className={cn("h-5 w-5", favorited && "fill-red-600")} />
    </button>
  );
}





