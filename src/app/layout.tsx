import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import Appbar from "./components/Appbar";
import SignInPanel from "./components/signInPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FavoriteProvider } from "./context/FavoriteContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AFRIQUE AVENIR IMMO",
  description: "Site d'annonces immobilières pour l'AFRIQUE FRANCOPHONE",
  icons: {
    icon: "/favicon.ico", // Assurez-vous que ce fichier existe dans /public
    // Vous pouvez également ajouter d'autres icônes si nécessaire
    // apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Lien direct vers la favicon */}
      </head>
      <body className={`${inter.className} h-full`}>
        <FavoriteProvider>
          <Providers>
            <Appbar>
              <SignInPanel />
            </Appbar>
            {children}
            <ToastContainer />
          </Providers>
        </FavoriteProvider>
      </body>
    </html>
  );
}
