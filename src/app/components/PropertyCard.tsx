// "use client";
// import { Card, Image } from "@nextui-org/react";
// import { Prisma } from "@prisma/client";
// import Link from "next/link";

// interface Props {
//   property: Prisma.PropertyGetPayload<{
//     select: {
//       id: true;
//       name: true;
//       price: true;
//       images: {
//         select: {
//           url: true;
//         };
//       };
//       location: {
//         select: {
//           city: true;
//           state: true;
//         };
//       };
//     };
//   }>;
// }

// const PropertyCard = ({ property }: Props) => {
//   return (
//     <Card
//       className="w-72 flex flex-col hover:scale-105"
//       shadow="md"
//       // isHoverable
//       // isPressable
//       // onPress={() => console.log("item pressed")}
//     >
//       {property?.images[0]?.url ? (
//         <Image
//           radius="none"
//           src={
//             property?.images[0]?.url
//             // property.id === 1
//             //   ? property.images[0].url
//             //   : `/images/${Math.floor(Math.random() * 9 + 1)}.jpg`
//           }
//           className="object-fill w-96 h-48"
//           alt="image"
//         />
//       ) : (
//         <Image
//           radius="none"
//           src="/imageNotFound.png"
//           className="object-fill w-96 h-48"
//           alt="image"
//         />
//       )}
//       <div className="flex flex-col mt-auto">
//         <div className="p-4">
//           <p className="text-primary-600 text-xl font-bold">{property?.name}</p>
//           <p className="text-slate-600">{property?.location?.city}</p>
//           <p className="text-slate-600">{property?.location?.state}</p>
//         </div>
//         <div className="bg-gradient-to-br from-slate-50 to-slate-400 p-4 flex justify-between">
//           <p className="text-primary-600 text-xl font-bold">
//             {property?.price.toLocaleString()}
//             <span> €</span>
//           </p>
//           <Link
//             className="hover:text-primary-500 transition-colors"
//             href={`/property/${property.id}`}
//           >
//             Voir détails
//           </Link>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default PropertyCard;

"use client";

import React from "react";

import {
  BedDouble,
  Heart,
  HeartIcon,
  Home,
  ImageOff,
  Navigation,
  NavigationIcon,
  Square,
} from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { Badge, Card, Image } from "@nextui-org/react";

interface Props {
  property: Prisma.PropertyGetPayload<{
    select: {
      id: true;
      name: true;
      price: true;
      type: {
        select: {
          value: true;
        };
      };
      status: {
        select: {
          value: true;
        };
      };
      images: {
        select: {
          url: true;
        };
      };
      location: {
        select: {
          city: true;
          state: true;
        };
      };
      feature: {
        select: {
          area: true;
          bedrooms: true;
        };
      };
    };
  }>;
  onFavorite?: (id: number) => void;
  isFavorite?: boolean;
}

const PropertyCard = ({ property, onFavorite, isFavorite = false }: Props) => {
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area: number) => {
    return `${area.toLocaleString("fr-FR")} m²`;
  };

  // Fonction pour obtenir la couleur du badge de statut
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "à vendre":
        return "bg-blue-100 text-blue-800";
      case "à louer":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card
      className="w-72 h-96 relative group transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        {isImageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <ImageOff size={32} />
              <span className="text-sm">Image non disponible</span>
            </div>
          </div>
        ) : (
          <Image
            src={property?.images[0]?.url ?? "/imageNotFound.jpg"}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            alt={property.name}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Status Badge - Top Left */}
        <div className=" absolute top-2 left-2 z-10   p-2 rounded-full     bg-white/80">
          <div
            className={`${getStatusColor(
              property.status?.value
            )} font-medium  `}
          >
            {property.status?.value}
          </div>
        </div>

        {/* Favorite Button - Top Right*/}

        <button
          onClick={(e) => {
            e.preventDefault();
            onFavorite?.(property.id);
          }}
          className="z-10 absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
            }`}
          />
        </button>

        {/* Type de bien Badge - Bottom Right  */}
        <div className="z-40 absolute bottom-2 right-2 flex items-center gap-2z-10  p-2 rounded-full bg-white/80 ">
          <div className=" text-gray-800 flex items-center gap-1 ">
            {/* <Home className="w-4 h-4 text-primary-900" /> */}
            <span className="text-sm font-medium text-primary-900">
              {property.type?.value}
            </span>
          </div>
        </div>

        {/* Location Badge - - Bottom Left */}

        <div className="z-10 absolute bottom-2 left-2 flex items-center gap-2z-10  p-2 rounded-full bg-white/80 ">
          <div className=" text-gray-800 flex items-center gap-1 ">
            {/* <Navigation className="w-3 h-3" /> */}
            <span className="text-sm font-medium text-primary-900">
              {property?.location?.city}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-48">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {property.name}
        </h3>

        {/* Informations détaillées */}
        <div className="flex items-center gap-4 mb-2 text-gray-600">
          {property.feature?.bedrooms && (
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4" />
              <span className="text-sm">
                {property.feature.bedrooms} chambres
              </span>
            </div>
          )}
          {property.feature?.area && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span className="text-sm">
                {formatArea(property.feature.area)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-2xl font-bold text-primary-600 mb-3">
            {formatPrice(property.price)}
          </p>

          <Link
            href={`/property/${property.id}`}
            className="block w-full p-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
