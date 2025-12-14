// import {
//   LoginLink,
//   LogoutLink,
//   RegisterLink,
//   getKindeServerSession,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { Button } from "@nextui-org/react";
// import React from "react";
// import UserProfilePanel from "./UserProfilePanel";
// import prisma from "@/lib/prisma";

// const signInPanel = async () => {
//   const { isAuthenticated, getUser } = await getKindeServerSession();
//   if (await isAuthenticated()) {
//     const user = await getUser();
//     const dbUser = await prisma.user.findUnique({
//       where: {
//         id: user?.id,
//       },
//     });

//     return <>{dbUser!! && <UserProfilePanel user={dbUser} />}</>;
//   }

//   return (
//     <div className="flex gap-3">
//       <Button color="primary">
//         <LoginLink>Se connecter</LoginLink>
//       </Button>
//       <Button>
//         <RegisterLink>Créer un compte</RegisterLink>
//       </Button>
//     </div>
//   );
// };

// export default signInPanel;

// import {
//   LoginLink,
//   RegisterLink,
//   getKindeServerSession,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { Avatar, Button } from "@nextui-org/react";
// import React from "react";
// import UserProfilePanel from "./UserProfilePanel";
// import prisma from "@/lib/prisma";

// const SignInPanel = async () => {
//   const { isAuthenticated, getUser } = await getKindeServerSession();

//   if (await isAuthenticated()) {
//     const user = await getUser();
//     const dbUser = await prisma.user.findUnique({
//       where: {
//         id: user?.id,
//       },
//     });

//     return (
//       <div className="flex items-center gap-3">
//         {dbUser && (
//           <>
//             {/* <Avatar
//               src={dbUser.avatarUrl || "/default-avatar.png"} // Remplacez par une URL valide
//               alt="Avatar utilisateur"
//               size="md"
//             /> */}
//             <UserProfilePanel user={dbUser} />
//           </>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center gap-3">
//       <LoginLink>
//         {/* <Avatar
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//           }
//           color="primary"
//           isBordered
//           alt="Se connecter"
//           size="md"
//         /> */}

//         {/* <Avatar
//           src={"/default-avatar.png"} // Remplacez par une URL valide
//           alt="Avatar utilisateur"
//           size="md"
//         /> */}

//         <Avatar
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               aria-hidden="true"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path d="M12 12a4.8 4.8 0 1 0 0-9.6 4.8 4.8 0 0 0 0 9.6m0-8.4c1.985 0 3.6 1.615 3.6 3.6s-1.615 3.6-3.6 3.6a3.605 3.605 0 0 1-3.6-3.6c0-1.985 1.616-3.6 3.6-3.6m1.901 10.2H10.1a6.5 6.5 0 0 0-6.5 6.499 1.3 1.3 0 0 0 1.3 1.3h14.2a1.297 1.297 0 0 0 1.299-1.3 6.5 6.5 0 0 0-6.499-6.5Zm5.198 6.6h-14.2a.1.1 0 0 1-.099-.101 5.305 5.305 0 0 1 5.299-5.3h3.799a5.306 5.306 0 0 1 5.302 5.3.1.1 0 0 1-.101.1Z"></path>
//             </svg>
//           }
//           color="primary"
//           isBordered
//           alt="Se connecter"
//           size="md"
//         />
//       </LoginLink>

//       {/* <svg
//         viewBox="0 0 24 24"
//         xmlns="http://www.w3.org/2000/svg"
//         aria-hidden="true"
//         class="css-4489fn"
//         data-testid="shell_ufrn_header-UserToolbar-UserButton-UserToolbarButton['login']-icon"
//       >
//         <path d="M12 12a4.8 4.8 0 1 0 0-9.6 4.8 4.8 0 0 0 0 9.6m0-8.4c1.985 0 3.6 1.615 3.6 3.6s-1.615 3.6-3.6 3.6a3.605 3.605 0 0 1-3.6-3.6c0-1.985 1.616-3.6 3.6-3.6m1.901 10.2H10.1a6.5 6.5 0 0 0-6.5 6.499 1.3 1.3 0 0 0 1.3 1.3h14.2a1.297 1.297 0 0 0 1.299-1.3 6.5 6.5 0 0 0-6.499-6.5Zm5.198 6.6h-14.2a.1.1 0 0 1-.099-.101 5.305 5.305 0 0 1 5.299-5.3h3.799a5.306 5.306 0 0 1 5.302 5.3.1.1 0 0 1-.101.1Z"></path>
//       </svg> */}

//       {/* <RegisterLink>
//         <Avatar
//           icon={
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M16 12H8m8 0l-4-4m4 4l-4 4"
//               />
//             </svg>
//           }
//           color="secondary"
//           isBordered
//           alt="Créer un compte"
//           size="md"
//         />
//       </RegisterLink> */}
//     </div>
//   );
// };

// export default SignInPanel;

// end ----------------------------
// Cedrico - changer le design de l'accueil

// import {
//   LoginLink,
//   RegisterLink,
//   getKindeServerSession,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { Avatar, Button } from "@nextui-org/react";
// import React from "react";
// import UserProfilePanel from "./UserProfilePanel";
// import prisma from "@/lib/prisma";
// import SigningAvatar from "./SigningAvatar";

// const SignInPanel = async () => {
//   const { isAuthenticated, getUser } = await getKindeServerSession();

//   if (await isAuthenticated()) {
//     const user = await getUser();
//     const dbUser = await prisma.user.findUnique({
//       where: {
//         id: user?.id,
//       },
//     });

//     return (
//       <div className="flex items-center gap-3">
//         {dbUser && (
//           <>
//             <UserProfilePanel user={dbUser} />
//           </>
//         )}
//       </div>
//     );
//   }

//   return <SigningAvatar />;
// };

// export default SignInPanel;

// import {
//   LoginLink,
//   LogoutLink,
//   RegisterLink,
//   getKindeServerSession,
// } from "@kinde-oss/kinde-auth-nextjs/server";
// import { Button } from "@nextui-org/react";
// import React from "react";
// import UserProfilePanel from "./UserProfilePanel";
// import prisma from "@/lib/prisma";

// const signInPanel = async () => {
//   const { isAuthenticated, getUser } = await getKindeServerSession();
//   if (await isAuthenticated()) {
//     const user = await getUser();
//     const dbUser = await prisma.user.findUnique({
//       where: {
//         id: user?.id,
//       },
//     });

//     return <>{dbUser!! && <UserProfilePanel user={dbUser} />}</>;
//   }

//   return (
//     <div className="flex gap-3">
//       <Button color="primary">
//         <LoginLink>Se connecter</LoginLink>
//       </Button>
//       <Button>
//         <RegisterLink>Créer un compte</RegisterLink>
//       </Button>
//     </div>
//   );
// };

// export default signInPanel;

import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { Avatar, Button } from "@nextui-org/react";
import React from "react";
import UserProfilePanel from "./UserProfilePanel";
import prisma from "@/lib/prisma";
import SigningAvatar from "./SigningAvatar";

const SignInPanel = async () => {
  const { isAuthenticated, getUser } = await getKindeServerSession();

  if (await isAuthenticated()) {
    const user = await getUser();
    const dbUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    // Retournez quelque chose si dbUser est null pour le diagnostique
 if (!dbUser) {
 return <div className="text-red-500">ERREUR: Utilisateur Kinde connecté, mais DB non trouvée pour ID: {user?.id}</div>;
}

    return (
      <div className="flex items-center gap-3">
        {dbUser && (
          <>
            <UserProfilePanel user={dbUser} />
          </>
        )}
      </div>
    );
  }

  return <SigningAvatar />;
};

export default SignInPanel;
