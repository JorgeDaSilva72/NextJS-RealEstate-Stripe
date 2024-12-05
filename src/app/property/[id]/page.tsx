// "use client";
// import DescriptionCard from "@/app/components/DescriptionCard ";
// import { ImagesSliderHero } from "@/app/components/ImageSliderHero";
// import ImageThumbnails from "@/app/components/ImageThumbnailsProps";
// import PageTitle from "@/app/components/pageTitle";
// import { formatPrice } from "@/lib/formatPrice";
// // import prisma from "@/lib/prisma";
// import { Card, Image } from "@nextui-org/react";
// import { notFound, useRouter } from "next/navigation";

// import ShareButtons from "@/app/components/ShareButtons"; // Ajout Adrien
// import Head from "next/head"; // Ajout Adrien
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { Property } from "@prisma/client";

// interface Props {
//   params: {
//     id: string;
//   };
// }

// // interface Property {
// //   id: string;
// //   name: string;
// //   description: string;
// //   images: { url: string }[];
// // }

// const PropertyPage = ({ params }: Props) => {
//   const [property, setProperty] = useState<Property | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [copySuccess, setCopySuccess] = useState(false);
//   // Ajout Adrien
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const res = await fetch(`/api/property/${params.id}`);
//         if (!res.ok) {
//           throw new Error("Propriété non trouvée");
//         }
//         const data: Property = await res.json();
//         setProperty(data);
//       } catch (error) {
//         console.error("Erreur lors du chargement de la propriété :", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperty();
//   }, [params.id]);

//   // Ajout Adrien
//   // Construit l'URL complète (remplace localhost par votre domaine en production)
//   // const currentUrl =
//   //   typeof window !== "undefined"
//   //     ? `${window.location.origin}${router}`
//   //     : `http://localhost:3000/property/${params.id}`;

//   const currentUrl =
//     typeof window !== "undefined"
//       ? `${window.location.origin}/property/${params.id}`
//       : `http://localhost:3000/property/${params.id}`;

//   const handleShare = async () => {
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: `Annonce ${params.id}`,
//           text: `Découvrez cette annonce : ${property?.name}`,
//           url: currentUrl,
//         });
//       } catch (err) {
//         console.error("Le partage a échoué : ", err);
//         toast.error("Le partage a été annulé ou a échoué.");
//       }
//     } else {
//       // Fallback pour les navigateurs ne supportant pas l'API Web Share
//       if (navigator.clipboard) {
//         navigator.clipboard.writeText(currentUrl);
//         setCopySuccess(true);
//         setTimeout(() => setCopySuccess(false), 2000);
//       } else {
//         toast.error(
//           "Votre navigateur ne prend pas en charge le copier-coller automatique."
//         );
//       }
//     }
//   };

//   // const property = await prisma.property.findUnique({
//   //   where: {
//   //     id: +params.id,
//   //   },
//   //   include: {
//   //     status: true,
//   //     type: true,
//   //     feature: true,
//   //     location: true,
//   //     contact: true,
//   //     images: true,
//   //     videos: true,
//   //   },
//   // });

//   if (loading) {
//     return <div>Chargement...</div>;
//   }

//   if (!property) return notFound();

//   const transformToEmbedUrl = (url: string): string => {
//     const urlObj = new URL(url);
//     if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
//       return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
//     }
//     return url;
//   };

//   return (
//     <>
//       {/* Ajout Adrien */}
//       <Head>
//         <title>{property.name}</title>
//         <meta name="description" content={property.description} />
//         {/* Balises Open Graph */}
//         <meta property="og:type" content="website" />
//         <meta property="og:title" content={property.name} />
//         <meta property="og:description" content={property.description} />
//         <meta
//           property="og:image"
//           content={
//             property.images.length > 0
//               ? property.images[0].url
//               : "/default-image.jpg"
//           }
//         />
//         <meta
//           property="og:url"
//           content={`https://www.votredomaine.com/product/${property.id}`}
//         />
//         <meta property="og:site_name" content="Afrique Avenir IMMO " />
//       </Head>
//       <div className="min-h-screen bg-gray-50">
//         <PageTitle
//           title="Annonce"
//           href="/result"
//           linkCaption="Retour aux annonces"
//         />
//         <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//           {/* Grille principale */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
//             {/* Slider - 2/3 */}
//             {/* Vérifiez s'il y a des images */}
//             {property.images.length > 0 && (
//               <div className="col-span-1 lg:col-span-2 rounded-2xl overflow-hidden shadow-lg">
//                 {/* <ImagesSliderHero
//                 images={property.images.map((img) => img.url)}
//               /> */}
//                 <ImageThumbnails
//                   images={property.images.map((img) => img.url)}
//                 />
//               </div>
//             )}
//             {/* Détails - 1/3  - Prend toute la largeur si pas de slider */}
//             <div
//               className={`col-span-1 ${
//                 property.images.length === 0 ? "lg:col-span-3" : ""
//               } space-y-6`}
//             >
//               {/* Titre et prix */}
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
//                   {property.name}
//                 </h2>
//                 <div className="mt-4 flex items-center gap-4">
//                   <button
//                     onClick={handleShare}
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
//                   >
//                     Partager
//                   </button>
//                   {copySuccess && (
//                     <span className="text-green-600">Lien copié !</span>
//                   )}
//                 </div>
//                 <div className="flex gap-2 text-sm text-gray-600">
//                   <span className="px-2 py-1 bg-blue-100 rounded-full">
//                     {property.status.value}
//                   </span>
//                   <span className="px-2 py-1 bg-green-100 rounded-full">
//                     {property.type.value}
//                   </span>
//                 </div>
//                 <div className="mt-4 flex items-baseline ">
//                   <span className="text-2xl sm:text-3xl font-bold text-primary">
//                     {formatPrice(property.price)}
//                   </span>
//                 </div>
//                 <div className="mt-4 flex items-baseline ">
//                   <p className="">
//                     Réf :{" "}
//                     <span className="text-sm sm:text-sm ">{property.id}</span>
//                   </p>
//                 </div>
//               </Card>

//               {/* Description */}
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 {/* <Title title="Description" /> */}

//                 {/* Ajout Adrien */}
//                 <div>
//                   <Title title="Description" shars="Partager" />
//                 </div>
//                 <div className=" mt-4">
//                   {/* <FeatureCard icon="📝" label="" value={property.description} /> */}
//                   <DescriptionCard description={property.description} />
//                 </div>
//                 {/* Ajout Adrien */}
//                 <ShareButtons
//                   url={currentUrl}
//                   title={`Propriété ${params.id}`}
//                 />
//               </Card>

//               {/* Caractéristiques */}
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <Title title="Caractéristiques" />
//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <FeatureCard
//                     icon="🛏️"
//                     label="Chambre(s)"
//                     value={property.feature?.bedrooms}
//                   />
//                   <FeatureCard
//                     icon="🚿"
//                     label="Salle(s) de bain"
//                     value={property.feature?.bathrooms}
//                   />
//                   <FeatureCard
//                     icon="🚗"
//                     label="Parking"
//                     value={property.feature?.parkingSpots}
//                   />
//                   <FeatureCard
//                     icon="📏"
//                     label="Surface"
//                     value={`${property.feature?.area} m²`}
//                   />
//                   {/* Nouveaux attributs */}
//                   <FeatureCard
//                     icon="🏊‍♂️"
//                     label="Piscine"
//                     value={property.feature?.hasSwimmingPool ? "Oui" : "Non"}
//                   />
//                   <FeatureCard
//                     icon="🌳"
//                     label="Jardin/Cour"
//                     value={property.feature?.hasGardenYard ? "Oui" : "Non"}
//                   />
//                   <FeatureCard
//                     icon="☀️"
//                     label="Balcon/Terrasse"
//                     value={property.feature?.hasBalcony ? "Oui" : "Non"}
//                   />
//                 </div>
//               </Card>

//               {/* Adresse */}
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <Title title="Adresse" />
//                 <div className="space-y-3 mt-4">
//                   <Attribute
//                     icon="🌍"
//                     label="Pays"
//                     value={property.location?.state}
//                   />
//                   <Attribute
//                     icon="🗺️"
//                     label="Région"
//                     value={property.location?.region}
//                   />
//                   <Attribute
//                     icon="🏘️"
//                     label="Ville"
//                     value={property.location?.city}
//                   />
//                   <Attribute
//                     icon="📍"
//                     label="Adresse"
//                     value={property.location?.streetAddress}
//                   />

//                   <Attribute
//                     icon="📮"
//                     label="Code postal"
//                     value={property.location?.zip}
//                   />
//                   <Attribute
//                     icon="ℹ️"
//                     label="Informations"
//                     value={property.location?.landmark}
//                   />
//                 </div>
//               </Card>

//               {/* Contact */}
//               <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                 <Title title="Contact" />
//                 <div className="space-y-3 mt-4">
//                   <Attribute
//                     icon="👤"
//                     label="Nom"
//                     value={property.contact?.name}
//                   />
//                   <Attribute
//                     icon="📧"
//                     label="Email"
//                     value={property.contact?.email}
//                   />
//                   <Attribute
//                     icon="📱"
//                     label="Téléphone"
//                     value={property.contact?.phone}
//                   />
//                 </div>
//               </Card>

//               {/* Vidéos */}
//               {property.videos.length > 0 && (
//                 <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
//                   <Title title="Vidéos" />
//                   <div className="grid grid-cols-1 gap-4 mt-4">
//                     {property.videos.map((video) => (
//                       <div
//                         key={video.id}
//                         className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//                       >
//                         <iframe
//                           className="w-full h-full"
//                           src={transformToEmbedUrl(video.url)}
//                           title={`Vidéo ${video.id}`}
//                           allowFullScreen
//                           aria-label={`Vidéo ${video.id}`}
//                         ></iframe>
//                       </div>
//                     ))}
//                   </div>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PropertyPage;

// // const Title = ({ title }: { title: string }) => (
// //   <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
// //     {title}
// //   </h2>
// // );

// // Ajout Adrien
// const Title = ({ title, shars }: { title: string; shars: string }) => {
//   if (title === "Description") {
//     return (
//       <h2 className="text-xl font-bold text-gray-800 w-full flex gap-16  pb-2 border-b border-gray-200">
//         {title}
//         {shars && <span>{shars}</span>}
//       </h2>
//     );
//   } else {
//     return (
//       <h2 className="text-xl font-bold text-gray-800 w-full flex gap-16  pb-2 border-b border-gray-200">
//         {title}
//       </h2>
//     );
//   }
// };

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

import DescriptionCard from "@/app/components/DescriptionCard ";
import { ImagesSliderHero } from "@/app/components/ImageSliderHero";
import ImageThumbnails from "@/app/components/ImageThumbnailsProps";
import PageTitle from "@/app/components/pageTitle";
import ShareButtons from "@/app/components/ShareButtons";
import { formatPrice } from "@/lib/formatPrice";
import prisma from "@/lib/prisma";
import { Card, Image } from "@nextui-org/react";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const PropertyPage = async ({ params }: Props) => {
  const property = await prisma.property.findUnique({
    where: {
      id: +params.id,
    },
    include: {
      status: true,
      type: true,
      feature: true,
      location: true,
      contact: true,
      images: true,
      videos: true,
    },
  });

  if (!property) return notFound();

  const transformToEmbedUrl = (url: string): string => {
    const urlObj = new URL(url);
    if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
    }
    return url;
  };

  // const getCurrentUrl = (): string => {
  //   try {
  //     // Get the current URL
  //     const currentUrl =
  //       typeof window !== "undefined" ? window.location.href : "";

  //     // Extract the path from the current URL
  //     const urlObject = new URL(currentUrl);
  //     const path = urlObject.pathname;

  //     // Construct the full URL using the path and the origin
  //     const origin =
  //       typeof window !== "undefined" ? window.location.origin : "";
  //     return `${origin}${path}`;
  //   } catch (error) {
  //     // If the current URL is not valid, return an empty string
  //     return "";
  //   }
  // };
  // const currentUrl = getCurrentUrl();

  // const currentUrl =
  //   typeof window !== "undefined"
  //     ? `${window.location.origin}/property/${params.id}`
  //     : `http://localhost:3000/property/${params.id}`;

  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/property/${params.id}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle
        title="Annonce"
        href="/result"
        linkCaption="Retour aux annonces"
      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          {/* Slider - 2/3 */}
          {/* Vérifiez s'il y a des images */}
          {property.images.length > 0 && (
            <div className="col-span-1 lg:col-span-2 rounded-2xl overflow-hidden shadow-lg">
              {/* <ImagesSliderHero
                images={property.images.map((img) => img.url)}
              /> */}
              <ImageThumbnails images={property.images.map((img) => img.url)} />
            </div>
          )}
          {/* Détails - 1/3  - Prend toute la largeur si pas de slider */}
          <div
            className={`col-span-1 ${
              property.images.length === 0 ? "lg:col-span-3" : ""
            } space-y-6`}
          >
            {/* Titre et prix */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
                {property.name}
              </h2>

              <div className="flex gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 rounded-full">
                  {property.status.value}
                </span>
                <span className="px-2 py-1 bg-green-100 rounded-full">
                  {property.type.value}
                </span>
              </div>
              <div className="mt-4 flex items-baseline ">
                <span className="text-2xl sm:text-3xl font-bold text-primary">
                  {formatPrice(property.price)}
                </span>
              </div>
              <div className="mt-4 flex items-baseline ">
                <p className="">
                  Réf :{" "}
                  <span className="text-sm sm:text-sm ">{property.id}</span>
                </p>
              </div>
            </Card>

            {/* Partager */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Title title="Partager" />
              <div className=" mt-4">
                <ShareButtons
                  url={currentUrl}
                  title={`Découvrez cette propriété : ${property.name}`}
                  description={property.description}
                />
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Title title="Description" />
              <div className=" mt-4">
                {/* <FeatureCard icon="📝" label="" value={property.description} /> */}
                <DescriptionCard description={property.description} />
              </div>
            </Card>

            {/* Caractéristiques */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Title title="Caractéristiques" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FeatureCard
                  icon="🛏️"
                  label="Chambre(s)"
                  value={property.feature?.bedrooms}
                />
                <FeatureCard
                  icon="🚿"
                  label="Salle(s) de bain"
                  value={property.feature?.bathrooms}
                />
                <FeatureCard
                  icon="🚗"
                  label="Parking"
                  value={property.feature?.parkingSpots}
                />
                <FeatureCard
                  icon="📏"
                  label="Surface"
                  value={`${property.feature?.area} m²`}
                />
                {/* Nouveaux attributs */}
                <FeatureCard
                  icon="🏊‍♂️"
                  label="Piscine"
                  value={property.feature?.hasSwimmingPool ? "Oui" : "Non"}
                />
                <FeatureCard
                  icon="🌳"
                  label="Jardin/Cour"
                  value={property.feature?.hasGardenYard ? "Oui" : "Non"}
                />
                <FeatureCard
                  icon="☀️"
                  label="Balcon/Terrasse"
                  value={property.feature?.hasBalcony ? "Oui" : "Non"}
                />
              </div>
            </Card>

            {/* Adresse */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Title title="Adresse" />
              <div className="space-y-3 mt-4">
                <Attribute
                  icon="🌍"
                  label="Pays"
                  value={property.location?.state}
                />
                <Attribute
                  icon="🗺️"
                  label="Région"
                  value={property.location?.region}
                />
                <Attribute
                  icon="🏘️"
                  label="Ville"
                  value={property.location?.city}
                />
                <Attribute
                  icon="📍"
                  label="Adresse"
                  value={property.location?.streetAddress}
                />

                <Attribute
                  icon="📮"
                  label="Code postal"
                  value={property.location?.zip}
                />
                <Attribute
                  icon="ℹ️"
                  label="Informations"
                  value={property.location?.landmark}
                />
              </div>
            </Card>

            {/* Contact */}
            <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <Title title="Contact" />
              <div className="space-y-3 mt-4">
                <Attribute
                  icon="👤"
                  label="Nom"
                  value={property.contact?.name}
                />
                <Attribute
                  icon="📧"
                  label="Email"
                  value={property.contact?.email}
                />
                <Attribute
                  icon="📱"
                  label="Téléphone"
                  value={property.contact?.phone}
                />
              </div>
            </Card>

            {/* Vidéos */}
            {property.videos.length > 0 && (
              <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <Title title="Vidéos" />
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {property.videos.map((video) => (
                    <div
                      key={video.id}
                      className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <iframe
                        className="w-full h-full"
                        src={transformToEmbedUrl(video.url)}
                        title={`Vidéo ${video.id}`}
                        allowFullScreen
                        aria-label={`Vidéo ${video.id}`}
                      ></iframe>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;

const Title = ({ title }: { title: string }) => (
  <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-200">
    {title}
  </h2>
);

const FeatureCard = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string | number;
}) => (
  <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center gap-2">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="font-semibold text-gray-800">{value || "N/A"}</p>
      </div>
    </div>
  </div>
);

const Attribute = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string | number;
}) => (
  <div className="flex items-center gap-3">
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium text-gray-800">{value || "N/A"}</p>
    </div>
  </div>
);
