// src/lib/db/queries/property.ts

import { prisma } from "@/lib/prisma";

export async function getPropertiesCountByCity() {
  try {
    const cityCounts = await prisma.property.findMany({
      select: {
        location: {
          select: {
            city: true,
          },
        },
      },
      where: {
        statusId: 1, // Assuming 1 is for properties for sale
        location: {
          isNot: null,
        },
      },
    });

    // Manually count properties per city
    const cityMap = cityCounts.reduce((acc, property) => {
      const city = property.location?.city;
      if (city) {
        acc.set(city, (acc.get(city) || 0) + 1);
      }
      return acc;
    }, new Map<string, number>());

    return Array.from(cityMap.entries()).map(([city, count]) => ({
      city,
      propertyCount: count,
    }));
  } catch (error) {
    console.error("Error fetching property counts:", error);
    throw error;
  }
}

export async function getPropertyStatsByCity() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        price: true,
        location: {
          select: {
            city: true,
          },
        },
      },
      where: {
        statusId: 1,
        location: {
          isNot: null,
        },
      },
    });

    // Calculer manuellement les statistiques par ville
    const cityStats = properties.reduce((acc, property) => {
      const city = property.location?.city;
      if (city) {
        if (!acc[city]) {
          acc[city] = {
            count: 0,
            totalPrice: 0,
          };
        }
        acc[city].count += 1;
        acc[city].totalPrice += property.price;
      }
      return acc;
    }, {} as Record<string, { count: number; totalPrice: number }>);

    return Object.entries(cityStats).map(([city, stats]) => ({
      city,
      propertyCount: stats.count,
      averagePrice:
        stats.count > 0
          ? new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(stats.totalPrice / stats.count)
          : "N/A",
    }));
  } catch (error) {
    console.error("Error fetching property stats:", error);
    throw error;
  }
}

// Type pour la réutilisation
export type CityPropertyStats = {
  city: string;
  propertyCount: number;
  averagePrice: string;
};

// Fonction pour obtenir les détails d'une ville spécifique
export async function getCityDetails(cityName: string) {
  try {
    const properties = await prisma.property.findMany({
      where: {
        statusId: 1,
        location: {
          city: cityName,
        },
      },
      include: {
        type: true,
        feature: true,
        images: true,
        location: true,
      },
    });

    const propertyCount = properties.length;
    const totalPrice = properties.reduce((sum, prop) => sum + prop.price, 0);
    const averagePrice = propertyCount > 0 ? totalPrice / propertyCount : 0;

    return {
      city: cityName,
      propertyCount,
      averagePrice: averagePrice
        ? new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(averagePrice)
        : "N/A",
      properties,
    };
  } catch (error) {
    console.error(`Error fetching details for city ${cityName}:`, error);
    throw error;
  }
}
