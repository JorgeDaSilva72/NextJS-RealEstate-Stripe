"use client";

import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { buildUrl } from "@/lib/utils";
import HeroBanner from "@/components/ui/HeroBanner";
import BenefitsSection from "@/components/ui/BenefitsSection";
import SectionHeader from "@/components/ui/SectionHeader";
import SearchFormWrapper from "@/components/ui/SearchFormWrapper";
import ContactSection from "@/components/ui/ContactSection";
import { BenefitProps } from "@/components/ui/BenefitsSection/BenefitCard";
import { CitiesGridSkeleton } from "@/components/ui/CityCardSkeleton";

interface CityDetails {
  name: string;
  image: string;
  description: string;
  propertyCount: number;
  averagePrice: string;
  features: string;
}
const furnishedRentalBenefits: BenefitProps[] = [
  {
    title: "Emménagement Immédiat",
    description:
      "Logements entièrement équipés et prêts à vivre dès votre arrivée",
  },
  {
    title: "Confort Premium",
    description: "Mobilier de qualité, équipements modernes et services inclus",
  },
  {
    title: "Flexibilité Maximale",
    description:
      "Baux adaptables et possibilité de location courte ou longue durée",
  },
];

const FurnishedRentPage = () => {
  const [cities, setCities] = useState<CityDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const CityCard = ({ city }: { city: CityDetails }) => (
    <Link href={buildUrl(city.name, "Location+meublée")}>
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
                biens meublés disponibles
              </p>
              <p className="text-sm">
                Loyer moyen sur notre site:{" "}
                <span className="font-semibold">{city.averagePrice}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Inclus : {city.features}
              </p>
            </div>
          </div>
        </CardBody>
        <CardFooter className="bg-gray-50">
          <p className="text-primary w-full text-center">
            Découvrir les biens →
          </p>
        </CardFooter>
      </Card>
    </Link>
  );

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cityDetailsForFurnishedRent");

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
      {/* Hero Banner */}
      <HeroBanner
        imageSrc="/Maroc/MarocForFurnishedRent.jpg"
        imageAlt="Locations meublées au Maroc"
        title=" Locations Meublées au Maroc"
        subtitle="Des appartements et villas meublés prêts à vivre dans les plus belles villes du royaume"
        imageQuality={95}
        height="h-[60vh]"
        overlayOpacity={0}
        blurIntensity={0}
        isPriority={true}
        titleClassName="text-4xl md:text-6xl font-bold text-center mb-4"
        subtitleClassName="text-xl md:text-2xl text-center max-w-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/*  Benefits Section */}

        <BenefitsSection
          title="Les avantages de la location meublée"
          benefits={furnishedRentalBenefits}
        />

        {/* Cities Section */}
        {/* <h2 className="text-3xl font-bold mb-8 text-center">
          Locations meublées par ville
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMoroccanCitiesForFurnishedRental.map((city) => (
            <Link
              href={buildUrl(city.name, "Location+meublée")}
              key={city.name}
            >
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
                        <span className="font-semibold">
                          {city.propertyCount}
                        </span>{" "}
                        biens meublés disponibles
                      </p>
                      <p className="text-sm">
                        Loyer moyen:{" "}
                        <span className="font-semibold">
                          {city.averagePrice}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Inclus : {city.features}
                      </p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="bg-gray-50">
                  <p className="text-primary w-full text-center">
                    Découvrir les biens →
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div> */}

        {/* Cities Section */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">
            Trouvez votre location meublée par ville
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

        {/* Services Inclus Section */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Services inclus dans nos locations meublées
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Internet Haut Débit</h3>
                <p className="text-gray-600">Wifi fibre optique inclus</p>
              </div>
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Électroménager</h3>
                <p className="text-gray-600">
                  Équipements complets et modernes
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Entretien</h3>
                <p className="text-gray-600">Service de ménage disponible</p>
              </div>
              <div className="bg-white p-6 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Conciergerie</h3>
                <p className="text-gray-600">Assistance 7j/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        {/* <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Affinez votre recherche immobilière
        </h2>
        <div className="px-4">
          <SearchForm
            defaultValues={{
              ville: "",
              categorie: "",
              budget: "",
              chambres: "",
            }}
            defaultActiveTab="Location meublée"
            backgroundColor="bg-black"
          />
        </div>
      </div> */}

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
              defaultActiveTab="Location meublée"
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

export default FurnishedRentPage;
