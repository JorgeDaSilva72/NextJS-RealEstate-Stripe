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
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, [])
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
      className={`${isTransparent ? "fixed top-0 left-0 w-full bg-transparent" : "bg-white "
        } z-50 shadow-md transition duration-300 ease-in-out`}
      onMenuOpenChange={setIsMenuOpen}
      height={pathname != "/" && width < 600 ? "7rem" : "4rem"}
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
                <p className={(pathname == "/" ? "text-white" : "text-blue-500") + " w-full text-center whitespace-pre-line font-medium tracking-[1px] text-primary text-sm"}>
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
              className={(pathname == "/" ? "text-white" : "text-blue-500") + " tracking-[1px] text-primary-500 hover:text-primary-700 transition duration-200"}
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
      <NavbarContent
        className="sm:hidden menu"
      >
        <input type="checkbox" className="menu-open hidden" name="menu-open" id="menu-open" />
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
