"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeFooter() {
  const t = useTranslations("Footer");

  const footerLinks = {
    about: [
      { label: t("about"), href: "/about" },
      { label: t("ourTeam"), href: "/team" },
      { label: t("careers"), href: "/careers" },
      { label: t("press"), href: "/press" },
    ],
    services: [
      { label: t("properties"), href: "/search-results" },
      { label: t("sell"), href: "/user/properties/add" },
      { label: t("estimation"), href: "/estimation" },
    ],
    support: [
      { label: t("faq"), href: "/faq" },
      { label: t("contact"), href: "/contact" },
      { label: t("help"), href: "/help" },
      { label: t("guide"), href: "/guide" },
    ],
    legal: [
      { label: t("legalNotice"), href: "/legal" },
      { label: t("terms"), href: "/terms" },
      { label: t("privacy"), href: "/privacy" },
      { label: t("cookies"), href: "/cookies" },
    ],
  };
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
                  sizes="40px"
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
            <h3 className="text-white font-semibold mb-4">{t("about")}</h3>
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
            <h3 className="text-white font-semibold mb-4">{t("services")}</h3>
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
            <h3 className="text-white font-semibold mb-4">{t("support")}</h3>
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
              {t("copyright")}
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

