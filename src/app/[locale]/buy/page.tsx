// import React from "react";
// import { getCityStatsData } from "./actions";
// import { CityGrid } from "./components/CityGrid";
// import SearchFormWrapper from "../../../components/ui/SearchFormWrapper";
// import HeroBanner from "@/components/ui/HeroBanner";
// import ContactSection from "@/components/ui/ContactSection";
// import BenefitsSection from "@/components/ui/BenefitsSection";
// import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
// import SectionHeader from "@/components/ui/SectionHeader";

// const benefits: BenefitProps[] = [
//   {
//     title: "Marché Dynamique",
//     description:
//       "Un secteur immobilier en constante évolution avec des opportunités d'investissement attractives",
//   },
//   {
//     title: "Cadre de Vie",
//     description:
//       "Un climat agréable, une riche culture et une hospitalité légendaire",
//   },
//   {
//     title: "Infrastructure Moderne",
//     description:
//       "Des villes en plein développement avec des infrastructures de qualité",
//   },
// ];

// const BuyPage: React.FC = async () => {
//   const citiesWithStats = await getCityStatsData();

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <HeroBanner
//         imageSrc="/Maroc/maroc_to_buy.jpg"
//         imageAlt="Luxury properties in Morocco"
//         title="Trouvez votre bien immobilier au Maroc"
//         subtitle="Des propriétés exceptionnelles dans les plus belles villes du royaume"
//         imageQuality={95}
//         height="h-[60vh]"
//         overlayOpacity={20}
//         blurIntensity={2}
//         isPriority={true}
//         titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
//         subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
//       >
//         {/* <button className="mt-8">Call to Action</button> */}
//       </HeroBanner>

//       <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
//         {/* Benefits Section */}

//         <BenefitsSection
//           title="Pourquoi acheter au Maroc ?"
//           benefits={benefits}
//         />

//         {/* Cities Section */}
//         <section aria-labelledby="cities-title">
//           <SectionHeader
//             id="cities-title"
//             title="Découvrez nos propriétés par ville"
//           />

//           <CityGrid cities={citiesWithStats} />
//         </section>

//         {/* Search Form Section */}

//         <section className="w-full" aria-labelledby="search-title">
//           <SectionHeader
//             id="search-title"
//             title="Affinez votre recherche immobilière"
//           />
//           <div className="px-4">
//             <SearchFormWrapper
//               defaultValues={{
//                 ville: "",
//                 categorie: "Appartement",
//                 budget: "",
//                 chambres: "",
//               }}
//               defaultActiveTab="Vente"
//               backgroundColor="bg-black"
//             />
//           </div>
//         </section>
//         {/* Contact Section */}

//         <ContactSection />
//       </main>
//     </div>
//   );
// };

// export default BuyPage;

// next-intl with deepseek
import React from "react";
import { getCityStatsData } from "./actions";
import { CityGrid } from "./components/CityGrid";
import SearchFormWrapper from "../../../components/ui/SearchFormWrapper";
import HeroBanner from "@/components/ui/HeroBanner";
import ContactSection from "@/components/ui/ContactSection";
import BenefitsSection from "@/components/ui/BenefitsSection";
import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { getTranslations } from "next-intl/server";

const BuyPage: React.FC = async () => {
  const t = await getTranslations("BuyPage");
  const citiesWithStats = await getCityStatsData();

  // Récupérer les avantages traduits
  const benefits: BenefitProps[] = t.raw("benefits").map((benefit: any) => ({
    title: benefit.title,
    description: benefit.description,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner
        imageSrc="/Maroc/maroc_to_buy.jpg"
        imageAlt="Luxury properties in Morocco"
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        imageQuality={95}
        height="h-[60vh]"
        overlayOpacity={20}
        blurIntensity={2}
        isPriority={true}
        titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
        subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
      >
        {/* <button className="mt-8">Call to Action</button> */}
      </HeroBanner>

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Benefits Section */}
        <BenefitsSection title={t("benefitsTitle")} benefits={benefits} />

        {/* Cities Section */}
        <section aria-labelledby="cities-title">
          <SectionHeader id="cities-title" title={t("citiesTitle")} />
          <CityGrid cities={citiesWithStats} />
        </section>

        {/* Search Form Section */}
        <section className="w-full" aria-labelledby="search-title">
          <SectionHeader id="search-title" title={t("searchTitle")} />
          <div className="px-4">
            <SearchFormWrapper
              defaultValues={{
                ville: "",
                categorie: "Appartement",
                budget: "",
                chambres: "",
              }}
              defaultActiveTab="Vente"
              backgroundColor="bg-black"
            />
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>
    </div>
  );
};

export default BuyPage;
