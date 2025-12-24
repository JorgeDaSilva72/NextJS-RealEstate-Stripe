import prisma from "@/lib/prisma";
import { AppointmentState } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import PropertiesGrid from "./_components/PropertiesGrid";
import { redirect } from "next/navigation";

const PAGE_SIZE = 12;

interface Props {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const PropertiesPage = async ({ params, searchParams }: Props) => {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect(`/${params.locale}/api/auth/login`);
  }

  const pagenum = searchParams.pagenum ?? 1;
  // Fetch ALL user properties regardless of isActive or publishedAt status
  const propertiesPromise = prisma.property.findMany({
    where: {
      userId: user.id, // Only filter by userId - show all user's properties
    },
    include: {
      type: true,
      status: true,
      images: {
        orderBy: [
          { isMain: "desc" },
          { displayOrder: "asc" },
          { createdAt: "asc" },
        ],
        // Take all images for the property card to show multiple if needed
        take: 5,
      },
      location: {
        include: {
          city: {
            include: {
              translations: {
                take: 1,
              },
            },
          },
        },
      },
      feature: true,
      appointments: {
        where: { state: AppointmentState.PENDING },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: (+pagenum - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const totalPropertiesPromise = prisma.property.count({
    where: {
      userId: user.id,
    },
  });

  const [properties, totalProperties] = await Promise.all([
    propertiesPromise,
    totalPropertiesPromise,
  ]);

  // Transform properties to match PropertiesGrid interface
  const serializedProperties = properties.map((prop) => {
    // Convert Decimal latitude/longitude to numbers
    const lat = prop.location?.latitude
      ? typeof prop.location.latitude === "number"
        ? prop.location.latitude
        : Number(prop.location.latitude)
      : null;
    const lng = prop.location?.longitude
      ? typeof prop.location.longitude === "number"
        ? prop.location.longitude
        : Number(prop.location.longitude)
      : null;

    return {
      id: prop.id,
      name: prop.name,
      price: prop.price,
      currency: prop.currency,
      images: prop.images.map(img => ({ url: img.url, isMain: img.isMain })),
      type: { value: prop.type?.code || "" },
      status: { value: prop.status?.code || "" },
      location: prop.location ? {
        city: prop.location.city ? {
          translations: prop.location.city.translations || []
        } : undefined,
        streetAddress: prop.location.streetAddress || undefined,
      } : undefined,
      feature: prop.feature ? {
        bedrooms: prop.feature.bedrooms || undefined,
        bathrooms: prop.feature.bathrooms || undefined,
        area: prop.feature.area ? Number(prop.feature.area) : undefined,
      } : undefined,
      appointments: prop.appointments || [],
    };
  });

  const totalPages = Math.ceil(totalProperties / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertiesGrid
          properties={serializedProperties}
          totalPages={totalPages}
          currentPage={+pagenum}
        />
      </div>
    </div>
  );
};

export default PropertiesPage;
