// import { FaFacebook } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa6";
// import { FaSquareWhatsapp } from "react-icons/fa6";
// import { RxClipboardCopy } from "react-icons/rx";

// import React, { useState } from "react";

// interface ShareButtonsProps {
//   url: string; // Lien à partager
//   title?: string; // Titre (utile pour LinkedIn)
// }

// const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
//   const encodedUrl = encodeURIComponent(url);
//   const encodedTitle = title ? encodeURIComponent(title) : "";
//   const [copied, setCopied] = useState(false);
//   // Fonction pour copier le lien
//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(url);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000); // Réinitialise après 2 secondes
//     } catch (error) {
//       console.error("Erreur :", error);
//       alert("Impossible de copier le lien.");
//     }
//   };
//   return (
//     <div className="flex gap-4 flex-col bg-[#F9FAFB] rounded-lg p-4">
//       {/* Partager sur Facebook */}
//       <a
//         href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center gap-3"
//         aria-label="Partager sur Facebook"
//       >
//         <FaFacebook className="text-2xl text-[#1877F2]" />
//         <span>Facebook</span>
//       </a>

//       {/* Partager sur WhatsApp */}
//       <a
//         className="flex items-center gap-3 "
//         href={`https://wa.me/?text=${encodedUrl}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Partager sur WhatsApp"
//       >
//         <FaSquareWhatsapp className="text-2xl text-[#075E54]" />
//         <span>WhatsApp</span>
//       </a>

//       {/* Partager sur LinkedIn */}
//       <a
//         className="flex  items-center gap-3"
//         href={`https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         aria-label="Partager sur LinkedIn"
//       >
//         <FaLinkedin className="text-2xl text-[#0077B5]" />
//         <span>LinkedIn</span>
//       </a>
//       {/* Copier le lien */}
//       <button
//         onClick={copyToClipboard}
//         aria-label="Copier"
//         className="flex items-center gap-3 bg-[#39424e] text-white p-2 rounded-md"
//       >
//         <RxClipboardCopy className="text-2xl" />
//         <span>{copied ? "Lien copié !" : "Copier"}</span>
//       </button>
//     </div>
//   );
// };

// export default ShareButtons;
"use client";
import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaTelegram,
} from "react-icons/fa";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, description }) => {
  // Enhanced WhatsApp share message with description
  const whatsappMessage = description 
    ? `${title}\n\n${description}\n\n🔗 ${url}`
    : `${title}\n\n🔗 ${url}`;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank", "width=600,height=400");
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleShare("facebook")}
        className="text-blue-600 hover:text-blue-800 transition-colors"
        aria-label="Partager sur Facebook"
      >
        <FaFacebook size={24} />
      </button>

      <button
        onClick={() => handleShare("twitter")}
        className="text-blue-400 hover:text-blue-600 transition-colors"
        aria-label="Partager sur Twitter"
      >
        <FaTwitter size={24} />
      </button>

      <button
        onClick={() => handleShare("whatsapp")}
        className="text-green-500 hover:text-green-700 transition-colors"
        aria-label="Partager sur WhatsApp"
      >
        <FaWhatsapp size={24} />
      </button>

      <button
        onClick={() => handleShare("linkedin")}
        className="text-blue-700 hover:text-blue-900 transition-colors"
        aria-label="Partager sur LinkedIn"
      >
        <FaLinkedin size={24} />
      </button>

      <button
        onClick={() => handleShare("telegram")}
        className="text-blue-500 hover:text-blue-700 transition-colors"
        aria-label="Partager sur Telegram"
      >
        <FaTelegram size={24} />
      </button>
    </div>
  );
};

export default ShareButtons;
