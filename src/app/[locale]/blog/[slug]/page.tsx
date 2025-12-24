import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";

interface Props {
  params: { locale: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale || "fr";
  const post = getBlogPostBySlug(params.slug, locale);

  if (!post) {
    return {
      title: locale === "fr" ? "Article non trouvé" : "Post Not Found",
    };
  }

  return {
    title: `${post.title} - Afrique Avenir Immobilier`,
    description: post.excerpt,
  };
}

// Blog post interface
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: Date;
  author: {
    name: string;
    avatarUrl?: string;
  };
  category: string;
  readTime: number;
}

// Get blog post by slug
const getBlogPostBySlug = (slug: string, locale: string): BlogPost | null => {
  const allPosts: BlogPost[] = [
    {
      id: 1,
      title:
        locale === "fr"
          ? "Guinée Conakry : Le Marché Immobilier Sous-Côté Que Les Investisseurs Devraient Surveiller"
          : "Guinea Conakry: The Underrated Real Estate Market That Investors Should Monitor",
      slug: "guinee-conakry-marche-immobilier-sous-cote",
      excerpt:
        locale === "fr"
          ? "L'Afrique de l'Ouest regorge d'opportunités immobilières. Si le Sénégal, la Côte d'Ivoire et le Ghana attirent déjà l'attention des investisseurs, la Guinée Conakry reste un marché sous-côté et une véritable pépite pour ceux qui savent où chercher."
          : "West Africa is full of real estate opportunities. While Senegal, Côte d'Ivoire and Ghana are already attracting investors' attention, Guinea Conakry remains an underrated market and a true gem for those who know where to look.",
      content: locale === "fr" 
        ? `<h2>Introduction</h2>
        <p>L'Afrique de l'Ouest regorge d'opportunités immobilières. Si le Sénégal, la Côte d'Ivoire et le Ghana attirent déjà l'attention des investisseurs, la Guinée Conakry reste un marché sous-côté et une véritable pépite pour ceux qui savent où chercher.</p>
        
        <h2>Pourquoi la Guinée Conakry ?</h2>
        <p>La Guinée Conakry présente plusieurs avantages pour les investisseurs immobiliers :</p>
        <ul>
          <li>Croissance démographique importante</li>
          <li>Développement économique en cours</li>
          <li>Prix immobiliers encore accessibles</li>
          <li>Potentiel de valorisation élevé</li>
        </ul>
        
        <h2>Les secteurs porteurs</h2>
        <p>Plusieurs secteurs immobiliers sont particulièrement prometteurs en Guinée Conakry, notamment l'immobilier résidentiel et commercial dans la capitale.</p>
        
        <h2>Conclusion</h2>
        <p>La Guinée Conakry représente une opportunité unique pour les investisseurs qui cherchent à diversifier leur portefeuille en Afrique de l'Ouest.</p>`
        : `<h2>Introduction</h2>
        <p>West Africa is full of real estate opportunities. While Senegal, Côte d'Ivoire and Ghana are already attracting investors' attention, Guinea Conakry remains an underrated market and a true gem for those who know where to look.</p>
        
        <h2>Why Guinea Conakry?</h2>
        <p>Guinea Conakry offers several advantages for real estate investors:</p>
        <ul>
          <li>Significant demographic growth</li>
          <li>Ongoing economic development</li>
          <li>Still affordable property prices</li>
          <li>High appreciation potential</li>
        </ul>
        
        <h2>Promising Sectors</h2>
        <p>Several real estate sectors are particularly promising in Guinea Conakry, especially residential and commercial real estate in the capital.</p>
        
        <h2>Conclusion</h2>
        <p>Guinea Conakry represents a unique opportunity for investors looking to diversify their portfolio in West Africa.</p>`,
      imageUrl: "/Hero1.jpg",
      publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      author: {
        name: "Expert Immobilier",
        avatarUrl: "/logo-topaz-enhance-coupe.jpeg",
      },
      category: locale === "fr" ? "Actualité, Immobilier" : "News, Real Estate",
      readTime: 8,
    },
    {
      id: 2,
      title:
        locale === "fr"
          ? "Peut-On Vraiment Investir En Afrique Avec 5 000 € ?"
          : "Can You Really Invest In Africa With 5,000 €?",
      slug: "investir-afrique-5000-euros",
      excerpt:
        locale === "fr"
          ? "Beaucoup pensent qu'investir dans l'immobilier en Afrique nécessite un capital important. Pourtant, avec seulement 5 000 €, il est possible de se lancer dans l'investissement immobilier. Découvrez comment démystifier les idées reçues et expliquer concrètement comment procéder."
          : "Many think that investing in real estate in Africa requires significant capital. However, with just 5,000 €, it is possible to start investing in real estate. Discover how to debunk misconceptions and explain concretely how to proceed.",
      content: locale === "fr"
        ? `<h2>Introduction</h2>
        <p>Beaucoup pensent qu'investir dans l'immobilier en Afrique nécessite un capital important. Pourtant, avec seulement 5 000 €, il est possible de se lancer dans l'investissement immobilier.</p>
        
        <h2>Les opportunités avec 5 000 €</h2>
        <p>Avec 5 000 €, vous pouvez :</p>
        <ul>
          <li>Acquérir un terrain dans certaines zones</li>
          <li>Investir dans des projets en cours de développement</li>
          <li>Participer à des investissements groupés</li>
        </ul>
        
        <h2>Stratégies d'investissement</h2>
        <p>Plusieurs stratégies s'offrent à vous pour maximiser votre investissement initial de 5 000 €.</p>
        
        <h2>Conclusion</h2>
        <p>Investir en Afrique avec 5 000 € est non seulement possible, mais peut être très rentable si vous choisissez les bons projets.</p>`
        : `<h2>Introduction</h2>
        <p>Many think that investing in real estate in Africa requires significant capital. However, with just 5,000 €, it is possible to start investing in real estate.</p>
        
        <h2>Opportunities with 5,000 €</h2>
        <p>With 5,000 €, you can:</p>
        <ul>
          <li>Acquire land in certain areas</li>
          <li>Invest in projects under development</li>
          <li>Participate in group investments</li>
        </ul>
        
        <h2>Investment Strategies</h2>
        <p>Several strategies are available to maximize your initial investment of 5,000 €.</p>
        
        <h2>Conclusion</h2>
        <p>Investing in Africa with 5,000 € is not only possible, but can be very profitable if you choose the right projects.</p>`,
      imageUrl: "/Hero2.jpg",
      publishedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      author: {
        name: "Conseiller Investissement",
        avatarUrl: "/logo-topaz-enhance-coupe.jpeg",
      },
      category: locale === "fr" ? "Non classé" : "Uncategorized",
      readTime: 6,
    },
    {
      id: 3,
      title:
        locale === "fr"
          ? "Comment Obtenir Ton Permis De Construire En Côte D'Ivoire : Guide Complet"
          : "How To Obtain Your Building Permit In Côte D'Ivoire: Complete Guide",
      slug: "permis-construire-cote-ivoire-guide",
      excerpt:
        locale === "fr"
          ? "Obtenir un permis de construire en Côte d'Ivoire peut sembler complexe. Ce guide complet vous explique étape par étape le processus administratif, simplifie les démarches et répond à vos préoccupations concernant la construction sans autorisation."
          : "Obtaining a building permit in Côte d'Ivoire can seem complex. This complete guide explains the administrative process step by step, simplifies procedures and addresses your concerns about building without authorization.",
      content: locale === "fr"
        ? `<h2>Introduction</h2>
        <p>Obtenir un permis de construire en Côte d'Ivoire peut sembler complexe. Ce guide complet vous explique étape par étape le processus administratif.</p>
        
        <h2>Les documents nécessaires</h2>
        <p>Pour obtenir votre permis de construire, vous devez fournir :</p>
        <ul>
          <li>Un plan de situation</li>
          <li>Un plan de masse</li>
          <li>Les plans architecturaux</li>
          <li>Le titre de propriété</li>
        </ul>
        
        <h2>Le processus étape par étape</h2>
        <p>Le processus de demande de permis de construire comprend plusieurs étapes administratives que nous détaillons dans ce guide.</p>
        
        <h2>Délais et coûts</h2>
        <p>Comprenez les délais de traitement et les coûts associés à l'obtention d'un permis de construire en Côte d'Ivoire.</p>
        
        <h2>Conclusion</h2>
        <p>Suivre les bonnes démarches pour obtenir votre permis de construire vous évitera bien des complications et vous permettra de construire en toute légalité.</p>`
        : `<h2>Introduction</h2>
        <p>Obtaining a building permit in Côte d'Ivoire can seem complex. This complete guide explains the administrative process step by step.</p>
        
        <h2>Required Documents</h2>
        <p>To obtain your building permit, you must provide:</p>
        <ul>
          <li>A location plan</li>
          <li>A site plan</li>
          <li>Architectural plans</li>
          <li>Property title</li>
        </ul>
        
        <h2>Step-by-Step Process</h2>
        <p>The building permit application process includes several administrative steps that we detail in this guide.</p>
        
        <h2>Timelines and Costs</h2>
        <p>Understand processing times and costs associated with obtaining a building permit in Côte d'Ivoire.</p>
        
        <h2>Conclusion</h2>
        <p>Following the right procedures to obtain your building permit will save you many complications and allow you to build legally.</p>`,
      imageUrl: "/Hero3.jpg",
      publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      author: {
        name: "Expert Juridique",
        avatarUrl: "/logo-topaz-enhance-coupe.jpeg",
      },
      category: locale === "fr" ? "Guide, Administration" : "Guide, Administration",
      readTime: 10,
    },
  ];

  return allPosts.find((post) => post.slug === slug) || null;
};

export default async function BlogDetailPage({ params }: Props) {
  const locale = params.locale || "fr";
  const post = getBlogPostBySlug(params.slug, locale);

  if (!post) {
    notFound();
  }

  return <BlogDetailClient post={post} locale={locale} />;
}





