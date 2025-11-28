// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Providers } from "./components/providers";
// import Appbar from "./components/Appbar";
// import SignInPanel from "./components/signInPanel";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FavoriteProvider } from "./context/FavoriteContext";
// import FooterWrapper from "./components/FooterWrapper"; // Import du composant FooterWrapper
// import Script from "next/script";

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
//       <body className={`${inter.className} h-full flex flex-col`}>
//         {/* Script Google Maps */}
//         {/* <Script
//           src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
//           strategy="lazyOnload"
//         /> */}
//         <FavoriteProvider>
//           <Providers>
//             {/* Appbar */}
//             <Appbar>
//               <SignInPanel />
//             </Appbar>

//             {/* Contenu principal */}
//             <main className="flex-grow">{children}</main>

//             {/* FooterWrapper conditionne l'affichage du Footer */}
//             <FooterWrapper />

//             {/* Toast notifications */}
//             <ToastContainer />
//           </Providers>
//         </FavoriteProvider>
//       </body>
//     </html>
//   );
// }
// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import Appbar from "./components/Appbar";
import SignInPanel from "./components/signInPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FavoriteProvider } from "./context/FavoriteContext";
import FooterWrapper from "./components/FooterWrapper";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LanguageProvider } from "./context/LanguageContext ";

const inter = Inter({ subsets: ["latin"] });

// Metadata doit être générée dynamiquement pour supporter les différentes langues
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  try {
    return {
      title: locale === "fr" ? "AFRIQUE AVENIR IMMO" : "AFRIQUE AVENIR IMMO",
      description:
        locale === "fr"
          ? "Site d'annonces immobilières pour l'AFRIQUE"
          : "Real estate listings site for AFRICA",
      icons: {
        icon: "/favicon.ico",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Return default metadata on error
    return {
      title: "AFRIQUE AVENIR IMMO",
      description: "Site d'annonces immobilières pour l'AFRIQUE",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Vérifie si la locale est supportée
  // if (!["en", "fr"].includes(locale)) notFound();

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Charge les traductions
  // let messages;
  // try {
  //   messages = (await import(`../../messages/${locale}.json`)).default;
  // } catch (error) {
  //   notFound();
  // }

  // Providing all messages to the client
  // side is the easiest way to get started
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error("Error loading messages:", error);
    // Fallback to empty messages object to prevent render failure
    messages = {};
  }

  return (
    <html lang={locale} className="h-full">
      <body className={`${inter.className} h-full flex flex-col`}>
        {/* Script Google Maps */}
        {/* <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="lazyOnload"
        /> */}
        <NextIntlClientProvider locale={locale} messages={messages || {}}>
          <LanguageProvider>
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
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
