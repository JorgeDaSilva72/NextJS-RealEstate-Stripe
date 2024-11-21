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
interface Props {
  children: ReactNode;
}

const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isTransparent, setIsTransparent] = useState(false);

  const pathname = usePathname(); // Utilisation de usePathname pour obtenir le chemin actuel
  useEffect(() => {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <Navbar
      // className=" bg-transparent shadow-md z-50 "
      className={`${
        isTransparent ? "fixed top-0 left-0 w-full bg-transparent" : "bg-white "
      } z-50 shadow-md transition duration-300 ease-in-out`}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Mobile Menu Toggle */}
      <NavbarContent className="flex items-center">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="sm:hidden"
        />
        {/* Brand */}
        <NavbarBrand>
          <Link
            href="/"
            className="flex items-center text-primary-500 hover:text-primary-700 transition duration-200"
          >
            <Image
              src="/logo-topaz-enhance-coupe.jpeg"
              alt="Logo Afrique Avenir"
              width={48}
              height={48}
              className="rounded-lg object-contain"
            />
            {/* Texte caché sur petit écran */}
            <div className=" ml-2 hidden sm:flex sm:flex-col   text-center md:flex md:flex-row md:items-center md:text-left  ">
              <p className="font-bold text-primary text-xs sm:text-sm md:text-md lg:text-lg">
                AFRIQUE&nbsp;
              </p>
              <p className="font-bold text-primary text-xs sm:text-sm md:text-md lg:text-lg">
                AVENIR&nbsp;
              </p>
              <p className="font-bold text-primary text-xs sm:text-sm md:text-md lg:text-lg">
                IMMO&nbsp;
              </p>
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
        <NavbarItem>
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
        </NavbarItem>
      </NavbarContent>

      {/* Actions */}
      {/* <NavbarContent justify="end" className="hidden sm:flex"> */}
      <NavbarContent justify="end" className="sm:flex">
        {children}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu
        className={`sm:hidden ${
          isMenuOpen ? "flex" : "hidden"
        } flex-col items-center`}
      >
        <NavbarMenuItem>
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
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Appbar;
