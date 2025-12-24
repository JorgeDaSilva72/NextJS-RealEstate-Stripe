import { getUserById } from "@/lib/actions/user";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Calendar, 
  Home, 
  Crown, 
  CreditCard, 
  Edit, 
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import UploadAvatar from "./_components/UploadAvatar";

const ProfilePage = async () => {
  const t = await getTranslations("ProfilePage");
  const locale = await getLocale();

  const getLocalizedText = (field: any, locale: string): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object") {
      return (
        field[locale] || field.fr || field.en || Object.values(field)[0] || ""
      );
    }
    return String(field);
  };

  try {
    // Get session and user
    const { getUser } = await getKindeServerSession();
    const user = await getUser();

    // Redirect to login if not authenticated
    if (!user || !user.id) {
      redirect('/api/auth/login');
    }

    // Verify user is valid
    const dbUser = await getUserById(user.id);
    if (!dbUser || !dbUser.id) {
      redirect('/api/auth/login');
    }

    // Get subscription info
    const userSubscription = await prisma.subscriptions.findFirst({
      where: { userId: dbUser?.id },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });

    // Check if subscription expired
    const currentDate = new Date();
    const isSubscriptionExpired = userSubscription?.endDate
      ? new Date(userSubscription.endDate) < currentDate
      : true;

    const totalPropertiesCount = await prisma.property.count({
      where: {
        userId: user?.id,
      },
    });

    const firstName = getLocalizedText((dbUser as any)?.firstname, locale);
    const lastName = getLocalizedText((dbUser as any)?.lastname, locale);
    const fullName = `${firstName} ${lastName}`.trim() || dbUser.email?.split("@")[0] || "User";
    const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="absolute inset-0 bg-[url('/Hero1.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome")}
              </Button>
            </Link>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                  <AvatarImage 
                    src={dbUser?.avatarUrl ?? "/profile.png"} 
                    alt={fullName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                  <UploadAvatar 
                    userId={dbUser?.id!} 
                    userAvatar={dbUser?.avatarUrl} 
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{fullName}</h1>
              <p className="text-gray-300 mb-4">{dbUser?.email}</p>
              <div className="flex gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-1">
                  <Home className="mr-2 h-4 w-4" />
                  {totalPropertiesCount} {totalPropertiesCount === 1 ? "propriété" : "propriétés"}
                </Badge>
                {userSubscription && !isSubscriptionExpired && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 px-4 py-1">
                    <Crown className="mr-2 h-4 w-4" />
                    {userSubscription.plan?.namePlan}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Personal Information */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-5 w-5" />
                  Informations Personnelles
                </CardTitle>
                <CardDescription className="text-white/80">
                  Vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <InfoRow
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    label="Nom complet"
                    value={fullName}
                  />
                  <InfoRow
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    label="Email"
                    value={dbUser?.email || "N/A"}
                  />
                  <InfoRow
                    icon={<Calendar className="h-5 w-5 text-gray-400" />}
                    label="Compte créé le"
                    value={dbUser?.createdAt.toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  />
                  <InfoRow
                    icon={<Home className="h-5 w-5 text-gray-400" />}
                    label="Nombre d'annonces"
                    value={totalPropertiesCount.toString()}
                  />
                  <Link href="/user/properties" className="block mt-6">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                      <Home className="mr-2 h-4 w-4" />
                      Voir mes annonces
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Subscription */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Crown className="h-5 w-5" />
                  Abonnement
                </CardTitle>
                <CardDescription className="text-white/80">
                  Détails de votre abonnement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {userSubscription ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Plan actuel</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {userSubscription?.plan?.namePlan || "N/A"}
                        </p>
                      </div>
                      {!isSubscriptionExpired ? (
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500" />
                      )}
                    </div>
                    
                    <InfoRow
                      icon={<CreditCard className="h-5 w-5 text-gray-400" />}
                      label="Prix"
                      value={`${userSubscription?.plan?.price || 0} €`}
                    />
                    <InfoRow
                      icon={<Calendar className="h-5 w-5 text-gray-400" />}
                      label="Acheté le"
                      value={userSubscription?.createdAt.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    />
                    <div>
                      <InfoRow
                        icon={<AlertCircle className={`h-5 w-5 ${isSubscriptionExpired ? 'text-red-400' : 'text-green-400'}`} />}
                        label="Expire le"
                        value={
                          <span className={isSubscriptionExpired ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
                            {userSubscription?.endDate ? new Date(userSubscription.endDate).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : "N/A"}
                          </span>
                        }
                      />
                      {isSubscriptionExpired && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400">
                            ⚠️ Votre abonnement a expiré. Renouvelez-le pour continuer à utiliser nos services.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Link href="/user/subscription">
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white">
                        <Edit className="mr-2 h-4 w-4" />
                        {isSubscriptionExpired ? "Renouveler l'abonnement" : "Changer l'abonnement"}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                      <Crown className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
                      Aucun abonnement trouvé
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                      Abonnez-vous maintenant pour profiter de tous nos services
                    </p>
                    <Link href="/user/subscription">
                      <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white">
                        <Crown className="mr-2 h-4 w-4" />
                        Acheter un abonnement
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Propriétés</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalPropertiesCount}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("subscriptionStatus")}</p>
                    <p className={`text-2xl font-bold ${userSubscription && !isSubscriptionExpired ? 'text-green-600' : 'text-red-600'}`}>
                      {userSubscription && !isSubscriptionExpired ? t("active") : t("inactive")}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${userSubscription && !isSubscriptionExpired ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                    {userSubscription && !isSubscriptionExpired ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t("memberSince")}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Date(dbUser?.createdAt).getFullYear()}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('[ProfilePage] Error:', error);
    redirect('/api/auth/login');
  }
};

// InfoRow component for displaying key-value pairs
const InfoRow = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: ReactNode; 
  label: string; 
  value: ReactNode;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
    <div className="mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base text-gray-900 dark:text-white font-semibold mt-1">{value}</p>
    </div>
  </div>
);

export default ProfilePage;
