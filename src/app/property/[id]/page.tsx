import DescriptionCard from "@/app/components/DescriptionCard ";
import { ImagesSliderHero } from "@/app/components/ImageSliderHero";
import ImageThumbnails from "@/app/components/ImageThumbnailsProps";
import PageTitle from "@/app/components/pageTitle";
import { formatPrice } from "@/lib/formatPrice";
import prisma from "@/lib/prisma";
import { Card, Image } from "@nextui-org/react";
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
