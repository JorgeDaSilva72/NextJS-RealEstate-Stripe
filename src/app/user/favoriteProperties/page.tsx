// "use client";
// import PropertyCard from "@/app/components/PropertyCard";
// import { useFavorites } from "@/app/context/FavoriteContext";

// interface Property {
//   id: number;
//   name: string;
//   price: number;
//   type?: {
//     value: string;
//   };
//   status?: {
//     value: string;
//   };
//   images: {
//     url: string;
//   }[];
//   location?: { city: string; state: string } | null;
//   feature?: {
//     area: number;
//     bedrooms: number;
//     bathrooms: number;
//     parkingSpots: number;
//   } | null;
// }

// const FavoriteProperties = ({ properties }: { properties: Property[] }) => {
//   const { favorites } = useFavorites();

//   // Filtrer les propriétés favorites
//   const favoriteProperties = (properties || []).filter((property) =>
//     favorites.includes(property.id)
//   );

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Mes Favoris</h1>

//       {favoriteProperties.length === 0 ? (
//         <div className="text-gray-500">
//           Vous n&apos;avez aucune propriété en favoris pour le moment.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {favoriteProperties.map((property) => (
//             <PropertyCard key={property.id} property={property} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FavoriteProperties;

// end -----------------------------------------
"use client";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
import PropertyContainer from "@/app/components/PropertyContainer";
import PropertyCard from "@/app/components/PropertyCard";
import NoPropertiesFound from "@/app/result/_components/noPropertiesFound";
import { useFavorites } from "@/app/context/FavoriteContext";
import PageTitle from "@/app/components/pageTitle";

export default function FavoriteProperties() {
  //   const { favorites } = useFavorites(); // Récupère les IDs favoris
  const { favorites, clearFavorites } = useFavorites();
  const [properties, setProperties] = useState([]);
  console.log("Favorites :", favorites); // Vérifiez que cette valeur est correcte

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/favorite-properties", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: favorites }),
        });
        console.log("Réponse brute :", response);
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

      {favorites.length && properties.length > 0 ? (
        <PropertyContainer totalPages={1} currentPage={1}>
          {properties.map((property, index) => (
            <PropertyCard key={index} property={property} />
          ))}
        </PropertyContainer>
      ) : (
        <NoPropertiesFound /> // Affiche un message si aucun favori
      )}
    </div>
  );
}
