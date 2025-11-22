// import React, { useRef, useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Diamond,
//   Armchair,
//   MapPin,
// } from "lucide-react";

// interface FeaturedProperty {
//   id: number;
//   title: string;
//   subtitle: string;
//   agency: string;
//   image: string;
//   category: "GHANA" | "archi" | "location";
//   categoryLabel: string;
//   categoryIcon: React.ReactNode;
// }

// const FeaturedPropertiesSlider: React.FC = () => {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   const properties: FeaturedProperty[] = [
//     {
//       id: 1,
//       title: "GHANA",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE PEKIN GROUP ",
//       image:
//         "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
//       category: "GHANA",
//       categoryLabel:
//         "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
//       categoryIcon: <Diamond className="w-8 h-8" />,
//     },
//     {
//       id: 2,
//       title: "TOGO",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE PEKIN GROUP",
//       image:
//         "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
//       category: "archi",
//       categoryLabel:
//         "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
//       categoryIcon: <Armchair className="w-8 h-8" />,
//     },
//     {
//       id: 3,
//       title: "BENIN",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE PEKIN GROUP ",
//       image:
//         "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
//       category: "location",
//       categoryLabel:
//         "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
//       categoryIcon: <MapPin className="w-8 h-8" />,
//     },
//     {
//       id: 4,
//       title: "PRESTIGE",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE VERSAILLES",
//       image:
//         "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
//       category: "GHANA",
//       categoryLabel: "Villa contemporaine avec piscine",
//       categoryIcon: <Diamond className="w-8 h-8" />,
//     },
//   ];

//   const scroll = (direction: "left" | "right"): void => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const cardWidth = 450; // Largeur approximative d'une carte
//       const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

//       container.scrollBy({
//         left: scrollAmount,
//         behavior: "smooth",
//       });

//       // Mettre à jour l'index
//       const newIndex =
//         direction === "left"
//           ? Math.max(0, currentIndex - 1)
//           : Math.min(properties.length - 1, currentIndex + 1);
//       setCurrentIndex(newIndex);
//     }
//   };

//   const getCategoryColors = (category: string) => {
//     switch (category) {
//       case "prestige":
//         return "bg-white/95 text-gray-900";
//       case "archi":
//         return "bg-gray-900/95 text-white";
//       case "location":
//         return "bg-red-600/95 text-white";
//       default:
//         return "bg-white/95 text-gray-900";
//     }
//   };

//   return (
//     <section className="relative w-full bg-gray-50 py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-10">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
//             BIENS À LA UNE
//           </h2>

//           {/* Navigation */}
//           <div className="flex items-center gap-4">
//             <span className="text-gray-600 font-medium">
//               {currentIndex + 1} | {properties.length}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => scroll("left")}
//                 disabled={currentIndex === 0}
//                 className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-orange-500"
//                 aria-label="Précédent"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => scroll("right")}
//                 disabled={currentIndex === properties.length - 1}
//                 className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-orange-500"
//                 aria-label="Suivant"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Slider */}
//         <div className="relative">
//           <div
//             ref={scrollContainerRef}
//             className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {properties.map((property) => (
//               <div
//                 key={property.id}
//                 className="flex-shrink-0 w-[420px] group cursor-pointer"
//               >
//                 <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
//                   {/* Image de fond */}
//                   <div className="absolute inset-0">
//                     <img
//                       src={property.image}
//                       alt={property.title}
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
//                   </div>

//                   {/* Badge agence en haut */}
//                   <div className="absolute top-6 left-0 right-0 text-center">
//                     <span className="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 text-xs font-bold text-gray-900 tracking-wider">
//                       {property.agency}
//                     </span>
//                     <p className="mt-2 text-white text-sm px-4">
//                       {property.categoryLabel}
//                     </p>
//                   </div>

//                   {/* Contenu principal au centre */}
//                   <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     <div
//                       className={`${getCategoryColors(
//                         property.category
//                       )} backdrop-blur-sm px-8 py-6 text-center transition-all duration-300 group-hover:scale-105`}
//                     >
//                       {/* Icône */}
//                       <div className="flex justify-center mb-4">
//                         {property.categoryIcon}
//                       </div>

//                       {/* Titre */}
//                       <h3 className="text-3xl font-bold tracking-wider mb-2">
//                         {property.title}
//                       </h3>

//                       {/* Badge espaces atypiques pour location */}
//                       {property.category === "location" && (
//                         <div className="mb-2">
//                           <span className="inline-block bg-white text-red-600 px-3 py-1 text-xs font-bold">
//                             LES ESPACES ATYPIQUES
//                           </span>
//                         </div>
//                       )}

//                       {/* Sous-titre */}
//                       <p className="text-sm font-semibold tracking-wide">
//                         {property.subtitle}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Overlay hover */}
//                   <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default FeaturedPropertiesSlider;

// import React, { useRef, useState } from "react";
// import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// interface FeaturedProperty {
//   id: number;
//   title: string;
//   subtitle: string;
//   agency: string;
//   image: string;
//   category: "ghana" | "togo" | "benin" | "contact";
//   categoryLabel: string;
//   countryCode?: string;
// }

// const FeaturedPropertiesSlider: React.FC = () => {
//   const scrollContainerRef = useRef<HTMLDivElement>(null);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);

//   const properties: FeaturedProperty[] = [
//     {
//       id: 1,
//       title: "GHANA",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE PEKIN GROUP",
//       image:
//         "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
//       category: "ghana",
//       categoryLabel:
//         "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
//       countryCode: "GH",
//     },
//     {
//       id: 2,
//       title: "TOGO",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE PEKIN GROUP",
//       image:
//         "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
//       category: "togo",
//       categoryLabel:
//         "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
//       countryCode: "TG",
//     },
//     {
//       id: 3,
//       title: "BENIN",
//       subtitle: "VOIR LA SÉLECTION",
//       agency: "AGENCE PEKIN GROUP",
//       image:
//         "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
//       category: "benin",
//       categoryLabel:
//         "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
//       countryCode: "BJ",
//     },
//     {
//       id: 4,
//       title: "NOUS CONTACTER",
//       subtitle: "CONTACTEZ-NOUS",
//       agency: "AFRIQUE AVENIR IMMOBILIER",
//       image:
//         "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=600&fit=crop",
//       category: "contact",
//       categoryLabel:
//         "Vous voulez mettre votre bien à la une ? Notre équipe est à votre écoute.",
//     },
//   ];

//   const scroll = (direction: "left" | "right"): void => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const cardWidth = 450; // Largeur approximative d'une carte
//       const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

//       container.scrollBy({
//         left: scrollAmount,
//         behavior: "smooth",
//       });

//       // Mettre à jour l'index
//       const newIndex =
//         direction === "left"
//           ? Math.max(0, currentIndex - 1)
//           : Math.min(properties.length - 1, currentIndex + 1);
//       setCurrentIndex(newIndex);
//     }
//   };

//   const getCategoryColors = (category: string) => {
//     switch (category) {
//       case "ghana":
//         return "bg-white/95 text-gray-900";
//       case "togo":
//         return "bg-green-600/95 text-white";
//       case "benin":
//         return "bg-yellow-500/95 text-gray-900";
//       case "contact":
//         return "bg-blue-600/95 text-white";
//       default:
//         return "bg-white/95 text-gray-900";
//     }
//   };

//   const renderFlag = (countryCode: string | undefined) => {
//     if (!countryCode) return null;

//     // Utilisation de l'API des emojis de drapeaux
//     const codePoints = countryCode
//       .toUpperCase()
//       .split("")
//       .map((char) => 127397 + char.charCodeAt(0));

//     return (
//       <div className="text-6xl mb-4">{String.fromCodePoint(...codePoints)}</div>
//     );
//   };

//   return (
//     <section className="relative w-full bg-gray-50 py-16 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-10">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
//             BIENS À LA UNE
//           </h2>

//           {/* Navigation */}
//           <div className="flex items-center gap-4">
//             <span className="text-gray-600 font-medium">
//               {currentIndex + 1} | {properties.length}
//             </span>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => scroll("left")}
//                 disabled={currentIndex === 0}
//                 className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-orange-500"
//                 aria-label="Précédent"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={() => scroll("right")}
//                 disabled={currentIndex === properties.length - 1}
//                 className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-orange-500"
//                 aria-label="Suivant"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Slider */}
//         <div className="relative">
//           <div
//             ref={scrollContainerRef}
//             className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
//             style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//           >
//             {properties.map((property) => (
//               <div
//                 key={property.id}
//                 className="flex-shrink-0 w-[420px] group cursor-pointer"
//               >
//                 <div className="relative h-[500px] rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
//                   {/* Image de fond */}
//                   <div className="absolute inset-0">
//                     <img
//                       src={property.image}
//                       alt={property.title}
//                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
//                   </div>

//                   {/* Badge agence en haut */}
//                   <div className="absolute top-6 left-0 right-0 text-center">
//                     <span className="inline-block bg-white/90 backdrop-blur-sm px-6 py-2 text-xs font-bold text-gray-900 tracking-wider">
//                       {property.agency}
//                     </span>
//                     <p className="mt-2 text-white text-sm px-4">
//                       {property.categoryLabel}
//                     </p>
//                   </div>

//                   {/* Contenu principal au centre */}
//                   <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     <div
//                       className={`${getCategoryColors(
//                         property.category
//                       )} backdrop-blur-sm px-8 py-6 text-center transition-all duration-300 group-hover:scale-105`}
//                     >
//                       {/* Drapeau ou icône contact */}
//                       {property.category === "contact" ? (
//                         <div className="flex justify-center mb-4">
//                           <MapPin className="w-12 h-12" />
//                         </div>
//                       ) : (
//                         renderFlag(property.countryCode)
//                       )}

//                       {/* Titre */}
//                       <h3 className="text-3xl font-bold tracking-wider mb-2">
//                         {property.title}
//                       </h3>

//                       {/* Sous-titre */}
//                       <p className="text-sm font-semibold tracking-wide">
//                         {property.subtitle}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Overlay hover */}
//                   <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </section>
//   );
// };

// export default FeaturedPropertiesSlider;

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";

interface FeaturedProperty {
  id: number;
  title: string;
  subtitle: string;
  agency: string;
  image: string;
  category: "ghana" | "togo" | "benin" | "contact";
  categoryLabel: string;
  countryCode?: string;
}

const FeaturedPropertiesSlider: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const properties: FeaturedProperty[] = [
    {
      id: 1,
      title: "GHANA",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE PEKIN GROUP",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop",
      category: "ghana",
      categoryLabel:
        "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
      countryCode: "GH",
    },
    {
      id: 2,
      title: "TOGO",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE PEKIN GROUP",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      category: "togo",
      categoryLabel:
        "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
      countryCode: "TG",
    },
    {
      id: 3,
      title: "BENIN",
      subtitle: "VOIR LA SÉLECTION",
      agency: "AGENCE PEKIN GROUP",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      category: "benin",
      categoryLabel:
        "Votre partenaire en immobilier de luxe en Afrique de l'Ouest",
      countryCode: "BJ",
    },
    {
      id: 4,
      title: "NOUS CONTACTER",
      subtitle: "CONTACTEZ-NOUS",
      agency: "AFRIQUE AVENIR IMMOBILIER",
      image:
        "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&h=600&fit=crop",
      category: "contact",
      categoryLabel:
        "Vous voulez mettre votre bien à la une ? Notre équipe est à votre écoute.",
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
      case "ghana":
        return "bg-white/20 text-white border-2 border-white/40";
      case "togo":
        return "bg-green-600/20 text-white border-2 border-green-400/40";
      case "benin":
        return "bg-yellow-500/20 text-white border-2 border-yellow-400/40";
      case "contact":
        return "bg-blue-600/20 text-white border-2 border-blue-400/40";
      default:
        return "bg-white/20 text-white border-2 border-white/40";
    }
  };

  const getFlagEmoji = (countryCode: string | undefined): string => {
    if (!countryCode) return "";

    const flags: { [key: string]: string } = {
      GH: "🇬🇭",
      TG: "🇹🇬",
      BJ: "🇧🇯",
    };

    return flags[countryCode] || "";
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
                    <Image
                      src={property.image}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
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
                      )} backdrop-blur-md px-6 py-4 text-center transition-all duration-300 group-hover:scale-105 rounded-lg`}
                    >
                      {/* Drapeau ou icône contact */}
                      {property.category === "contact" ? (
                        <div className="flex justify-center mb-3">
                          <MapPin className="w-10 h-10" />
                        </div>
                      ) : (
                        <div className="text-5xl mb-3">
                          {/* {getFlagEmoji(property.countryCode)} */}
                        </div>
                      )}

                      {/* Titre */}
                      <h3 className="text-2xl font-bold tracking-wider mb-2">
                        {property.title}
                      </h3>

                      {/* Sous-titre */}
                      <p className="text-xs font-semibold tracking-wide uppercase">
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
