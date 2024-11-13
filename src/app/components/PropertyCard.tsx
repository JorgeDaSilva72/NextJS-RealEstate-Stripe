import { Card, Image } from "@nextui-org/react";
import { Prisma } from "@prisma/client";
import Link from "next/link";

interface Props {
  property: Prisma.PropertyGetPayload<{
    select: {
      id: true;
      name: true;
      price: true;
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
    };
  }>;
}

const PropertyCard = ({ property }: Props) => {
  return (
    <Card className="w-72 flex flex-col hover:scale-105" shadow="md">
      {property?.images[0]?.url ? (
        <Image
          radius="none"
          src={
            property?.images[0]?.url
            // property.id === 1
            //   ? property.images[0].url
            //   : `/images/${Math.floor(Math.random() * 9 + 1)}.jpg`
          }
          className="object-fill w-96 h-48"
          alt="image"
        />
      ) : (
        <Image
          radius="none"
          src="/imageNotFound.png"
          className="object-fill w-96 h-48"
          alt="image"
        />
      )}
      <div className="flex flex-col mt-auto">
        <div className="p-4">
          <p className="text-primary-600 text-xl font-bold">{property?.name}</p>
          <p className="text-slate-600">{property?.location?.city}</p>
          <p className="text-slate-600">{property?.location?.state}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-400 p-4 flex justify-between">
          <p className="text-primary-600 text-xl font-bold">
            {property?.price.toLocaleString()}
            <span> €</span>
          </p>
          <Link
            className="hover:text-primary-500 transition-colors"
            href={`/property/${property.id}`}
          >
            Voir détails
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCard;
