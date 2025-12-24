"use client";

import { useState, useEffect } from "react";

const FAVORITES_STORAGE_KEY = "property_favorites";

export interface FavoriteProperty {
  id: number;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  city?: string;
  country?: string;
  status?: string;
  type?: string;
  area?: number;
  addedAt: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    }
  }, [favorites, isLoading]);

  const addFavorite = (property: FavoriteProperty) => {
    setFavorites((prev) => {
      // Check if already favorited
      if (prev.some((fav) => fav.id === property.id)) {
        return prev;
      }
      return [...prev, { ...property, addedAt: new Date().toISOString() }];
    });
  };

  const removeFavorite = (propertyId: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== propertyId));
  };

  const isFavorite = (propertyId: number): boolean => {
    return favorites.some((fav) => fav.id === propertyId);
  };

  const toggleFavorite = (property: FavoriteProperty) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    count: favorites.length,
  };
}





