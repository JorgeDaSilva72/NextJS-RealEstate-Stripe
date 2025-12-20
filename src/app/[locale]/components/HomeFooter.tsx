"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const footerLinks = {
  about: [
    { label: "À propos", href: "/about" },
    { label: "Notre équipe", href: "/team" },
    { label: "Carrières", href: "/careers" },
    { label: "Presse", href: "/press" },
  ],
  services: [
    { label: "Acheter", href: "/buy" },
    { label: "Louer", href: "/rent" },
    { label: "Vendre", href: "/user/properties/add" },
    { label: "Estimation", href: "/estimation" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Aide", href: "/help" },
    { label: "Guide", href: "/guide" },
  ],
  legal: [
    { label: "Mentions légales", href: "/legal" },
    { label: "CGU", href: "/terms" },
    { label: "Confidentialité", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export default function HomeFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo Section */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo-topaz-enhance-coupe.jpeg"
                  alt="AFRIQUE AVENIR IMMOBILIER"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <span className="text-white font-semibold text-sm">
                AFRIQUE AVENIR IMMOBILIER
              </span>
            </Link>
          </div>

          {/* À Propos */}
          <div>
            <h3 className="text-white font-semibold mb-4">À Propos</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-500 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2024 Afrique Avenir Immobilier. Tous droits réservés.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-4">
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-orange-500 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

