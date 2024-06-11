import prisma from "@/lib/prisma";
import Image from "next/image";
import PropertyCard from "./components/PropertyCard";
import PropertyContainer from "./components/PropertyContainer";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}
export default async function Home({ searchParams }: Props) {
  const propertiesPromise = prisma.property.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      images: {
        select: {
          url: true,
        },
      },
      location: {
        select: {
          city: true,
          state: true,
        },
      },
    },
  });

  const [properties] = await Promise.all([propertiesPromise]);

  return (
    <div>
      <PropertyContainer>
        {properties.map((propertyItem) => (
          <PropertyCard property={propertyItem} key={propertyItem.id} />
        ))}
      </PropertyContainer>
    </div>
  );
}
