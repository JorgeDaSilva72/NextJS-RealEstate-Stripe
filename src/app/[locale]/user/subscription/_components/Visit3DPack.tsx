// "use client";

// import React, { useState } from "react";
// import { SubscriptionPlan } from "@prisma/client";
// import { useTranslations } from "next-intl";
// import emailjs from "@emailjs/browser";
// import { toast } from "react-toastify";
// import MeetingModal, { MeetingFormData } from "@/components/ui/MeetingModal";

// interface Visit3DPackProps {
//   data: SubscriptionPlan;
// }

// const Visit3DPack: React.FC<Visit3DPackProps> = ({ data }) => {
//   const t = useTranslations("Visit3DPack");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { namePlan, price, country, duration } = data;

//   const handleMeetingRequest = async (formData: MeetingFormData) => {
//     try {
//       const templateParams = {
//         plan_name: namePlan,
//         plan_price: price,
//         plan_duration: duration,
//         country: country,
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         message: formData.message,
//       };

//       const response = await emailjs.send(
//         process.env.NEXT_PUBLIC_SERVICE_ID!,
//         process.env.NEXT_PUBLIC_TEMPLATE_FOR_DIAMOND_PACK_ID!,
//         templateParams,
//         process.env.NEXT_PUBLIC_PUBLIC_KEY_EMAIL!
//       );

//       if (response.status === 200) {
//         toast.success(t("meetingRequestSuccess"));
//         setIsModalOpen(false);
//       } else {
//         throw new Error(t("meetingRequestError"));
//       }
//     } catch (error) {
//       toast.error(t("meetingRequestErrorTryAgain"));
//       console.error("Erreur:", error);
//     }
//   };

//   return (
//     <>
//       <div className="bg-black text-white mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full">
//         <div className="bg-black/90 text-white h-full rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden p-6">
//           <div>
//             <h1 className="uppercase text-3xl sm:text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
//               {t("packElite")} <br />
//             </h1>

//             <ul className="flex-grow mt-6 space-y-3 text-xs sm:text-sm">
//               <li>
//                 💎 <strong>Plongez dans l'immersion totale :</strong>
//                 <p>
//                   Découvrez nos logements comme si vous y étiez grâce à des
//                   visites virtuelles haute définition
//                 </p>
//               </li>
//               <li>
//                 💎 <strong>Gagnez du temps et facilitez vos choix : </strong>
//                 <p>
//                   Visitez plusieurs biens depuis chez vous avant de vous
//                   déplacer.
//                 </p>
//               </li>
//               <li>
//                 💎{" "}
//                 <strong>Une technologie au service de l'immobilier : </strong>
//                 <p>
//                   Offrez à vos clients une expérience interactive et réaliste
//                   pour une prise de décision éclairée.
//                 </p>
//               </li>
//               <li>
//                 💎 <strong>Mettez en valeur vos biens immobiliers : </strong>
//                 <p>
//                   Augmentez l'engagement des acheteurs et locataires avec des
//                   visites immersives.
//                 </p>
//               </li>
//               <li>
//                 💎 <strong>Un atout marketing puissant : </strong>
//                 <p>
//                   Différenciez-vous de la concurrence en proposant des visites
//                   3D attractives et engageantes.
//                 </p>
//               </li>
//             </ul>
//           </div>

//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 text-sm sm:text-base mt-4"
//           >
//             {t("scheduleAppointment")}
//           </button>
//         </div>
//       </div>
//       <MeetingModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleMeetingRequest}
//         planName={namePlan}
//       />
//     </>
//   );
// };

// export default Visit3DPack;

// "use client";

// import React, { useState } from "react";
// import { SubscriptionPlan } from "@prisma/client";
// import { useTranslations } from "next-intl";
// import emailjs from "@emailjs/browser";
// import { toast } from "react-toastify";
// import MeetingModal, { MeetingFormData } from "@/components/ui/MeetingModal";
// import { Camera, Building2, Zap, Target, LineChart } from "lucide-react";

// interface Visit3DPackProps {
//   data: SubscriptionPlan;
// }

// const Visit3DPack: React.FC<Visit3DPackProps> = ({ data }) => {
//   const t = useTranslations("Visit3DPack");
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const { namePlan, price, country, duration } = data;

//   const handleMeetingRequest = async (formData: MeetingFormData) => {
//     try {
//       const templateParams = {
//         plan_name: namePlan,
//         plan_price: price,
//         plan_duration: duration,
//         country: country,
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         message: formData.message,
//       };

//       const response = await emailjs.send(
//         process.env.NEXT_PUBLIC_SERVICE_ID!,
//         process.env.NEXT_PUBLIC_TEMPLATE_FOR_DIAMOND_PACK_ID!,
//         templateParams,
//         process.env.NEXT_PUBLIC_PUBLIC_KEY_EMAIL!
//       );

//       if (response.status === 200) {
//         toast.success(t("meetingRequestSuccess"));
//         setIsModalOpen(false);
//       } else {
//         throw new Error(t("meetingRequestError"));
//       }
//     } catch (error) {
//       toast.error(t("meetingRequestErrorTryAgain"));
//       console.error("Erreur:", error);
//     }
//   };

//   return (
//     <>
//       <div className="relative bg-gradient-to-br from-black via-blue-950 to-black text-white mx-auto p-8 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 backdrop-blur-3xl"></div>

//         <div className="relative z-10 flex flex-col h-full space-y-8">
//           {/* Header avec animation */}
//           <div className="text-center space-y-4">
//             <h1 className="uppercase text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse">
//               {t("packElite")}
//             </h1>
//             <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-cyan-400"></div>
//           </div>

//           {/* Liste des fonctionnalités avec icônes */}
//           <ul className="flex-grow space-y-6 text-sm sm:text-base">
//             <li className="transform hover:translate-x-2 transition-transform duration-300 p-4 rounded-lg bg-blue-950/30 backdrop-blur-md">
//               <div className="flex items-start gap-3">
//                 <Camera className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <strong className="text-blue-300">
//                     Plongez dans l'immersion totale
//                   </strong>
//                   <p className="mt-2 text-gray-300">
//                     Découvrez nos logements comme si vous y étiez grâce à des
//                     visites virtuelles haute définition
//                   </p>
//                 </div>
//               </div>
//             </li>

//             <li className="transform hover:translate-x-2 transition-transform duration-300 p-4 rounded-lg bg-blue-950/30 backdrop-blur-md">
//               <div className="flex items-start gap-3">
//                 <Building2 className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <strong className="text-blue-300">
//                     Gagnez du temps et facilitez vos choix
//                   </strong>
//                   <p className="mt-2 text-gray-300">
//                     Visitez plusieurs biens depuis chez vous avant de vous
//                     déplacer
//                   </p>
//                 </div>
//               </div>
//             </li>

//             <li className="transform hover:translate-x-2 transition-transform duration-300 p-4 rounded-lg bg-blue-950/30 backdrop-blur-md">
//               <div className="flex items-start gap-3">
//                 <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <strong className="text-blue-300">
//                     Une technologie au service de l'immobilier
//                   </strong>
//                   <p className="mt-2 text-gray-300">
//                     Offrez à vos clients une expérience interactive et réaliste
//                     pour une prise de décision éclairée
//                   </p>
//                 </div>
//               </div>
//             </li>

//             <li className="transform hover:translate-x-2 transition-transform duration-300 p-4 rounded-lg bg-blue-950/30 backdrop-blur-md">
//               <div className="flex items-start gap-3">
//                 <Target className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <strong className="text-blue-300">
//                     Mettez en valeur vos biens immobiliers
//                   </strong>
//                   <p className="mt-2 text-gray-300">
//                     Augmentez l'engagement des acheteurs et locataires avec des
//                     visites immersives
//                   </p>
//                 </div>
//               </div>
//             </li>

//             <li className="transform hover:translate-x-2 transition-transform duration-300 p-4 rounded-lg bg-blue-950/30 backdrop-blur-md">
//               <div className="flex items-start gap-3">
//                 <LineChart className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
//                 <div>
//                   <strong className="text-blue-300">
//                     Un atout marketing puissant
//                   </strong>
//                   <p className="mt-2 text-gray-300">
//                     Différenciez-vous de la concurrence en proposant des visites
//                     3D attractives et engageantes
//                   </p>
//                 </div>
//               </div>
//             </li>
//           </ul>

//           {/* Bouton avec effet de brillance */}
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 group"
//           >
//             <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
//             {t("scheduleAppointment")}
//           </button>
//         </div>
//       </div>
//       <MeetingModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSubmit={handleMeetingRequest}
//         planName={namePlan}
//       />
//     </>
//   );
// };

// export default Visit3DPack;

"use client";

import React, { useState } from "react";
import { SubscriptionPlan } from "@prisma/client";
import { useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import MeetingModal, { MeetingFormData } from "@/components/ui/MeetingModal";
import { Camera, Building2, Zap, Target, LineChart } from "lucide-react";

interface Visit3DPackProps {
  data: SubscriptionPlan;
}

interface FeatureItemProps {
  icon: React.ComponentType<any>; // Accepte un composant Lucide
  titleKey: string; // Clé de traduction pour le titre
  descriptionKey: string; // Clé de traduction pour la description
}

const Visit3DPack: React.FC<Visit3DPackProps> = ({ data }) => {
  const t = useTranslations("Visit3DPack");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { namePlan, price, country, duration } = data;

  const handleMeetingRequest = async (formData: MeetingFormData) => {
    try {
      const templateParams = {
        plan_name: namePlan,
        plan_price: price,
        plan_duration: duration,
        country: country,
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
        toast.success(t("meetingRequestSuccess"));
        setIsModalOpen(false);
      } else {
        throw new Error(t("meetingRequestError"));
      }
    } catch (error) {
      toast.error(t("meetingRequestErrorTryAgain"));
      console.error("Erreur:", error);
    }
  };

  const FeatureItem: React.FC<FeatureItemProps> = ({
    icon: Icon,
    titleKey,
    descriptionKey,
  }) => {
    const title = t(titleKey);
    const description = t(descriptionKey);

    return (
      <li className="transform hover:translate-x-2 transition-transform duration-300 p-4 rounded-lg bg-blue-950/30 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <Icon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <strong className="text-blue-300">{title}</strong>
            <p className="mt-2 text-gray-300">{description}</p>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <div className="relative bg-gradient-to-br from-black via-blue-950 to-black text-white mx-auto p-8 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 backdrop-blur-3xl"></div>

        <div className="relative z-10 flex flex-col h-full space-y-8">
          {/* Header avec animation */}
          <div className="text-center space-y-4">
            <h1 className="uppercase text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-pulse">
              {t("packVisit3D")}
            </h1>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          </div>

          {/* Liste des fonctionnalités avec icônes */}
          <ul className="flex-grow space-y-6 text-sm sm:text-base">
            <FeatureItem
              icon={Camera}
              titleKey="features.immersion.title"
              descriptionKey="features.immersion.description"
            />
            <FeatureItem
              icon={Building2}
              titleKey="features.timeSaving.title"
              descriptionKey="features.timeSaving.description"
            />
            <FeatureItem
              icon={Zap}
              titleKey="features.technology.title"
              descriptionKey="features.technology.description"
            />
            <FeatureItem
              icon={Target}
              titleKey="features.propertyValue.title"
              descriptionKey="features.propertyValue.description"
            />
            <FeatureItem
              icon={LineChart}
              titleKey="features.marketing.title"
              descriptionKey="features.marketing.description"
            />
          </ul>

          {/* Bouton avec effet de brillance */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 group"
            aria-label={t("scheduleAppointment")}
          >
            <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            {t("scheduleAppointment")}
          </button>
        </div>
      </div>
      <MeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleMeetingRequest}
        planName={namePlan}
      />
    </>
  );
};

export default Visit3DPack;
