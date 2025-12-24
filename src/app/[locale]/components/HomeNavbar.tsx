"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import UserMenu from "./UserMenu";
import NavbarLanguageSwitcher from "./NavbarLanguageSwitcher";
import { useTranslations } from "next-intl";

// Client-only login button to avoid hydration mismatch
const ClientLoginButton = ({ 
  className, 
  onLoginClick 
}: { 
  className?: string;
  onLoginClick?: () => void;
}) => {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("Navbar");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button className={className} disabled>
        {t("login")}
      </Button>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const redirectUrl = `${window.location.origin}/api/auth/success?redirect_url=${encodeURIComponent(currentUrl)}`;

  return (
    <LoginLink postLoginRedirectURL={redirectUrl}>
      <Button 
        className={className}
        onClick={onLoginClick}
      >
        {t("login")}
      </Button>
    </LoginLink>
  );
};

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();
  const t = useTranslations("Navbar");
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state only briefly, then show button (even if still loading)
  const showLoadingState = mounted && isLoading && isAuthenticated === undefined;

  // Check if a route is active
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href) || false;
  };

  const navigationItems = [
    { label: t("properties"), href: "/search-results" },
    { label: t("services"), href: "/services" },
    { label: t("blog"), href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="relative inline-block w-8 h-8">
              <Image
                src="/logo-topaz-enhance-coupe.jpeg"
                alt="AFRIQUE AVENIR IMMOBILIER"
                fill
                sizes="32px"
                className="rounded-lg object-cover"
              />
            </span>
            <span className="hidden sm:block text-white font-semibold text-sm md:text-base">
              AFRIQUE AVENIR IMMOBILIER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-orange-500"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side: Language Switcher + Post Ad + Auth */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <NavbarLanguageSwitcher />

            {/* Post Ad Button (visible for authenticated users) */}
            {mounted && !showLoadingState && isAuthenticated ? (
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link href="/user/properties/add">
                  {t("publishAd")}
                </Link>
              </Button>
            ) : null}

            {/* Auth Section */}
            {showLoadingState ? (
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" disabled>
                {t("login")}
              </Button>
            ) : mounted && isAuthenticated ? (
              <UserMenu />
            ) : (
              <ClientLoginButton className="bg-orange-500 hover:bg-orange-600 text-white" />
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-gray-900 text-white">
              <div className="flex flex-col gap-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "text-base font-medium transition-colors py-2",
                      isActive(item.href)
                        ? "text-orange-500"
                        : "text-gray-300 hover:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile Language Switcher */}
                <div className="pt-4 border-t border-gray-700">
                  <NavbarLanguageSwitcher />
                </div>

                {/* Mobile Post Ad Button (visible for authenticated users) */}
                {mounted && !showLoadingState && isAuthenticated ? (
                  <Button
                    asChild
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                  >
                    <Link href="/user/properties/add" onClick={() => setIsOpen(false)}>
                      {t("publishAd")}
                    </Link>
                  </Button>
                ) : null}

                {/* Mobile Auth */}
                {showLoadingState ? (
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white mt-4 w-full"
                    disabled
                  >
                    {t("login")}
                  </Button>
                ) : mounted && isAuthenticated ? (
                  <div className="mt-4 w-full">
                    <UserMenu />
                  </div>
                ) : (
                  <ClientLoginButton
                    className="bg-orange-500 hover:bg-orange-600 text-white mt-4 w-full"
                    onLoginClick={() => setIsOpen(false)}
                  />
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

