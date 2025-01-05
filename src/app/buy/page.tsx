// "use client";

// import React from "react";
// import { Card, CardBody, CardFooter } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { topMoroccanCities } from "../../data/cities";
// import { buildUrl } from "@/lib/utils";
// import SearchForm from "../components/SearchForm";
// import { PropertyStatus, PropertyType } from "@prisma/client";

// const BuyPage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Banner */}
//       <div className="relative h-[60vh] w-full">
//         <Image
//           src="/Maroc/maroc.jpg"
//           alt="Luxury properties in Morocco"
//           fill
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-black/50" />
//         <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
//           <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
//             Trouvez votre bien immobilier au Maroc
//           </h1>
//           <p className="text-xl md:text-2xl text-center max-w-3xl">
//             Des propriétés exceptionnelles dans les plus belles villes du
//             royaume
//           </p>
//         </div>
//       </div>

//       {/* Description Section */}
//       <div className="max-w-7xl mx-auto px-4 py-16">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl font-bold mb-6">
//             Pourquoi acheter au Maroc ?
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="p-6 bg-white rounded-lg shadow-sm">
//               <h3 className="text-xl font-semibold mb-3">Marché Dynamique</h3>
//               <p className="text-gray-600">
//                 Un secteur immobilier en constante évolution avec des
//                 {/* eslint-disable-next-line react/no-unescaped-entities */}
//                 opportunités d'investissement attractives
//               </p>
//             </div>
//             <div className="p-6 bg-white rounded-lg shadow-sm">
//               <h3 className="text-xl font-semibold mb-3">Cadre de Vie</h3>
//               <p className="text-gray-600">
//                 Un climat agréable, une riche culture et une hospitalité
//                 légendaire
//               </p>
//             </div>
//             <div className="p-6 bg-white rounded-lg shadow-sm">
//               <h3 className="text-xl font-semibold mb-3">
//                 Infrastructure Moderne
//               </h3>
//               <p className="text-gray-600">
//                 Des villes en plein développement avec des infrastructures de
//                 qualité
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Cities Section */}
//         <h2 className="text-3xl font-bold mb-8 text-center">
//           Découvrez nos propriétés par ville
//         </h2>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {topMoroccanCities.map((city) => (
//             <Link href={buildUrl(city.name, "Vente")} key={city.name}>
//               <Card className="h-full hover:scale-105 transition-transform duration-200">
//                 <CardBody className="p-0">
//                   <div className="relative h-48 w-full">
//                     <Image
//                       src={city.image}
//                       alt={city.name}
//                       fill
//                       className="object-cover rounded-t-xl"
//                     />
//                   </div>
//                   <div className="p-6">
//                     <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
//                     <p className="text-gray-600 mb-4">{city.description}</p>
//                     <div className="flex flex-col gap-1">
//                       <p className="text-sm">
//                         <span className="font-semibold">
//                           {city.propertyCount}
//                         </span>{" "}
//                         propriétés disponibles
//                       </p>
//                       <p className="text-sm">
//                         Prix moyen:{" "}
//                         <span className="font-semibold">
//                           {city.averagePrice}
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </CardBody>
//                 <CardFooter className="bg-gray-50">
//                   <p className="text-primary w-full text-center">
//                     Voir les propriétés →
//                   </p>
//                 </CardFooter>
//               </Card>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Search Form */}
//       <div className="w-full max-w-7xl mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold mb-8 text-center">
//           Affinez votre recherche immobilière
//         </h2>
//         <div className="px-4">
//           <SearchForm
//             defaultValues={{
//               ville: "",
//               categorie: "Appartement",
//               budget: "",
//               chambres: "",
//             }}
//             defaultActiveTab="Vente"
//             backgroundColor="bg-black"
//           />
//         </div>
//       </div>

//       {/* Contact Section */}
//       <div className="bg-primary text-white py-16 mt-16">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-6">
//             {/* eslint-disable-next-line react/no-unescaped-entities */}
//             Besoin d'aide pour votre projet immobilier ?
//           </h2>
//           <p className="text-xl mb-8">
//             Nos conseillers sont là pour vous accompagner dans votre recherche
//           </p>
//           <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
//             Contactez-nous
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BuyPage;

import React from "react";
import { getCityStatsData } from "./actions";
import { CityGrid } from "./components/CityGrid";
import SearchFormWrapper from "./components/SearchFormWrapper";
import HeroBanner from "@/components/ui/HeroBanner";
import ContactSection from "@/components/ui/ContactSection";
import BenefitsSection from "@/components/ui/BenefitsSection";
import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
import SectionHeader from "@/components/ui/SectionHeader";

const benefits: BenefitProps[] = [
  {
    title: "Marché Dynamique",
    description:
      "Un secteur immobilier en constante évolution avec des opportunités d'investissement attractives",
  },
  {
    title: "Cadre de Vie",
    description:
      "Un climat agréable, une riche culture et une hospitalité légendaire",
  },
  {
    title: "Infrastructure Moderne",
    description:
      "Des villes en plein développement avec des infrastructures de qualité",
  },
];

const BuyPage: React.FC = async () => {
  const citiesWithStats = await getCityStatsData();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner
        imageSrc="/Maroc/maroc.jpg"
        imageAlt="Luxury properties in Morocco"
        title="Trouvez votre bien immobilier au Maroc"
        subtitle="Des propriétés exceptionnelles dans les plus belles villes du royaume"
        imageQuality={95}
        height="h-[60vh]"
        overlayOpacity={60}
        blurIntensity={2}
        isPriority={true}
        titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
        subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
      >
        {/* <button className="mt-8">Call to Action</button> */}
      </HeroBanner>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Benefits Section */}
        {/* <section className="text-center" aria-labelledby="benefits-title">
          <h2 id="benefits-title" className="text-3xl font-bold mb-8">
            Pourquoi acheter au Maroc ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <BenefitCard key={benefit.title} {...benefit} />
            ))}
          </div>
        </section> */}
        <BenefitsSection
          title="Pourquoi acheter au Maroc ?"
          benefits={benefits}
        />

        {/* Cities Section */}
        <section aria-labelledby="cities-title">
          <SectionHeader
            id="cities-title"
            title="Découvrez nos propriétés par ville"
          />

          <CityGrid cities={citiesWithStats} />
        </section>

        {/* Search Form Section */}

        <section className="w-full" aria-labelledby="search-title">
          <SectionHeader
            id="search-title"
            title="Affinez votre recherche immobilière"
          />
          <div className="px-4">
            <SearchFormWrapper />
          </div>
        </section>
      </main>

      {/* Contact Section */}

      <ContactSection />
    </div>
  );
};

export default BuyPage;
