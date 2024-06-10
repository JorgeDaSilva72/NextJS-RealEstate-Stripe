import { ImagesSlider } from "@/app/components/ImageSlider";
import PageTitle from "@/app/components/pageTitle";
import prisma from "@/lib/prisma";
import { Card } from "@nextui-org/react";
import { notFound } from "next/navigation";
const images = [1, 2, 3, 4, 5, 6].map((image) => `/images/${image}.jpg`);
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
      feature: true,
      location: true,
      contact: true,
      images: true,
    },
  });
  if (!property) return notFound();
  return (
    <div>
      <PageTitle title="Annonce" href="/" linkCaption="Retour aux annonces" />
      <div className="p-4">
        <h2 className="text-2xl font-bold text-primary my-5">
          {property.name}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="col-span-2">
            <ImagesSlider images={property.images.map((img) => img.url)} />
            <h2 className="text-2xl font-bold text-gray-700 mt-7">
              {property.price} <span className="text-blue-700">FCFA</span> /{" "}
              {property.status.value}
            </h2>

            <p className="text-sm text-slate-600 mt-7">
              {property.description}
            </p>
          </div>
          <Card className="p-5 flex flex-col gap-1">
            <Title title="Caractéristiques" />
            <Attribute label="Chambre(s)" value={property.feature?.bedrooms} />
            <Attribute
              label="salle(s) de bain"
              value={property.feature?.bathrooms}
            />
            <Attribute
              label="Place(s) de stationnement'"
              value={property.feature?.parkingSpots}
            />
            <Attribute
              label="Superficie en m²"
              value={property.feature?.area}
            />

            <Title title="Adresse" className="mt-7" />
            <Attribute
              label="Adresse"
              value={property.location?.streetAddress}
            />
            <Attribute label="Boîte postale" value={property.location?.zip} />
            <Attribute label="Ville" value={property.location?.city} />

            <Attribute
              label="Informations"
              value={property.location?.landmark}
            />

            <Title title="Détails du contact" className="mt-7" />
            <Attribute label="Nom du contact" value={property.contact?.name} />
            <Attribute label="Email" value={property.contact?.email} />
            <Attribute label="Téléphone" value={property.contact?.phone} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyPage;

const Title = ({ title, className }: { title: string; className?: string }) => (
  <div className={className}>
    <h2 className="text-xl font-bold text-slate-700">{title} </h2>
    <hr className="boreder border-solid border-slate-300" />
  </div>
);

const Attribute = ({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) => (
  <div className="flex justify-between">
    <span className="text-sm text-slate-600">{label}</span>
    <span className="text-sm text-slate-600">{value}</span>
  </div>
);
