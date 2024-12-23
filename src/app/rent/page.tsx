"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { topMoroccanCitiesForRent } from "../data/cities";
import { buildUrl, capitalizeFirstLetter } from "@/lib/utils";
import SearchForm from "../components/SearchForm";

const RentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/Maroc/maroc.jpg"
          alt="Locations immobilières au Maroc"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Louez votre bien immobilier au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl">
            Des locations de qualité dans les plus belles villes du royaume
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Pourquoi louer au Maroc ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Flexibilité</h3>
              <p className="text-gray-600">
                Des options de location variées pour tous les budgets et toutes
                les durées
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Qualité de Vie</h3>
              <p className="text-gray-600">
                Un mode de vie agréable dans des quartiers dynamiques et bien
                desservis
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Simplicité</h3>
              <p className="text-gray-600">
                Un processus de location transparent avec un accompagnement
                personnalisé
              </p>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Trouvez votre location par ville
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMoroccanCitiesForRent.map((city) => (
            <Link href={buildUrl(city.name, "Location")} key={city.name}>
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
                        locations disponibles
                      </p>
                      <p className="text-sm">
                        Loyer moyen:{" "}
                        <span className="font-semibold">
                          {city.averagePrice}
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
          ))}
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
              categorie: "Appartement",
              budget: "",
              chambres: "",
            }}
            defaultActiveTab="Location"
            backgroundColor="bg-black"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Besoin d'aide pour trouver votre location idéale ?
          </h2>
          <p className="text-xl mb-8">
            Nos experts en location sont à votre disposition pour vous guider
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentPage;
