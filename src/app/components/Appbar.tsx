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
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Appbar = ({ children }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar className="shadow-md bg-white" onMenuOpenChange={setIsMenuOpen}>
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
              className="rounded-lg"
            />
            {/* Texte caché sur petit écran */}
            <div className="ml-2 text-center hidden sm:block">
              <p className="font-bold text-md text-primary">AFRIQUE</p>
              <p className="font-bold text-md text-primary">AVENIR</p>
              <p className="font-bold text-md text-primary">IMMO</p>
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
