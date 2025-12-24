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
import HomeNavbar from "./components/HomeNavbar";
import HomeFooter from "./components/HomeFooter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FavoriteProvider } from "./context/FavoriteContext";
import Script from "next/script";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LanguageProvider } from "./context/LanguageContext ";
import WhatsAppWidgetProvider from "./components/WhatsAppWidgetProvider";

const inter = Inter({ subsets: ["latin"] });

// Metadata doit être générée dynamiquement pour supporter les différentes langues
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  let locale = "fr";
  try {
    locale = params?.locale || "fr";
  } catch (error) {
    console.error("Error extracting locale in generateMetadata:", error);
    locale = "fr";
  }

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Extract locale from params (handle both sync and async params)
  let locale = "fr";
  try {
    locale = params?.locale || "fr";
    console.log("[RootLayout] Rendering layout for locale:", locale);
  } catch (error: any) {
    console.error("[RootLayout] Error extracting locale from params:", error);
    console.error("[RootLayout] Error details:", {
      message: error.message,
      stack: error.stack,
    });
    locale = "fr";
  }

  // Vérifie si la locale est supportée
  if (!locale || !routing.locales.includes(locale as any)) {
    console.warn("[RootLayout] Invalid locale, calling notFound():", locale);
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  let messages = {};
  try {
    console.log("[RootLayout] Loading messages...");
    messages = await getMessages();
    console.log("[RootLayout] Messages loaded successfully");
  } catch (error: any) {
    console.error("[RootLayout] Error loading messages:", error);
    console.error("[RootLayout] Error details:", {
      message: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
    // Fallback to empty messages object to prevent render failure
    messages = {};
  }

  try {
    console.log("[RootLayout] Rendering layout JSX for locale:", locale);
    
    // Wrap children rendering in try/catch to catch any Server Component errors
    let safeChildren: React.ReactNode;
    try {
      console.log("[RootLayout] Rendering children...");
      safeChildren = children;
    } catch (childrenError: any) {
      console.error("[RootLayout] Error rendering children:", childrenError);
      console.error("[RootLayout] Children error details:", {
        message: childrenError.message,
        stack: childrenError.stack,
        name: childrenError.name,
      });
      // Render error UI instead of crashing
      safeChildren = (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Error Loading Page
            </h1>
            <p className="text-gray-600 mb-4">
              {process.env.NODE_ENV === "development" 
                ? childrenError.message 
                : "An error occurred while loading this page."}
            </p>
            <a
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }

    return (
      <html lang={locale} className="h-full">
        <body className={`${inter.className} h-full flex flex-col`}>
          {/* Google tag (gtag.js) */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-9WN9KJ29GR"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9WN9KJ29GR');
            `}
          </Script>
          {/* Script Google Maps */}
          {/* <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
            strategy="lazyOnload"
          /> */}
          <NextIntlClientProvider locale={locale} messages={messages || {}}>
            <LanguageProvider>
              <FavoriteProvider>
                <Providers>
                  {/* HomeNavbar - consistent across all pages */}
                  <HomeNavbar />

                  {/* Contenu principal */}
                  <main className="flex-grow pt-16">{safeChildren}</main>

                  {/* HomeFooter - consistent across all pages */}
                  <HomeFooter />

                  {/* Toast notifications */}
                  <ToastContainer />

                  {/* WhatsApp Floating Widget */}
                  <WhatsAppWidgetProvider />
                </Providers>
              </FavoriteProvider>
            </LanguageProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error: any) {
    // Log the error for debugging with more details
    console.error("[RootLayout] CRITICAL ERROR in RootLayout render:", error);
    console.error("[RootLayout] Error type:", typeof error);
    console.error("[RootLayout] Error constructor:", error?.constructor?.name);
    console.error("[RootLayout] Error message:", error?.message);
    console.error("[RootLayout] Error name:", error?.name);
    console.error("[RootLayout] Error stack:", error?.stack);
    console.error("[RootLayout] Error cause:", error?.cause);
    console.error("[RootLayout] Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Log environment check
    console.error("[RootLayout] Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      hasNextIntl: typeof getMessages !== "undefined",
      locale: locale,
    });
    
    // Return a minimal fallback layout to prevent complete failure
    return (
      <html lang={locale} className="h-full">
        <body className={`${inter.className} h-full flex flex-col`}>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-4">
                An error occurred while loading the page. Please try refreshing.
              </p>
              {process.env.NODE_ENV === "development" && error?.message && (
                <div className="mb-4 p-3 bg-red-50 rounded text-left max-w-md mx-auto">
                  <p className="text-xs text-red-800 font-mono break-all">
                    {error.message}
                  </p>
                </div>
              )}
              <a
                href="/"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Home
              </a>
            </div>
          </div>
        </body>
      </html>
    );
  }
}
