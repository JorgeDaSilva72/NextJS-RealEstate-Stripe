import React from "react";
import { toast } from "react-toastify";
import prisma from "@/lib/prisma";
import { retryOperation } from "@/utils/retry";
import { cacheWithTTL, getCachedValue } from "@/lib/cache";
import SigningAvatar from "./SigningAvatar";
import UserProfilePanel from "./UserProfilePanel";
import { KindeUser } from "@/types/kinde";
// import { User } from "@/types/auth";
import { User as PrismaUser } from "@prisma/client";

// interface AuthenticatedContentProps {
//   user: {
//     id: string;
//     // autres propriétés de l'utilisateur Kinde
//   };
// }
interface AuthenticatedContentProps {
  user: KindeUser;
}

const fetchUserData = async (userId: string): Promise<PrismaUser | null> => {
  const cacheKey = `user-${userId}`;
  const cachedUser = getCachedValue<PrismaUser>(cacheKey);

  if (cachedUser) {
    return cachedUser;
  }

  const user = await retryOperation(async () => {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  });

  if (user) {
    cacheWithTTL(cacheKey, user, 300000); // 5 minutes
  }

  return user;
};

export const AuthenticatedContent: React.FC<
  AuthenticatedContentProps
> = async ({ user }) => {
  try {
    const dbUser = await fetchUserData(user?.id);

    if (!dbUser) {
      console.error("User found in session but not in database:", user?.id);
      toast.error("Erreur de synchronisation du profil utilisateur");
      return <SigningAvatar />;
    }

    return (
      <div className="flex items-center gap-3">
        <UserProfilePanel user={dbUser} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error, {
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    toast.error("Erreur lors du chargement du profil");
    return <SigningAvatar />;
  }
};
