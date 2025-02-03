"use client";

import { usePathname } from "@/i18n/routing";
// import { usePathname } from "next/navigation";
import { FooterSection } from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname(); // Récupère la route actuelle

  // Affiche le footer sauf sur la page d'accueil "/"
  if (pathname === "/") {
    return null;
  }

  return <FooterSection />;
}
