// // import { LanguageSelector } from "@/components/language-selector";
// import { CountrySelector } from "@/app/components/CountrySelector";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";
// import { Inter } from "next/font/google";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";

// const inter = Inter({ subsets: ["latin"] });

// interface LayoutProps {
//   children: React.ReactNode;
//   params: {
//     lang: string;
//     country: string;
//   };
// }

// export async function generateStaticParams() {
//   const params = [];

//   for (const country of Object.keys(SUPPORTED_COUNTRIES)) {
//     for (const lang of SUPPORTED_COUNTRIES[country].languages) {
//       params.push({
//         country,
//         lang,
//       });
//     }
//   }

//   return params;
// }

// function isValidCountryAndLang(country: string, lang: string) {
//   return (
//     SUPPORTED_COUNTRIES[country] &&
//     SUPPORTED_COUNTRIES[country].languages.includes(lang)
//   );
// }

// export default function RootLayout({ children, params }: LayoutProps) {
//   const { country, lang } = params;

//   if (!isValidCountryAndLang(country, lang)) {
//     redirect("/");
//   }

//   const currentCountry = SUPPORTED_COUNTRIES[country];

//   return (
//     <html lang={lang}>
//       <body className={inter.className}>
//         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="container flex h-14 items-center">
//             <div className="flex gap-4">
//               <Suspense fallback={<div>Loading...</div>}>
//                 <CountrySelector currentCountry={country} lang={lang} />
//                 {/* <LanguageSelector
//                   currentLang={lang}
//                   country={country}
//                   supportedLangs={currentCountry.languages}
//                 /> */}
//               </Suspense>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 container mx-auto px-4 py-8">
//           <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
//         </main>

//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               try {
//                 if (navigator.geolocation) {
//                   navigator.geolocation.getCurrentPosition(function(position) {
//                     document.cookie = "userLat=" + position.coords.latitude;
//                     document.cookie = "userLng=" + position.coords.longitude;
//                   });
//                 }
//               } catch (e) {
//                 console.error('Geolocation failed:', e);
//               }
//             `,
//           }}
//         />
//       </body>
//     </html>
//   );
// }

// export async function generateMetadata({
//   params: { country, lang },
// }: {
//   params: { country: string; lang: string };
// }) {
//   const countryData = SUPPORTED_COUNTRIES[country];

//   return {
//     title: {
//       template: `%s | ${countryData.name[lang]} Real Estate`,
//       default: `${countryData.name[lang]} Real Estate - Find Your Dream Home`,
//     },
//     description: `Find properties for sale and rent in ${countryData.name[lang]}. The best real estate marketplace in Africa.`,
//     keywords: [
//       "real estate",
//       "property",
//       "africa",
//       country,
//       "house",
//       "apartment",
//       "buy",
//       "rent",
//     ],
//     authors: [{ name: "Your Company Name" }],
//     metadataBase: new URL(`https://${country}.yoursite.com`),
//   };
// }
// import { CountrySelector } from "@/app/components/CountrySelector";
// import { LanguageSelector } from "@/app/components/LanguageSelector";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";
// import { CountryName } from "@/types/country";
// import { Inter } from "next/font/google";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";

// const inter = Inter({ subsets: ["latin"] });

// interface LayoutProps {
//   children: React.ReactNode;
//   params: {
//     lang: keyof CountryName;
//     country: string;
//   };
// }

// export async function generateStaticParams() {
//   const params = [];

//   for (const country of Object.keys(SUPPORTED_COUNTRIES)) {
//     for (const lang of SUPPORTED_COUNTRIES[country].languages) {
//       params.push({
//         country,
//         lang,
//       });
//     }
//   }

//   return params;
// }

// function isValidCountryAndLang(country: string, lang: string) {
//   return (
//     SUPPORTED_COUNTRIES[country] &&
//     SUPPORTED_COUNTRIES[country].languages.includes(lang)
//   );
// }

// export default function RootLayout({ children, params }: LayoutProps) {
//   const { country, lang } = params;

//   if (!isValidCountryAndLang(country, lang)) {
//     redirect("/");
//   }

//   const currentCountry = SUPPORTED_COUNTRIES[country];

//   return (
//     <html lang={lang}>
//       <body className={inter.className}>
//         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="container flex h-14 items-center">
//             <div className="flex flex-wrap items-center gap-4">
//               <Suspense
//                 fallback={
//                   <div className="w-[200px] h-10 bg-gray-200 animate-pulse rounded-md" />
//                 }
//               >
//                 <CountrySelector currentCountry={country} lang={lang} />
//               </Suspense>
//               <Suspense
//                 fallback={
//                   <div className="w-[140px] h-10 bg-gray-200 animate-pulse rounded-md" />
//                 }
//               >
//                 <LanguageSelector
//                   currentLang={lang}
//                   country={country}
//                   supportedLangs={currentCountry.languages}
//                 />
//               </Suspense>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 container mx-auto px-4 py-8">
//           <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
//         </main>

//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               try {
//                 if (navigator.geolocation) {
//                   navigator.geolocation.getCurrentPosition(function(position) {
//                     document.cookie = "userLat=" + position.coords.latitude;
//                     document.cookie = "userLng=" + position.coords.longitude;
//                   });
//                 }
//               } catch (e) {
//                 console.error('Geolocation failed:', e);
//               }
//             `,
//           }}
//         />
//       </body>
//     </html>
//   );
// }

// export const metadata = {
//   metadataBase: new URL("https://afriqueavenirimmobilier.com/"),
// };
// import { CountrySelector } from "@/app/components/CountrySelector";
// import { LanguageSelector } from "@/app/components/LanguageSelector";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";
// import { CountryName } from "@/types/country";
// import { Inter } from "next/font/google";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";

// const inter = Inter({ subsets: ["latin"] });

// interface LayoutProps {
//   children: React.ReactNode;
//   params: {
//     lang: keyof CountryName;
//     country: string;
//   };
// }

// // Génération des paramètres statiques pour le routage dynamique
// export async function generateStaticParams() {
//   const params = Object.entries(SUPPORTED_COUNTRIES).flatMap(
//     ([country, data]) => data.languages.map((lang) => ({ country, lang }))
//   );

//   return params;
// }

// // Validation du pays et de la langue
// function isValidCountryAndLang(country: string, lang: string): boolean {
//   return (
//     SUPPORTED_COUNTRIES[country] &&
//     SUPPORTED_COUNTRIES[country].languages.includes(lang)
//   );
// }

// export default function RootLayout({ children, params }: LayoutProps) {
//   const { country, lang } = params;

//   // Redirige vers la page d'accueil si les paramètres ne sont pas valides
//   if (!isValidCountryAndLang(country, lang)) {
//     redirect("/");
//   }

//   const currentCountry = SUPPORTED_COUNTRIES[country];

//   return (
//     <html lang={lang}>
//       <body className={inter.className}>
//         {/* En-tête */}
//         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//           <div className="container flex h-14 items-center">
//             <div className="flex flex-wrap items-center gap-4">
//               {/* Sélecteur de pays */}
//               <Suspense
//                 fallback={
//                   <div className="w-[200px] h-10 bg-gray-200 animate-pulse rounded-md" />
//                 }
//               >
//                 <CountrySelector currentCountry={country} lang={lang} />
//               </Suspense>
//               {/* Sélecteur de langue */}
//               <Suspense
//                 fallback={
//                   <div className="w-[140px] h-10 bg-gray-200 animate-pulse rounded-md" />
//                 }
//               >
//                 <LanguageSelector
//                   currentLang={lang}
//                   country={country}
//                   supportedLangs={currentCountry.languages}
//                 />
//               </Suspense>
//             </div>
//           </div>
//         </header>

//         {/* Contenu principal */}
//         <main className="flex-1 container mx-auto px-4 py-8">
//           <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
//         </main>

//         {/* Script pour récupérer la géolocalisation */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               try {
//                 if (navigator.geolocation) {
//                   navigator.geolocation.getCurrentPosition(function(position) {
//                     document.cookie = "userLat=" + position.coords.latitude;
//                     document.cookie = "userLng=" + position.coords.longitude;
//                   });
//                 }
//               } catch (e) {
//                 console.error('Geolocation failed:', e);
//               }
//             `,
//           }}
//         />
//       </body>
//     </html>
//   );
// }

// // Métadonnées pour SEO et l'URL de base
// export const metadata = {
//   metadataBase: new URL("https://afriqueavenirimmobilier.com/"),
// };
// "use client";

// import { CountrySelector } from "@/app/components/CountrySelector";
// import { LanguageSelector } from "@/app/components/LanguageSelector";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";
// import { CountryName } from "@/types/country";
// import { Inter } from "next/font/google";
// import { redirect } from "next/navigation";
// import { useEffect } from "react";

// const inter = Inter({ subsets: ["latin"] });

// interface LayoutProps {
//   children: React.ReactNode;
//   params: {
//     lang: keyof CountryName;
//     country: string;
//   };
// }

// // Validation des paramètres
// function isValidCountryAndLang(country: string, lang: string): boolean {
//   return (
//     SUPPORTED_COUNTRIES[country] &&
//     SUPPORTED_COUNTRIES[country].languages.includes(lang)
//   );
// }

// export default function RootLayout({ children, params }: LayoutProps) {
//   const { country, lang } = params;

//   // Redirection côté client si les paramètres ne sont pas valides
//   if (!isValidCountryAndLang(country, lang)) {
//     redirect("/");
//   }

//   const currentCountry = SUPPORTED_COUNTRIES[country];

//   useEffect(() => {
//     // Géolocalisation client-only
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition((position) => {
//           document.cookie = `userLat=${position.coords.latitude}`;
//           document.cookie = `userLng=${position.coords.longitude}`;
//         });
//       }
//     } catch (e) {
//       console.error("Geolocation failed:", e);
//     }
//   }, []);

//   return (
//     <div className="container flex h-14 items-center">
//       <div className="flex flex-wrap items-center gap-4">
//         {/* Sélecteur de pays */}
//         <CountrySelector currentCountry={country} lang={lang} />
//         {/* Sélecteur de langue */}
//         <LanguageSelector
//           currentLang={lang}
//           country={country}
//           supportedLangs={currentCountry.languages}
//         />
//       </div>
//       {children}
//     </div>
//   );
// }

// Métadonnées pour SEO
// export const metadata = {
//   metadataBase: new URL("https://afriqueavenirimmobilier.com/"),
// };

"use client";

import { CountrySelector } from "@/app/components/CountrySelector";
import { LanguageSelector } from "@/app/components/LanguageSelector";
import { SUPPORTED_COUNTRIES } from "@/data/countries";
import { CountryName, LanguageCode } from "@/types/country";
import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
  params: {
    lang: keyof CountryName;
    country: string;
  };
}

function isValidCountryAndLang(country: string, lang: LanguageCode): boolean {
  const countryData = SUPPORTED_COUNTRIES[country];
  return countryData && countryData.languages.includes(lang);
}

export default function RootLayout({ children, params }: LayoutProps) {
  const { country, lang } = params;

  if (!isValidCountryAndLang(country, lang)) {
    redirect("/");
  }

  const currentCountry = SUPPORTED_COUNTRIES[country];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          document.cookie = `userLat=${position.coords.latitude};path=/`;
          document.cookie = `userLng=${position.coords.longitude};path=/`;
        },
        (error) => {
          console.warn("Geolocation permission denied or failed:", error);
        }
      );
    }
  }, []);

  return (
    <div className={`${inter.className} container`}>
      <div className="flex h-14 items-center">
        <div className="flex flex-wrap items-center gap-4">
          <CountrySelector currentCountry={country} lang={lang} />
          <LanguageSelector
            currentLang={lang}
            country={country}
            supportedLangs={currentCountry.languages}
          />
          {children}
        </div>
      </div>
    </div>
  );
}
