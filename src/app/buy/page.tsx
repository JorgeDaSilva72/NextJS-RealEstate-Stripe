"use client";

import React from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { topMoroccanCities } from "../data/cities";
import { buildUrl, capitalizeFirstLetter } from "@/lib/utils";

const BuyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/Maroc/maroc.jpg"
          alt="Luxury properties in Morocco"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
            Trouvez votre bien immobilier au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl">
            Des propriétés exceptionnelles dans les plus belles villes du
            royaume
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Pourquoi acheter au Maroc ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Marché Dynamique</h3>
              <p className="text-gray-600">
                Un secteur immobilier en constante évolution avec des
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                opportunités d'investissement attractives
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Cadre de Vie</h3>
              <p className="text-gray-600">
                Un climat agréable, une riche culture et une hospitalité
                légendaire
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">
                Infrastructure Moderne
              </h3>
              <p className="text-gray-600">
                Des villes en plein développement avec des infrastructures de
                qualité
              </p>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Découvrez nos propriétés par ville
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMoroccanCities.map((city) => (
            <Link href={buildUrl(city.name, "Vente")} key={city.name}>
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
                        propriétés disponibles
                      </p>
                      <p className="text-sm">
                        Prix moyen:{" "}
                        <span className="font-semibold">
                          {city.averagePrice}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="bg-gray-50">
                  <p className="text-primary w-full text-center">
                    Voir les propriétés →
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-primary text-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Besoin d'aide pour votre projet immobilier ?
          </h2>
          <p className="text-xl mb-8">
            Nos conseillers sont là pour vous accompagner dans votre recherche
          </p>
          <button className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contactez-nous
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyPage;
