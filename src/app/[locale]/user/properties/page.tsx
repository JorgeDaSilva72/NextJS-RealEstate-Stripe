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
  const propertiesPromise = prisma.property.findMany({
    where: {
      userId: user.id,
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
        take: 1,
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

  const totalPages = Math.ceil(totalProperties / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PropertiesGrid
          properties={properties}
          totalPages={totalPages}
          currentPage={+pagenum}
        />
      </div>
    </div>
  );
};

export default PropertiesPage;
