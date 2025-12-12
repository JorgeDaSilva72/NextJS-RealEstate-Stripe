// next-intl with claude.ai

// "use client";

// import React, { useEffect, useState } from "react";
// import { Card, CardBody, CardFooter } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useLocale, useTranslations } from "next-intl";
// import { buildUrl } from "@/lib/utils";
// import HeroBanner from "@/components/ui/HeroBanner";
// import BenefitsSection from "@/components/ui/BenefitsSection";
// import ContactSection from "@/components/ui/ContactSection";
// import SectionHeader from "@/components/ui/SectionHeader";
// import { CitiesGridSkeleton } from "@/components/ui/CityCardSkeleton";
// import SearchFormWrapper from "@/components/ui/SearchFormWrapper";

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

// const ExclusiveRentalsPage = () => {
//   const t = useTranslations("ExclusiveRentals");
//   const [cities, setCities] = useState<CityDetails[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const locale = useLocale(); // Récupère la locale active (ex: "fr" ou "en")

//   const seasonalBenefits = [
//     {
//       title: t("benefits.exclusivity.title"),
//       description: t("benefits.exclusivity.description"),
//     },
//     {
//       title: t("benefits.trust.title"),
//       description: t("benefits.trust.description"),
//     },
//     {
//       title: t("benefits.comfort.title"),
//       description: t("benefits.comfort.description"),
//     },
//   ];

//   const CityCard = ({ city }: { city: CityDetails }) => (
//     <Link href={buildUrl(city.name, "Location+exclusive")}>
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
//                 <span className="font-semibold">{city.propertyCount}</span>{" "}
//                 {t("cityCard.availableProperties")}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">
//                   {t("cityCard.peakSeason")}:
//                 </span>{" "}
//                 {city.peakSeason}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">
//                   {t("cityCard.peakSeasonPrice")}:
//                 </span>{" "}
//                 {city.avgPriceHigh}
//               </p>
//               <p className="text-sm">
//                 <span className="font-semibold">
//                   {t("cityCard.lowSeasonPrice")}:
//                 </span>{" "}
//                 {city.avgPriceLow}
//               </p>
//               <p className="text-sm text-gray-500 mt-1">
//                 {t("cityCard.highlights")}: {city.highlights}
//               </p>
//             </div>
//           </div>
//         </CardBody>
//         <CardFooter className="bg-gray-50">
//           <p className="text-primary w-full text-center">
//             {t("cityCard.checkAvailability")} →
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
//           `/api/cityDetailsForExclusiveRentals?locale=${locale}`
//         );

//         if (!response.ok) {
//           throw new Error(t("errors.fetchFailed"));
//         }

//         const data = await response.json();
//         setCities(data);
//       } catch (error) {
//         console.error("Error:", error);
//         setError(t("errors.loadFailed"));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCityDetails();
//   }, [t]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <HeroBanner
//         imageSrc="/Maroc/exclusive-rentals.webp"
//         imageAlt={t("hero.imageAlt")}
//         title={t("hero.title")}
//         subtitle={t("hero.subtitle")}
//         imageQuality={95}
//         height="h-[60vh]"
//         overlayOpacity={0}
//         blurIntensity={0}
//         isPriority={true}
//         titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
//         subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
//       />

//       <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
//         <BenefitsSection
//           title={t("sections.benefits.title")}
//           benefits={seasonalBenefits}
//         />

//         <section>
//           <h2 className="text-3xl font-bold mb-8 text-center">
//             {t("sections.cities.title")}
//           </h2>

//           {error ? (
//             <div className="text-center py-8">
//               <p className="text-red-500">{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
//               >
//                 {t("common.retry")}
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

//         <section className="w-full" aria-labelledby="search-title">
//           <SectionHeader id="search-title" title={t("sections.search.title")} />
//           <div className="px-4">
//             <SearchFormWrapper
//               defaultValues={{
//                 ville: "",
//                 categorie: "",
//                 budget: "",
//                 chambres: "",
//               }}
//               defaultActiveTab={"Location exclusive"}
//               backgroundColor="bg-black"
//             />
//           </div>
//         </section>

//         <section className="w-full" aria-labelledby="contact-title">
//           <SectionHeader
//             id="contact-title"
//             title={t("sections.contact.title")}
//           />
//           <ContactSection />
//         </section>
//       </div>
//     </div>
//   );
// };

// export default ExclusiveRentalsPage;

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
