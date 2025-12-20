"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
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

const navigationItems = [
  { label: "Acheter", href: "/buy", active: true },
  { label: "Louer", href: "/rent" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
];

// Client-only login button to avoid hydration mismatch
const ClientLoginButton = ({ 
  className, 
  onLoginClick 
}: { 
  className?: string;
  onLoginClick?: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button className={className} disabled>
        Se Connecter
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
        Se Connecter
      </Button>
    </LoginLink>
  );
};

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image
                src="/logo-topaz-enhance-coupe.jpeg"
                alt="AFRIQUE AVENIR IMMOBILIER"
                fill
                className="rounded-lg object-cover"
              />
            </div>
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
                  item.active
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
            {!mounted || isLoading ? null : isAuthenticated ? (
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Link href="/user/properties/add">
                  Publier une annonce
                </Link>
              </Button>
            ) : null}

            {/* Auth Section */}
            {!mounted || isLoading ? (
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" disabled>
                Se Connecter
              </Button>
            ) : isAuthenticated ? (
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
                      item.active
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
                {!mounted || isLoading ? null : isAuthenticated ? (
                  <Button
                    asChild
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                  >
                    <Link href="/user/properties/add" onClick={() => setIsOpen(false)}>
                      Publier une annonce
                    </Link>
                  </Button>
                ) : null}

                {/* Mobile Auth */}
                {!mounted || isLoading ? (
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white mt-4 w-full"
                    disabled
                  >
                    Se Connecter
                  </Button>
                ) : isAuthenticated ? (
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

