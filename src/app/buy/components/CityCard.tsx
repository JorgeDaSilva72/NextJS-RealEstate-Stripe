// src/app/buy/components/CityCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import { buildUrl } from "@/lib/utils";

// interface City {
//     name: string;
//     image: string;
//     description: string;
//     propertyCount: number;
//     averagePrice: string;
//     isPriority?: boolean;
//   }

//   interface CityCardProps {
//     city: City;
//   }

interface CityCardProps {
  city: {
    name: string;
    image: string;
    description: string;
    propertyCount: number;
    averagePrice: string;
    isPriority?: boolean;
  };
}

export const CityCard: React.FC<CityCardProps> = ({ city }) => {
  return (
    <Link href={buildUrl(city.name, "Vente")} className="block h-full">
      <Card className="h-full hover:scale-105 transition-transform duration-200">
        <CardBody className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover rounded-t-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={city.isPriority}
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
                Prix moyen sur notre site:{" "}
                <span className="font-semibold">{city.averagePrice}</span>
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
  );
};
