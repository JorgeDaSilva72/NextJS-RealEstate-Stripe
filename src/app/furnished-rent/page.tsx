"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { topMoroccanCitiesForFurnishedRental } from "../../data/cities";
import { buildUrl } from "@/lib/utils";
import SearchForm from "../components/SearchForm";

const FurnishedRentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/Maroc/maroc.jpg"
          alt="Locations meublées au Maroc"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Locations Meublées au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl">
            Des appartements et villas meublés prêts à vivre dans les plus
            belles villes du royaume
          </p>
        </div>
      </div>

      {/* Avantages Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Les avantages de la location meublée
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Emménagement Immédiat
              </h3>
              <p className="text-gray-600">
                Logements entièrement équipés et prêts à vivre dès votre arrivée
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Confort Premium</h3>
              <p className="text-gray-600">
                Mobilier de qualité, équipements modernes et services inclus
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Flexibilité Maximale
              </h3>
              <p className="text-gray-600">
                Baux adaptables et possibilité de location courte ou longue
                durée
              </p>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <h2 className="text-3xl font-bold mb-8 text-center">
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
        </div>
      </div>

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
              <p className="text-gray-600">Équipements complets et modernes</p>
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
            defaultActiveTab="Location meublée"
            backgroundColor="bg-black"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Envie d'en savoir plus sur nos locations meublées ?
          </h2>
          <p className="text-xl mb-8">
            Nos conseillers vous accompagnent dans votre recherche de location
            meublée
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
};

export default FurnishedRentPage;
