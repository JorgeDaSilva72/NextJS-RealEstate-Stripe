// import { isUserDiamant } from "@/lib/actions/user";
// import { formatPrice } from "@/lib/formatPrice";
// import prisma from "@/lib/prisma";
// import { Card, Image } from "@nextui-org/react";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import PageTitle from "../../components/pageTitle";
// import ImageThumbnails from "../../components/ImageThumbnailsProps";
// import ShareButtons from "../../components/ShareButtons";
// import DescriptionCard from "../../components/DescriptionCard ";

// export interface Props {
//   params: {
//     id: string;
//   };
// }

// interface ShareButtonsProps {
//   url: string;
//   title: string;
//   description?: string;
// }

// const PropertyPage = async ({ params }: Props) => {
//   const property = await prisma.property.findUnique({
//     where: {
//       id: +params.id,
//     },
//     include: {
//       status: true,
//       type: true,
//       feature: true,
//       location: true,
//       contact: true,
//       images: true,
//       videos: true,
//     },
//   });
//   const userFound = await isUserDiamant(+params.id);

//   if (!property) return notFound();

//   const transformToEmbedUrl = (url: string): string => {
//     const urlObj = new URL(url);
//     if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
//       return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
//     }
//     return url;
//   };

//   // const getCurrentUrl = (): string => {
//   //   try {
//   //     // Get the current URL
//   //     const currentUrl =
//   //       typeof window !== "undefined" ? window.location.href : "";

//   //     // Extract the path from the current URL
//   //     const urlObject = new URL(currentUrl);
//   //     const path = urlObject.pathname;

//   //     // Construct the full URL using the path and the origin
//   //     const origin =
//   //       typeof window !== "undefined" ? window.location.origin : "";
//   //     return `${origin}${path}`;
//   //   } catch (error) {
//   //     // If the current URL is not valid, return an empty string
//   //     return "";
//   //   }
//   // };
//   // const currentUrl = getCurrentUrl();

//   // const currentUrl =
//   //   typeof window !== "undefined"
//   //     ? `${window.location.origin}/property/${params.id}`
//   //     : `http://localhost:3000/property/${params.id}`;

//   const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/property/${params.id}`;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <PageTitle
//         title="Annonce"
//         href="/result"
//         linkCaption="Retour aux annonces"
//       />
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         {/* Grille principale */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
//           {/* Slider - 2/3 */}
//           {/* Vérifiez s'il y a des images */}
//           {property.images.length > 0 && (
//             <div className="col-span-1 lg:col-span-2 rounded-2xl overflow-hidden shadow-lg">
//               {/* <ImagesSliderHero
//                 images={property.images.map((img) => img.url)}
//               /> */}
//               <ImageThumbnails images={property.images.map((img) => img.url)} />
//             </div>
//           )}
//           {/* Détails - 1/3  - Prend toute la largeur si pas de slider */}
//           <div
//             className={`col-span-1 ${
//               property.images.length === 0 ? "lg:col-span-3" : ""
//             } space-y-6`}
//           >
//             {/* Titre et prix */}
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
//                 {property.name}
//               </h2>

//               <div className="flex gap-2 text-sm text-gray-600">
//                 <span className="px-2 py-1 bg-blue-100 rounded-full">
//                   {property.status.value}
//                 </span>
//                 <span className="px-2 py-1 bg-green-100 rounded-full">
//                   {property.type.value}
//                 </span>
//               </div>
//               <div className="mt-4 flex items-baseline ">
//                 <span className="text-2xl sm:text-3xl font-bold text-primary">
//                   {formatPrice(property.price)}
//                 </span>
//               </div>
//               <div className="mt-4 flex items-baseline ">
//                 <p className="">
//                   Réf :{" "}
//                   <span className="text-sm sm:text-sm ">{property.id}</span>
//                 </p>
//               </div>
//               {userFound && (
//                 <Link
//                   href={`/property/${property.id}/appointment`}
//                   className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
//                 >
//                   Prendre Rendez-Vous
//                 </Link>
//               )}
//             </Card>

//             {/* Partager */}
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title="Partager" />
//               <div className=" mt-4">
//                 <ShareButtons
//                   url={currentUrl}
//                   title={`Découvrez cette propriété : ${property.name}`}
//                   description={property.description}
//                 />
//               </div>
//             </Card>

//             {/* Description */}
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title="Description" />
//               <div className=" mt-4">
//                 {/* <FeatureCard icon="📝" label="" value={property.description} /> */}
//                 <DescriptionCard description={property.description} />
//               </div>
//             </Card>

//             {/* Caractéristiques */}
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title="Caractéristiques" />
//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <FeatureCard
//                   icon="🛏️"
//                   label="Chambre(s)"
//                   value={property.feature?.bedrooms}
//                 />
//                 <FeatureCard
//                   icon="🚿"
//                   label="Salle(s) de bain"
//                   value={property.feature?.bathrooms}
//                 />
//                 <FeatureCard
//                   icon="🚗"
//                   label="Parking"
//                   value={property.feature?.parkingSpots}
//                 />
//                 <FeatureCard
//                   icon="📏"
//                   label="Surface"
//                   value={`${property.feature?.area} m²`}
//                 />
//                 {/* Nouveaux attributs */}
//                 <FeatureCard
//                   icon="🏊‍♂️"
//                   label="Piscine"
//                   value={property.feature?.hasSwimmingPool ? "Oui" : "Non"}
//                 />
//                 <FeatureCard
//                   icon="🌳"
//                   label="Jardin/Cour"
//                   value={property.feature?.hasGardenYard ? "Oui" : "Non"}
//                 />
//                 <FeatureCard
//                   icon="☀️"
//                   label="Balcon/Terrasse"
//                   value={property.feature?.hasBalcony ? "Oui" : "Non"}
//                 />
//               </div>
//             </Card>

//             {/* Adresse */}
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title="Adresse" />
//               <div className="space-y-3 mt-4">
//                 <Attribute
//                   icon="🌍"
//                   label="Pays"
//                   value={property.location?.state}
//                 />
//                 <Attribute
//                   icon="🗺️"
//                   label="Région"
//                   value={property.location?.region}
//                 />
//                 <Attribute
//                   icon="🏘️"
//                   label="Ville"
//                   value={property.location?.city}
//                 />
//                 <Attribute
//                   icon="📍"
//                   label="Adresse"
//                   value={property.location?.streetAddress}
//                 />

//                 <Attribute
//                   icon="📮"
//                   label="Code postal"
//                   value={property.location?.zip}
//                 />
//                 <Attribute
//                   icon="ℹ️"
//                   label="Informations"
//                   value={property.location?.landmark}
//                 />
//               </div>
//             </Card>

//             {/* Contact */}
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title="Contact" />
//               <div className="space-y-3 mt-4">
//                 <Attribute
//                   icon="👤"
//                   label="Nom"
//                   value={property.contact?.name}
//                 />
//                 <Attribute
//                   icon="📧"
//                   label="Email"
//                   value={property.contact?.email}
//                 />
//                 <Attribute
//                   icon="📱"
//                   label="Téléphone"
//                   value={property.contact?.phone}
//                 />
//               </div>
//             </Card>

//             {/* Vidéos */}
//             {property.videos.length > 0 && (
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <Title title="Vidéos" />
//                 <div className="grid grid-cols-1 gap-4 mt-4">
//                   {property.videos.map((video) => (
//                     <div
//                       key={video.id}
//                       className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//                     >
//                       <iframe
//                         className="w-full h-full"
//                         src={transformToEmbedUrl(video.url)}
//                         title={`Vidéo ${video.id}`}
//                         allowFullScreen
//                         aria-label={`Vidéo ${video.id}`}
//                       ></iframe>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyPage;

// const Title = ({ title }: { title: string }) => (
//   <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
//     {title}
//   </h2>
// );

// const FeatureCard = ({
//   icon,
//   label,
//   value,
// }: {
//   icon: string;
//   label: string;
//   value?: string | number;
// }) => (
//   <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
//     <div className="flex items-center gap-2">
//       <span className="text-xl">{icon}</span>
//       <div>
//         <p className="text-sm text-gray-600">{label}</p>
//         <p className="font-semibold text-gray-800">{value || "N/A"}</p>
//       </div>
//     </div>
//   </div>
// );

// const Attribute = ({
//   icon,
//   label,
//   value,
// }: {
//   icon: string;
//   label: string;
//   value?: string | number;
// }) => (
//   <div className="flex items-center gap-3">
//     <span className="text-xl">{icon}</span>
//     <div className="flex-1">
//       <p className="text-sm text-gray-600">{label}</p>
//       <p className="font-medium text-gray-800">{value || "N/A"}</p>
//     </div>
//   </div>
// );

// import { isUserDiamant } from "@/lib/actions/user";
// import { formatPrice } from "@/lib/formatPrice";
// import prisma from "@/lib/prisma";
// import { Card, Image } from "@nextui-org/react";
// // import Link from "next/link";
// import { notFound } from "next/navigation";
// import PageTitle from "../../components/pageTitle";
// import ImageThumbnails from "../../components/ImageThumbnailsProps";
// import ShareButtons from "../../components/ShareButtons";
// // import DescriptionCard from "../../components/DescriptionCard";
// import { getTranslations } from "next-intl/server";
// import DescriptionCard from "../../components/DescriptionCard ";
// import { Link } from "@/i18n/routing";

// export interface Props {
//   params: {
//     id: string;
//     locale: string;
//   };
// }

// interface ShareButtonsProps {
//   url: string;
//   title: string;
//   description?: string;
// }

// const PropertyPage = async ({ params }: Props) => {
//   const t = await getTranslations("Property");

//   const property = await prisma.property.findUnique({
//     where: {
//       id: +params.id,
//     },
//     include: {
//       status: true,
//       type: true,
//       feature: true,
//       location: true,
//       contact: true,
//       images: true,
//       videos: true,
//     },
//   });
//   const userFound = await isUserDiamant(+params.id);

//   if (!property) return notFound();

//   const transformToEmbedUrl = (url: string): string => {
//     const urlObj = new URL(url);
//     if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
//       return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
//     }
//     return url;
//   };

//   const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${params.locale}/property/${params.id}`;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <PageTitle
//         title={t("pageTitle")}
//         href="/result"
//         linkCaption={t("backToListings")}
//       />
//       <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
//           {property.images.length > 0 && (
//             <div className="col-span-1 lg:col-span-2 rounded-2xl overflow-hidden shadow-lg">
//               <ImageThumbnails images={property.images.map((img) => img.url)} />
//             </div>
//           )}
//           <div
//             className={`col-span-1 ${
//               property.images.length === 0 ? "lg:col-span-3" : ""
//             } space-y-6`}
//           >
//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
//                 {property.name}
//               </h2>

//               <div className="flex gap-2 text-sm text-gray-600">
//                 <span className="px-2 py-1 bg-blue-100 rounded-full">
//                   {property.status.value}
//                 </span>
//                 <span className="px-2 py-1 bg-green-100 rounded-full">
//                   {property.type.value}
//                 </span>
//               </div>
//               <div className="mt-4 flex items-baseline ">
//                 <span className="text-2xl sm:text-3xl font-bold text-primary">
//                   {formatPrice(property.price)}
//                 </span>
//               </div>
//               <div className="mt-4 flex items-baseline ">
//                 <p>
//                   {t("reference")}{" "}
//                   <span className="text-sm sm:text-sm ">{property.id}</span>
//                 </p>
//               </div>
//               {userFound && (
//                 <Link
//                   href={`/${params.locale}/property/${property.id}/appointment`}
//                   className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
//                 >
//                   {t("bookAppointment")}
//                 </Link>
//               )}
//             </Card>

//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title={t("share")} />
//               <div className="mt-4">
//                 <ShareButtons
//                   url={currentUrl}
//                   title={t("shareTitle", { propertyName: property.name })}
//                   description={property.description}
//                 />
//               </div>
//             </Card>

//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title={t("description")} />
//               <div className="mt-4">
//                 <DescriptionCard description={property.description} />
//               </div>
//             </Card>

//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title={t("features")} />
//               <div className="grid grid-cols-2 gap-4 mt-4">
//                 <FeatureCard
//                   icon="🛏️"
//                   label={t("bedrooms")}
//                   value={property.feature?.bedrooms}
//                 />
//                 <FeatureCard
//                   icon="🚿"
//                   label={t("bathrooms")}
//                   value={property.feature?.bathrooms}
//                 />
//                 <FeatureCard
//                   icon="🚗"
//                   label={t("parking")}
//                   value={property.feature?.parkingSpots}
//                 />
//                 <FeatureCard
//                   icon="📏"
//                   label={t("area")}
//                   value={`${property.feature?.area} m²`}
//                 />
//                 <FeatureCard
//                   icon="🏊‍♂️"
//                   label={t("swimmingPool")}
//                   value={t(property.feature?.hasSwimmingPool ? "yes" : "no")}
//                 />
//                 <FeatureCard
//                   icon="🌳"
//                   label={t("garden")}
//                   value={t(property.feature?.hasGardenYard ? "yes" : "no")}
//                 />
//                 <FeatureCard
//                   icon="☀️"
//                   label={t("balcony")}
//                   value={t(property.feature?.hasBalcony ? "yes" : "no")}
//                 />
//               </div>
//             </Card>

//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title={t("address")} />
//               <div className="space-y-3 mt-4">
//                 <Attribute
//                   icon="🌍"
//                   label={t("country")}
//                   value={property.location?.state}
//                 />
//                 <Attribute
//                   icon="🗺️"
//                   label={t("region")}
//                   value={property.location?.region}
//                 />
//                 <Attribute
//                   icon="🏘️"
//                   label={t("city")}
//                   value={property.location?.city}
//                 />
//                 <Attribute
//                   icon="📍"
//                   label={t("streetAddress")}
//                   value={property.location?.streetAddress}
//                 />
//                 <Attribute
//                   icon="📮"
//                   label={t("zipCode")}
//                   value={property.location?.zip}
//                 />
//                 <Attribute
//                   icon="ℹ️"
//                   label={t("information")}
//                   value={property.location?.landmark}
//                 />
//               </div>
//             </Card>

//             <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//               <Title title={t("contact")} />
//               <div className="space-y-3 mt-4">
//                 <Attribute
//                   icon="👤"
//                   label={t("name")}
//                   value={property.contact?.name}
//                 />
//                 <Attribute
//                   icon="📧"
//                   label={t("email")}
//                   value={property.contact?.email}
//                 />
//                 <Attribute
//                   icon="📱"
//                   label={t("phone")}
//                   value={property.contact?.phone}
//                 />
//               </div>
//             </Card>

//             {property.videos.length > 0 && (
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <Title title={t("videos")} />
//                 <div className="grid grid-cols-1 gap-4 mt-4">
//                   {property.videos.map((video) => (
//                     <div
//                       key={video.id}
//                       className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//                     >
//                       <iframe
//                         className="w-full h-full"
//                         src={transformToEmbedUrl(video.url)}
//                         title={t("videoTitle", { id: video.id })}
//                         allowFullScreen
//                         aria-label={t("videoTitle", { id: video.id })}
//                       ></iframe>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyPage;

// const Title = ({ title }: { title: string }) => (
//   <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
//     {title}
//   </h2>
// );

// const FeatureCard = ({
//   icon,
//   label,
//   value,
// }: {
//   icon: string;
//   label: string;
//   value?: string | number;
// }) => (
//   <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
//     <div className="flex items-center gap-2">
//       <span className="text-xl">{icon}</span>
//       <div>
//         <p className="text-sm text-gray-600">{label}</p>
//         <p className="font-semibold text-gray-800">{value || "N/A"}</p>
//       </div>
//     </div>
//   </div>
// );

// const Attribute = ({
//   icon,
//   label,
//   value,
// }: {
//   icon: string;
//   label: string;
//   value?: string | number;
// }) => (
//   <div className="flex items-center gap-3">
//     <span className="text-xl">{icon}</span>
//     <div className="flex-1">
//       <p className="text-sm text-gray-600">{label}</p>
//       <p className="font-medium text-gray-800">{value || "N/A"}</p>
//     </div>
//   </div>
// );

// 6/12/2025

import { formatPrice } from "@/lib/formatPrice";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageTitle from "../../components/pageTitle";
import ImageThumbnails from "../../components/ImageThumbnailsProps";
import ShareButtons from "../../components/ShareButtons";
import { getTranslations } from "next-intl/server";
import DescriptionCard from "../../components/DescriptionCard ";
import { Link } from "@/i18n/routing";
import { getLanguageIdByCode } from "@/lib/utils";
import { getLocalizedText, LocalizedText } from "@/lib/utils/translation-utils";
import WhatsAppContactButton from "../../components/WhatsAppContactButton";
import WhatsAppQuickActions from "../../components/WhatsAppQuickActions";
import Map from "@/components/ui/Map";
import FavoriteButtonWrapper from "./FavoriteButtonWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bed, 
  Bath, 
  Car, 
  Ruler, 
  Waves, 
  Trees, 
  Sun, 
  MapPin, 
  Mail, 
  Phone, 
  User
} from "lucide-react";

export interface Props {
  params: {
    id: string;
    locale: string;
  };
}

// Modern Title Component
const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-xl font-semibold text-foreground mb-4">
    {title}
  </h2>
);

// Modern Feature Card Component
const FeatureCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
}) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200">
    <Icon className="h-6 w-6 mb-2 text-muted-foreground" />
    <p className="text-xs text-muted-foreground text-center mb-1">{label}</p>
    <p className="text-lg font-semibold text-foreground">{value ?? "N/A"}</p>
  </div>
);

// Modern Attribute Component
const Attribute = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
}) => {
  // Handle object display - convert to string safely
  let displayValue: string;
  if (value === null || value === undefined) {
    displayValue = "N/A";
  } else if (typeof value === 'object') {
    try {
      displayValue = JSON.stringify(value);
    } catch {
      displayValue = String(value);
    }
  } else {
    displayValue = String(value);
  }

  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground break-words">{displayValue}</p>
      </div>
    </div>
  );
};

const PropertyPage = async ({ params }: Props) => {
  const t = await getTranslations("Property");
  const locale = params.locale;

  // Validate property ID
  if (!params.id || params.id === 'undefined' || params.id === 'null') {
    notFound();
  }

  const propertyId = parseInt(params.id, 10);
  if (isNaN(propertyId) || propertyId <= 0) {
    notFound();
  }

  const languageId = await getLanguageIdByCode(locale);

  if (!languageId) {
    console.error(`Language ID for locale ${locale} not found.`);
  }

  // 2. Requête Prisma ajustée pour le multilingue et les relations
  // Fix: findUnique can only use unique fields (id), isActive must be in a separate where clause
  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      isActive: true,
    },
    include: {
      // 🚨 MULTILINGUE STATUT & TYPE: Ces modèles utilisent des tables de traduction.
      status: {
        include: {
          translations: {
            where: { languageId },
            select: { value: true },
            take: 1,
          },
        },
      }, // 🚨 MULTILINGUE TYPE
      type: {
        include: {
          translations: {
            where: { languageId },
            select: { value: true },
            take: 1,
          },
        },
      },
      feature: true,
      // 🚨 GÉOLOCALISATION
      location: {
        include: {
          city: {
            select: {
              // On joint la ville pour obtenir son ID
              id: true, // Et ses relations régionales/nationales
              region: {
                include: {
                  translations: {
                    where: { languageId },
                    select: { name: true },
                    take: 1,
                  },
                },
              },
              country: {
                include: {
                  translations: {
                    where: { languageId },
                    select: { name: true },
                    take: 1,
                  },
                },
              },
              translations: {
                where: { languageId },
                select: { name: true },
                take: 1,
              },
            },
          },
        },
      },
      contact: true,
      images: true,
      videos: true,
      // Include country for phone number normalization
      country: {
        select: {
          phonePrefix: true,
        },
      },
      // Note: name, description, price, currency, landmark sont sélectionnés implicitement
      // car ils sont des champs directs dans le modèle Property et PropertyLocation.
    },
  });

  // const userFound = await isUserDiamant(property?.userId); // Utiliser property.userId
  if (!property) return notFound();

  // Récupération des valeurs traduites
  const translatedStatus =
    property.status.translations[0]?.value ?? property.status.code;
  const translatedType =
    property.type.translations[0]?.value ?? property.type.code;
  const translatedCity =
    property.location?.city?.translations[0]?.name ??
    property.location?.city?.id;
  const translatedRegion =
    property.location?.city?.region?.translations[0]?.name;
  const translatedCountry =
    property.location?.city?.country?.translations[0]?.name;

  const transformToEmbedUrl = (url: string): string => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
    }
    return url;
  };

  // Helper function to extract text from multilingual JSON
  // const getLocalizedText = (field: any, locale: string = "fr"): string => {
  //   if (!field) return "";
  //   if (typeof field === "string") return field;
  //   if (typeof field === "object") {
  //     // Try requested locale first, then fallback to fr, en, ar, pt
  //     return (
  //       field[locale] || field.fr || field.en || field.ar || field.pt || ""
  //     );
  //   }
  //   return String(field);
  // };

  // Utilisez getLocalizedText pour les champs JSON
  // 🚨 CORRECTION CRITIQUE: Forcer le type pour satisfaire le contrat de getLocalizedText
  const translatedName = getLocalizedText(
    property.name as LocalizedText,
    params.locale
  );
  const translatedDescription = getLocalizedText(
    property.description as LocalizedText,
    params.locale
  );
  // L'objet location?.landmark peut être null, d'où le casting sur l'objet lui-même si non null
  const translatedLandmark = getLocalizedText(
    property.location?.landmark as LocalizedText,
    params.locale
  );

  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${params.locale}/property/${params.id}`;

  return (
    <div className="min-h-screen bg-background">
      <PageTitle
        title={t("pageTitle")}
        href="/result"
        linkCaption={t("backToListings")}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Image Gallery Section */}
          {property.images && property.images.length > 0 && (
            <div className="col-span-1 lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="rounded-lg overflow-hidden">
                  <ImageThumbnails
                    images={property.images
                      .map((img: any) => img.url)
                      .filter((url: string) => url && url !== 'undefined' && url !== 'null' && url.trim() !== '')}
                  />
                </div>
              </Card>
            </div>
          )}

          {/* Main Content Section */}
          <div
            className={`col-span-1 ${
              !property.images || property.images.length === 0 ? "lg:col-span-3" : ""
            } space-y-6`}
          >
            {/* Property Header Card */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
                      {translatedName}
                    </h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {translatedStatus}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {translatedType}
                      </Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-foreground">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t("reference")}: <span className="font-medium">{property.id}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
            {/* Share & Favorites Card */}
            <Card>
              <CardHeader>
                <div className="space-y-4">
                  <div>
                    <SectionTitle title={t("share")} />
                    <ShareButtons
                      url={currentUrl}
                      title={t("shareTitle", {
                        propertyName: translatedName,
                      })}
                      description={translatedDescription}
                    />
                  </div>
                  <Separator />
                  <div>
                    <SectionTitle title={locale === "fr" ? "Favoris" : "Favorites"} />
                    <FavoriteButtonWrapper
                      property={{
                        id: property.id,
                        name: translatedName,
                        price: property.price,
                        currency: property.currency || "EUR",
                        imageUrl: property.images?.[0]?.url || "/Hero1.jpg",
                        city: property.location?.city?.translations?.[0]?.name,
                        country: property.location?.city?.country?.translations?.[0]?.name,
                        status: translatedStatus,
                        type: translatedType,
                        area: property.feature?.area || undefined,
                        addedAt: new Date().toISOString(),
                      }}
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description Card */}
            <Card>
              <CardHeader>
                <SectionTitle title={t("description")} />
              </CardHeader>
              <CardContent>
                <DescriptionCard description={translatedDescription} />
              </CardContent>
            </Card>
            {/* Features Card */}
            <Card>
              <CardHeader>
                <SectionTitle title={t("features")} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <FeatureCard
                    icon={Bed}
                    label={t("bedrooms")}
                    value={property.feature?.bedrooms}
                  />
                  <FeatureCard
                    icon={Bath}
                    label={t("bathrooms")}
                    value={property.feature?.bathrooms}
                  />
                  <FeatureCard
                    icon={Car}
                    label={t("parking")}
                    value={property.feature?.parkingSpots}
                  />
                  <FeatureCard
                    icon={Ruler}
                    label={t("area")}
                    value={property.feature?.area ? `${property.feature.area} m²` : null}
                  />
                  <FeatureCard
                    icon={Waves}
                    label={t("swimmingPool")}
                    value={t(property.feature?.hasSwimmingPool ? "yes" : "no")}
                  />
                  <FeatureCard
                    icon={Trees}
                    label={t("garden")}
                    value={t(property.feature?.hasGardenYard ? "yes" : "no")}
                  />
                  <FeatureCard
                    icon={Sun}
                    label={t("balcony")}
                    value={t(property.feature?.hasBalcony ? "yes" : "no")}
                  />
                </div>
              </CardContent>
            </Card>
            {/* Address Card */}
            <Card>
              <CardHeader>
                <SectionTitle title={t("address")} />
              </CardHeader>
              <CardContent className="space-y-1">
                <Attribute
                  icon={MapPin}
                  label={t("country")}
                  value={translatedCountry}
                />
                <Attribute
                  icon={MapPin}
                  label={t("region")}
                  value={translatedRegion}
                />
                <Attribute
                  icon={MapPin}
                  label={t("city")}
                  value={translatedCity}
                />
                <Attribute
                  icon={MapPin}
                  label={t("streetAddress")}
                  value={property.location?.streetAddress}
                />
                <Attribute
                  icon={MapPin}
                  label={t("zipCode")}
                  value={property.location?.zip}
                />
                {translatedLandmark && (
                  <Attribute
                    icon={MapPin}
                    label={t("information")}
                    value={translatedLandmark}
                  />
                )}
              </CardContent>
            </Card>
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <SectionTitle title={t("contact")} />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  {property.contact?.name && (
                    <Attribute
                      icon={User}
                      label={t("name")}
                      value={property.contact.name}
                    />
                  )}
                  {property.contact?.email && (
                    <Attribute
                      icon={Mail}
                      label={t("email")}
                      value={property.contact.email}
                    />
                  )}
                  {property.contact?.phone && (
                    <Attribute
                      icon={Phone}
                      label={t("phone")}
                      value={property.contact.phone}
                    />
                  )}
                </div>
                
                {/* WhatsApp Contact Button & Quick Actions */}
                {property.contact?.phone && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <WhatsAppContactButton
                        phoneNumber={property.contact.phone}
                        propertyId={property.id}
                        propertyName={property.name}
                        propertyPrice={property.price ? `${formatPrice(property.price)} ${property.currency || 'EUR'}` : undefined}
                        propertyUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://afriqueavenirimmobilier.com'}/${locale}/property/${property.id}`}
                        variant="button"
                        size="md"
                        className="w-full"
                        buttonType="contact_agent"
                        requireGDPRConsent={true}
                      />
                      <WhatsAppQuickActions
                        phoneNumber={property.contact.phone}
                        propertyId={property.id}
                        propertyName={property.name}
                        propertyUrl={`${process.env.NEXT_PUBLIC_BASE_URL || 'https://afriqueavenirimmobilier.com'}/${locale}/property/${property.id}`}
                        propertyPrice={property.price ? `${formatPrice(property.price)} ${property.currency || 'EUR'}` : undefined}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            {/* Videos Card */}
            {property.videos && property.videos.length > 0 && (
              <Card>
                <CardHeader>
                  <SectionTitle title={t("videos")} />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {property.videos.map((video: any) => (
                      <div
                        key={video.id}
                        className="relative w-full aspect-video rounded-lg overflow-hidden border"
                      >
                        <iframe
                          className="w-full h-full"
                          src={transformToEmbedUrl(video.url)}
                          title={t("videoTitle", { id: video.id })}
                          allowFullScreen
                          aria-label={t("videoTitle", { id: video.id })}
                        ></iframe>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Map Section */}
            {property.location?.latitude && property.location?.longitude && (
              <Card>
                <CardHeader>
                  <SectionTitle title={t("location") || "Localisation"} />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full rounded-lg overflow-hidden border">
                    <Map
                      properties={[
                        {
                          id: property.id.toString(),
                          coordinates: {
                            lat: Number(property.location.latitude),
                            lng: Number(property.location.longitude),
                          },
                          title: translatedName,
                        },
                      ]}
                      defaultCenter={{
                        lat: Number(property.location.latitude),
                        lng: Number(property.location.longitude),
                      }}
                      defaultZoom={15}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;
