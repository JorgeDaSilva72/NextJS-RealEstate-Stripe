// "use client";

// import React, { ReactNode, useEffect, useState } from "react";
// import {
//   Navbar,
//   NavbarContent,
//   NavbarMenuToggle,
//   NavbarBrand,
//   NavbarItem,
//   Button,
//   NavbarMenu,
//   NavbarMenuItem,
//   DropdownTrigger,
//   DropdownItem,
//   Dropdown,
//   DropdownMenu,
// } from "@nextui-org/react";
// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// // import { navigationItems } from "../../data/navigationData";
// import { CountrySelector } from "./CountrySelector";
// import PlusSVG from "../assets/svg/PlusSVG";
// import { navigationItems } from "@/data/navigationData";
// import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

// interface Props {
//   children: ReactNode;
// }

// const Appbar = ({ children }: Props) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const handleScroll = () => {
//       const heroElement = document.getElementById("hero");
//       if (heroElement) {
//         const heroHeight = heroElement.offsetHeight;
//         const scrolled = window.scrollY > 0;
//         setIsScrolled(scrolled);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const isHomePage = pathname === "/";
//   // const navbarBackground = isHomePage
//   //   ? isScrolled
//   //     ? "bg-white/90 backdrop-blur-md"
//   //     : "bg-transparent"
//   //   : "bg-white";

//   const navbarBackground = isHomePage
//     ? "fixed bg-transparent backdrop-blur-md"
//     : "sticky bg-white";

//   const textColor = isHomePage && !isScrolled ? "text-white" : "text-primary";

//   const renderDropdownButton = (label: string) => (
//     <Button
//       disableRipple
//       className={`p-0 bg-transparent data-[hover=true]:bg-transparent ${textColor} font-medium`}
//       endContent={
//         <svg
//           className={`w-4 h-4 ${textColor}`}
//           fill="none"
//           strokeWidth="2"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path d="M19 9l-7 7-7-7" />
//         </svg>
//       }
//       radius="sm"
//       variant="light"
//     >
//       {label}
//     </Button>
//   );

//   useEffect(() => {
//     setIsMenuOpen(false); // Fermer le menu lors d'un changement de route
//   }, [pathname]);

//   return (
//     <Navbar
//       isMenuOpen={isMenuOpen}
//       className={`${navbarBackground}   top-0 left-0 right-0 h-16 transition-all duration-300 shadow-sm z-50`}
//       onMenuOpenChange={setIsMenuOpen}
//     >
//       <NavbarContent className="flex items-center">
//         <NavbarMenuToggle
//           aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
//           className="sm:hidden"
//           // onClick={() => setIsMenuOpen((prev) => !prev)} // Toggle de l'état
//         />
//         <NavbarBrand>
//           <Link href="/" className="flex items-center gap-2">
//             <Image
//               src="/logo-topaz-enhance-coupe.jpeg"
//               alt="Logo Afrique Avenir"
//               width={40}
//               height={40}
//               className="rounded-lg"
//             />
//             <div className="hidden md:block">
//               <p
//                 className={`${textColor} text-xs sm:text-sm md:text-sm lg:text-lg xl:text-xl font-medium tracking-wide whitespace-nowrap`}
//               >
//                 AFRIQUE AVENIR IMMO
//               </p>
//             </div>
//           </Link>
//         </NavbarBrand>
//       </NavbarContent>

//       <NavbarContent className="hidden sm:flex gap-6" justify="center">
//         {navigationItems.map((item) => (
//           <Dropdown key={item.label}>
//             <NavbarItem>
//               <DropdownTrigger>
//                 {renderDropdownButton(item.label)}
//               </DropdownTrigger>
//             </NavbarItem>
//             <DropdownMenu
//               aria-label={item.label}
//               className="w-[340px]"
//               itemClasses={{
//                 base: "gap-4",
//               }}
//             >
//               {item.dropdownItems.map((dropdownItem) => (
//                 <DropdownItem
//                   key={dropdownItem.key}
//                   description={dropdownItem.description}
//                   as={Link}
//                   href={dropdownItem.href}
//                 >
//                   {dropdownItem.title}
//                 </DropdownItem>
//               ))}
//             </DropdownMenu>
//           </Dropdown>
//         ))}
//         <NavbarItem>
//           {/* <CountrySelector
//             currentCountry="MA"
//             lang="fr"
//             color="primary"
//             variant="bordered"
//             size="lg"
//             isRequired
//             onSelectionChange={(country) => console.log(country)}
//             customNavigationPath={(lang, country) => `/${lang}/${country}`}
//             containerClassName="w-full max-w-md"
//             errorMessage="Veuillez sélectionner un pays"
//           /> */}
//           <LanguageSwitcher />
//         </NavbarItem>
//       </NavbarContent>

//       <NavbarContent justify="end">
//         <Button
//           as={Link}
//           href="/user/properties/add"
//           className="ml-4 flex items-center gap-2 bg-primary text-white hover:bg-primary/90 p-2 md:px-4 rounded-lg"
//           radius="sm"
//         >
//           {/* <svg
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//             strokeWidth="2"
//             stroke="currentColor"
//             className="w-5 h-5"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 4v16m8-8H4"
//             />
//           </svg> */}
//           <PlusSVG />
//           <span className="hidden sm:block">Publier une annonce</span>
//         </Button>
//         {children}
//       </NavbarContent>

//       <NavbarMenu className="pt-6 gap-6">
//         {navigationItems.map((item) => (
//           <NavbarMenuItem key={item.label}>
//             <div className="flex flex-col gap-2">
//               <p className="font-medium text-primary text-sm">{item.label}</p>
//               {item.dropdownItems.map((dropdownItem) => (
//                 <Link
//                   key={dropdownItem.key}
//                   href={dropdownItem.href}
//                   className="text-foreground/70 hover:text-foreground pl-4"
//                   onClick={() => setIsMenuOpen(false)} // Fermer le menu
//                 >
//                   {dropdownItem.title}
//                 </Link>
//               ))}
//             </div>
//           </NavbarMenuItem>
//         ))}
//       </NavbarMenu>
//     </Navbar>
//   );
// };

// export default Appbar;
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  DropdownTrigger,
  DropdownItem,
  Dropdown,
  DropdownMenu,
} from "@nextui-org/react";
// import { usePathname } from "next/navigation";
import Image from "next/image";
// import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useNavigationItems } from "@/data/navigationData";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import PlusSVG from "../assets/svg/PlusSVG";
import { Link, usePathname } from "@/i18n/routing";

interface Props {
  children: ReactNode;
}

const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const locale = useLocale(); // Récupérer la langue actuelle
  const t = useTranslations("appbar");
  const navigationItems = useNavigationItems(); // Charge les éléments traduits
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = pathname === "/";
  const navbarBackground = isHomePage
    ? "fixed bg-transparent backdrop-blur-md"
    : "sticky bg-white";
  const textColor = isHomePage && !isScrolled ? "text-white" : "text-primary";

  const renderDropdownButton = (label: string) => (
    <Button
      disableRipple
      className={`p-0 bg-transparent data-[hover=true]:bg-transparent ${textColor} font-medium`}
      endContent={
        <svg
          className={`w-4 h-4 ${textColor}`}
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      }
      radius="sm"
      variant="light"
    >
      {label}
    </Button>
  );

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      className={`${navbarBackground} top-0 left-0 right-0 h-16 transition-all duration-300 shadow-sm z-50`}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="flex items-center">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? t("closeMenu") : t("openMenu")}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-topaz-enhance-coupe.jpeg"
              alt="Logo Afrique Avenir"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <div className="hidden md:block">
              <p
                className={`${textColor} text-xs sm:text-sm md:text-sm lg:text-lg xl:text-xl font-medium tracking-wide whitespace-nowrap`}
              >
                {t("siteTitle")}
              </p>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {navigationItems.map((item) => (
          <Dropdown key={item.label}>
            <NavbarItem>
              <DropdownTrigger>
                {renderDropdownButton(item.label)}
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
              key={locale} // Forcer le re-render si la langue change
              aria-label={item.label}
              className="w-[340px]"
              itemClasses={{ base: "gap-4" }}
            >
              {item.dropdownItems.map((dropdownItem) => (
                <DropdownItem
                  key={dropdownItem.key}
                  description={dropdownItem.description}
                  as={Link}
                  href={dropdownItem.href}
                >
                  {dropdownItem.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ))}
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <Button
          as={Link}
          // href={`/${locale}/user/properties/add`}
          href={`/user/properties/add`}
          className="ml-4 flex items-center gap-2 bg-primary text-white hover:bg-primary/90 p-2 md:px-4 rounded-lg"
          radius="sm"
        >
          <PlusSVG />
          <span className="hidden sm:block">{t("publishAd")}</span>
        </Button>
        {children}
      </NavbarContent>

      <NavbarMenu className="pt-6 gap-6">
        {navigationItems.map((item) => (
          <NavbarMenuItem key={item.label}>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-primary text-sm">{item.label}</p>
              {item.dropdownItems.map((dropdownItem) => (
                <Link
                  key={dropdownItem.key}
                  href={dropdownItem.href}
                  className="text-foreground/70 hover:text-foreground pl-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dropdownItem.title}
                </Link>
              ))}
            </div>
          </NavbarMenuItem>
        ))}
        <LanguageSwitcher />
      </NavbarMenu>
    </Navbar>
  );
};

export default Appbar;
