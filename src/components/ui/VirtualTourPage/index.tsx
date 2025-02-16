"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Laptop, Star, Users, Clock, Award } from "lucide-react";
import Visit3DPack from "@/app/[locale]/user/subscription/_components/Visit3DPack";

// Types pour les données
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface Statistic {
  value: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface Benefit {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface VirtualTourPageProps {
  visit3DPlanData: any; // Votre type SubscriptionPlan
  testimonials: Testimonial[];
}

// Composant de témoignage
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-gradient-to-br from-black via-blue-950 to-black text-white p-6 rounded-xl ">
      <div className="flex items-center gap-2 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-300 mb-4">{testimonial.content}</p>
      <div>
        <p className="font-semibold text-white">{testimonial.name}</p>
        <p className="text-blue-300">{testimonial.role}</p>
      </div>
    </div>
  );
};

// Composant statistique
const StatisticCard = ({ stat }: { stat: Statistic }) => {
  const Icon = stat.icon;
  return (
    <div className="text-center p-6 bg-gradient-to-br from-black via-blue-950 to-black text-white rounded-xl backdrop-blur-lg">
      <Icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
      <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
      <p className="text-blue-200">{stat.label}</p>
    </div>
  );
};

const VirtualTourPage: React.FC<VirtualTourPageProps> = ({
  visit3DPlanData,
  testimonials,
}) => {
  const t = useTranslations("VirtualTourPage");

  const statistics: Statistic[] = [
    { value: "85%", label: t("stats.timeReduction"), icon: Clock },
    { value: "3x", label: t("stats.conversionRate"), icon: Award },
    { value: "10k+", label: t("stats.visitorsServed"), icon: Users },
  ];

  const benefits: Benefit[] = [
    {
      title: t("benefits.accessibility.title"),
      description: t("benefits.accessibility.description"),
      icon: Laptop,
    },
    // Ajoutez d'autres avantages ici
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-black text-white "></div>
        </div>
        <div className="container mx-auto px-4 z-10 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            {t("hero.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto"
          >
            {t("hero.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Service Section */}
      <section className="py-20 container mx-auto px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <Visit3DPack data={visit3DPlanData} />
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-black via-blue-950 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <StatisticCard stat={stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("testimonials.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-black via-blue-950 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{t("cta.title")}</h2>
          <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300">
            {t("cta.button")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default VirtualTourPage;
