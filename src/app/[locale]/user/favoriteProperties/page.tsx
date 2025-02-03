"use client";
import React, { useEffect, useState } from "react";
// import PropertyContainer from "@/app/components/PropertyContainer";
// import PropertyCard from "@/app/components/PropertyCard";
import NoPropertiesFound from "@/app/[locale]/result/_components/noPropertiesFound";
import { useFavorites } from "@/app/[locale]/context/FavoriteContext";
import PageTitle from "../../components/pageTitle";
import PropertyContainer from "../../components/PropertyContainer";
import PropertyCard from "../../components/PropertyCard";
// import PageTitle from "@/app/components/pageTitle";

export default function FavoriteProperties() {
  const { favorites, clearFavorites } = useFavorites(); // Récupère les IDs favoris
  const [properties, setProperties] = useState([]);
  console.log("Favorites :", favorites); // Vérifiez que cette valeur est correcte
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true); // Commence le chargement
      try {
        const response = await fetch("/api/favorite-properties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: favorites }),
        });
        if (!response.ok) {
          console.error("Erreur lors de l'appel API :", response.statusText);
        }

        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des propriétés favorites :",
          error
        );
      } finally {
        setIsLoading(false); // Termine le chargement
      }
    };

    if (favorites.length > 0) {
      fetchFavorites();
    }
  }, [favorites]);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <PageTitle
        title="Mes propriétés favorites"
        linkCaption="Retour à l'accueil"
        href="/result"
      />

      {isLoading ? (
        <div className="text-center py-10">Chargement des annonces...</div>
      ) : favorites.length && properties.length > 0 ? (
        <PropertyContainer totalPages={1} currentPage={1}>
          {properties.map((property, index) => (
            <PropertyCard key={index} property={property} />
          ))}
        </PropertyContainer>
      ) : (
        <NoPropertiesFound
          title="Pas encore de biens en favoris ?"
          message="Ajouter des biens en cliquant sur leur coeur.
Vos annonces préférées seront disponibles ici à tout moment."
          buttonText="Lancer une recherche"
        />
      )}
    </div>
  );
}
