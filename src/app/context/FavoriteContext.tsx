"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface FavoriteContextType {
  favorites: number[]; // Liste des IDs de propriétés en favoris
  toggleFavorite: (id: number) => void; // Ajouter ou retirer un favori
  clearFavorites: () => void; // Supprimer tous les favoris
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedFavorites = localStorage.getItem("favorites");
        return storedFavorites ? JSON.parse(storedFavorites) : [];
      } catch (error) {
        console.error("Erreur lors du chargement des favoris :", error);
        return [];
      }
    }
    return [];
  });

  // Initialize favorites from localStorage on the client side
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris :", error);
    }
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id];
      try {
        localStorage.setItem("favorites", JSON.stringify(updated));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des favoris :", error);
      }
      return updated;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem("favorites");
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris :", error);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, toggleFavorite, clearFavorites }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
};
