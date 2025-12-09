// "use client";

// import React, { useState } from "react";
// import { SubscriptionPlan } from "@prisma/client";
// import PurchasePlan from "./PurchasePlan";
// import emailjs from "@emailjs/browser";
// import { toast } from "react-toastify";
// import MeetingModal, { MeetingFormData } from "@/components/ui/MeetingModal";

// interface DiamondPackProps {
//   data: SubscriptionPlan;
//   // onSubscribe?: () => void; // Ajout d'une action personnalisée au clic
// }

// const DiamondPack: React.FC<DiamondPackProps> = ({
//   data,
//   // onSubscribe = () =>
//   //   alert(`Souscription au Pack ${data.namePlan} effectuée !`),
// }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const {
//     namePlan,
//     price,
//     country,
//     startDate,
//     endDate,
//     duration,
//     premiumAds,
//     photosPerAd,
//     shortVideosPerAd,
//     youtubeVideoDuration,
//     zoneRadius,
//   } = data;

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
//         toast.success(
//           "Votre demande de rendez-vous a été envoyée avec succès !"
//         );
//         setIsModalOpen(false);
//       } else {
//         throw new Error("Erreur lors de l'envoi de la demande");
//       }
//     } catch (error) {
//       toast.error(
//         "Une erreur est survenue lors de l'envoi de la demande. Veuillez réessayer."
//       );
//       console.error("Erreur:", error);
//     }
//   };

//   return (
//     <>
//       <div className="bg-black text-white mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full">
//         <div className="bg-black/90 text-white h-full rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden p-6">
//           {/* Titre */}
//           <div>
//             <h1 className="uppercase text-3xl sm:text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
//               PACK ELITE <br />
//               <span className="text-5xl">{namePlan} </span>
//             </h1>

//             {/* Price and Duration */}
//             <h2 className="text-lg sm:text-xl font-bold text-center mt-4">
//               <span className="text-6xl">{price} €</span> / {duration}
//             </h2>
//             <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
//               Offre spéciale {country} valable du{" "}
//               {new Intl.DateTimeFormat("fr-FR", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//               }).format(new Date(startDate))}{" "}
//               au{" "}
//               {new Intl.DateTimeFormat("fr-FR", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//               }).format(new Date(endDate))}
//             </p>

//             {/* Liste des caractéristiques */}
//             <ul className="flex-grow mt-6 space-y-3 text-xs sm:text-sm">
//               <li>
//                 💎 <strong>Visibilité maximale et notoriété renforcée</strong>
//               </li>
//               <li>
//                 💎 <strong>{premiumAds} annonces premium</strong> : Mettez en
//                 avant vos meilleurs biens.
//               </li>
//               <li>
//                 💎{" "}
//                 <strong>
//                   {photosPerAd} photos professionnelles par annonce
//                 </strong>{" "}
//                 : Des visuels de qualité pour séduire les acquéreurs.
//               </li>

//               {shortVideosPerAd > 0 && (
//                 <li>
//                   💎{" "}
//                   <strong>
//                     {shortVideosPerAd} vidéo courte et impactante (1mn) par
//                     annonce
//                   </strong>{" "}
//                   : Présentez vos biens sous tous les angles.
//                 </li>
//               )}
//               {youtubeVideoDuration && (
//                 <li>
//                   💎{" "}
//                   <strong>
//                     1 Vidéo de présentation YouTube de ({youtubeVideoDuration})
//                   </strong>{" "}
//                   : Renforcez votre image de marque.
//                 </li>
//               )}
//               {zoneRadius > 0 && (
//                 <li>
//                   💎{" "}
//                   <strong>
//                     Zone de chalandise exclusive de {zoneRadius} km ou 100 000
//                     habitants.
//                   </strong>
//                 </li>
//               )}
//             </ul>

//             {/* Footer */}
//             <p className="text-[10px] sm:text-xs text-gray-400 mt-6 text-center">
//               Suivi personnalisé tout au long de la collaboration. Une
//               visibilité accrue sur le marché immobilier, des ventes plus
//               rapides grâce à des annonces de qualité, un retour sur
//               investissement rapide.
//             </p>
//           </div>

//           {/* Bouton de souscription */}
//           <div className="mt-6 ">
//             {/* <button
//           aria-label={`Souscrire au Pack ${namePlan}`}
//           onClick={onSubscribe}
//           className="mt-6 w-full bg-gradient-to-r from-blue-500 to-yellow-500 text-black font-bold py-2 rounded-lg shadow-lg hover:from-blue-600 hover:to-yellow-600 transition duration-300 text-sm sm:text-base"
//         >
//           Souscrire
//         </button> */}
//             <PurchasePlan
//               plan={data}
//               buttonClassName="bg-gradient-to-r from-blue-500 to-yellow-500 text-black  hover:from-blue-600 hover:to-yellow-600"
//             />
//           </div>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 text-sm sm:text-base mt-4"
//           >
//             Prendre RDV
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

// export default DiamondPack;

// ----------------------------------------------------------
// next-intl with claude
"use client";

import React, { useState } from "react";
import { SubscriptionPlan } from "@prisma/client";
import { useTranslations } from "next-intl";
import PurchasePlan from "./PurchasePlan";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import MeetingModal, { MeetingFormData } from "@/components/ui/MeetingModal";
import { Link } from "@/i18n/routing";
import { isValidDate } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@nextui-org/react";

interface DiamondPackProps {
  data: SubscriptionPlan;
  isAuthenticated?: boolean;
}

const DiamondPack: React.FC<DiamondPackProps> = ({
  data,
  isAuthenticated = false,
}) => {
  const t = useTranslations("DiamondPack");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    namePlan,
    price,
    countryId,
    startDate,
    endDate,
    duration,
    premiumAds,
    photosPerAd,
    shortVideosPerAd,
    youtubeVideoDuration,
    zoneRadius,
  } = data;

  // Bouton de connexion pour les utilisateurs non authentifiés
  const LoginButton = () => (
    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 text-center block">
      <LoginLink>Se connecter pour souscrire</LoginLink>
    </Button>
  );

  const handleMeetingRequest = async (formData: MeetingFormData) => {
    try {
      const templateParams = {
        plan_name: namePlan,
        plan_price: price,
        plan_duration: duration,
        country: countryId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      };

      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_FOR_DIAMOND_PACK_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_PUBLIC_KEY_EMAIL!
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

  return (
    <>
      <div className="bg-black text-white mx-auto p-6 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-full">
        <div className="bg-black/90 text-white h-full rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden p-6">
          <div>
            <h1 className="uppercase text-3xl sm:text-4xl text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-yellow-500 drop-shadow-[0_0_20px_rgba(255,255,255,1)] animate-glow">
              {t("packElite")} <br />
              <span className="text-5xl">{namePlan}</span>
            </h1>

            <h2 className="text-lg sm:text-xl font-bold text-center mt-4">
              <span className="text-6xl">{price} €</span> / {duration}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 text-center mt-2">
              {t("specialOffer", {
                countryId,
                startDate: isValidDate(startDate)
                  ? new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(startDate))
                  : "Date invalide", // ou une autre valeur par défaut
                endDate: isValidDate(endDate)
                  ? new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(endDate))
                  : "Date invalide", // ou une autre valeur par défaut
              })}
            </p>

            <ul className="flex-grow mt-6 space-y-3 text-xs sm:text-sm">
              <li>
                💎 <strong>{t("maxVisibility")}</strong>
              </li>
              <li>
                💎 <strong>{t("premiumAds", { count: premiumAds })}</strong>:{" "}
                {t("premiumAdsDescription")}
              </li>
              <li>
                💎 <strong>{t("photosPerAd", { count: photosPerAd })}</strong>:{" "}
                {t("photosDescription")}
              </li>

              {shortVideosPerAd > 0 && (
                <li>
                  💎{" "}
                  <strong>
                    {t("shortVideos", { count: shortVideosPerAd })}
                  </strong>
                  : {t("shortVideosDescription")}
                </li>
              )}

              {youtubeVideoDuration && (
                <li>
                  💎{" "}
                  <strong>
                    {t("youtubeVideo", { duration: youtubeVideoDuration })}
                  </strong>
                  : {t("youtubeVideoDescription")}
                </li>
              )}

              {zoneRadius > 0 && (
                <li>
                  💎{" "}
                  <strong>{t("exclusiveZone", { radius: zoneRadius })}</strong>
                </li>
              )}
            </ul>

            <p className="text-[10px] sm:text-xs text-gray-400 mt-6 text-center">
              {t("footerDescription")}
            </p>
          </div>

          <div className="mt-6">
            {isAuthenticated ? (
              <PurchasePlan
                plan={data}
                buttonClassName="bg-gradient-to-r from-blue-500 to-yellow-500 text-black hover:from-blue-600 hover:to-yellow-600"
              />
            ) : (
              <LoginButton />
            )}
          </div>
          {isAuthenticated ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 text-sm sm:text-base mt-4"
            >
              {t("scheduleAppointment")}
            </button>
          ) : null}
        </div>
      </div>
      {/* Modal uniquement disponible pour les utilisateurs authentifiés */}
      {isAuthenticated && (
        <MeetingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleMeetingRequest}
          planName={namePlan}
        />
      )}
    </>
  );
};

export default DiamondPack;
