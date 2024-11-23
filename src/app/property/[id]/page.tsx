// import { ImagesSliderHero } from "@/app/components/ImageSliderHero";
// import PageTitle from "@/app/components/pageTitle";
// import prisma from "@/lib/prisma";
// import { Card } from "@nextui-org/react";
// import { notFound } from "next/navigation";
// const images = [1, 2, 3, 4, 5, 6].map((image) => `/images/${image}.jpg`);
// interface Props {
//   params: {
//     id: string;
//   };
// }

// const PropertyPage = async ({ params }: Props) => {
//   const property = await prisma.property.findUnique({
//     where: {
//       id: +params.id,
//     },
//     include: {
//       status: true,
//       feature: true,
//       location: true,
//       contact: true,
//       images: true,
//       videos: true,
//     },
//   });
//   if (!property) return notFound();
//   return (
//     <div>
//       <PageTitle title="Annonce" href="/" linkCaption="Retour aux annonces" />
//       <div className="p-4">
//         <h2 className="text-2xl font-bold text-primary my-5">
//           {property.name}
//         </h2>
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           <div className="col-span-1 lg:col-span-2 ">
//             <ImagesSliderHero images={property.images.map((img) => img.url)} />
//             <h2 className="text-2xl font-bold text-gray-700 mt-7">
//               {property.price} <span className="text-blue-700">F CFA</span> /{" "}
//               {property.status.value}
//             </h2>

//             <p className="text-sm text-slate-600 mt-7">
//               {property.description}
//             </p>
//           </div>
//           <Card className="p-5 flex flex-col gap-1">
//             <Title title="Caractéristiques" />
//             <Attribute label="Chambre(s)" value={property.feature?.bedrooms} />
//             <Attribute
//               label="salle(s) de bain"
//               value={property.feature?.bathrooms}
//             />
//             <Attribute
//               label="Place(s) de stationnement'"
//               value={property.feature?.parkingSpots}
//             />
//             <Attribute
//               label="Superficie en m²"
//               value={property.feature?.area}
//             />

//             <Title title="Adresse" className="mt-7" />
//             <Attribute
//               label="Adresse"
//               value={property.location?.streetAddress}
//             />
//             <Attribute label="Boîte postale" value={property.location?.zip} />
//             <Attribute label="Ville" value={property.location?.city} />

//             <Attribute
//               label="Informations"
//               value={property.location?.landmark}
//             />

//             <Title title="Détails du contact" className="mt-7" />
//             <Attribute label="Nom du contact" value={property.contact?.name} />
//             <Attribute label="Email" value={property.contact?.email} />
//             <Attribute label="Téléphone" value={property.contact?.phone} />
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyPage;

// const Title = ({ title, className }: { title: string; className?: string }) => (
//   <div className={className}>
//     <h2 className="text-xl font-bold text-slate-700">{title} </h2>
//     <hr className="boreder border-solid border-slate-300" />
//   </div>
// );

// const Attribute = ({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | number;
// }) => (
//   <div className="flex justify-between">
//     <span className="text-sm text-slate-600">{label}</span>
//     <span className="text-sm text-slate-600">{value}</span>
//   </div>
// );

// -----------------------------------------------------------------------------
// import { ImagesSliderHero } from "@/app/components/ImageSliderHero";
// import PageTitle from "@/app/components/pageTitle";
// import prisma from "@/lib/prisma";
// import { Card } from "@nextui-org/react";
// import { notFound } from "next/navigation";
// const images = [1, 2, 3, 4, 5, 6].map((image) => `/images/${image}.jpg`);
// interface Props {
//   params: {
//     id: string;
//   };
// }
// const PropertyPage = async ({ params }: Props) => {
//   const property = await prisma.property.findUnique({
//     where: {
//       id: +params.id,
//     },
//     include: {
//       status: true,
//       feature: true,
//       location: true,
//       contact: true,
//       images: true,
//       videos: true, // Inclure les vidéos associées
//     },
//   });
//   if (!property) return notFound();

//   const transformToEmbedUrl = (url: string): string => {
//     const urlObj = new URL(url);
//     if (urlObj.hostname === "www.youtube.com" && urlObj.searchParams.has("v")) {
//       return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}`;
//     }
//     return url; // Retourne l'URL originale si ce n'est pas une vidéo YouTube
//   };

//   return (
//     <div>
//       <PageTitle
//         title="Annonce"
//         href="/result"
//         linkCaption="Retour aux annonces"
//       />
//       <div className="p-4">
//         {/* Structure de la grille principale */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           {/* Section 2/3 : Slider */}
//           <div className="col-span-1 lg:col-span-2">
//             <ImagesSliderHero images={property.images.map((img) => img.url)} />
//           </div>

//           {/* Section 1/3 : Caractéristiques, contact et vidéos */}
//           <div className="col-span-1 flex flex-col gap-5">
//             <h2 className="text-2xl font-bold text-primary my-5">
//               {property.name}
//             </h2>
//             <h2 className="text-2xl font-bold text-gray-700 mt-7">
//               {property.price} <span className="text-blue-700">€</span> /{" "}
//               {property.status.value}
//             </h2>

//             {/* Caractéristiques et contact */}
//             <Card className="p-5 flex flex-col gap-1">
//               <Title title="Caractéristiques" />
//               <Attribute
//                 label="Chambre(s)"
//                 value={property.feature?.bedrooms}
//               />
//               <Attribute
//                 label="salle(s) de bain"
//                 value={property.feature?.bathrooms}
//               />
//               <Attribute
//                 label="Place(s) de stationnement"
//                 value={property.feature?.parkingSpots}
//               />
//               <Attribute
//                 label="Superficie en m²"
//                 value={property.feature?.area}
//               />

//               <Title title="Adresse" className="mt-7" />
//               <Attribute
//                 label="Adresse"
//                 value={property.location?.streetAddress}
//               />
//               <Attribute label="Boîte postale" value={property.location?.zip} />
//               <Attribute label="Ville" value={property.location?.city} />

//               <Attribute
//                 label="Informations"
//                 value={property.location?.landmark}
//               />

//               <Title title="Détails du contact" className="mt-7" />
//               <Attribute
//                 label="Nom du contact"
//                 value={property.contact?.name}
//               />
//               <Attribute label="Email" value={property.contact?.email} />
//               <Attribute label="Téléphone" value={property.contact?.phone} />
//             </Card>

//             {/* Section vidéos */}
//             <div className="p-5 border rounded-md">
//               <h2 className="text-2xl font-bold text-gray-700">
//                 Vidéos associées
//               </h2>
//               {property.videos.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
//                   {property.videos.map((video) => (
//                     <div key={video.id} className="aspect-w-16 aspect-h-9">
//                       <iframe
//                         className="w-full h-full"
//                         src={transformToEmbedUrl(video.url)}
//                         title={`Vidéo ${video.id}`}
//                         allowFullScreen
//                       ></iframe>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-sm text-slate-600 mt-5">
//                   Aucune vidéo disponible.
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default PropertyPage;

// const Title = ({ title, className }: { title: string; className?: string }) => (
//   <div className={className}>
//     <h2 className="text-xl font-bold text-slate-700">{title} </h2>
//     <hr className="boreder border-solid border-slate-300" />
//   </div>
// );

// const Attribute = ({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string | number;
// }) => (
//   <div className="flex justify-between">
//     <span className="text-sm text-slate-600">{label}</span>
//     <span className="text-sm text-slate-600">{value}</span>
//   </div>
// );

// -----------------------------------------------------------------------------

import { ImagesSliderHero } from "@/app/components/ImageSliderHero";
import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { Card } from "@nextui-org/react";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
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

  return (
    <div>
      <PageTitle
        title="Annonce"
        href="/result"
        linkCaption="Retour aux annonces"
      />
      <div className="p-4">
        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Slider - 2/3 */}
          <div className="col-span-1 lg:col-span-2">
            <ImagesSliderHero images={property.images.map((img) => img.url)} />
          </div>

          {/* Détails - 1/3 */}
          <div className="col-span-1 flex flex-col gap-5">
            {/* Titre et prix */}
            <div>
              <h2 className="">
                <span className="">
                  <span className="text-3xl font-bold text-primary">
                    {property.name}
                  </span>
                </span>
              </h2>
              <h2 className="text-xl font-semibold text-gray-700 mt-3">
                <span className="text-3xl font-bold text-primary">
                  {property.price}
                </span>{" "}
                <span className="text-blue-700">€</span> /{" "}
                {property.status.value}/ {property.type.value}
              </h2>
            </div>

            {/* Caractéristiques et contact */}
            <Card className="p-5 flex flex-col gap-4">
              <Title title="Caractéristiques" />
              <div className="grid grid-cols-2 gap-2">
                <Attribute
                  label="Chambre(s)"
                  value={property.feature?.bedrooms}
                />
                <Attribute
                  label="Salle(s) de bain"
                  value={property.feature?.bathrooms}
                />
                <Attribute
                  label="Place(s) de stationnement"
                  value={property.feature?.parkingSpots}
                />
                <Attribute
                  label="Superficie (m²)"
                  value={property.feature?.area}
                />
              </div>

              <Title title="Adresse" className="mt-7" />
              <div className="grid grid-cols-2 gap-2">
                <Attribute
                  label="Adresse"
                  value={property.location?.streetAddress}
                />
                <Attribute label="Ville" value={property.location?.city} />
                <Attribute label="Code postal" value={property.location?.zip} />
                <Attribute
                  label="Informations"
                  value={property.location?.landmark}
                />
              </div>

              <Title title="Contact" className="mt-7" />
              <Attribute label="Nom" value={property.contact?.name} />
              <Attribute label="Email" value={property.contact?.email} />
              <Attribute label="Téléphone" value={property.contact?.phone} />
            </Card>

            {/* Vidéos */}
            <div className="p-5 border rounded-md">
              <h2 className="text-xl font-bold text-gray-700">
                Vidéos associées
              </h2>
              {property.videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  {property.videos.map((video) => (
                    <div
                      key={video.id}
                      className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md"
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
              ) : (
                <p className="text-sm text-slate-600 mt-5">
                  Aucune vidéo disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;

/* Titres pour les sections */
const Title = ({ title, className }: { title: string; className?: string }) => (
  <div className={className}>
    <h2 className="text-xl font-bold text-slate-700">{title}</h2>
    <hr className="border-t border-slate-300 mt-2" />
  </div>
);

/* Attribut générique */
const Attribute = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex justify-between">
    <span className="text-sm text-slate-600 font-medium">{label}</span>
    <span className="text-sm text-slate-600">{value || "N/A"}</span>
  </div>
);
