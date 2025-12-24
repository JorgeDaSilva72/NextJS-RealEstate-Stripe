// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";

// const LanguageSwitcher = () => {
//   const router = useRouter();
//   const pathname = usePathname();

//   const switchLanguage = (locale: string) => {
//     const segments = pathname.split("/");
//     segments[1] = locale; // Remplace la langue actuelle par la nouvelle
//     router.push(segments.join("/"));
//   };

//   return (
//     <div className="flex gap-2">
//       <button
//         onClick={() => switchLanguage("fr")}
//         className="p-2 bg-gray-200 rounded"
//       >
//         🇫🇷 FR
//       </button>
//       <button
//         onClick={() => switchLanguage("en")}
//         className="p-2 bg-gray-200 rounded"
//       >
//         🇬🇧 EN
//       </button>
//     </div>
//   );
// };

// export default LanguageSwitcher;
// "use client";

// import { useLocale, useTranslations } from "next-intl";
// import { usePathname, useRouter } from "next/navigation";
// import Link from "next/link";

// const LanguageSwitcher = () => {
//   const locale = useLocale();
//   const t = useTranslations("LanguageSwitcher");
//   const router = useRouter();
//   const pathname = usePathname();

//   const switchLanguage = (newLocale: string) => {
//     const segments = pathname.split("/");
//     segments[1] = newLocale; // Remplace la langue actuelle par la nouvelle
//     router.push(segments.join("/"));
//   };

//   return (
//     <div className="flex gap-2">
//       <button
//         onClick={() => switchLanguage("fr")}
//         className={`p-2 rounded ${
//           locale === "fr" ? "bg-blue-500 text-white" : "bg-gray-200"
//         }`}
//         aria-label={t("switchToFrench")}
//       >
//         🇫🇷 FR
//       </button>
//       <button
//         onClick={() => switchLanguage("en")}
//         className={`p-2 rounded ${
//           locale === "en" ? "bg-blue-500 text-white" : "bg-gray-200"
//         }`}
//         aria-label={t("switchToEnglish")}
//       >
//         🇬🇧 EN
//       </button>
//     </div>
//   );
// };

// export default LanguageSwitcher;

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useLocale, useTranslations } from "next-intl";
// import { usePathname, useRouter } from "next/navigation";
// import { ChevronDown } from "lucide-react";

// const LanguageSwitcher = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const locale = useLocale();
//   const t = useTranslations("LanguageSwitcher");
//   const router = useRouter();
//   const pathname = usePathname();

//   const languages = [
//     { code: "fr", name: "Français", flag: "🇫🇷" },
//     { code: "en", name: "English", flag: "🇬🇧" },
//   ];

//   const switchLanguage = (newLocale: string) => {
//     if (newLocale !== locale) {
//       router.push(`/${newLocale}${pathname.slice(3)}`);
//     }
//     setIsOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div ref={dropdownRef} className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 px-3 py-2 rounded-md
//         bg-gray-100 hover:bg-gray-200 focus:outline-none"
//       >
//         {/* {languages.find((lang) => lang.code === locale)?.flag} */}
//         {languages.find((lang) => lang.code === locale)?.name}
//         <ChevronDown className="ml-2 w-4 h-4" />
//       </button>
//       {isOpen && (
//         <div className="absolute mt-1 w-full bg-white shadow-lg rounded-md border z-10">
//           {languages
//             .filter((lang) => lang.code !== locale)
//             .map((lang) => (
//               <button
//                 key={lang.code}
//                 onClick={() => switchLanguage(lang.code)}
//                 className="flex items-center gap-2 w-full p-2
//                 hover:bg-gray-100 text-left"
//               >
//                 {lang.name}
//               </button>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LanguageSwitcher;

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { useLocale, useTranslations } from "next-intl";
// import { usePathname, useRouter } from "next/navigation";
// import { ChevronDown } from "lucide-react";

// const FrFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <g fillRule="evenodd" strokeWidth="1pt">
//       <path fill="#fff" d="M0 0h640v480H0z" />
//       <path fill="#00267f" d="M0 0h213.3v480H0z" />
//       <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
//     </g>
//   </svg>
// );

// const GbFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#012169" d="M0 0h640v480H0z" />
//     <path
//       fill="#FFF"
//       d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
//     />
//     <path
//       fill="#C8102E"
//       d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
//     />
//     <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
//     <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
//   </svg>
// );

// const LanguageSwitcher = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const locale = useLocale();
//   const t = useTranslations("LanguageSwitcher");
//   const router = useRouter();
//   const pathname = usePathname();

//   const languages = [
//     {
//       code: "fr",
//       flag: FrFlag,
//     },
//     {
//       code: "en",
//       flag: GbFlag,
//     },
//   ];

//   const switchLanguage = (newLocale: string) => {
//     if (newLocale !== locale) {
//       router.push(`/${newLocale}${pathname.slice(3)}`);
//     }
//     setIsOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const currentLanguage = languages.find((lang) => lang.code === locale);
//   const Flag = currentLanguage?.flag || FrFlag;

//   return (
//     <div ref={dropdownRef} className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 px-3 py-2 rounded-lg
//           bg-white hover:bg-gray-50 border border-gray-200
//           shadow-sm transition-colors duration-200
//           focus:outline-none focus:ring-2 focus:ring-offset-2
//           focus:ring-gray-200"
//         aria-label={t("selectLanguage")}
//       >
//         <Flag />
//         <span className="text-sm font-medium text-gray-700">
//           {t(`languages.${locale}`)}
//         </span>
//         <ChevronDown
//           className={`w-4 h-4 text-gray-500 transition-transform duration-200
//             ${isOpen ? "rotate-180" : "rotate-0"}`}
//         />
//       </button>

//       {isOpen && (
//         <div
//           className="absolute right-0 mt-2 w-40 rounded-lg bg-white
//           shadow-lg ring-1 ring-black ring-opacity-5 z-50
//           transform opacity-100 scale-100
//           transition-all duration-200 ease-out"
//         >
//           <div className="py-1">
//             {languages
//               .filter((lang) => lang.code !== locale)
//               .map((lang) => {
//                 const OtherFlag = lang.flag;
//                 return (
//                   <button
//                     key={lang.code}
//                     onClick={() => switchLanguage(lang.code)}
//                     className="flex items-center gap-3 w-full px-4 py-2
//                       text-sm text-gray-700 hover:bg-gray-50
//                       transition-colors duration-150"
//                   >
//                     <OtherFlag />
//                     <span>{t(`languages.${lang.code}`)}</span>
//                   </button>
//                 );
//               })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LanguageSwitcher;
// "use client";

// import { useLocale, useTranslations } from "next-intl";
// import { usePathname, useRouter } from "next/navigation";
// import { Select, SelectItem } from "@nextui-org/react";
// // import { usePathname, useRouter } from "@/i18n/routing";

// const FrFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <g fillRule="evenodd" strokeWidth="1pt">
//       <path fill="#fff" d="M0 0h640v480H0z" />
//       <path fill="#00267f" d="M0 0h213.3v480H0z" />
//       <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
//     </g>
//   </svg>
// );

// const GbFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#012169" d="M0 0h640v480H0z" />
//     <path
//       fill="#FFF"
//       d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
//     />
//     <path
//       fill="#C8102E"
//       d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
//     />
//     <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
//     <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
//   </svg>
// );

// const PtFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#046a38" d="M0 0h240v480H0z" />
//     <path fill="#da291c" d="M240 0h400v480H240z" />
//     <path fill="#ffd90a" d="M160 240a80 80 0 1 1-160 0 80 80 0 0 1 160 0z" />
//     <path
//       fill="#da291c"
//       d="M110 240c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50z"
//     />
//     <path
//       fill="#fff"
//       d="M130 240c0-16.6 13.4-30 30-30s30 13.4 30 30-13.4 30-30 30-30-13.4-30-30z"
//     />
//   </svg>
// );

// const LanguageSwitcher = () => {
//   const locale = useLocale();
//   const t = useTranslations("LanguageSwitcher");
//   const router = useRouter();
//   const pathname = usePathname();

//   const languages = [
//     {
//       code: "fr",
//       flag: FrFlag,
//       label: t("languages.fr"),
//     },
//     {
//       code: "en",
//       flag: GbFlag,
//       label: t("languages.en"),
//     },
//     {
//       code: "pt",
//       flag: PtFlag,
//       label: t("languages.pt"),
//     },
//   ];

//   const switchLanguage = (newLocale: string) => {
//     if (newLocale !== locale) {
//       router.push(`/${newLocale}${pathname.slice(3)}`);
//     }
//   };

//   const currentLanguage = languages.find((lang) => lang.code === locale);
//   const Flag = currentLanguage?.flag || FrFlag;

//   return (
//     <div className="w-[150px]">
//       <Select
//         aria-label={t("selectLanguage")}
//         selectedKeys={[locale]}
//         onChange={(e) => switchLanguage(e.target.value)}
//         startContent={<Flag />}
//         classNames={{
//           trigger: "bg-white hover:bg-gray-50 border border-gray-200 shadow-sm",
//           value: "text-sm font-medium text-gray-700",
//         }}
//       >
//         {languages.map((lang) => {
//           const OtherFlag = lang.flag;
//           return (
//             <SelectItem
//               key={lang.code}
//               value={lang.code}
//               startContent={<OtherFlag />}
//               className="text-sm text-gray-700"
//             >
//               {lang.label}
//             </SelectItem>
//           );
//         })}
//       </Select>
//     </div>
//   );
// };

// export default LanguageSwitcher;
// "use client";

// import { useLocale, useTranslations } from "next-intl";
// import { usePathname, useRouter } from "next/navigation";
// import { Select, SelectItem } from "@nextui-org/react";

// const FrFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <g fillRule="evenodd" strokeWidth="1pt">
//       <path fill="#fff" d="M0 0h640v480H0z" />
//       <path fill="#00267f" d="M0 0h213.3v480H0z" />
//       <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
//     </g>
//   </svg>
// );

// const GbFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#012169" d="M0 0h640v480H0z" />
//     <path
//       fill="#FFF"
//       d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
//     />
//     <path
//       fill="#C8102E"
//       d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
//     />
//     <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
//     <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
//   </svg>
// );

// const PtFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#046a38" d="M0 0h240v480H0z" />
//     <path fill="#da291c" d="M240 0h400v480H240z" />
//     <path fill="#ffd90a" d="M160 240a80 80 0 1 1-160 0 80 80 0 0 1 160 0z" />
//     <path
//       fill="#da291c"
//       d="M110 240c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50z"
//     />
//     <path
//       fill="#fff"
//       d="M130 240c0-16.6 13.4-30 30-30s30 13.4 30 30-13.4 30-30 30-30-13.4-30-30z"
//     />
//   </svg>
// );

// const ArFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#006233" d="M0 0h640v480H0z" />
//     <path
//       fill="#fff"
//       d="M67 192a67 67 0 1 0 0 96 80 80 0 1 1 0-96m13 48l84-27-52 71v-88l52 71z"
//     />
//   </svg>
// );

// const LanguageSwitcher = () => {
//   const locale = useLocale();
//   const t = useTranslations("LanguageSwitcher");
//   const router = useRouter();
//   const pathname = usePathname();

//   const languages = [
//     {
//       code: "fr",
//       flag: FrFlag,
//       label: t("languages.fr"),
//     },
//     {
//       code: "en",
//       flag: GbFlag,
//       label: t("languages.en"),
//     },
//     {
//       code: "pt",
//       flag: PtFlag,
//       label: t("languages.pt"),
//     },
//     {
//       code: "ar",
//       flag: ArFlag,
//       label: t("languages.ar"),
//     },
//   ];

//   const switchLanguage = (newLocale: string) => {
//     if (newLocale !== locale) {
//       router.push(`/${newLocale}${pathname.slice(3)}`);
//     }
//   };

//   const currentLanguage = languages.find((lang) => lang.code === locale);
//   const Flag = currentLanguage?.flag || FrFlag;

//   return (
//     <div className="w-[150px]">
//       <Select
//         aria-label={t("selectLanguage")}
//         selectedKeys={[locale]}
//         onChange={(e) => switchLanguage(e.target.value)}
//         startContent={<Flag />}
//         classNames={{
//           trigger: "bg-white hover:bg-gray-50 border border-gray-200 shadow-sm",
//           value: "text-sm font-medium text-gray-700",
//         }}
//       >
//         {languages.map((lang) => {
//           const OtherFlag = lang.flag;
//           return (
//             <SelectItem
//               key={lang.code}
//               value={lang.code}
//               startContent={<OtherFlag />}
//               className={`text-sm text-gray-700 ${
//                 lang.code === "ar" ? "text-right" : ""
//               }`}
//             >
//               {lang.label}
//             </SelectItem>
//           );
//         })}
//       </Select>
//     </div>
//   );
// };

// export default LanguageSwitcher;
// "use client";

// import { useLocale, useTranslations } from "next-intl";
// import { usePathname, useRouter } from "next/navigation";
// import { Select, SelectItem } from "@nextui-org/react";

// const FrFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <g fillRule="evenodd" strokeWidth="1pt">
//       <path fill="#fff" d="M0 0h640v480H0z" />
//       <path fill="#00267f" d="M0 0h213.3v480H0z" />
//       <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
//     </g>
//   </svg>
// );

// const GbFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#012169" d="M0 0h640v480H0z" />
//     <path
//       fill="#FFF"
//       d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
//     />
//     <path
//       fill="#C8102E"
//       d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
//     />
//     <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
//     <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
//   </svg>
// );

// const PtFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#046a38" d="M0 0h240v480H0z" />
//     <path fill="#da291c" d="M240 0h400v480H240z" />
//     <path fill="#ffd90a" d="M160 240a80 80 0 1 1-160 0 80 80 0 0 1 160 0z" />
//     <path
//       fill="#da291c"
//       d="M110 240c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50z"
//     />
//     <path
//       fill="#fff"
//       d="M130 240c0-16.6 13.4-30 30-30s30 13.4 30 30-13.4 30-30 30-30-13.4-30-30z"
//     />
//   </svg>
// );

// const ArFlag = () => (
//   <svg className="w-5 h-4" viewBox="0 0 640 480">
//     <path fill="#006233" d="M0 0h640v480H0z" />
//     <path
//       fill="#fff"
//       d="M67 192a67 67 0 1 0 0 96 80 80 0 1 1 0-96m13 48l84-27-52 71v-88l52 71z"
//     />
//   </svg>
// );

// const LanguageSwitcher = () => {
//   const locale = useLocale();
//   const t = useTranslations("LanguageSwitcher");
//   const router = useRouter();
//   const pathname = usePathname();

//   const isRTL = locale === "ar";

//   const languages = [
//     {
//       code: "fr",
//       flag: FrFlag,
//       label: t("languages.fr"),
//     },
//     {
//       code: "en",
//       flag: GbFlag,
//       label: t("languages.en"),
//     },
//     {
//       code: "pt",
//       flag: PtFlag,
//       label: t("languages.pt"),
//     },
//     {
//       code: "ar",
//       flag: ArFlag,
//       label: t("languages.ar"),
//     },
//   ];

//   const switchLanguage = (newLocale: string) => {
//     if (newLocale !== locale) {
//       router.push(`/${newLocale}${pathname.slice(3)}`);
//     }
//   };

//   const currentLanguage = languages.find((lang) => lang.code === locale);
//   const Flag = currentLanguage?.flag || FrFlag;

//   return (
//     <div className={`w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
//       <Select
//         aria-label={t("selectLanguage")}
//         selectedKeys={[locale]}
//         onChange={(e) => switchLanguage(e.target.value)}
//         startContent={<Flag />}
//         classNames={{
//           trigger: `bg-white hover:bg-gray-50 border border-gray-200 shadow-sm ${
//             isRTL ? "text-right" : "text-left"
//           }`,
//           value: `text-sm font-medium text-gray-700 ${
//             isRTL ? "text-right" : "text-left"
//           }`,
//           base: isRTL ? "text-right" : "text-left",
//         }}
//       >
//         {languages.map((lang) => {
//           const OtherFlag = lang.flag;
//           return (
//             <SelectItem
//               key={lang.code}
//               value={lang.code}
//               startContent={<OtherFlag />}
//               className="text-sm text-gray-700"
//             >
//               {lang.label}
//             </SelectItem>
//           );
//         })}
//       </Select>
//     </div>
//   );
// };

// export default LanguageSwitcher;
"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Select, SelectItem } from "@nextui-org/react";

const FrFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#00267f" d="M0 0h213.3v480H0z" />
      <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
    </g>
  </svg>
);

const GbFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path
      fill="#FFF"
      d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
    />
    <path
      fill="#C8102E"
      d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
    />
    <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
    <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
  </svg>
);

const PtFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <path fill="#046a38" d="M0 0h240v480H0z" />
    <path fill="#da291c" d="M240 0h400v480H240z" />
    <path fill="#ffd90a" d="M160 240a80 80 0 1 1-160 0 80 80 0 0 1 160 0z" />
    <path
      fill="#da291c"
      d="M110 240c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50z"
    />
    <path
      fill="#fff"
      d="M130 240c0-16.6 13.4-30 30-30s30 13.4 30 30-13.4 30-30 30-30-13.4-30-30z"
    />
  </svg>
);

const ArFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <path fill="#006233" d="M0 0h640v480H0z" />
    <path
      fill="#fff"
      d="M67 192a67 67 0 1 0 0 96 80 80 0 1 1 0-96m13 48l84-27-52 71v-88l52 71z"
    />
  </svg>
);

const LanguageSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const pathname = usePathname();

  const isRTL = locale === "ar";

  const languages = [
    {
      code: "fr",
      flag: FrFlag,
      label: t("languages.fr"),
    },
    {
      code: "en",
      flag: GbFlag,
      label: t("languages.en"),
    },
    {
      code: "ar",
      flag: ArFlag,
      label: t("languages.ar"),
    },
    {
      code: "pt",
      flag: PtFlag,
      label: t("languages.pt"),
    },
  ];

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    // Ne rien faire si on sélectionne la langue actuelle
    if (newLocale === locale) {
      return;
    }
    
    // usePathname from next-intl returns pathname WITHOUT locale prefix
    // So if we're on /fr/user/properties, pathname will be /user/properties
    let currentPath = pathname || "/";
    
    // Handle edge case: if pathname is empty or just "/", use root
    if (!currentPath || currentPath === "/") {
      currentPath = "/";
    }
    
    // Ensure we have a leading slash
    if (!currentPath.startsWith("/")) {
      currentPath = "/" + currentPath;
    }
    
    // Remove trailing slash (except for root)
    if (currentPath !== "/" && currentPath.endsWith("/")) {
      currentPath = currentPath.slice(0, -1);
    }
    
    // Build the final path with the new locale
    // For root, just use the locale; otherwise prepend locale to the path
    const finalPath = currentPath === "/" ? `/${newLocale}` : `/${newLocale}${currentPath}`;
    
    // Use window.location for a full page reload to ensure locale change takes effect
    if (typeof window !== "undefined") {
      window.location.href = finalPath;
    } else {
      // Fallback for SSR
      router.push(finalPath);
    }
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);
  const Flag = currentLanguage?.flag || FrFlag;

  return (
    <div className={`w-[150px] ${isRTL ? "text-right" : "text-left"}`}>
      <Select
        aria-label={t("selectLanguage")}
        defaultSelectedKeys={[locale]}
        onChange={handleSelectionChange}
        startContent={<Flag />}
        classNames={{
          trigger: `bg-white hover:bg-gray-50 border border-gray-200 shadow-sm ${
            isRTL ? "text-right" : "text-left"
          }`,
          value: `text-sm font-medium text-gray-700 ${
            isRTL ? "text-right" : "text-left"
          }`,
          base: isRTL ? "text-right" : "text-left",
        }}
      >
        {languages.map((lang) => {
          const OtherFlag = lang.flag;
          return (
            <SelectItem
              key={lang.code}
              value={lang.code}
              startContent={<OtherFlag />}
              className="text-sm text-gray-700"
            >
              {lang.label}
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
