import PageTitle from "@/app/components/pageTitle";
import { getUserById } from "@/lib/actions/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ReactNode } from "react";
import SectionTitle from "./_components/sectionTitle";
import { Avatar, Button, Card } from "@nextui-org/react";
import UploadAvatar from "./_components/UploadAvatar";
import Link from "next/link";
import prisma from "@/lib/prisma";

const ProfilePage = async () => {
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
        <PageTitle
          title="Mon Profil"
          linkCaption="Retour à l'accueil"
          href="/"
        />
        <Card className="m-4 p-4 flex flex-col gap-5">
          <SectionTitle title="Informations" />
          <div className="flex">
            <div className="flex flex-col items-center ">
              <Avatar
                className="w-20 h-20"
                src={dbUser?.avatarUrl ?? "/profile.png"}
              />
              <UploadAvatar userId={dbUser?.id!} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Attribute
              title="Nom"
              value={`${dbUser?.firstName} ${dbUser?.lastName}`}
            />
            <Attribute title="Email" value={dbUser?.email} />
            <Attribute
              title="Compte créé le:"
              value={dbUser?.createdAt.toLocaleDateString()}
            />
            <Attribute
              title="Nombre d'annonces"
              value={totalPropertiesCount.toString()}
            />
            <Link href={"/user/properties"}>
              <Button color="secondary">Voir mes annonces</Button>
            </Link>
          </div>
        </Card>

        <Card className="m-4 p-4 flex flex-col gap-5">
          <SectionTitle title="Abonnement" />
          {userSubscription ? (
            <div>
              <Attribute
                title="Abonnement"
                value={userSubscription?.plan?.name}
              />
              <Attribute
                title="Prix en F CFA"
                value={userSubscription?.plan?.price}
              />
              <Attribute
                title="Acheté le"
                value={userSubscription?.createdAt.toLocaleDateString()}
              />
              <Attribute
                title="Expire le"
                value={
                  <span
                    className={
                      isSubscriptionExpired ? "text-red-500" : "text-slate-600"
                    }
                  >
                    {userSubscription?.endDate.toLocaleDateString()}
                  </span>
                }
              />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-center">Aucun abonnement trouvé !</p>
            </div>
          )}

          {(isSubscriptionExpired || !userSubscription) && (
            <Link href={"/user/subscription"}>
              <Button color="secondary">Achetez votre abonnement</Button>
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
