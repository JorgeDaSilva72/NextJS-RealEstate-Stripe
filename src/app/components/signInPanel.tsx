import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@nextui-org/react";
import React from "react";
import UserProfilePanel from "./UserProfilePanel";
import prisma from "@/lib/prisma";

const signInPanel = async () => {
  const { isAuthenticated, getUser } = await getKindeServerSession();
  if (await isAuthenticated()) {
    const user = await getUser();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
    });
    

    const filter = await prisma.savedSearch.findMany({
      where: { userId: user?.id },  // Vous pouvez filtrer en fonction de l'ID de l'utilisateur si nécessaire
    });
    console.log('filter', filter);

    return <>{dbUser!! && <UserProfilePanel user={dbUser} filter={filter} />}</>;
  }

  return (
    <div className="flex gap-3">
      <Button color="primary">
        <LoginLink>Se connecter</LoginLink>
      </Button>
      <Button>
        <RegisterLink>Créer un compte</RegisterLink>
      </Button>
    </div>
  );
};

export default signInPanel;
