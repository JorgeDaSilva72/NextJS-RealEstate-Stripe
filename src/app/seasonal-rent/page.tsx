"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { topMoroccanCitiesForSeasonalRent } from "../../data/cities";
import { buildUrl } from "@/lib/utils";
import SearchForm from "../components/SearchForm";

const SeasonalRentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/Maroc/maroc.jpg"
          alt="Locations saisonnières au Maroc"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Locations Saisonnières au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl">
            Des séjours inoubliables dans les plus belles destinations du
            royaume
          </p>
        </div>
      </div>

      {/* Seasonal Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Pourquoi choisir une location saisonnière ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Liberté Totale</h3>
              <p className="text-gray-600">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Plus d'espace et de flexibilité qu'à l'hôtel, idéal pour les
                familles et groupes
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Authenticité</h3>
              <p className="text-gray-600">
                Vivez comme un local dans des logements typiques et de caractère
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Rapport Qualité/Prix
              </h3>
              <p className="text-gray-600">
                Des tarifs avantageux pour des prestations haut de gamme
              </p>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Destinations populaires
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMoroccanCitiesForSeasonalRent.map((city) => (
            <Link
              href={buildUrl(city.name, "Location+saisonnière")}
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
                    <div className="flex flex-col gap-2">
                      <p className="text-sm">
                        <span className="font-semibold">
                          {city.propertyCount}
                        </span>{" "}
                        locations saisonnières
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Haute saison:</span>{" "}
                        {city.peakSeason}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">
                          Prix haute saison:
                        </span>{" "}
                        {city.avgPriceHigh}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">
                          Prix basse saison:
                        </span>{" "}
                        {city.avgPriceLow}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Points forts: {city.highlights}
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
          ))}
        </div>
      </div>

      {/* Seasonal Calendar Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Calendrier des saisons
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Printemps (Mars - Mai)</h3>
              <p className="text-gray-600">
                Climat idéal, prix modérés, festivals culturels
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Été (Juin - Août)</h3>
              <p className="text-gray-600">
                Haute saison balnéaire, animations nocturnes
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Automne (Sept - Nov)</h3>
              <p className="text-gray-600">
                Temps agréable, prix attractifs, moins de touristes
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Hiver (Déc - Fév)</h3>
              <p className="text-gray-600">
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Sports d'hiver à Ifrane, tourisme culturel
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Search Form */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
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
            defaultActiveTab="Location saisonnière"
            backgroundColor="bg-black"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Planifiez votre séjour saisonnier
          </h2>
          <p className="text-xl mb-8">
            Nos experts vous aident à trouver la location idéale pour vos
            vacances
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeasonalRentPage;
