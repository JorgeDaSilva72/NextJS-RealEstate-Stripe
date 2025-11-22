import React, { useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Warehouse,
  Hotel,
  Store,
  TreePine,
  LucideIcon,
} from "lucide-react";

interface Category {
  id: number;
  icon: LucideIcon;
  title: string;
  count: string;
  image: string;
}

const PropertyCategoriesSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    {
      id: 1,
      icon: Home,
      title: "Maisons",
      count: "245 biens",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      icon: Building2,
      title: "Appartements",
      count: "432 biens",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      icon: Warehouse,
      title: "Locaux Commerciaux",
      count: "87 biens",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      icon: Hotel,
      title: "Villas",
      count: "156 biens",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      icon: Store,
      title: "Bureaux",
      count: "198 biens",
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      icon: TreePine,
      title: "Terrains",
      count: "321 biens",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    },
  ];

  const scroll = (direction: "left" | "right"): void => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explorez par Catégorie
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Trouvez le bien immobilier qui correspond parfaitement à vos besoins
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative group">
          {/* Bouton gauche */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          {/* Bouton droit */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
            aria-label="Suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="flex-shrink-0 w-72 group/card cursor-pointer"
                >
                  <div className="relative h-64 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover/card:scale-[1.02]">
                    {/* Image de fond */}
                    <div className="absolute inset-0">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* Contenu */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Icône en haut */}
                      <div className="flex justify-end">
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                          <Icon className="w-6 h-6 text-gray-800" />
                        </div>
                      </div>

                      {/* Texte en bas */}
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2 group-hover/card:translate-x-2 transition-transform duration-300">
                          {category.title}
                        </h3>
                        <p className="text-white/90 text-sm font-medium">
                          {category.count}
                        </p>
                      </div>
                    </div>

                    {/* Effet de survol */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover/card:border-white/30 rounded-2xl transition-colors duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicateur de scroll (optionnel) */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(Math.ceil(categories.length / 3))].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"
            />
          ))}
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

export default PropertyCategoriesSlider;
