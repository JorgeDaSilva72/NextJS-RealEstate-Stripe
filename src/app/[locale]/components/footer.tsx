// "use client";

// import {
//   Linkedin,
//   Twitter,
//   Instagram,
//   Facebook,
//   Youtube,
//   Twitch,
//   SmartphoneIcon,
//   GlobeIcon,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import emailjs from "@emailjs/browser";
// import { toast } from "react-toastify";
// import FeedbackModal, { FeedbackFormData } from "@/components/ui/FeedbackModal";
// import ContactModal, { ContactFormData } from "@/components/ui/ContactModal";
// // import ContactModal, { ContactFormData } from "@/components/ui/ContactModal";

// export const FooterSection = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleFeedbackRequest = async (formData: FeedbackFormData) => {
//     try {
//       setIsLoading(true);
//       const templateParams = {
//         category: formData.category,
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
//         toast.success("Votre feedback a été envoyé avec succès !.Merci.");
//         setIsModalOpen(false);
//       } else {
//         throw new Error("Erreur lors de l'envoi de la demande");
//       }
//     } catch (error) {
//       toast.error("Une erreur est survenue. Veuillez réessayer.");
//       console.error("Erreur:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleContactRequest = async (formData: ContactFormData) => {
//     try {
//       setIsLoading(true);
//       const templateParams = {
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
//           "Votre message a été envoyé avec succès ! Nous vous répondrons bientôt."
//         );
//         setIsContactModalOpen(false);
//       } else {
//         throw new Error("Erreur lors de l'envoi du message");
//       }
//     } catch (error) {
//       toast.error("Une erreur est survenue. Veuillez réessayer.");
//       console.error("Erreur:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <footer
//       id="footer"
//       className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-100"
//     >
//       <div className="w-full max-w-7xl p-10 bg-card border border-secondary rounded-2xl">
//         <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-6">
//           {/* Logo Section */}
//           <div className="col-span-full xl:col-span-2">
//             <Link href="#" className="flex items-center space-x-3">
//               <Image
//                 src="/logo-topaz-enhance-coupe.jpeg"
//                 alt="Icone"
//                 width={36}
//                 height={36}
//                 className="rounded-lg"
//               />
//               <h2 className="text-transparent text-2xl font-bold bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
//                 AFRIQUE AVENIR
//               </h2>
//             </Link>
//           </div>

//           {/* Contact Section */}
//           <div className="flex flex-col gap-3">
//             <h3 className="font-bold text-lg">Contact</h3>
//             <Link
//               href="#footer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-blue-500 transition-all"
//             >
//               <Linkedin className="w-5 h-5" />
//               LinkedIn
//             </Link>
//             <Link
//               href="https://x.com/afriqueavenir9?s=21"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-blue-500 transition-all"
//             >
//               <Twitter className="w-5 h-5" />
//               Twitter
//             </Link>
//             <Link
//               href="https://m.twitch.tv/afriqueavenir/home"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-blue-500 transition-all"
//             >
//               <Twitch className="w-5 h-5" />
//               Twitch
//             </Link>
//           </div>

//           {/* Plateformes Section */}
//           <div className="flex flex-col gap-3">
//             <h3 className="font-bold text-lg">Plateformes</h3>
//             <Link
//               href="#footer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-green-500 transition-all"
//             >
//               <SmartphoneIcon className="w-5 h-5" />
//               iOS
//             </Link>
//             <Link
//               href="#footer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-green-500 transition-all"
//             >
//               <SmartphoneIcon className="w-5 h-5" />
//               Android
//             </Link>
//             <Link
//               href="#footer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-green-500 transition-all"
//             >
//               <GlobeIcon className="w-5 h-5" />
//               Web
//             </Link>
//           </div>

//           {/* Aide Section */}
//           <div className="flex flex-col gap-3">
//             <h3 className="font-bold text-lg">Aide</h3>
//             <Link
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setIsContactModalOpen(true);
//               }}
//               className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
//             >
//               Nous contacter
//             </Link>
//             <Link
//               href="faq"
//               className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
//             >
//               FAQ
//             </Link>
//             <Link
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setIsModalOpen(true);
//               }}
//               className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
//             >
//               Feedback
//             </Link>
//           </div>

//           {/* Réseaux sociaux */}
//           <div className="flex flex-col gap-3">
//             <h3 className="font-bold text-lg">Réseaux sociaux</h3>
//             <Link
//               href="https://www.youtube.com/@Afriqueavenir-m5g"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
//             >
//               <Youtube className="w-5 h-5" />
//               YouTube
//             </Link>
//             <Link
//               href="https://www.instagram.com/afriqueavenir9/profilecard/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-pink-500 transition-all"
//             >
//               <Instagram className="w-5 h-5" />
//               Instagram
//             </Link>
//             <Link
//               href="https://www.facebook.com/profile.php?id=61568365453332&mibextid=wwXIfr&rdid=T1Uukh3inyp1lt68&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19TQgmn4dJ%2F%3Fmibextid%3DwwXIfr"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
//             >
//               <Facebook className="w-5 h-5" />
//               Facebook
//             </Link>
//           </div>
//         </div>

//         {/* Footer Credits */}
//         <section className="text-center mt-8">
//           <h3 className="text-sm">
//             &copy; 2024
//             <Link
//               target="_blank"
//               rel="noopener noreferrer"
//               href="https://afrique-avenir.com/"
//               className="text-primary transition-all border-primary hover:border-b-2 ml-1"
//             >
//               AFRIQUE AVENIR
//             </Link>
//           </h3>
//         </section>

//         {/* Modals */}
//         <FeedbackModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onSubmit={handleFeedbackRequest}
//         />
//         <ContactModal
//           isOpen={isContactModalOpen}
//           onClose={() => setIsContactModalOpen(false)}
//           onSubmit={handleContactRequest}
//         />
//       </div>
//     </footer>
//   );
// };

"use client";

import {
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Twitch,
  SmartphoneIcon,
  GlobeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import FeedbackModal, { FeedbackFormData } from "@/components/ui/FeedbackModal";
import ContactModal, { ContactFormData } from "@/components/ui/ContactModal";

export const FooterSection = () => {
  const t = useTranslations("Footer");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFeedbackRequest = async (formData: FeedbackFormData) => {
    try {
      setIsLoading(true);
      const templateParams = {
        category: formData.category,
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
        toast.success(t("feedbackSuccess"));
        setIsModalOpen(false);
      } else {
        throw new Error(t("sendError"));
      }
    } catch (error) {
      toast.error(t("generalError"));
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactRequest = async (formData: ContactFormData) => {
    try {
      setIsLoading(true);
      const templateParams = {
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
        toast.success(t("contactSuccess"));
        setIsContactModalOpen(false);
      } else {
        throw new Error(t("sendError"));
      }
    } catch (error) {
      toast.error(t("generalError"));
      console.error("Erreur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer
      id="footer"
      className="flex items-center justify-center min-h-screen px-4 py-8 bg-gray-100"
    >
      <div className="w-full max-w-7xl p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-6">
          {/* Logo Section */}
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex items-center space-x-3">
              <Image
                src="/logo-topaz-enhance-coupe.jpeg"
                alt={t("logoAlt")}
                width={36}
                height={36}
                className="rounded-lg"
              />
              <h2 className="text-transparent text-2xl font-bold bg-gradient-to-r from-[#D247BF] to-primary bg-clip-text">
                {t("companyName")}
              </h2>
            </Link>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg">{t("contact")}</h3>
            <Link
              href="#footer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-blue-500 transition-all"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </Link>
            <Link
              href="https://x.com/afriqueavenir9?s=21"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-blue-500 transition-all"
            >
              <Twitter className="w-5 h-5" />
              Twitter
            </Link>
            <Link
              href="https://m.twitch.tv/afriqueavenir/home"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-blue-500 transition-all"
            >
              <Twitch className="w-5 h-5" />
              Twitch
            </Link>
          </div>

          {/* Plateformes Section */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg">{t("platforms")}</h3>
            <Link
              href="#footer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-green-500 transition-all"
            >
              <SmartphoneIcon className="w-5 h-5" />
              iOS
            </Link>
            <Link
              href="#footer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-green-500 transition-all"
            >
              <SmartphoneIcon className="w-5 h-5" />
              Android
            </Link>
            <Link
              href="#footer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-green-500 transition-all"
            >
              <GlobeIcon className="w-5 h-5" />
              Web
            </Link>
          </div>

          {/* Aide Section */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg">{t("help")}</h3>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsContactModalOpen(true);
              }}
              className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
            >
              {t("contactUs")}
            </Link>
            <Link
              href="faq"
              className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
            >
              FAQ
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="opacity-60 hover:opacity-100 hover:text-orange-500 transition-all"
            >
              {t("feedback")}
            </Link>
          </div>

          {/* Réseaux sociaux */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg">{t("socialMedia")}</h3>
            <Link
              href="https://www.youtube.com/@Afriqueavenir-m5g"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
            >
              <Youtube className="w-5 h-5" />
              YouTube
            </Link>
            <Link
              href="https://www.instagram.com/afriqueavenir9/profilecard/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-pink-500 transition-all"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61568365453332&mibextid=wwXIfr&rdid=T1Uukh3inyp1lt68&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F19TQgmn4dJ%2F%3Fmibextid%3DwwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 opacity-60 hover:opacity-100 hover:text-red-500 transition-all"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </Link>
          </div>
        </div>

        {/* Footer Credits */}
        <section className="text-center mt-8">
          <h3 className="text-sm">
            &copy; 2024
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://afrique-avenir.com/"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              {t("companyName")}
            </Link>
          </h3>
        </section>

        {/* Modals */}
        <FeedbackModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFeedbackRequest}
        />
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          onSubmit={handleContactRequest}
        />
      </div>
    </footer>
  );
};
