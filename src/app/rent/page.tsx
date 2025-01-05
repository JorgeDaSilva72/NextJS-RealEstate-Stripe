"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { buildUrl } from "@/lib/utils";
import ContactSection from "@/components/ui/ContactSection";
import HeroBanner from "@/components/ui/HeroBanner";
import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
import BenefitsSection from "@/components/ui/BenefitsSection";
import SearchFormWrapper from "@/components/ui/SearchFormWrapper";
import SectionHeader from "@/components/ui/SectionHeader";
import { CitiesGridSkeleton } from "@/components/ui/CityCardSkeleton";

interface CityDetails {
  name: string;
  image: string;
  description: string;
  propertyCount: number;
  averagePrice: string;
}

const benefits: BenefitProps[] = [
  {
    title: "Flexibilité",
    description:
      "Des options de location variées pour tous les budgets et toutes les durées",
  },
  {
    title: "Qualité de Vie",
    description:
      "Un mode de vie agréable dans des quartiers dynamiques et bien desservis",
  },
  {
    title: "Simplicité",
    description:
      "Un processus de location transparent avec un accompagnementpersonnalisé",
  },
];

const RentPage = () => {
  const [cities, setCities] = useState<CityDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CityCard = ({ city }: { city: CityDetails }) => (
    <Link href={buildUrl(city.name, "Location")}>
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
                locations disponibles
              </p>
              <p className="text-sm">
                Loyer moyen sur notre site:{" "}
                <span className="font-semibold">
                  {city.averagePrice || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </CardBody>
        <CardFooter className="bg-gray-50">
          <p className="text-primary w-full text-center">
            Voir les locations →
          </p>
        </CardFooter>
      </Card>
    </Link>
  );

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cityDetailsForRent");

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }

        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les détails des villes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCityDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroBanner
        imageSrc="/Maroc/maroc_to_rent.jpg"
        imageAlt="Locations immobilières au Maroc"
        title="Louez votre bien immobilier au Maroc"
        subtitle="Des locations de qualité dans les plus belles villes du royaume"
        imageQuality={95}
        height="h-[60vh]"
        overlayOpacity={20}
        blurIntensity={2}
        isPriority={true}
        titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
        subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Seasonal Benefits Section */}
        <BenefitsSection
          title="Pourquoi louer au Maroc ?"
          benefits={benefits}
        />

        {/* Cities Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Trouvez votre location par ville
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
                categorie: "Appartement",
                budget: "",
                chambres: "",
              }}
              defaultActiveTab="Location"
              backgroundColor="bg-black"
            />
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </div>
    </div>
  );
};

export default RentPage;
