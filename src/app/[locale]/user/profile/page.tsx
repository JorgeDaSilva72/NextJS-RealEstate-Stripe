// // Cedrico : fixer upload avatar et supprimer l'ancien photo 05/12/2024

// import { getUserById } from "@/lib/actions/user";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { ReactNode } from "react";
// import SectionTitle from "./_components/sectionTitle";
// import { Avatar, Button, Card } from "@nextui-org/react";
// import UploadAvatar from "./_components/UploadAvatar";
// import Link from "next/link";
// import prisma from "@/lib/prisma";
// import PageTitle from "../../components/pageTitle";

// const ProfilePage = async () => {
//   try {
//     // Obtenez la session et l'utilisateur
//     const { getUser } = await getKindeServerSession();
//     const user = await getUser();

//     // Vérifiez si l'utilisateur est valide
//     const dbUser = await getUserById(user ? user.id : "");
//     if (!dbUser || !dbUser.id) {
//       throw new Error("Something went wrong with authentication");
//     }

//     // Cherchez le plan d'abonnement de l'utilisateur dans la base de données
//     const userSubscription = await prisma.subscriptions.findFirst({
//       where: { userId: dbUser?.id },
//       include: { plan: true },
//       orderBy: { createdAt: "desc" },
//     });

//     // Vérifiez si l'abonnement a expiré
//     const currentDate = new Date();
//     const isSubscriptionExpired = userSubscription?.endDate
//       ? new Date(userSubscription.endDate) < currentDate
//       : true;

//     const totalPropertiesCount = await prisma.property.count({
//       where: {
//         userId: user?.id,
//       },
//     });

//     return (
//       <div>
//         <PageTitle
//           title="Mon Profil"
//           linkCaption="Retour à l'accueil"
//           href="/"
//         />
//         <Card className="m-4 p-6 flex flex-col gap-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
//           <SectionTitle title="Informations" />
//           <div className="flex flex-col items-center gap-4">
//             <Avatar
//               className="w-24 h-24"
//               src={dbUser?.avatarUrl ?? "/profile.png"}
//             />
//             <UploadAvatar userId={dbUser?.id!} userAvatar={dbUser?.avatarUrl} />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             <Attribute
//               title="Nom"
//               value={`${dbUser?.firstName} ${dbUser?.lastName}`}
//             />
//             <Attribute title="Email" value={dbUser?.email} />
//             <Attribute
//               title="Compte créé le:"
//               value={dbUser?.createdAt.toLocaleDateString()}
//             />
//             <Attribute
//               title="Nombre d'annonces"
//               value={totalPropertiesCount.toString()}
//             />
//             <Link href={"/user/properties"}>
//               <Button
//                 color="secondary"
//                 className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow"
//               >
//                 Voir mes annonces
//               </Button>
//             </Link>
//           </div>
//         </Card>

//         <Card className="m-4 p-6 flex flex-col gap-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
//           <SectionTitle title="Abonnement" />
//           {userSubscription ? (
//             <div className="space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//                 <Attribute
//                   title="Abonnement"
//                   value={userSubscription?.plan?.namePlan}
//                 />
//                 <Link href={"/user/subscription"}>
//                   <Button
//                     color="secondary"
//                     className="mt-2 sm:mt-0 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow"
//                   >
//                     Changer votre abonnement
//                   </Button>
//                 </Link>
//               </div>
//               <Attribute
//                 title="Prix en euros"
//                 value={`${userSubscription?.plan?.price} €`}
//               />
//               <Attribute
//                 title="Acheté le"
//                 value={userSubscription?.createdAt.toLocaleDateString()}
//               />
//               <Attribute
//                 title="Expire le"
//                 value={
//                   <span
//                     className={
//                       isSubscriptionExpired
//                         ? "text-red-500 font-semibold"
//                         : "text-slate-600"
//                     }
//                   >
//                     {userSubscription?.endDate.toLocaleDateString()}
//                   </span>
//                 }
//               />
//             </div>
//           ) : (
//             <div className="text-center text-gray-600">
//               <p className="font-medium">Aucun abonnement trouvé !</p>
//             </div>
//           )}
//           {(isSubscriptionExpired || !userSubscription) && (
//             <Link href={"/user/subscription"}>
//               <Button
//                 color="secondary"
//                 className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow w-full sm:w-auto mx-auto"
//               >
//                 Achetez votre abonnement
//               </Button>
//             </Link>
//           )}
//         </Card>
//       </div>
//     );
//   } catch (error) {
//     console.log((error as Error).message);
//   }
// };

// export default ProfilePage;

// const Attribute = ({ title, value }: { title: string; value: ReactNode }) => (
//   <div className="flex flex-col text-sm">
//     <span className="text-slate-800 font-semibold">{title}</span>
//     <span className="text-slate-600">{value}</span>
//   </div>
// );

// next-intl avec deepseek
import { getUserById } from "@/lib/actions/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ReactNode } from "react";
import SectionTitle from "./_components/sectionTitle";
import { Avatar, Button, Card } from "@nextui-org/react";
import UploadAvatar from "./_components/UploadAvatar";
import Link from "next/link";
import prisma from "@/lib/prisma";
import PageTitle from "../../components/pageTitle";
import { getTranslations } from "next-intl/server";

const ProfilePage = async () => {
  const t = await getTranslations("ProfilePage");

  try {
    // Obtenez la session et l'utilisateur
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    // Vérifiez si l'utilisateur est valide
    const dbUser = await getUserById(user ? user.id : "");
    if (!dbUser || !dbUser.id) {
      throw new Error("Something went wrong with authentication");
    }

    // Cherchez le plan d'abonnement de l'utilisateur dans la base de données
    const userSubscription = await prisma.subscriptions.findFirst({
      where: { userId: dbUser?.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    // Vérifiez si l'abonnement a expiré
    const currentDate = new Date();
    const isSubscriptionExpired = userSubscription?.endDate
      ? new Date(userSubscription.endDate) < currentDate
      : true;

    const totalPropertiesCount = await prisma.property.count({
      where: {
        userId: user?.id,
      },
    });

    return (
      <div>
        <PageTitle title={t("title")} linkCaption={t("backToHome")} href="/" />
        <Card className="m-4 p-6 flex flex-col gap-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
          <SectionTitle title={t("information")} />
          <div className="flex flex-col items-center gap-4">
            <Avatar
              className="w-24 h-24"
              src={dbUser?.avatarUrl ?? "/profile.png"}
            />
            <UploadAvatar userId={dbUser?.id!} userAvatar={dbUser?.avatarUrl} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Attribute
              title={t("name")}
              value={`${dbUser?.firstName} ${dbUser?.lastName}`}
            />
            <Attribute title={t("email")} value={dbUser?.email} />
            <Attribute
              title={t("accountCreated")}
              value={dbUser?.createdAt.toLocaleDateString()}
            />
            <Attribute
              title={t("numberOfListings")}
              value={totalPropertiesCount.toString()}
            />
            <Link href={"/user/properties"}>
              <Button
                color="secondary"
                className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow"
              >
                {t("viewListings")}
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="m-4 p-6 flex flex-col gap-6 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
          <SectionTitle title={t("subscription")} />
          {userSubscription ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <Attribute
                  title={t("subscription")}
                  value={userSubscription?.plan?.namePlan}
                />
                <Link href={"/user/subscription"}>
                  <Button
                    color="secondary"
                    className="mt-2 sm:mt-0 text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md shadow"
                  >
                    {t("changeSubscription")}
                  </Button>
                </Link>
              </div>
              <Attribute
                title={t("price")}
                value={`${userSubscription?.plan?.price} €`}
              />
              <Attribute
                title={t("purchasedOn")}
                value={userSubscription?.createdAt.toLocaleDateString()}
              />
              <Attribute
                title={t("expiresOn")}
                value={
                  <span
                    className={
                      isSubscriptionExpired
                        ? "text-red-500 font-semibold"
                        : "text-slate-600"
                    }
                  >
                    {userSubscription?.endDate.toLocaleDateString()}
                  </span>
                }
              />
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p className="font-medium">{t("noSubscription")}</p>
            </div>
          )}
          {(isSubscriptionExpired || !userSubscription) && (
            <Link href={"/user/subscription"}>
              <Button
                color="secondary"
                className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow w-full sm:w-auto mx-auto"
              >
                {t("buySubscription")}
              </Button>
            </Link>
          )}
        </Card>
      </div>
    );
  } catch (error) {
    console.log((error as Error).message);
  }
};

export default ProfilePage;

const Attribute = ({ title, value }: { title: string; value: ReactNode }) => (
  <div className="flex flex-col text-sm">
    <span className="text-slate-800 font-semibold">{title}</span>
    <span className="text-slate-600">{value}</span>
  </div>
);
