import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

//Génération d'avatars dynamiques
function generateAvatarUrl(userId: string): string {
  return `https://api.dicebear.com/6.x/identicon/svg?seed=${userId}`;
}

export async function GET(req: NextRequest) {
  try {
    // Obtenez la session et l'utilisateur
    const session = await getKindeServerSession();
    const { getUser } = session;
    const user = await getUser();

    // Vérifiez si l'utilisateur est valide
    if (!user || !user.id)
      throw new Error("Authentication failed: User not found");

    // Cherchez l'utilisateur dans la base de données
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    // Définissez l'URL de redirection en fonction de l'environnement
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://afriqueavenirimmobilier.com/"
        : "http://localhost:3000/";

    // A essqyer
    //const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/";

    // Si l'utilisateur n'existe pas, créez-le
    if (!dbUser) {
      const newUser = await prisma.user.create({
        data: {
          id: user.id,
          firstName: user.given_name ?? "",
          lastName: user.family_name ?? "",
          email: user.email ?? "",
          avatarUrl: generateAvatarUrl(user.id),
        },
      });
      // return NextResponse.json({
      //   message: "User created successfully",
      //   user: newUser,
      // });
      console.log("User created:", newUser);
      // Redirigez vers la page d'accueil après la création de l'utilisateur
      // return NextResponse.redirect(baseUrl);
    }

    // Si l'utilisateur existe déjà, redirigez également
    return NextResponse.redirect(baseUrl);
  } catch (error) {
    // Gérez les erreurs et retournez une réponse d'erreur
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Unknown error occurred" },
      { status: 500 }
    );
  }
}
