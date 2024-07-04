// import prisma from "@/lib/prisma";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     // Obtenez la session et l'utilisateur
//     const session = await getKindeServerSession();
//     const { getUser } = session;
//     const user = await getUser();

//     // Vérifiez si l'utilisateur est valide
//     if (!user || !user.id)
//       throw new Error("Something went wrong with authentication");

//     // Cherchez l'utilisateur dans la base de données
//     const dbUser = await prisma.user.findUnique({
//       where: {
//         id: user.id,
//       },
//     });

//     // Si l'utilisateur n'existe pas, créez-le
//     if (!dbUser) {
//       await prisma.user.create({
//         data: {
//           id: user.id,
//           firstName: user.given_name ?? "",
//           lastName: user.family_name ?? "",
//           email: user.email ?? "",
//         },
//       });
//       // Redirigez vers la page d'accueil après la création de l'utilisateur
//       return NextResponse.redirect("http://localhost:3000/");
//     }
//     // Retournez une réponse appropriée si l'utilisateur existe déjà
//     return NextResponse.json({ message: "User already exists", user: dbUser });
//   } catch (error) {
//     // Gérez les erreurs et retournez une réponse d'erreur
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id)
    throw new Error(
      "Quelque chose s'est mal passé avec l'authentification" + user
    );

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        email: user.email ?? "",
      },
    });

    return NextResponse.redirect("http://localhost:3000/");
  }
}
