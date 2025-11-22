import React, { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Diamond,
  Armchair,
  MapPin,
} from "lucide-react";

interface FeaturedProperty {
  id: number;
  title: string;
  subtitle: string;
  agency: string;
  image: string;
  category: "prestige" | "archi" | "location";
  categoryLabel: string;
  categoryIcon: React.ReactNode;
}

const FeaturedPropertiesSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const properties: FeaturedProperty[] = [
    {
      id: 1,
      title: "PRESTIGE",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE HAUTS-DE-SEINE",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      category: "prestige",
      categoryLabel: "L'élégance Blanche du Hameau de la Jonchère",
      categoryIcon: <Diamond className="w-8 h-8" />,
    },
    {
      id: 2,
      title: "ARCHI BIEN",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE ORLÉANS",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      category: "archi",
      categoryLabel: "Maison d'architecte Art déco",
      categoryIcon: <Armchair className="w-8 h-8" />,
    },
    {
      id: 3,
      title: "VIS MA VILLE",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE PARIS - OUEST",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      category: "location",
      categoryLabel: "Appartement d'architecte avec rooftop - Louvre-Rivoli",
      categoryIcon: <MapPin className="w-8 h-8" />,
    },
    {
      id: 4,
      title: "PRESTIGE",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE VERSAILLES",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      category: "prestige",
      categoryLabel: "Villa contemporaine avec piscine",
      categoryIcon: <Diamond className="w-8 h-8" />,
    },
    {
      id: 5,
      title: "ARCHI BIEN",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE LYON",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      category: "archi",
      categoryLabel: "Loft industriel rénové",
      categoryIcon: <Armchair className="w-8 h-8" />,
    },
  ];

  const scroll = (direction: "left" | "right"): void => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = 450; // Largeur approximative d'une carte
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });

      // Mettre à jour l'index
      const newIndex =
        direction === "left"
          ? Math.max(0, currentIndex - 1)
          : Math.min(properties.length - 1, currentIndex + 1);
      setCurrentIndex(newIndex);
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case "prestige":
        return "bg-white/95 text-gray-900";
      case "archi":
        return "bg-gray-900/95 text-white";
      case "location":
        return "bg-red-600/95 text-white";
      default:
        return "bg-white/95 text-gray-900";
    }
  };

  return (
    <section className="relative w-full bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            BIENS À LA UNE
          </h2>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              {currentIndex + 1} | {properties.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={currentIndex === 0}
                className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-orange-500"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={currentIndex === properties.length - 1}
                className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-orange-500"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {properties.map((property) => (
              <div
                key={property.id}
                className="flex-shrink-0 w-[420px] group cursor-pointer"
              >
                <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image de fond */}
                  <div className="absolute inset-0">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                  </div>

                  {/* Badge agence en haut */}
                  <div className="absolute top-6 left-0 right-0 text-center">
                    <span className="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 text-xs font-bold text-gray-900 tracking-wider">
                      {property.agency}
                    </span>
                    <p className="mt-2 text-white text-sm px-4">
                      {property.categoryLabel}
                    </p>
                  </div>

                  {/* Contenu principal au centre */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className={`${getCategoryColors(
                        property.category
                      )} backdrop-blur-sm px-8 py-6 text-center transition-all duration-300 group-hover:scale-105`}
                    >
                      {/* Icône */}
                      <div className="flex justify-center mb-4">
                        {property.categoryIcon}
                      </div>

                      {/* Titre */}
                      <h3 className="text-3xl font-bold tracking-wider mb-2">
                        {property.title}
                      </h3>

                      {/* Badge espaces atypiques pour location */}
                      {property.category === "location" && (
                        <div className="mb-2">
                          <span className="inline-block bg-white text-red-600 px-3 py-1 text-xs font-bold">
                            LES ESPACES ATYPIQUES
                          </span>
                        </div>
                      )}

                      {/* Sous-titre */}
                      <p className="text-sm font-semibold tracking-wide">
                        {property.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Overlay hover */}
                  <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedPropertiesSlider;
