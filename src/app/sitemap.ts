import { MetadataRoute } from 'next';
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://afriqueavenirimmobilier.com"; 

  // 1. Récupérer tous les biens immobiliers actifs depuis la DB
  const properties = await prisma.property.findMany({
    where: { 
        // Ajoutez vos filtres si nécessaire (ex: seulement les biens publiés)
    },
    select: {
      id: true,
      updatedAt: true,
    },
  });

  // 2. Générer les URLs pour chaque bien (en version FR et EN si possible)
  const propertyEntries = properties.flatMap((prop) => [
    {
      url: `${baseUrl}/fr/property/${prop.id}`,
      lastModified: prop.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/property/${prop.id}`,
      lastModified: prop.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]);

  // 3. Pages statiques principales
  const staticPages = ['', '/about', '/contact', '/properties'].flatMap((path) => [
    {
      url: `${baseUrl}/fr${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    },
  ]);

  return [...staticPages, ...propertyEntries];
}