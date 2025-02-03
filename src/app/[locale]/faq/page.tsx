// "use client";
// import React from "react";
// import { Plus, Minus } from "lucide-react";

// type FAQItem = {
//   question: string;
//   answer: string;
// };

// const faqData: FAQItem[] = [
//   {
//     question: "Comment puis-je publier une annonce immobilière ?",
//     answer:
//       "Pour publier une annonce, connectez-vous à votre compte, cliquez sur 'Publier une annonce' et remplissez le formulaire avec les détails de votre bien : photos, description, prix, et caractéristiques. Votre annonce sera visible après validation par notre équipe.",
//   },
//   {
//     question: "Quels sont les frais de publication d'une annonce ?",
//     answer:
//       "La publication d'une annonce est gratuite mais limitée à 5 photos maximum. Pour plus de fonctionnalités et en particulier pour les professionnels, nous proposons différents forfaits annuels selon le nombre d'annonces souhaité, du nombre de photos et de vidéos par annonce. Consultez notre grille tarifaire pour plus de détails.",
//   },
//   {
//     question: "Combien de temps mon annonce reste-t-elle en ligne ?",
//     answer:
//       "Les annonces restent en ligne pendant 30 jours. Vous pouvez les renouveler gratuitement avant expiration. Si une annonce n'est pas renouvelée, elle sera automatiquement archivée mais restera accessible dans votre espace personnel.",
//   },
//   {
//     question: "Comment modifier ou supprimer mon annonce ?",
//     answer:
//       "Connectez-vous à votre compte et accédez à la section 'Mes annonces'. Vous pourrez modifier ou supprimer vos annonces à tout moment. Les modifications sont soumises à une nouvelle validation par notre équipe.",
//   },
//   {
//     question: "Comment contacter un vendeur ou une agence ?",
//     answer:
//       "Sur chaque annonce, vous trouverez un bouton 'Contacter' qui vous permettra d'envoyer un message direct au vendeur. Vous pouvez également sauvegarder les annonces qui vous intéressent dans vos favoris pour les retrouver facilement.",
//   },
// ];

// const Faq = () => {
//   const [openItems, setOpenItems] = React.useState<number[]>([]);

//   const toggleItem = (index: number) => {
//     setOpenItems((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//         Questions Fréquentes
//       </h1>

//       <div className="space-y-4">
//         {faqData.map((item, index) => (
//           <div
//             key={index}
//             className="border border-gray-200 rounded-lg overflow-hidden"
//           >
//             <button
//               className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
//               onClick={() => toggleItem(index)}
//             >
//               <span className="text-lg font-medium text-gray-900">
//                 {item.question}
//               </span>
//               {openItems.includes(index) ? (
//                 <Minus className="h-5 w-5 text-gray-500" />
//               ) : (
//                 <Plus className="h-5 w-5 text-gray-500" />
//               )}
//             </button>

//             {openItems.includes(index) && (
//               <div className="p-4 bg-gray-50 border-t border-gray-200">
//                 <p className="text-gray-600">{item.answer}</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Faq;

"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";

const Faq = () => {
  const t = useTranslations("faq");
  const [openItems, setOpenItems] = React.useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqData = [
    {
      id: "publishAd",
      question: t("publishAd.question"),
      answer: t("publishAd.answer"),
    },
    { id: "fees", question: t("fees.question"), answer: t("fees.answer") },
    {
      id: "duration",
      question: t("duration.question"),
      answer: t("duration.answer"),
    },
    {
      id: "modify",
      question: t("modify.question"),
      answer: t("modify.answer"),
    },
    {
      id: "contact",
      question: t("contact.question"),
      answer: t("contact.answer"),
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {t("title")}
      </h1>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleItem(index)}
            >
              <span className="text-lg font-medium text-gray-900">
                {item.question}
              </span>
              {openItems.includes(index) ? (
                <Minus className="h-5 w-5 text-gray-500" />
              ) : (
                <Plus className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {openItems.includes(index) && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
