"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { buildUrl } from "@/lib/utils";
import HeroBanner from "@/components/ui/HeroBanner";
import BenefitsSection from "@/components/ui/BenefitsSection";
import ContactSection from "@/components/ui/ContactSection";
import SectionHeader from "@/components/ui/SectionHeader";
import { CitiesGridSkeleton } from "@/components/ui/CityCardSkeleton";
import SearchFormWrapper from "@/components/ui/SearchFormWrapper";

interface CityDetails {
  name: string;
  image: string;
  description: string;
  propertyCount: number;
  peakSeason: string;
  avgPriceHigh: string;
  avgPriceLow: string;
  highlights: string;
}

const seasonalBenefits = [
  {
    title: "Exclusivité",
    description:
      "Accédez à des locations haut de gamme sélectionnées par nos partenaires et exclusives à AFRIQUE AVENIR.",
  },
  {
    title: "Confiance et Sécurité",
    description:
      "Des propriétés validées par Afrique Avenir pour garantir la qualité.",
  },
  {
    title: "Confort Optimal",
    description:
      "Des hébergements adaptés aux séjours en famille ou entre amis.",
  },
];

const ExclusiveRentalsPage = () => {
  const [cities, setCities] = useState<CityDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CityCard = ({ city }: { city: CityDetails }) => (
    <Link href={buildUrl(city.name, "Location+exclusive")}>
      <Card className="h-full hover:scale-105 transition-transform duration-200">
        <CardBody className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover rounded-t-xl"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">{city.name}</h3>
            <p className="text-gray-600 mb-4">{city.description}</p>
            <div className="flex flex-col gap-1">
              <p className="text-sm">
                <span className="font-semibold">{city.propertyCount}</span>{" "}
                propriétés disponibles
              </p>
              <p className="text-sm">
                <span className="font-semibold">Haute saison :</span>{" "}
                {city.peakSeason}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Prix haute saison :</span>{" "}
                {city.avgPriceHigh}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Prix basse saison :</span>{" "}
                {city.avgPriceLow}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Points forts : {city.highlights}
              </p>
            </div>
          </div>
        </CardBody>
        <CardFooter className="bg-gray-50">
          <p className="text-primary w-full text-center">
            Voir les disponibilités →
          </p>
        </CardFooter>
      </Card>
    </Link>
  );

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cityDetailsForExclusiveRentals");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les détails des locations exclusives");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner
        imageSrc="/Maroc/exclusive-rentals.webp"
        imageAlt="Locations exclusives Afrique Avenir"
        title="Locations Exclusives"
        subtitle="Des séjours uniques dans des propriétés partenaires d'Afrique Avenir"
        imageQuality={95}
        height="h-[60vh]"
        overlayOpacity={0}
        blurIntensity={0}
        isPriority={true}
        titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
        subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Benefits Section */}
        <BenefitsSection
          title="Pourquoi choisir nos locations exclusives ?"
          benefits={seasonalBenefits}
        />

        {/* Cities Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Découvrez nos destinations partenaires
          </h2>

          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Réessayer
              </button>
            </div>
          ) : isLoading ? (
            <CitiesGridSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <CityCard key={city.name} city={city} />
              ))}
            </div>
          )}
        </section>

        {/* Search Form */}
        <section className="w-full" aria-labelledby="search-title">
          <SectionHeader
            id="search-title"
            title="Affinez votre recherche immobilière"
          />
          <div className="px-4">
            <SearchFormWrapper
              defaultValues={{
                ville: "",
                categorie: "",
                budget: "",
                chambres: "",
              }}
              defaultActiveTab="Location exclusive"
              backgroundColor="bg-black"
            />
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full" aria-labelledby="contact-title">
          <SectionHeader
            id="contact-title"
            title="Contactez-nous pour réserver votre séjour exclusif"
          />
          <ContactSection />
        </section>
      </div>
    </div>
  );
};

export default ExclusiveRentalsPage;
