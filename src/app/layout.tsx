// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Providers } from "./components/providers";
// import Appbar from "./components/Appbar";
// import SignInPanel from "./components/signInPanel";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FavoriteProvider } from "./context/FavoriteContext";
// import { FooterSection } from "./components/footer";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "AFRIQUE AVENIR IMMO",
//   description: "Site d'annonces immobilières pour l'AFRIQUE FRANCOPHONE",
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" className="h-full">
//       <head>
//         <link rel="icon" href="/favicon.ico" type="image/x-icon" />
//         {/* Lien direct vers la favicon */}
//       </head>
//       <body className={`${inter.className} h-full flex flex-col`}>
//         <FavoriteProvider>
//           <Providers>
//             {/* Appbar */}
//             <Appbar>
//               <SignInPanel />
//             </Appbar>

//             {/* Contenu principal */}
//             <main className="flex-grow">{children}</main>

//             {/* Footer */}
//             <FooterSection />

//             {/* Toast notifications */}
//             <ToastContainer />
//           </Providers>
//         </FavoriteProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import Appbar from "./components/Appbar";
import SignInPanel from "./components/signInPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FavoriteProvider } from "./context/FavoriteContext";
import FooterWrapper from "./components/FooterWrapper"; // Import du composant FooterWrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AFRIQUE AVENIR IMMO",
  description: "Site d'annonces immobilières pour l'AFRIQUE FRANCOPHONE",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        <FavoriteProvider>
          <Providers>
            {/* Appbar */}
            <Appbar>
              <SignInPanel />
            </Appbar>

            {/* Contenu principal */}
            <main className="flex-grow">{children}</main>

            {/* FooterWrapper conditionne l'affichage du Footer */}
            <FooterWrapper />

            {/* Toast notifications */}
            <ToastContainer />
          </Providers>
        </FavoriteProvider>
      </body>
    </html>
  );
}
