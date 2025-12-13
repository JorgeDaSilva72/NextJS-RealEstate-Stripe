// "use client";
// import React from "react";

// import {
//   Heart,
//   Square,
//   ChevronLeft,
//   ChevronRight,
//   Bed,
//   ImageOff,
//   Bath,
//   ParkingCircle,
// } from "lucide-react";

// import Link from "next/link";
// // import { Prisma } from "@prisma/client";
// import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
// import { formatPrice } from "@/lib/formatPrice";
// import { useFavorites } from "../context/FavoriteContext";

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

// interface Props {
//   property: Property;
//   onFavorite?: (id: number) => void;
//   isFavorite?: boolean;
// }

// const PropertyCard = ({ property, onFavorite, isFavorite = false }: Props) => {
//   const [isImageLoading, setIsImageLoading] = React.useState(true);
//   const [isHovered, setIsHovered] = React.useState(false);
//   const [imageError, setImageError] = React.useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
//   const { favorites, toggleFavorite } = useFavorites();
//   const isPropertyFavorite = favorites.includes(property.id);
//   if (!property) {
//     return null;
//   }

//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     setIsImageLoading(false);
//   };

//   const nextImage = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (property.images.length > 1) {
//       setCurrentImageIndex((prev) =>
//         prev === property.images.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const prevImage = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (property.images.length > 1) {
//       setCurrentImageIndex((prev) =>
//         prev === 0 ? property.images.length - 1 : prev - 1
//       );
//     }
//   };

//   const formatArea = (area: number) => {
//     return `${area.toLocaleString("fr-FR")} m²`;
//   };

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "vente":
//         return "bg-blue-100 text-blue-800";
//       case "location":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const features = [
//     { icon: <Bed className="w-4 h-4" />, value: property.feature?.bedrooms },
//     { icon: <Bath className="w-4 h-4" />, value: property.feature?.bathrooms },
//     {
//       icon: <ParkingCircle className="w-4 h-4" />,
//       value: property.feature?.parkingSpots,
//     },
//     {
//       icon: <Square className="w-4 h-4" />,
//       value: property.feature?.area && formatArea(property.feature.area),
//     },
//   ];

//   return (
//     <Card
//       className="w-72 h-96 relative group transition-all duration-300 hover:shadow-xl rounded-lg bg-white "
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <CardBody className="h-[calc(100%-4rem)] overflow-y-auto p-0">
//         {/* Image Container with Slider */}
//         <div className="relative w-full h-48 overflow-hidden bg-gray-100">
//           {isImageLoading && (
//             <div className="absolute inset-0 bg-gray-200 animate-pulse" />
//           )}

//           {imageError ? (
//             <div className="w-full h-full flex items-center justify-center bg-gray-100">
//               <div className="flex flex-col items-center gap-2 text-gray-400">
//                 <ImageOff size={32} />
//                 <span className="text-sm">Image non disponible</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <Image
//                 src={
//                   property.images[currentImageIndex]?.url ??
//                   "/imageNotFound.jpg"
//                 }
//                 className={`w-full h-full object-cover transition-transform duration-300 ${
//                   isHovered ? "scale-110" : "scale-100"
//                 }`}
//                 alt={`${property.name} - Image ${currentImageIndex + 1}`}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//               />

//               {/* Navigation arrows */}
//               {property.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="z-10 absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors  opacity-0 group-hover:opacity-100"
//                   >
//                     <ChevronLeft className=" w-5 h-5 text-gray-800" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="z-10 absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors  opacity-0 group-hover:opacity-100"
//                   >
//                     <ChevronRight className="w-5 h-5 text-gray-800" />
//                   </button>
//                 </>
//               )}

//               {/* Image counter */}
//               {property.images.length > 1 && (
//                 <div className="z-10 absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs ">
//                   {currentImageIndex + 1} / {property.images.length}
//                 </div>
//               )}
//             </>
//           )}

//           {/* Status Badge - Top Left */}
//           <div className="absolute top-2 left-2 z-10  rounded-full bg-white/80">
//             <div
//               className={`${getStatusColor(
//                 property.status?.value || ""
//               )} px-2 py-1 rounded-full font-medium`}
//             >
//               {property.status?.value || "N/A"}
//             </div>
//           </div>

//           {/* Favorite Button - Top Right*/}
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               // onFavorite?.(property.id);
//               toggleFavorite(property.id);
//             }}
//             className="z-10 absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
//           >
//             <Heart
//               className={`w-5 h-5 transition-colors ${
//                 isPropertyFavorite
//                   ? "fill-red-500 text-red-500"
//                   : "text-gray-600"
//               }`}
//             />
//           </button>

//           {/* Type de bien Badge - Bottom Right  */}
//           <div className="z-10 absolute bottom-2 right-2 p-2 rounded-full bg-white/80">
//             <div className="text-gray-800 flex items-center gap-1">
//               <span className="text-sm font-medium">
//                 {property.type?.value || "N/A"}
//               </span>
//             </div>
//           </div>

//           {/* Location Badge - Bottom Left */}
//           <div className="z-10 absolute bottom-2 left-2 p-2 rounded-full bg-white/80">
//             <div className="text-gray-800 flex items-center gap-1">
//               <span className="text-sm font-medium">
//                 {property.location?.city || "N/A"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-2 flex  flex-col">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//             {property.name}
//           </h3>
//           {/* Informations détaillées */}
//           {/* <div className="flex flex-wrap items-center gap-4 mb-2 text-gray-600">
//             {property.feature?.bedrooms ? (
//               <div className="flex items-center gap-1">
//                 <Bed className="w-4 h-4" />
//                 <span className="text-sm">{property.feature.bedrooms}</span>
//               </div>
//             ) : null}

//             {property.feature?.bathrooms ? (
//               <div className="flex items-center gap-1">
//                 <Bath className="w-4 h-4" />
//                 <span className="text-sm">{property.feature.bathrooms}</span>
//               </div>
//             ) : null}
//             {property.feature?.parkingSpots ? (
//               <div className="flex items-center gap-1">
//                 <ParkingCircle className="w-4 h-4" />
//                 <span className="text-sm">{property.feature.parkingSpots}</span>
//               </div>
//             ) : null}
//             {property.feature?.area ? (
//               <div className="flex items-center gap-1">
//                 <Square className="w-4 h-4" />
//                 <span className="text-sm">
//                   {formatArea(property.feature.area)}
//                 </span>
//               </div>
//             ) : null}
//           </div> */}
//           <div className="flex flex-wrap items-center gap-4 mb-2 text-gray-600">
//             {features
//               .filter((feature: any) => feature.value) // N'affiche que les features définies
//               .map((feature, index) => (
//                 <div key={index} className="flex items-center gap-1">
//                   {feature.icon}
//                   <span className="text-sm">{feature.value}</span>
//                 </div>
//               ))}
//           </div>
//           {/* Prix */}
//           <div className="">
//             <p className="text-right text-2xl font-bold text-blue-600 ">
//               {formatPrice(property.price)}
//             </p>
//           </div>
//         </div>
//       </CardBody>

//       <CardFooter className="bg-gray-100 h-16 border-gray-200">
//         {property.id ? (
//           <Link
//             href={`/property/${property.id}`}
//             className="block w-full p-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
//           >
//             Voir détails
//           </Link>
//         ) : (
//           <p className="text-center text-gray-600">Détails non disponibles</p>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

// end ----------------------------------------------------------
// next-intl with claude

// "use client";
// import React from "react";
// import {
//   Heart,
//   Square,
//   ChevronLeft,
//   ChevronRight,
//   Bed,
//   ImageOff,
//   Bath,
//   ParkingCircle,
// } from "lucide-react";
// // import Link from "next/link";
// import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
// import { formatPrice } from "@/lib/formatPrice";
// import { useFavorites } from "../context/FavoriteContext";
// import { useTranslations } from "next-intl";
// import { Link } from "@/i18n/routing";

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

// interface Props {
//   property: Property;
//   onFavorite?: (id: number) => void;
//   isFavorite?: boolean;
// }

// const PropertyCard = ({ property, onFavorite, isFavorite = false }: Props) => {
//   const t = useTranslations("PropertyCard");

//   const [isImageLoading, setIsImageLoading] = React.useState(true);
//   const [isHovered, setIsHovered] = React.useState(false);
//   const [imageError, setImageError] = React.useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
//   const { favorites, toggleFavorite } = useFavorites();
//   const isPropertyFavorite = favorites.includes(property.id);

//   if (!property) {
//     return null;
//   }

//   const handleImageLoad = () => {
//     setIsImageLoading(false);
//   };

//   const handleImageError = () => {
//     setImageError(true);
//     setIsImageLoading(false);
//   };

//   const nextImage = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (property.images.length > 1) {
//       setCurrentImageIndex((prev) =>
//         prev === property.images.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const prevImage = (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (property.images.length > 1) {
//       setCurrentImageIndex((prev) =>
//         prev === 0 ? property.images.length - 1 : prev - 1
//       );
//     }
//   };

//   const formatArea = (area: number) => {
//     return t("area", { area: area.toLocaleString("fr-FR") });
//   };

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case "vente":
//         return "bg-blue-100 text-blue-800";
//       case "location":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const features = [
//     {
//       icon: <Bed className="w-4 h-4" />,
//       value: property.feature?.bedrooms,
//       label: "bedrooms",
//     },
//     {
//       icon: <Bath className="w-4 h-4" />,
//       value: property.feature?.bathrooms,
//       label: "bathrooms",
//     },
//     {
//       icon: <ParkingCircle className="w-4 h-4" />,
//       value: property.feature?.parkingSpots,
//       label: "parkingSpots",
//     },
//     {
//       icon: <Square className="w-4 h-4" />,
//       value: property.feature?.area && formatArea(property.feature.area),
//       label: "area",
//     },
//   ];

//   return (
//     <Card
//       className="w-72 h-96 relative group transition-all duration-300 hover:shadow-xl rounded-lg bg-white"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <CardBody className="h-[calc(100%-4rem)] overflow-y-auto p-0">
//         <div className="relative w-full h-48 overflow-hidden bg-gray-100">
//           {isImageLoading && (
//             <div className="absolute inset-0 bg-gray-200 animate-pulse" />
//           )}

//           {imageError ? (
//             <div className="w-full h-full flex items-center justify-center bg-gray-100">
//               <div className="flex flex-col items-center gap-2 text-gray-400">
//                 <ImageOff size={32} />
//                 <span className="text-sm">{t("imageNotAvailable")}</span>
//               </div>
//             </div>
//           ) : (
//             <>
//               <Image
//                 src={
//                   property.images[currentImageIndex]?.url ??
//                   "/imageNotFound.jpg"
//                 }
//                 className={`w-full h-full object-cover transition-transform duration-300 ${
//                   isHovered ? "scale-110" : "scale-100"
//                 }`}
//                 alt={t("imageAlt", {
//                   propertyName: property.name,
//                   imageNumber: currentImageIndex + 1,
//                 })}
//                 onLoad={handleImageLoad}
//                 onError={handleImageError}
//               />

//               {property.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={prevImage}
//                     className="z-10 absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
//                     aria-label={t("previousImage")}
//                   >
//                     <ChevronLeft className="w-5 h-5 text-gray-800" />
//                   </button>
//                   <button
//                     onClick={nextImage}
//                     className="z-10 absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
//                     aria-label={t("nextImage")}
//                   >
//                     <ChevronRight className="w-5 h-5 text-gray-800" />
//                   </button>
//                 </>
//               )}

//               {property.images.length > 1 && (
//                 <div className="z-10 absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
//                   {t("imageCounter", {
//                     current: currentImageIndex + 1,
//                     total: property.images.length,
//                   })}
//                 </div>
//               )}
//             </>
//           )}

//           <div className="absolute top-2 left-2 z-10 rounded-full bg-white/80">
//             <div
//               className={`${getStatusColor(
//                 property.status?.value || ""
//               )} px-2 py-1 rounded-full font-medium`}
//             >
//               {property.status?.value || t("notAvailable")}
//             </div>
//           </div>

//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               toggleFavorite(property.id);
//             }}
//             className="z-10 absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
//             aria-label={t("toggleFavorite")}
//           >
//             <Heart
//               className={`w-5 h-5 transition-colors ${
//                 isPropertyFavorite
//                   ? "fill-red-500 text-red-500"
//                   : "text-gray-600"
//               }`}
//             />
//           </button>

//           <div className="z-10 absolute bottom-2 right-2 p-2 rounded-full bg-white/80">
//             <div className="text-gray-800 flex items-center gap-1">
//               <span className="text-sm font-medium">
//                 {property.type?.value || t("notAvailable")}
//               </span>
//             </div>
//           </div>

//           <div className="z-10 absolute bottom-2 left-2 p-2 rounded-full bg-white/80">
//             <div className="text-gray-800 flex items-center gap-1">
//               <span className="text-sm font-medium">
//                 {property.location?.city || t("notAvailable")}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="p-2 flex flex-col">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
//             {property.name}
//           </h3>

//           <div className="flex flex-wrap items-center gap-4 mb-2 text-gray-600">
//             {features
//               .filter((feature) => feature.value)
//               .map((feature, index) => (
//                 <div key={index} className="flex items-center gap-1">
//                   {feature.icon}
//                   <span className="text-sm">{feature.value}</span>
//                 </div>
//               ))}
//           </div>

//           <div className="">
//             <p className="text-right text-2xl font-bold text-blue-600">
//               {formatPrice(property.price)}
//             </p>
//           </div>
//         </div>
//       </CardBody>

//       <CardFooter className="bg-gray-100 h-16 border-gray-200">
//         {property.id ? (
//           <Link
//             href={`/property/${property.id}`}
//             className="block w-full p-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
//           >
//             {t("viewDetails")}
//           </Link>
//         ) : (
//           <p className="text-center text-gray-600">
//             {t("detailsNotAvailable")}
//           </p>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

"use client";
import React from "react";
import {
  Heart,
  Square,
  ChevronLeft,
  ChevronRight,
  Bed,
  ImageOff,
  Bath,
  ParkingCircle,
} from "lucide-react";
import { Card, CardBody, CardFooter, Image } from "@nextui-org/react";
import { formatPrice } from "@/lib/formatPrice";
import { useFavorites } from "../context/FavoriteContext";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getLocalizedText } from "@/lib/utils/translation-utils"; // <-- NOUVEL IMPORT

// 🚨 INTERFACE MISE À JOUR POUR LE NOUVEAU SCHÉMA DE DONNÉES
interface Property {
  id: number;
  name: any; // Changed from string to any to match Json type from Prisma
  price: any; // CORRECTION : Changer de 'number' à 'any' ou 'string' (puisque c'est Decimal)
  type?: {
    code: string; // ANCIEN: value
  };
  status?: {
    code: string; // ANCIEN: value
  };
  images: {
    url: string;
  }[];
  location?: {
    city: {
      id: number;
      countryId: number;
      // 🚨 NOUVELLE STRUCTURE POUR LES TRADUCTIONS
      translations: {
        name: string; // Le nom traduit
      }[];
    } | null;
  } | null;
  feature?: {
    area: number;
    bedrooms: number;
    bathrooms: number;
    parkingSpots: number;
  } | null;
}

interface Props {
  property: Property;
  onFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

const PropertyCard = ({ property, onFavorite, isFavorite = false }: Props) => {
  // NOTE SUR LA TRADUCTION :
  // Les codes (ex: 'for_sale') doivent être traduits en utilisant `t(code)` si vous avez
  // les traductions correspondantes dans vos fichiers i18n.
  const t = useTranslations("PropertyCard");
  const tCommon = useTranslations("Common"); // Supposons que les codes comme "for_sale" ou "house" sont là

  const locale = useLocale();

  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const { favorites, toggleFavorite } = useFavorites();
  const isPropertyFavorite = favorites.includes(property.id);

  if (!property) {
    return null;
  }

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    if (property.images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const formatArea = (area: number) => {
    return t("area", { area: area.toLocaleString("fr-FR") });
  };

  // 🚨 ADAPTATION : Utilisation du code pour la couleur
  const getStatusColor = (code: string) => {
    switch (code?.toLowerCase()) {
      case "for_sale": // Vente
        return "bg-blue-100 text-blue-800";
      case "for_rent": // Location
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const features = [
    {
      icon: <Bed className="w-4 h-4" />,
      value: property.feature?.bedrooms,
      label: "bedrooms",
    },
    {
      icon: <Bath className="w-4 h-4" />,
      value: property.feature?.bathrooms,
      label: "bathrooms",
    },
    {
      icon: <ParkingCircle className="w-4 h-4" />,
      value: property.feature?.parkingSpots,
      label: "parkingSpots",
    },
    {
      icon: <Square className="w-4 h-4" />,
      value: property.feature?.area && formatArea(property.feature.area),
      label: "area",
    },
  ];

  // 🚨 NOUVELLE VALEUR DE STATUT/TYPE
  const status_code = property.status?.code || "";
  const type_code = property.type?.code || "";

  // 🚨 RÉCUPÉRATION DU NOM DE LA VILLE
  // Étant donné que PropertyLocation ne contient plus de champ 'city: string'
  // mais une relation 'city: City', nous ne pouvons accéder qu'à l'ID ici.
  // Pour afficher le nom, vous devez soit :
  // 1. Modifier la requête dans app/page.tsx pour joindre CityTranslation (recommandé).
  // 2. Ou faire une requête supplémentaire/utiliser un contexte global pour les noms des villes.
  // const displayCity = property.location?.city
  //   ? `City ID: ${property.location.city.id}` // Afficher l'ID
  //   : t("notAvailable"); // Ou un placeholder

  // 🚨 RÉCUPÉRATION DU NOM TRADUIT
  const translatedCityName = property.location?.city?.translations?.[0]?.name;

  const displayCity = translatedCityName || t("notAvailable");

  return (
    <Link href={`/property/${property.id}`} className="hover:no-underline">
      <Card
        className="w-72 h-96 relative group transition-all duration-300 hover:shadow-xl rounded-lg bg-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardBody className="h-[calc(100%-4rem)] overflow-y-auto p-0">
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {imageError ? (
              // ... (Affichage de l'image d'erreur inchangé)
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImageOff size={32} />
                  <span className="text-sm">{t("imageNotAvailable")}</span>
                </div>
              </div>
            ) : (
              <>
                <Image
                  src={
                    property.images[currentImageIndex]?.url ??
                    "/imageNotFound.jpg"
                  }
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                  alt={t("imageAlt", {
                    propertyName: property.name,
                    imageNumber: currentImageIndex + 1,
                  })}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {/* ... (Boutons de navigation d'image et compteur inchangés) */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="z-10 absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={t("previousImage")}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="z-10 absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                      aria-label={t("nextImage")}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-800" />
                    </button>
                  </>
                )}
                {property.images.length > 1 && (
                  <div className="z-10 absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                    {t("imageCounter", {
                      current: currentImageIndex + 1,
                      total: property.images.length,
                    })}
                  </div>
                )}
              </>
            )}

            {/* 🚨 AFFICHAGE DU STATUT (Traduction du code) */}
            <div className="absolute top-2 left-2 z-10 rounded-full bg-white/80">
              <div
                className={`${getStatusColor(
                  status_code
                )} px-2 py-1 rounded-full font-medium text-xs`}
              >
                {tCommon(status_code) || t("notAvailable")}
              </div>
            </div>

            {/* Bouton Favori (inchangé) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property.id);
              }}
              className="z-10 absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              aria-label={t("toggleFavorite")}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isPropertyFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600"
                }`}
              />
            </button>

            {/* 🚨 AFFICHAGE DU TYPE (Traduction du code) */}
            <div className="z-10 absolute bottom-2 right-2 p-2 rounded-full bg-white/80">
              <div className="text-gray-800 flex items-center gap-1">
                <span className="text-xs font-medium">
                  {tCommon(type_code) || t("notAvailable")}
                </span>
              </div>
            </div>

            {/* 🚨 AFFICHAGE DE LA VILLE (Utilise maintenant la nouvelle structure) */}
            <div className="z-10 absolute bottom-2 left-2 p-2 rounded-full bg-white/80">
              <div className="text-gray-800 flex items-center gap-1">
                <span className="text-xs font-medium">{displayCity}</span>
              </div>
            </div>
          </div>

          <div className="p-2 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {getLocalizedText(property.name, locale)}{" "}
              {/* ✅ CORRECTION APPLIQUÉE ICI */}
            </h3>

            <div className="flex flex-wrap items-center gap-4 mb-2 text-gray-600">
              {features
                .filter((feature) => feature.value)
                .map((feature, index) => (
                  <div key={index} className="flex items-center gap-1">
                    {feature.icon}
                    <span className="text-sm">{feature.value}</span>
                  </div>
                ))}
            </div>

            <div className="">
              <p className="text-right text-2xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </p>
            </div>
          </div>
        </CardBody>

        <CardFooter className="bg-gray-100 h-16 border-gray-200 justify-center">
          <div className="block w-full text-center">
            {property.id ? (
              <span className="p-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer w-full inline-block">
                {t("viewDetails")}
              </span>
            ) : (
              <p className="text-center text-gray-600">
                {t("detailsNotAvailable")}
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
