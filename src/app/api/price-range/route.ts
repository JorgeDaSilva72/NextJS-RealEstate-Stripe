import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Start with the simplest query - all active, published properties
    let result: { _min: { price: number | null }; _max: { price: number | null } } = await prisma.property.aggregate({
      where: {
        isActive: true,
        publishedAt: {
          not: null,
          lte: new Date(),
        },
      },
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    // If no results, try with subscription filter (more restrictive)
    if (result._min.price === null || result._max.price === null) {
      result = await prisma.property.aggregate({
        where: {
          isActive: true,
          publishedAt: {
            not: null,
            lte: new Date(),
          },
          user: {
            subscriptions: {
              some: {
                endDate: {
                  gt: new Date(),
                },
                status: "ACTIVE",
              },
            },
          },
        },
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      });
    }

    // If still no results, get from all properties (fallback)
    if (result._min.price === null || result._max.price === null) {
      result = await prisma.property.aggregate({
        _min: {
          price: true,
        },
        _max: {
          price: true,
        },
      });
    }

    const minPrice = result._min.price ?? 0;
    const maxPrice = result._max.price ?? (minPrice > 0 ? minPrice * 10 : 1000000);

    // Ensure we have valid values
    if (minPrice === 0 && maxPrice === 0) {
      console.warn("No properties found, using default values");
      return NextResponse.json(
        {
          minPrice: 0,
          maxPrice: 1000000,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      minPrice,
      maxPrice,
    });
  } catch (error) {
    console.error("Error fetching price range:", error);
    // Return default values on error
    return NextResponse.json(
      {
        minPrice: 0,
        maxPrice: 1000000,
      },
      { status: 500 }
    );
  }
}

