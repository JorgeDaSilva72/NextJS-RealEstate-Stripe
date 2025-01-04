// src/app/buy/components/CityGrid.tsx
"use client";

import { CityCard } from "@/app/buy/components/CityCard"; // Chemin absolu

interface CityGridProps {
  cities: Array<{
    name: string;
    image: string;
    description: string;
    propertyCount: number;
    averagePrice: string;
  }>;
}

export function CityGrid({ cities }: CityGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <CityCard key={city.name} city={city} />
      ))}
    </div>
  );
}
