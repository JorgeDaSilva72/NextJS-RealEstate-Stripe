// next-intl with deepseek

// "use client";

// import React, { useEffect, useState } from "react";
// import { Card, CardBody, CardFooter } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { buildUrl } from "@/lib/utils";
// import HeroBanner from "@/components/ui/HeroBanner";
// import BenefitsSection from "@/components/ui/BenefitsSection";
// import SectionHeader from "@/components/ui/SectionHeader";
// import SearchFormWrapper from "@/components/ui/SearchFormWrapper";
// import ContactSection from "@/components/ui/ContactSection";
// import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
// import { CitiesGridSkeleton } from "@/components/ui/CityCardSkeleton";
// import { useLocale, useTranslations } from "next-intl";

// interface CityDetails {
//   name: string;
//   image: string;
//   description: string;
//   propertyCount: number;
//   averagePrice: string;
//   features: string;
// }

// const FurnishedRentPage = () => {
//   const t = useTranslations("FurnishedRentPage");
//   const [cities, setCities] = useState<CityDetails[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const locale = useLocale(); // Récupère la locale active (ex: "fr" ou "en")

//   const furnishedRentalBenefits: BenefitProps[] = [
//     {
//       title: t("benefits.immediateSettlement.title"),
//       description: t("benefits.immediateSettlement.description"),
//     },
//     {
//       title: t("benefits.premiumComfort.title"),
//       description: t("benefits.premiumComfort.description"),
//     },
//     {
//       title: t("benefits.maximumFlexibility.title"),
//       description: t("benefits.maximumFlexibility.description"),
//     },
//   ];

//   const CityCard = ({ city }: { city: CityDetails }) => (
//     <Link href={buildUrl(city.name, "Location+meublée")}>
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
//                 {t("propertiesAvailable")}
//               </p>
//               <p className="text-sm">
//                 {t("averageRent")}{" "}
//                 <span className="font-semibold">{city.averagePrice}</span>
//               </p>
//               <p className="text-sm text-gray-500 mt-2">
//                 {t("included")}: {city.features}
//               </p>
//             </div>
//           </div>
//         </CardBody>
//         <CardFooter className="bg-gray-50">
//           <p className="text-primary w-full text-center">
//             {t("discoverProperties")} →
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
//           `/api/cityDetailsForFurnishedRent?locale=${locale}`
//         );

//         if (!response.ok) {
//           throw new Error(t("fetchError"));
//         }

//         const data = await response.json();
//         setCities(data);
//       } catch (error) {
//         console.error("Erreur:", error);
//         setError(t("loadError"));
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCityDetails();
//   }, [t]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <HeroBanner
//         imageSrc="/Maroc/MarocForFurnishedRent.jpg"
//         imageAlt={t("heroBanner.alt")}
//         title={t("heroBanner.title")}
//         subtitle={t("heroBanner.subtitle")}
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
//           title={t("benefitsSection.title")}
//           benefits={furnishedRentalBenefits}
//         />

//         <section>
//           <h2 className="text-3xl font-bold mb-8 text-center">
//             {t("citiesSection.title")}
//           </h2>

//           {error ? (
//             <div className="text-center py-8">
//               <p className="text-red-500">{error}</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
//               >
//                 {t("retry")}
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

//         <div className="bg-gray-100 py-16">
//           <div className="max-w-7xl mx-auto px-4">
//             <h2 className="text-3xl font-bold mb-8 text-center">
//               {t("servicesSection.title")}
//             </h2>
//             <div className="grid md:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-lg text-center">
//                 <h3 className="font-semibold mb-2">
//                   {t("servicesSection.internet.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("servicesSection.internet.description")}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg text-center">
//                 <h3 className="font-semibold mb-2">
//                   {t("servicesSection.appliances.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("servicesSection.appliances.description")}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg text-center">
//                 <h3 className="font-semibold mb-2">
//                   {t("servicesSection.maintenance.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("servicesSection.maintenance.description")}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-lg text-center">
//                 <h3 className="font-semibold mb-2">
//                   {t("servicesSection.concierge.title")}
//                 </h3>
//                 <p className="text-gray-600">
//                   {t("servicesSection.concierge.description")}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <section className="w-full" aria-labelledby="search-title">
//           <SectionHeader id="search-title" title={t("searchSection.title")} />
//           <div className="px-4">
//             <SearchFormWrapper
//               defaultValues={{
//                 ville: "",
//                 categorie: "Appartement",
//                 budget: "",
//                 chambres: "",
//               }}
//               defaultActiveTab={"Location meublée"}
//               backgroundColor="bg-black"
//             />
//           </div>
//         </section>

//         <ContactSection />
//       </div>
//     </div>
//   );
// };

// export default FurnishedRentPage;

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
