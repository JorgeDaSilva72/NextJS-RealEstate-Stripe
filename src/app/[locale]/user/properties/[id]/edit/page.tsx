// import prisma from "@/lib/prisma";
// import AddPropertyForm from "../../add/_components/AddPropertyForm";
// import { notFound, redirect } from "next/navigation";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// interface Props {
//   params: { id: string };
// }

// const EditPropertyPage = async ({ params }: Props) => {
//   const [propertyTypes, propertyStatuses, property] = await Promise.all([
//     prisma.propertyType.findMany(),
//     prisma.propertyStatus.findMany(),
//     prisma.property.findUnique({
//       where: {
//         id: +params.id,
//       },
//       include: {
//         location: true,
//         feature: true,
//         contact: true,
//         images: true,
//         videos: true,
//       },
//     }),
//   ]);

//   const { getUser } = getKindeServerSession();
//   const user = await getUser();

//   if (!property) return notFound();
//   if (!user || property.userId !== user.id) redirect("/unauthorized");
//   return (
//     <AddPropertyForm
//       types={propertyTypes}
//       statuses={propertyStatuses}
//       property={property}
//       isEdit={true}
//     />
//   );
// };

// export default EditPropertyPage;
//---------------------------------------
// JhnRavelo fixer le bug de la suppression de l'image.

import prisma from "@/lib/prisma";
import AddPropertyForm from "../../add/_components/AddPropertyForm";
import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserById } from "@/lib/actions/user";

interface Props {
  params: { id: string };
}

const EditPropertyPage = async ({ params }: Props) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  // Vérifiez si l'utilisateur est valide
  const dbUser = await getUserById(user ? user.id : "");
  if (!dbUser || !dbUser.id) {
    throw new Error("Something went wrong with authentication");
  }

  const [propertyTypes, propertyStatuses, property, plan] = await Promise.all([
    prisma.propertyType.findMany(),
    prisma.propertyStatus.findMany(),
    prisma.property.findUnique({
      where: {
        id: +params.id,
      },
      include: {
        location: true,
        feature: true,
        contact: true,
        images: true,
        videos: true,
      },
    }),
    prisma.subscriptions.findFirst({
      where: { userId: dbUser?.id },
      include: { plan: true },
    }),
  ]);

  if (!property) return notFound();
  if (!user || property.userId !== user.id) redirect("/unauthorized");
  return (
    <AddPropertyForm
      types={propertyTypes}
      statuses={propertyStatuses}
      property={property}
      planDetails={plan?.plan}
      isEdit={true}
    />
  );
};

export default EditPropertyPage;
