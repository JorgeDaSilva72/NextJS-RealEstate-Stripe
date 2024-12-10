// "use client";

// import {
//   Navbar,
//   NavbarContent,
//   NavbarMenuToggle,
//   NavbarBrand,
//   NavbarItem,
//   Button,
//   NavbarMenu,
//   NavbarMenuItem,
// } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { ReactNode, useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import { navBars } from "../data/navbars";

// interface Props {
//   children: ReactNode;
// }

// const Appbar = ({ children }: Props) => {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const [isTransparent, setIsTransparent] = useState(false);

//   const pathname = usePathname(); // Utilisation de usePathname pour obtenir le chemin actuel
//   useEffect(() => {
//     // Vérifie si on est dans la page d'accueil

//     const isHeroPage = pathname === "/";
//     setIsTransparent(isHeroPage);
//     const handleScroll = () => {
//       const heroElement = document.getElementById("hero");
//       if (heroElement) {
//         // Ajuste ici la hauteur du Hero pour déclencher le changement de style
//         const heroHeight = heroElement.offsetHeight;
//         setIsTransparent(window.scrollY < heroHeight);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname]);

//   return (
//     <Navbar
//       // className=" bg-transparent shadow-md z-50 "
//       className={`${
//         isTransparent ? "fixed top-0 left-0 w-full bg-transparent" : "bg-white "
//       } z-50 shadow-md transition duration-300 ease-in-out`}
//       onMenuOpenChange={setIsMenuOpen}
//     >
//       {/* Mobile Menu Toggle */}
//       <NavbarContent className="flex items-center">
//         <NavbarMenuToggle
//           aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
//           className="sm:hidden"
//         />
//         {/* Brand */}
//         <NavbarBrand>
//           <Link
//             href="/"
//             className="flex items-center text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             <Image
//               src="/logo-topaz-enhance-coupe.jpeg"
//               alt="Logo Afrique Avenir"
//               width={40}
//               height={40}
//               className="rounded-lg object-contain"
//             />
//             {/* Texte caché sur petit écran */}
//             <div className=" ml-2 hidden sm:flex sm:flex-col   text-center md:flex md:flex-row md:items-center md:text-left  ">
//               {/* <p className="font-bold text-primary text-xs sm:text-sm md:text-md lg:text-lg">
//                 AFRIQUE&nbsp;
//               </p>
//               <p className="font-bold text-primary text-xs sm:text-sm md:text-md lg:text-lg">
//                 AVENIR&nbsp;
//               </p>
//               <p className="font-bold text-primary text-xs sm:text-sm md:text-md lg:text-lg">
//                 IMMO&nbsp;
//               </p> */}
//               <div className="w-[170px] h-[50px] flex items-center justify-center">
//                 <p
//                   className={
//                     (pathname == "/" ? "text-white" : "text-blue-500") +
//                     " w-full text-center whitespace-pre-line font-medium leading-[20px] tracking-[1px] text-primary text-xs sm:text-sm md:text-md lg:text-lg"
//                   }
//                 >
//                   AFRIQUE AVENIR IMMO
//                 </p>
//               </div>
//             </div>
//           </Link>
//         </NavbarBrand>
//       </NavbarContent>

//       {/* Desktop Navigation Links */}
//       <NavbarContent className="hidden sm:flex gap-6">
//         {/* <NavbarItem>
//           <Link
//             href="/"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Accueil
//           </Link>
//         </NavbarItem> */}

//         {navBars.map((nav: { url: string; name: string }, index: number) => (
//           <NavbarItem key={index}>
//             <Link
//               href={nav.url}
//               className={
//                 (pathname == "/" ? "text-white" : "text-blue-500") +
//                 " tracking-[1px] text-primary-500 hover:text-primary-700 transition duration-200"
//               }
//             >
//               {nav.name}
//             </Link>
//           </NavbarItem>
//         ))}
//         {/* <NavbarItem>
//           <Link
//             href="/about"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             À Propos
//           </Link>
//         </NavbarItem>
//         <NavbarItem>
//           <Link
//             href="/contact"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Contact
//           </Link>
//         </NavbarItem> */}
//       </NavbarContent>

//       {/* Actions */}
//       {/* <NavbarContent justify="end" className="hidden sm:flex"> */}
//       <NavbarContent justify="end" className="sm:flex">
//         {children}
//       </NavbarContent>

//       {/* Mobile Menu */}
//       <NavbarMenu
//         className={`sm:hidden ${
//           isMenuOpen ? "flex" : "hidden"
//         } flex-col items-center`}
//       >
//         <NavbarMenuItem>
//           <Link
//             href="/"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Accueil
//           </Link>
//         </NavbarMenuItem>
//         <NavbarMenuItem>
//           <Link
//             href="/about"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             À Propos
//           </Link>
//         </NavbarMenuItem>
//         <NavbarMenuItem>
//           <Link
//             href="/contact"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Contact
//           </Link>
//         </NavbarMenuItem>
//       </NavbarMenu>
//     </Navbar>
//   );
// };

// export default Appbar;
// end
// Cedrico menu responsive pour mobile
// "use client";

// import {
//   Navbar,
//   NavbarContent,
//   NavbarMenuToggle,
//   NavbarBrand,
//   NavbarItem,
//   Button,
//   NavbarMenu,
//   NavbarMenuItem,
// } from "@nextui-org/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { ReactNode, useEffect, useState } from "react";
// import { usePathname } from "next/navigation";
// import "./appbar.css";
// import { navBars } from "../data/navbars";
// interface Props {
//   children: ReactNode;
// }

// const Appbar = ({ children }: Props) => {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const [isTransparent, setIsTransparent] = useState(false);
//   const [width, setWidth] = useState(0);

//   useEffect(() => {
//     setWidth(window.innerWidth);
//   }, []);
//   const pathname = usePathname(); // Utilisation de usePathname pour obtenir le chemin actuel
//   useEffect(() => {
//     // Vérifie si on est dans la page d'accueil

//     const isHeroPage = pathname === "/";
//     setIsTransparent(isHeroPage);
//     const handleScroll = () => {
//       const heroElement = document.getElementById("hero");
//       if (heroElement) {
//         // Ajuste ici la hauteur du Hero pour déclencher le changement de style
//         const heroHeight = heroElement.offsetHeight;
//         setIsTransparent(window.scrollY < heroHeight);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [pathname]);

//   return (
//     <Navbar
//       // className=" bg-transparent shadow-md z-50 "
//       className={`${
//         isTransparent ? "fixed top-0 left-0 w-full bg-transparent" : "bg-white "
//       } z-50 shadow-md transition duration-300 ease-in-out`}
//       onMenuOpenChange={setIsMenuOpen}
//       height={pathname != "/" && width < 600 ? "7rem" : "4rem"}
//     >
//       {/* Mobile Menu Toggle */}
//       <NavbarContent className="flex items-center">
//         {/* <NavbarMenuToggle
//           aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
//           className="sm:hidden"
//         /> */}
//         {/* Brand */}
//         <NavbarBrand>
//           <Link
//             href="/"
//             className="flex items-center text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             <Image
//               src="/logo-topaz-enhance-coupe.jpeg"
//               alt="Logo Afrique Avenir"
//               width={40}
//               height={40}
//               className="rounded-lg object-contain"
//             />
//             {/* Texte caché sur petit écran */}
//             <div className=" ml-2 hidden sm:flex sm:flex-col   text-center md:flex md:flex-row md:items-center md:text-left  ">
//               <div className="w-[140px] h-[50px] flex items-center justify-center">
//                 <p
//                   className={
//                     (pathname == "/" ? "text-white" : "text-blue-500") +
//                     " w-full text-center whitespace-pre-line font-medium tracking-[1px] text-primary text-sm"
//                   }
//                 >
//                   AFRIQUE AVENIR IMMO
//                 </p>
//               </div>
//             </div>
//           </Link>
//         </NavbarBrand>
//       </NavbarContent>

//       {/* Desktop Navigation Links */}
//       <NavbarContent className="hidden sm:flex gap-6">
//         {/* <NavbarItem>
//           <Link
//             href="/"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Accueil
//           </Link>
//         </NavbarItem> */}
//         {navBars.map((nav, index) => (
//           <NavbarItem key={index}>
//             <Link
//               href={nav.url}
//               className={
//                 (pathname == "/" ? "text-white" : "text-blue-500") +
//                 " tracking-[1px] text-primary-500 hover:text-primary-700 transition duration-200"
//               }
//             >
//               {nav.name}
//             </Link>
//           </NavbarItem>
//         ))}
//         {/* <NavbarItem>
//           <Link
//             href="/about"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             À Propos
//           </Link>
//         </NavbarItem>
//         <NavbarItem>
//           <Link
//             href="/contact"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Contact
//           </Link>
//         </NavbarItem> */}
//       </NavbarContent>

//       {/* Actions */}
//       {/* <NavbarContent justify="end" className="hidden sm:flex"> */}
//       <NavbarContent justify="end" className="sm:flex">
//         {children}
//       </NavbarContent>

//       {/* Mobile Menu */}
//       <NavbarContent className="sm:hidden menu">
//         <input
//           type="checkbox"
//           className="menu-open hidden"
//           name="menu-open"
//           id="menu-open"
//         />
//         <label className="menu-open-button" htmlFor="menu-open">
//           <span className="hamburger hamburger-1"></span>
//           <span className="hamburger hamburger-2"></span>
//           <span className="hamburger hamburger-3"></span>
//         </label>
//         {navBars.map((nav, index) => (
//           <Link href={nav.url} className="menu-item" key={index}>
//             {nav.svg}
//           </Link>
//         ))}
//         {/* <NavbarMenuItem>
//           <Link
//             href="/"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Accueil
//           </Link>
//         </NavbarMenuItem>
//         <NavbarMenuItem>
//           <Link
//             href="/about"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             À Propos
//           </Link>
//         </NavbarMenuItem>
//         <NavbarMenuItem>
//           <Link
//             href="/contact"
//             className="text-primary-500 hover:text-primary-700 transition duration-200"
//           >
//             Contact
//           </Link>
//         </NavbarMenuItem> */}
//       </NavbarContent>
//     </Navbar>
//   );
// };

// export default Appbar;

// end-----------------------------
// Cedrico 10/12/2024
"use client";

import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./appbar.css";
import { navBars } from "../data/navbars";
interface Props {
  children: ReactNode;
}

const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [isClient, setIsClient] = useState(false); // Nouvel état pour savoir si on est en mode client
  const pathname = usePathname(); // Utilisation de usePathname pour obtenir le chemin actuel
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Ce code ne s'exécute que côté client
    setIsClient(true); // Une fois monté côté client, setIsClient à true
    // Fonction de mise à jour de la largeur de la fenêtre
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);

    // Initialiser la largeur de la fenêtre
    if (isClient) {
      updateWindowWidth(); // Définir la largeur de la fenêtre dès que le composant est monté
      window.addEventListener("resize", updateWindowWidth);
    }
    // Vérifie si on est dans la page d'accueil

    const isHeroPage = pathname === "/";
    setIsTransparent(isHeroPage);
    const handleScroll = () => {
      const heroElement = document.getElementById("hero");
      if (heroElement) {
        // Ajuste ici la hauteur du Hero pour déclencher le changement de style
        const heroHeight = heroElement.offsetHeight;
        setIsTransparent(window.scrollY < heroHeight);
      }
    };
    if (isClient) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (isClient) {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", updateWindowWidth);
      }
    };
  }, [pathname, isClient]); // Ajouter isClient dans les dépendances

  return (
    <Navbar
      // className=" bg-transparent shadow-md z-50 "
      className={`${
        isTransparent ? "fixed top-0 left-0 w-full bg-transparent" : "bg-white "
      } z-50 shadow-md transition duration-300 ease-in-out`}
      onMenuOpenChange={setIsMenuOpen}
      height={pathname != "/" && windowWidth < 600 ? "7rem" : "4rem"}
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="flex items-center">
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="sm:hidden"
        /> */}
        {/* Brand */}
        <NavbarBrand>
          <Link
            href="/"
            className="flex items-center text-primary-500 hover:text-primary-700 transition duration-200"
          >
            <Image
              src="/logo-topaz-enhance-coupe.jpeg"
              alt="Logo Afrique Avenir"
              width={40}
              height={40}
              className="rounded-lg object-contain"
            />
            {/* Texte caché sur petit écran */}
            <div className=" ml-2 hidden sm:flex sm:flex-col   text-center md:flex md:flex-row md:items-center md:text-left  ">
              <div className="w-[140px] h-[50px] flex items-center justify-center">
                <p
                  className={
                    (pathname == "/" ? "text-white" : "text-blue-500") +
                    " w-full text-center whitespace-pre-line font-medium tracking-[1px] text-primary text-sm"
                  }
                >
                  AFRIQUE AVENIR IMMO
                </p>
              </div>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Navigation Links */}
      <NavbarContent className="hidden sm:flex gap-6">
        {/* <NavbarItem>
          <Link
            href="/"
            className="text-primary-500 hover:text-primary-700 transition duration-200"
          >
            Accueil
          </Link>
        </NavbarItem> */}
        {navBars.map((nav, index) => (
          <NavbarItem key={index}>
            <Link
              href={nav.url}
              className={
                (pathname == "/" ? "text-white" : "text-blue-500") +
                " tracking-[1px] text-primary-500 hover:text-primary-700 transition duration-200"
              }
            >
              {nav.name}
            </Link>
          </NavbarItem>
        ))}
        {/* <NavbarItem>
          <Link
            href="/about"
            className="text-primary-500 hover:text-primary-700 transition duration-200"
          >
            À Propos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/contact"
            className="text-primary-500 hover:text-primary-700 transition duration-200"
          >
            Contact
          </Link>
        </NavbarItem> */}
      </NavbarContent>

      {/* Actions */}
      {/* <NavbarContent justify="end" className="hidden sm:flex"> */}
      <NavbarContent justify="end" className="sm:flex">
        {children}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarContent className="sm:hidden menu w-1/3">
        <input
          type="checkbox"
          className="menu-open hidden"
          name="menu-open"
          id="menu-open"
        />
        <label className="menu-open-button" htmlFor="menu-open">
          <span className="hamburger hamburger-1"></span>
          <span className="hamburger hamburger-2"></span>
          <span className="hamburger hamburger-3"></span>
        </label>
        {navBars.map((nav, index) => (
          <Link href={nav.url} className="menu-item" key={index}>
            {nav.svg}
          </Link>
        ))}
        {/* <!-- filters --> */}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="shadowed-goo">
              <feGaussianBlur
                in="SourceGraphic"
                result="blur"
                stdDeviation="20"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
              <feColorMatrix
                in="shadow"
                mode="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2"
                result="shadow"
              />
              <feOffset in="shadow" dx="1" dy="1" result="shadow" />
              <feBlend in2="shadow" in="goo" result="goo" />
              <feBlend in2="goo" in="SourceGraphic" result="mix" />
            </filter>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                result="blur"
                stdDeviation="20"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feBlend in2="goo" in="SourceGraphic" result="mix" />
            </filter>
          </defs>
        </svg>
        {/* <NavbarMenuItem>
          <Link
            href="/"
            className="text-primary-500 hover:text-primary-700 transition duration-200"
          >
            Accueil
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/about"
            className="text-primary-500 hover:text-primary-700 transition duration-200"
          >
            À Propos
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/contact"
            className="text-primary-500 hover:text-primary-700 transition duration-200"
          >
            Contact
          </Link>
        </NavbarMenuItem> */}
      </NavbarContent>
    </Navbar>
  );
};

export default Appbar;
