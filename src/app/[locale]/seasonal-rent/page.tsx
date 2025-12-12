// next-intl avec chatgpt
// "use client";

// import React, { useEffect, useState } from "react";
// import { Card, CardBody, CardFooter } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { buildUrl } from "@/lib/utils";
// import HeroBanner from "@/components/ui/HeroBanner";
// import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
// import BenefitsSection from "@/components/ui/BenefitsSection";
// import ContactSection from "@/components/ui/ContactSection";
// import SearchFormWrapper from "@/components/ui/SearchFormWrapper";
// import SectionHeader from "@/components/ui/SectionHeader";
// import { CitiesGridSkeleton } from "@/components/ui/CityCardSkeleton";
// import { useLocale, useTranslations } from "next-intl";

// interface CityDetails {
//   name: string;
//   image: string;
//   description: string;
//   propertyCount: number;
//   peakSeason: string;
//   avgPriceHigh: string;
//   avgPriceLow: string;
//   highlights: string;
// }

// const SeasonalRentPage = () => {
//   const t = useTranslations("SeasonalRentPage");
//   const [cities, setCities] = useState<CityDetails[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const locale = useLocale(); // Récupère la locale active (ex: "fr" ou "en")

//   // Traduire les avantages
//   const seasonalBenefits: BenefitProps[] = t
//     .raw("benefits")
//     .map((benefit: any) => ({
//       title: benefit.title,
//       description: benefit.description,
//     }));

//   const CityCard = ({ city }: { city: CityDetails }) => (
//     <Link href={buildUrl(city.name, "Location+saisonnière")}>
//       <Card className="h-full hover:scale-105 transition-transform duration-200">
//         <CardBody className="p-0">
//           <div className="relative h-48 w-full">
//             <Image
//               src={city.image}
//               alt={city.name}
//               fill
//               className="object-cover rounded-t-xl"
//             />
//           </div>
//           <div className="p-6">
//             <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
//             <p className="text-gray-600 mb-4">{city.description}</p>
//             <div className="flex flex-col gap-1">
//               <p className="text-sm">
//                 {t("cityCard.seasonalRentals", { count: city.propertyCount })}
//               </p>
//               <p className="text-sm">
//                 {t("cityCard.peakSeason", { season: city.peakSeason })}
//               </p>
//               <p className="text-sm">
//                 {t("cityCard.highSeasonPrice", { price: city.avgPriceHigh })}
//               </p>
//               <p className="text-sm">
//                 {t("cityCard.lowSeasonPrice", { price: city.avgPriceLow })}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 {t("cityCard.highlights", { highlights: city.highlights })}
//               </p>
//             </div>
//           </div>
//         </CardBody>
//         <CardFooter className="bg-gray-50">
//           <p className="text-primary w-full text-center">
//             {t("cityCard.viewAvailability")}
//           </p>
//         </CardFooter>
//       </Card>
//     </Link>
//   );

//   useEffect(() => {
//     const fetchCityDetails = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `/api/cityDetailsForSeasonalRent?locale=${locale}`
//         );

//         if (!response.ok) {
//           throw new Error(t("error.fetchError"));
//         }

//         const data = await response.json();
//         setCities(data);
//       } catch (error) {
//         console.error("Error:", error);
//         setError(t("error.fetchError"));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCityDetails();
//   }, [t, locale]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <HeroBanner
//         imageSrc="/Maroc/MarocForSeasonalRent.jpg"
//         imageAlt={t("heroTitle")}
//         title={t("heroTitle")}
//         subtitle={t("heroSubtitle")}
//         imageQuality={95}
//         height="h-[60vh]"
//         overlayOpacity={20}
//         blurIntensity={2}
//         isPriority={true}
//         titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
//         subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
//       />

//       <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
//         {/* Seasonal Benefits Section */}
//         <BenefitsSection
//           title={t("benefitsTitle")}
//           benefits={seasonalBenefits}
//         />

//         {/* Cities Section */}
//         <section>
//           <h2 className="text-3xl font-bold mb-8 text-center">
//             {t("citiesTitle")}
//           </h2>

//           {error ? (
//             <div className="text-center py-8">
//               <p className="text-red-500">{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
//               >
//                 {t("error.retry")}
//               </button>
//             </div>
//           ) : isLoading ? (
//             <CitiesGridSkeleton />
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {cities.map((city) => (
//                 <CityCard key={city.name} city={city} />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Seasonal Calendar Section */}
//         <section className="bg-gray-100 py-16">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-3xl font-bold mb-8 text-center">
//               {t("seasonalCalendar.title")}
//             </h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-lg">
//                 <h3 className="font-semibold mb-2">
//                   {t("seasonalCalendar.spring.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("seasonalCalendar.spring.description")}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg">
//                 <h3 className="font-semibold mb-2">
//                   {t("seasonalCalendar.summer.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("seasonalCalendar.summer.description")}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg">
//                 <h3 className="font-semibold mb-2">
//                   {t("seasonalCalendar.autumn.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("seasonalCalendar.autumn.description")}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg">
//                 <h3 className="font-semibold mb-2">
//                   {t("seasonalCalendar.winter.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("seasonalCalendar.winter.description")}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Search Form */}
//         <section className="w-full" aria-labelledby="search-title">
//           <SectionHeader id="search-title" title={t("searchTitle")} />
//           <div className="px-4">
//             <SearchFormWrapper
//               defaultValues={{
//                 ville: "",
//                 categorie: "",
//                 budget: "",
//                 chambres: "",
//               }}
//               defaultActiveTab="Location saisonnière"
//               backgroundColor="bg-black"
//             />
//           </div>
//         </section>

//         {/* Contact Section */}
//         <ContactSection />
//       </div>
//     </div>
//   );
// };

// export default SeasonalRentPage;

// 09-12-2025 provisoire le code précédent doit être retouché pour qu il fonctionne avec la nouvelle structure de la base de données mais comme cette page n a pas été bien défini on ne va pas plus loin
import UnderConstruction from "../components/Underonstruction";

export default function MyWIPPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Le composant affichera le texte en français ou en anglais selon la locale active */}
      <UnderConstruction className="mt-10" />
    </div>
  );
}
