// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/lib/prisma";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids)) {
//       return res.status(400).json({ error: "Invalid request payload" });
//     }

//     // Requête pour récupérer les propriétés favorites depuis Prisma

//     try {
//       const favoriteProperties = await prisma.property.findMany({
//         where: {
//           id: {
//             in: ids, // Filtre basé sur les IDs favoris
//           },
//         },
//         select: {
//           id: true,
//           name: true,
//           price: true,
//           images: {
//             select: {
//               url: true,
//             },
//           },
//           location: {
//             select: {
//               city: true,
//               state: true,
//             },
//           },
//           feature: {
//             select: {
//               area: true,
//               bedrooms: true,
//               bathrooms: true,
//               parkingSpots: true,
//             },
//           },
//           status: true,
//           type: true,
//         },
//       });
//       res.status(200).json(favoriteProperties);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des propriétés :", error);
//       res.status(500).json({ error: "Erreur serveur" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
// end ------------------------------------------------

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Gère uniquement la méthode POST
export async function POST(req: Request) {
  try {
    // Récupérer le corps de la requête
    const body = await req.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    // Requête pour récupérer les propriétés favorites depuis Prisma
    const favoriteProperties = await prisma.property.findMany({
      where: {
        id: {
          in: ids, // Filtre basé sur les IDs favoris
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          select: {
            url: true,
          },
        },
        location: {
          select: {
            city: true,
            state: true,
          },
        },
        feature: {
          select: {
            area: true,
            bedrooms: true,
            bathrooms: true,
            parkingSpots: true,
          },
        },
        status: true,
        type: true,
      },
    });

    return NextResponse.json(favoriteProperties);
  } catch (error) {
    console.error("Erreur lors de la récupération des propriétés :", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}

// Gérer les autres méthodes HTTP
export async function GET() {
  return NextResponse.json(
    { error: "GET method not supported on this route." },
    { status: 405 }
  );
}
