import { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale || "fr";
  return {
    title: locale === "fr" 
      ? "Blog - Afrique Avenir Immobilier"
      : "Blog - Afrique Avenir Immobilier",
    description: locale === "fr"
      ? "Articles et actualités sur l'immobilier en Afrique"
      : "Articles and news about real estate in Africa",
  };
}

interface BlogPost {
  id: number;
  title: { fr: string; en: string };
  excerpt: { fr: string; en: string };
  content: { fr: string; en: string };
  author: string;
  date: string;
  category: { fr: string; en: string };
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: {
      fr: "Guide complet pour investir dans l'immobilier en Afrique",
      en: "Complete Guide to Investing in Real Estate in Africa"
    },
    excerpt: {
      fr: "Découvrez les opportunités d'investissement immobilier dans les principales villes africaines. Ce guide vous aidera à comprendre le marché et à faire les bons choix.",
      en: "Discover real estate investment opportunities in major African cities. This guide will help you understand the market and make the right choices."
    },
    content: {
      fr: "L'Afrique offre de nombreuses opportunités d'investissement immobilier. Les marchés émergents présentent un potentiel de croissance significatif. Dans cet article, nous explorons les meilleures villes pour investir, les tendances du marché, et les conseils pratiques pour réussir votre investissement.",
      en: "Africa offers many real estate investment opportunities. Emerging markets present significant growth potential. In this article, we explore the best cities to invest in, market trends, and practical tips for successful investment."
    },
    author: "Équipe Afrique Avenir",
    date: "2024-01-15",
    category: { fr: "Investissement", en: "Investment" },
    image: "/Hero1.jpg"
  },
  {
    id: 2,
    title: {
      fr: "Les tendances du marché immobilier en 2024",
      en: "Real Estate Market Trends in 2024"
    },
    excerpt: {
      fr: "Analyse des tendances actuelles du marché immobilier africain. Prix, demande, et perspectives d'avenir pour les investisseurs.",
      en: "Analysis of current trends in the African real estate market. Prices, demand, and future prospects for investors."
    },
    content: {
      fr: "Le marché immobilier africain connaît une croissance constante. Les prix augmentent dans les grandes métropoles, tandis que de nouvelles opportunités émergent dans les villes secondaires. Les investisseurs doivent rester informés des dernières tendances.",
      en: "The African real estate market is experiencing steady growth. Prices are rising in major metropolises, while new opportunities are emerging in secondary cities. Investors must stay informed of the latest trends."
    },
    author: "Équipe Afrique Avenir",
    date: "2024-02-10",
    category: { fr: "Marché", en: "Market" },
    image: "/Hero1.jpg"
  },
  {
    id: 3,
    title: {
      fr: "Comment choisir le bon bien immobilier",
      en: "How to Choose the Right Property"
    },
    excerpt: {
      fr: "Conseils pratiques pour choisir un bien immobilier qui correspond à vos besoins et à votre budget. Critères à considérer et erreurs à éviter.",
      en: "Practical tips for choosing a property that meets your needs and budget. Criteria to consider and mistakes to avoid."
    },
    content: {
      fr: "Choisir le bon bien immobilier nécessite une analyse approfondie. Il faut considérer la localisation, l'état du bien, le prix, et le potentiel de revente. Cet article vous guide à travers tous ces aspects importants.",
      en: "Choosing the right property requires thorough analysis. You need to consider location, property condition, price, and resale potential. This article guides you through all these important aspects."
    },
    author: "Équipe Afrique Avenir",
    date: "2024-03-05",
    category: { fr: "Conseils", en: "Tips" },
    image: "/Hero1.jpg"
  },
  {
    id: 4,
    title: {
      fr: "Immobilier neuf vs ancien : avantages et inconvénients",
      en: "New vs Old Real Estate: Advantages and Disadvantages"
    },
    excerpt: {
      fr: "Comparaison entre l'achat d'un bien neuf et d'un bien ancien. Avantages, inconvénients, et conseils pour faire le bon choix selon votre situation.",
      en: "Comparison between buying new and old properties. Advantages, disadvantages, and tips for making the right choice based on your situation."
    },
    content: {
      fr: "L'achat d'un bien neuf offre des avantages comme la garantie décennale et des équipements modernes. Les biens anciens peuvent être plus abordables et mieux situés. Découvrez quel type correspond le mieux à vos besoins.",
      en: "Buying a new property offers advantages like the ten-year warranty and modern equipment. Older properties can be more affordable and better located. Discover which type best suits your needs."
    },
    author: "Équipe Afrique Avenir",
    date: "2024-03-20",
    category: { fr: "Guide", en: "Guide" },
    image: "/Hero1.jpg"
  },
  {
    id: 5,
    title: {
      fr: "Financement immobilier en Afrique : options et conseils",
      en: "Real Estate Financing in Africa: Options and Tips"
    },
    excerpt: {
      fr: "Explorez les différentes options de financement disponibles pour l'achat immobilier en Afrique. Prêts bancaires, crédits, et alternatives.",
      en: "Explore the different financing options available for real estate purchases in Africa. Bank loans, credits, and alternatives."
    },
    content: {
      fr: "Le financement immobilier en Afrique évolue rapidement. De nouvelles options apparaissent, rendant l'accession à la propriété plus accessible. Nous vous présentons les meilleures solutions disponibles.",
      en: "Real estate financing in Africa is evolving rapidly. New options are emerging, making homeownership more accessible. We present the best available solutions."
    },
    author: "Équipe Afrique Avenir",
    date: "2024-04-01",
    category: { fr: "Financement", en: "Financing" },
    image: "/Hero1.jpg"
  },
  {
    id: 6,
    title: {
      fr: "Les meilleures villes pour investir en 2024",
      en: "Best Cities to Invest in 2024"
    },
    excerpt: {
      fr: "Découvrez les villes africaines les plus prometteuses pour l'investissement immobilier cette année. Analyse des marchés locaux et opportunités.",
      en: "Discover the most promising African cities for real estate investment this year. Analysis of local markets and opportunities."
    },
    content: {
      fr: "Certaines villes africaines offrent des opportunités d'investissement exceptionnelles. Nous avons analysé les marchés pour identifier les meilleures destinations pour les investisseurs en 2024.",
      en: "Some African cities offer exceptional investment opportunities. We have analyzed the markets to identify the best destinations for investors in 2024."
    },
    author: "Équipe Afrique Avenir",
    date: "2024-04-15",
    category: { fr: "Investissement", en: "Investment" },
    image: "/Hero1.jpg"
  }
];

export default function BlogPage({ params }: { params: { locale: string } }) {
  const locale = params.locale || "fr";
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {locale === "fr" ? "Blog Immobilier" : "Real Estate Blog"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {locale === "fr" 
              ? "Découvrez nos articles sur l'immobilier en Afrique, les tendances du marché, et les conseils d'investissement."
              : "Discover our articles on real estate in Africa, market trends, and investment tips."}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                <Image
                  src={post.image}
                  alt={post.title[locale as "fr" | "en"]}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    {post.category[locale as "fr" | "en"]}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                  {post.title[locale as "fr" | "en"]}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt[locale as "fr" | "en"]}
                </p>
                <Link 
                  href={`/${locale}/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                >
                  {locale === "fr" ? "Lire la suite" : "Read more"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
