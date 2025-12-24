import HeroSection from "../components/HeroSection";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  FileText,
  Building,
  Camera,
  Video,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

interface Service {
  icon: React.ReactNode;
  title: { fr: string; en: string; pt: string; ar: string };
  description: { fr: string; en: string; pt: string; ar: string };
  features: string[];
  badge?: string;
  color: string;
}

const services: Service[] = [
  {
    icon: <Home className="h-8 w-8" />,
    title: {
      fr: "Publication d'Annonces",
      en: "Property Listings",
      pt: "Listagens de Propriedades",
      ar: "قائمة العقارات",
    },
    description: {
      fr: "Publiez vos biens immobiliers avec des descriptions détaillées, photos haute qualité et informations complètes.",
      en: "List your properties with detailed descriptions, high-quality photos and complete information.",
      pt: "Liste suas propriedades com descrições detalhadas, fotos de alta qualidade e informações completas.",
      ar: "أدرج ممتلكاتك مع أوصاف مفصلة وصور عالية الجودة ومعلومات كاملة.",
    },
    features: [
      "Photos multiples par propriété",
      "Descriptions multilingues",
      "Géolocalisation précise",
      "Statut de disponibilité",
    ],
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: {
      fr: "Recherche Avancée",
      en: "Advanced Search",
      pt: "Pesquisa Avançada",
      ar: "بحث متقدم",
    },
    description: {
      fr: "Trouvez le bien idéal grâce à nos filtres avancés : prix, localisation, type, caractéristiques et plus encore.",
      en: "Find the perfect property with our advanced filters: price, location, type, features and more.",
      pt: "Encontre a propriedade perfeita com nossos filtros avançados: preço, localização, tipo, características e muito mais.",
      ar: "اعثر على العقار المثالي باستخدام فلاترنا المتقدمة: السعر والموقع والنوع والميزات والمزيد.",
    },
    features: [
      "Filtres multiples",
      "Recherche par carte",
      "Sauvegarde de recherches",
      "Alertes personnalisées",
    ],
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Camera className="h-8 w-8" />,
    title: {
      fr: "Photographie Professionnelle",
      en: "Professional Photography",
      pt: "Fotografia Profissional",
      ar: "التصوير الفوتوغرافي المهني",
    },
    description: {
      fr: "Mettez en valeur vos propriétés avec des photos professionnelles de qualité supérieure.",
      en: "Showcase your properties with high-quality professional photography.",
      pt: "Mostre suas propriedades com fotografia profissional de alta qualidade.",
      ar: "اعرض ممتلكاتك بتصوير فوتوغرافي احترافي عالي الجودة.",
    },
    features: [
      "Sessions photo dédiées",
      "Édition professionnelle",
      "Galerie virtuelle",
      "Plans 360°",
    ],
    badge: "Premium",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: <Video className="h-8 w-8" />,
    title: {
      fr: "Visites Vidéo",
      en: "Video Tours",
      pt: "Tours em Vídeo",
      ar: "جولات فيديو",
    },
    description: {
      fr: "Créez des visites virtuelles immersives pour présenter vos propriétés sous tous les angles.",
      en: "Create immersive virtual tours to showcase your properties from every angle.",
      pt: "Crie passeios virtuais imersivos para mostrar suas propriedades de todos os ângulos.",
      ar: "أنشئ جولات افتراضية غامرة لعرض ممتلكاتك من جميع الزوايا.",
    },
    features: [
      "Vidéos HD",
      "Visites interactives",
      "YouTube integration",
      "Partage facile",
    ],
    badge: "Premium",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: {
      fr: "Géolocalisation",
      en: "Geolocation",
      pt: "Geolocalização",
      ar: "الموقع الجغرافي",
    },
    description: {
      fr: "Cartes interactives et géolocalisation précise pour faciliter la localisation des biens.",
      en: "Interactive maps and precise geolocation to help locate properties easily.",
      pt: "Mapas interativos e geolocalização precisa para facilitar a localização de propriedades.",
      ar: "خرائط تفاعلية وموقع جغرافي دقيق لتسهيل تحديد موقع العقارات.",
    },
    features: [
      "Cartes Google Maps",
      "Recherche par zone",
      "Points d'intérêt",
      "Calcul d'itinéraire",
    ],
    color: "from-green-500 to-green-600",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: {
      fr: "Gestion des Rendez-vous",
      en: "Appointment Management",
      pt: "Gestão de Agendamentos",
      ar: "إدارة المواعيد",
    },
    description: {
      fr: "Organisez et gérez facilement les visites et rendez-vous avec vos clients.",
      en: "Easily organize and manage property visits and appointments with your clients.",
      pt: "Organize e gerencie facilmente visitas e agendamentos com seus clientes.",
      ar: "نظم وأدر زيارات العقارات والمواعيد مع عملائك بسهولة.",
    },
    features: [
      "Calendrier intégré",
      "Notifications automatiques",
      "Confirmations WhatsApp",
      "Gestion multi-calendrier",
    ],
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: <FileText className="h-8 w-8" />,
    title: {
      fr: "Documents et Contrats",
      en: "Documents & Contracts",
      pt: "Documentos e Contratos",
      ar: "الوثائق والعقود",
    },
    description: {
      fr: "Gérez tous vos documents immobiliers et contrats de manière sécurisée et organisée.",
      en: "Securely manage all your property documents and contracts in an organized way.",
      pt: "Gerencie de forma segura todos os seus documentos e contratos imobiliários.",
      ar: "أدر جميع وثائقك العقارية وعقودك بشكل آمن ومنظم.",
    },
    features: [
      "Stockage sécurisé",
      "Templates de contrats",
      "Signature électronique",
      "Archivage automatique",
    ],
    color: "from-teal-500 to-teal-600",
  },
  {
    icon: <Phone className="h-8 w-8" />,
    title: {
      fr: "Support Client",
      en: "Customer Support",
      pt: "Suporte ao Cliente",
      ar: "دعم العملاء",
    },
    description: {
      fr: "Une équipe dédiée disponible pour vous accompagner dans toutes vos démarches immobilières.",
      en: "A dedicated team available to assist you with all your real estate needs.",
      pt: "Uma equipe dedicada disponível para ajudá-lo em todas as suas necessidades imobiliárias.",
      ar: "فريق مخصص متاح لمساعدتك في جميع احتياجاتك العقارية.",
    },
    features: [
      "Support multilingue",
      "Assistance 7j/7",
      "Chat en direct",
      "WhatsApp Business",
    ],
    color: "from-red-500 to-red-600",
  },
];

interface ServicesPageProps {
  params: { locale: string };
}

export default function ServicesPage({ params }: ServicesPageProps) {
  const locale = params.locale || "fr";

  const getLocalizedText = (
    field: { fr: string; en: string; pt: string; ar: string },
    locale: string
  ): string => {
    return field[locale as keyof typeof field] || field.fr;
  };

  const pageTitle = {
    fr: "Nos Services",
    en: "Our Services",
    pt: "Nossos Serviços",
    ar: "خدماتنا",
  }[locale] || "Nos Services";

  const pageDescription = {
    fr: "Découvrez tous nos services immobiliers professionnels conçus pour faciliter vos transactions et maximiser votre visibilité.",
    en: "Discover all our professional real estate services designed to facilitate your transactions and maximize your visibility.",
    pt: "Descubra todos os nossos serviços imobiliários profissionais projetados para facilitar suas transações e maximizar sua visibilidade.",
    ar: "اكتشف جميع خدماتنا العقارية المهنية المصممة لتسهيل معاملاتك وتعظيم رؤيتك.",
  }[locale] || "Découvrez tous nos services immobiliers professionnels.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <HeroSection title={pageTitle} description={pageDescription} />

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500/50 overflow-hidden"
            >
              <CardHeader className={`bg-gradient-to-r ${service.color} text-white`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                    {service.icon}
                  </div>
                  {service.badge && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {service.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold mt-2">
                  {getLocalizedText(service.title, locale)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="text-base mb-4 text-gray-600 dark:text-gray-400 min-h-[60px]">
                  {getLocalizedText(service.description, locale)}
                </CardDescription>
                <Separator className="my-4" />
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {locale === "en"
                ? "Ready to Get Started?"
                : locale === "pt"
                ? "Pronto para Começar?"
                : locale === "ar"
                ? "هل أنت مستعد للبدء؟"
                : "Prêt à commencer ?"}
            </h2>
            <p className="text-xl text-orange-50 mb-8">
              {locale === "en"
                ? "Join thousands of satisfied clients and start your real estate journey today."
                : locale === "pt"
                ? "Junte-se a milhares de clientes satisfeitos e comece sua jornada imobiliária hoje."
                : locale === "ar"
                ? "انضم إلى آلاف العملاء الراضين وابدأ رحلتك العقارية اليوم."
                : "Rejoignez des milliers de clients satisfaits et commencez votre aventure immobilière dès aujourd'hui."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-white text-orange-600 font-semibold hover:bg-gray-100 shadow-lg"
                size="lg"
              >
                <Link href="/user/properties/add">
                  <FileText className="mr-2 h-5 w-5" />
                  {locale === "en"
                    ? "Publish a Listing"
                    : locale === "pt"
                    ? "Publicar Anúncio"
                    : locale === "ar"
                    ? "نشر إعلان"
                    : "Publier une annonce"}
                </Link>
              </Button>
              <Button
                asChild
                className="bg-orange-700 text-white font-semibold hover:bg-orange-800 shadow-lg"
                size="lg"
              >
                <Link href="/contact">
                  <Mail className="mr-2 h-5 w-5" />
                  {locale === "en"
                    ? "Contact Us"
                    : locale === "pt"
                    ? "Entre em Contato"
                    : locale === "ar"
                    ? "اتصل بنا"
                    : "Nous contacter"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
