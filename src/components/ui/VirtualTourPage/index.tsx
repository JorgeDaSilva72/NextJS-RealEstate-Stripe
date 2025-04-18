// "use client";

// import React from "react";
// import { useTranslations } from "next-intl";
// import { motion } from "framer-motion";
// import {
//   Laptop,
//   Star,
//   Users,
//   Clock,
//   Award,
//   Eye,
//   Timer,
//   Cpu,
//   Building,
//   TrendingUp,
// } from "lucide-react";
// import Visit3DPack from "@/app/[locale]/user/subscription/_components/Visit3DPack";

// // Types pour les données
// interface Testimonial {
//   id: number;
//   name: string;
//   role: string;
//   content: string;
//   rating: number;
// }

// interface Statistic {
//   value: string;
//   label: string;
//   icon: React.ComponentType<any>;
// }

// interface Benefit {
//   title: string;
//   description: string;
//   icon: React.ComponentType<any>;
// }

// interface VirtualTourPageProps {
//   visit3DPlanData: any; // Votre type SubscriptionPlan
//   testimonials: Testimonial[];
// }

// interface Service {
//   icon: React.ComponentType<any>;
//   title: string;
//   description: string;
// }

// // Composant de témoignage
// const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
//   return (
//     <div className="bg-gradient-to-br from-black via-blue-950 to-black text-white p-6 rounded-xl ">
//       <div className="flex items-center gap-2 mb-4">
//         {[...Array(testimonial.rating)].map((_, i) => (
//           <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
//         ))}
//       </div>
//       <p className="text-gray-300 mb-4">{testimonial.content}</p>
//       <div>
//         <p className="font-semibold text-white">{testimonial.name}</p>
//         <p className="text-blue-300">{testimonial.role}</p>
//       </div>
//     </div>
//   );
// };

// // Composant statistique
// const StatisticCard = ({ stat }: { stat: Statistic }) => {
//   const Icon = stat.icon;
//   return (
//     <div className="text-center p-6 bg-gradient-to-br from-black via-blue-950 to-black text-white rounded-xl backdrop-blur-lg">
//       <Icon className="w-8 h-8 mx-auto mb-4 text-blue-400" />
//       <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
//       <p className="text-blue-200">{stat.label}</p>
//     </div>
//   );
// };

// const ServiceCard = ({ service }: { service: Service }) => {
//   const Icon = service.icon;
//   return (
//     <motion.div
//       whileHover={{ scale: 1.02 }}
//       className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200"
//     >
//       <div className="mb-4 bg-gradient-to-br from-blue-600 to-blue-800 w-12 h-12 rounded-lg flex items-center justify-center">
//         <Icon className="w-6 h-6 text-white" />
//       </div>
//       <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
//       <p className="text-gray-600 leading-relaxed">{service.description}</p>
//     </motion.div>
//   );
// };

// const VirtualTourPage: React.FC<VirtualTourPageProps> = ({
//   visit3DPlanData,
//   testimonials,
// }) => {
//   const t = useTranslations("VirtualTourPage");

//   const statistics: Statistic[] = [
//     { value: "85%", label: t("stats.timeReduction"), icon: Clock },
//     { value: "3x", label: t("stats.conversionRate"), icon: Award },
//     { value: "10k+", label: t("stats.visitorsServed"), icon: Users },
//   ];

//   const benefits: Benefit[] = [
//     {
//       title: t("benefits.accessibility.title"),
//       description: t("benefits.accessibility.description"),
//       icon: Laptop,
//     },
//     // Ajoutez d'autres avantages ici
//   ];

//   const services: Service[] = [
//     {
//       icon: Eye,
//       title: "Plongez dans l'immersion totale",
//       description:
//         "Offrez une expérience unique à vos acheteurs potentiels avec des visites virtuelles à 360° qui leur permettent d'explorer chaque recoin du bien comme s'ils y étaient.",
//     },
//     {
//       icon: Timer,
//       title: "Gagnez du temps et facilitez les choix",
//       description:
//         "Optimisez le processus de recherche immobilière en permettant aux acheteurs potentiels de présélectionner les biens qui les intéressent réellement avant les visites physiques.",
//     },
//     {
//       icon: Cpu,
//       title: "Une technologie au service de l'immobilier",
//       description:
//         "Bénéficiez d'une technologie de pointe avec des visites virtuelles haute définition, des plans interactifs et une navigation fluide.",
//     },
//     {
//       icon: Building,
//       title: "Mettez en valeur vos biens immobiliers",
//       description:
//         "Présentez vos biens sous leur meilleur jour avec des visites virtuelles professionnelles qui captent l'attention et suscitent l'intérêt.",
//     },
//     {
//       icon: TrendingUp,
//       title: "Un atout marketing puissant",
//       description:
//         "Démarquez-vous de la concurrence et augmentez votre visibilité en ligne grâce à un outil marketing innovant qui répond aux attentes des clients modernes.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Hero Section */}
//       <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-black text-white "></div>
//         </div>
//         <div className="container mx-auto px-4 z-10 text-center text-white">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-5xl md:text-6xl font-bold mb-6"
//           >
//             {t("hero.title")}
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto"
//           >
//             {t("hero.subtitle")}
//           </motion.p>
//         </div>
//       </section>

//       {/* Service Section */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-3xl md:text-4xl font-bold mb-4"
//             >
//               Les atouts de la visite virtuelle
//             </motion.h2>
//             <motion.p
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.2 }}
//               className="text-xl text-gray-600 max-w-3xl mx-auto"
//             >
//               Découvrez comment la visite virtuelle révolutionne l'expérience
//               immobilière
//             </motion.p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {services.map((service, index) => (
//               <motion.div
//                 key={service.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <ServiceCard service={service} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Statistics Section */}
//       <section className="py-20 bg-gradient-to-br from-black via-blue-950 to-black">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
//             {statistics.map((stat, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.2 }}
//                 viewport={{ once: true }}
//               >
//                 <StatisticCard stat={stat} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-12">
//             {t("testimonials.title")}
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
//             {testimonials.map((testimonial, index) => (
//               <motion.div
//                 key={testimonial.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 viewport={{ once: true }}
//               >
//                 <TestimonialCard testimonial={testimonial} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-br from-black via-blue-950 to-black text-white">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-3xl font-bold mb-8">{t("cta.title")}</h2>
//           <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
//             {t("cta.description")}
//           </p>
//           <div className="max-w-4xl mx-auto">
//             <Visit3DPack data={visit3DPlanData} />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default VirtualTourPage;

"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  Clock,
  Award,
  Eye,
  Timer,
  Cpu,
  Building,
  TrendingUp,
} from "lucide-react";
import Visit3DPack from "@/app/[locale]/user/subscription/_components/Visit3DPack";
import MeetingModal, { MeetingFormData } from "../MeetingModal";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

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

interface VirtualTourPageProps {
  visit3DPlanData: any; // Votre type SubscriptionPlan
}

interface Service {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const HeroSection = () => {
  const t = useTranslations("VirtualTourPage");
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleMeetingRequest = async (formData: MeetingFormData) => {
    try {
      const templateParams = {
        plan_name: "Visite Virtuelle 3D",
        plan_price: "",
        plan_duration: "",
        country: "",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      const serviceId = process.env.NEXT_PUBLIC_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_TEMPLATE_FOR_DIAMOND_PACK_ID!;
      const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY_EMAIL!;

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200) {
        toast.success(t("hero.meetingRequestSuccess"));
        setIsMeetingModalOpen(false);
      } else {
        throw new Error(t("hero.meetingRequestError"));
      }
    } catch (error) {
      toast.error(t("hero.meetingRequestErrorTryAgain"));
      console.error("Erreur:", error);
    }
  };

  return (
    // <>
    //   {/* Hero Section */}
    //   <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
    //     <div className="absolute inset-0 z-0">
    //       <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950 to-black text-white"></div>
    //     </div>
    //     <div className="container mx-auto px-4 z-10 text-center text-white">
    //       <motion.h1
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         className="text-5xl md:text-6xl font-bold mb-6"
    //       >
    //         {t("hero.title")}
    //       </motion.h1>
    //       <motion.p
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ delay: 0.2 }}
    //         className="text-xl md:text-2xl text-blue-200 mb-8 max-w-2xl mx-auto"
    //       >
    //         {t("hero.subtitle")}
    //       </motion.p>

    //       {/* Bouton pour ouvrir la modale */}
    //       <motion.button
    //         whileHover={{ scale: 1.05 }}
    //         whileTap={{ scale: 0.95 }}
    //         onClick={() => setIsMeetingModalOpen(true)}
    //         // className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg rounded-lg shadow-lg"
    //         className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 group"
    //       >
    //         {t("hero.button")}
    //       </motion.button>
    //     </div>
    //   </section>

    //   {/* Modale de prise de rendez-vous */}
    //   <MeetingModal
    //     isOpen={isMeetingModalOpen}
    //     onClose={() => setIsMeetingModalOpen(false)}
    //     onSubmit={handleMeetingRequest}
    //     planName="Visite Virtuelle 3D"
    //   />
    // </>

    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Fond avec overlay vidéo - opacité réduite */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-blue-950/50 to-black/50 z-10"></div>

          {/* Vidéo en arrière-plan */}
          <video
            className="w-full h-full object-cover absolute inset-0"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/presentation-complete.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>

        <div className="container mx-auto px-4 z-20 text-center text-white">
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

          {/* Boutons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            {/* Bouton pour ouvrir la modale */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMeetingModalOpen(true)}
              className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 group"
            >
              {t("hero.button")}
            </motion.button>

            {/* Bouton pour voir la vidéo de présentation complète */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(true)}
              className="relative overflow-hidden bg-white text-blue-600 font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
              {t("hero.buttonSeeTheVideo")}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Modal pour la vidéo de présentation */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            {/* Bouton de fermeture */}
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Vidéo de présentation */}
            <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
              <video className="w-full h-full" controls autoPlay>
                <source
                  src="/videos/presentation-complete.mp4"
                  type="video/mp4"
                />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Modale de prise de rendez-vous */}
      <MeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        onSubmit={handleMeetingRequest}
        planName="Visite Virtuelle 3D"
      />
    </>
  );
};

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

const ServiceCard = ({ service }: { service: Service }) => {
  const Icon = service.icon;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg border border-gray-200"
    >
      <div className="mb-4 bg-gradient-to-br from-blue-600 to-blue-800 w-12 h-12 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
      <p className="text-gray-600 leading-relaxed">{service.description}</p>
    </motion.div>
  );
};

const VirtualTourPage: React.FC<VirtualTourPageProps> = ({
  visit3DPlanData,
}) => {
  const t = useTranslations("VirtualTourPage");

  const statistics: Statistic[] = [
    { value: "85%", label: t("stats.timeReduction"), icon: Clock },
    { value: "3x", label: t("stats.conversionRate"), icon: Award },
    { value: "10k+", label: t("stats.visitorsServed"), icon: Users },
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: t("testimonials.kwame.name"),
      role: t("testimonials.kwame.role"),
      content: t("testimonials.kwame.content"),
      rating: 5,
    },
    {
      id: 2,
      name: t("testimonials.marie.name"),
      role: t("testimonials.marie.role"),
      content: t("testimonials.marie.content"),
      rating: 5,
    },
    {
      id: 3,
      name: t("testimonials.tafari.name"),
      role: t("testimonials.tafari.role"),
      content: t("testimonials.tafari.content"),
      rating: 4,
    },
  ];

  const services: Service[] = [
    {
      icon: Eye,
      title: t("services.immersion.title"),
      description: t("services.immersion.description"),
    },
    {
      icon: Timer,
      title: t("services.timeSaving.title"),
      description: t("services.timeSaving.description"),
    },
    {
      icon: Cpu,
      title: t("services.technology.title"),
      description: t("services.technology.description"),
    },
    {
      icon: Building,
      title: t("services.propertyShowcase.title"),
      description: t("services.propertyShowcase.description"),
    },
    {
      icon: TrendingUp,
      title: t("services.marketing.title"),
      description: t("services.marketing.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}

      {/*
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

          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
            onClick={() => true}
          >
            {t("hero.bookAppointment")}
          </motion.button>
        </div>
      </section>

      */}

      <HeroSection />

      {/* Service Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {t("services.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              {t("services.subtitle")}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
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
          <div className="max-w-4xl mx-auto">
            <Visit3DPack data={visit3DPlanData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualTourPage;
