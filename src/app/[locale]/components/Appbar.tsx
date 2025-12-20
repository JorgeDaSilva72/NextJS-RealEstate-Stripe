"use client";

import React, { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useKindeBrowserClient, LoginLink } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "./UserMenu";
import NavbarLanguageSwitcher from "./NavbarLanguageSwitcher";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

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
      <Button variant="outline" size="sm" className={className} disabled>
        Se Connecter
      </Button>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const redirectUrl = `${window.location.origin}/api/auth/success?redirect_url=${encodeURIComponent(currentUrl)}`;

  return (
    <LoginLink postLoginRedirectURL={redirectUrl}>
      <Button 
        variant="outline" 
        size="sm" 
        className={className}
        onClick={onLoginClick}
      >
        Se Connecter
      </Button>
    </LoginLink>
  );
};

const Appbar = ({ children }: Props) => {
  // ✅ ALL HOOKS AT THE TOP - UNCONDITIONAL
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [forceRefresh, setForceRefresh] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({ isAuthenticated: false, isLoading: true });
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("appbar");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated: kindeAuth, isLoading: kindeLoading, user } =
    useKindeBrowserClient();

  // ✅ ALL useEffect HOOKS AT THE TOP
  // Mark component as mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsScrolled(scrolled);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Sync Kinde auth state with local state
  useEffect(() => {
    if (mounted) {
      setAuthState({
        isAuthenticated: kindeAuth,
        isLoading: kindeLoading,
      });
    }
  }, [kindeAuth, kindeLoading, mounted]);

  // Periodic auth check to catch any auth state changes (only when not authenticated)
  // This helps catch auth state changes that might be missed by the hook
  useEffect(() => {
    // Only poll if we're not authenticated and not loading
    // This helps catch when auth state changes externally
    if (!authState.isAuthenticated && !authState.isLoading) {
      const checkAuth = async () => {
        try {
          const response = await fetch("/api/auth/check", {
            cache: "no-store",
          });
          const data = await response.json();
          
          // Only update if auth state changed
          if (data.isAuthenticated && !authState.isAuthenticated) {
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
            });
            router.refresh();
            setForceRefresh((prev) => prev + 1);
          }
        } catch (error) {
          console.error("Error checking auth:", error);
        }
      };

      // Check every 3 seconds when not authenticated
      const interval = setInterval(checkAuth, 3000);
      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, authState.isLoading, router]);

  // Force refresh after login redirect with polling
  useEffect(() => {
    if (!mounted) return;

    const fromAuth = searchParams?.get("from_auth");
    if (fromAuth === "true") {
      // Remove the query param first
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("from_auth");
      window.history.replaceState({}, "", newUrl.toString());

      // Immediately check auth status
      const checkAuth = async () => {
        try {
          const response = await fetch("/api/auth/check", {
            cache: "no-store",
            credentials: "include",
          });
          const data = await response.json();

          if (data.isAuthenticated) {
            // Auth confirmed, refresh router and update state
            router.refresh();
            setAuthState({ isAuthenticated: true, isLoading: false });
            setForceRefresh((prev) => prev + 1);
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
        }
      };

      // Check immediately
      checkAuth();

      // Poll auth status until authenticated or timeout
      let pollCount = 0;
      const maxPolls = 10; // 5 seconds max (10 * 500ms)
      const pollInterval = setInterval(async () => {
        pollCount++;
        try {
          const response = await fetch("/api/auth/check", {
            cache: "no-store",
            credentials: "include",
          });
          const data = await response.json();

          if (data.isAuthenticated) {
            // Auth confirmed, refresh router and update state
            router.refresh();
            setAuthState({ isAuthenticated: true, isLoading: false });
            setForceRefresh((prev) => prev + 1);
            clearInterval(pollInterval);
          } else if (pollCount >= maxPolls) {
            // Timeout, stop polling
            clearInterval(pollInterval);
            setAuthState({ isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          console.error("Error polling auth status:", error);
          if (pollCount >= maxPolls) {
            clearInterval(pollInterval);
          }
        }
      }, 500); // Poll every 500ms

      // Cleanup
      return () => clearInterval(pollInterval);
    }
  }, [searchParams, router, mounted]);

  // ✅ CONDITIONAL LOGIC AFTER ALL HOOKS
  const isHomePage = pathname === "/";

  // Hide Appbar on home page (using new HomeNavbar instead)
  if (isHomePage) {
    return null;
  }

  const navbarBackground = "sticky bg-white shadow-sm";
  const textColor = "text-gray-900";

  // Navigation items for left side
  const leftNavItems = [
    { label: "Acheter", href: "/buy" },
    { label: "Louer", href: "/rent" },
    { label: "Services", href: "/services" },
  ];

  return (
    <nav
      className={cn(
        navbarBackground,
        "top-0 left-0 right-0 h-16 transition-all duration-300 z-50"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-topaz-enhance-coupe.jpeg"
                alt="Logo Afrique Avenir"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="hidden sm:block text-sm font-semibold text-gray-900">
                {t("siteTitle")}
              </span>
            </Link>

            {/* Desktop Navigation - Left */}
            <div className="hidden lg:flex items-center gap-6">
              {leftNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    textColor,
                    "hover:text-orange-500"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center: Language Switcher (Desktop) */}
          <div className="hidden lg:flex items-center">
            <NavbarLanguageSwitcher />
          </div>

          {/* Right: Post Ad Button + Auth */}
          <div className="flex items-center gap-4">
            {/* Post Ad Button */}
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Link href="/user/properties/add">
                <span className="hidden sm:inline">{t("publishAd")}</span>
                <span className="sm:hidden">+</span>
              </Link>
            </Button>

            {/* Auth Section */}
            {!mounted || authState.isLoading ? (
              <div className="h-10 w-10 flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : authState.isAuthenticated ? (
              <UserMenu key={`user-menu-${authState.isAuthenticated}-${forceRefresh}`} />
            ) : (
              <ClientLoginButton />
            )}

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Navigation */}
                  {leftNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-base font-medium text-gray-900 hover:text-orange-500"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile Language Switcher */}
                  <div className="pt-4 border-t">
                    <NavbarLanguageSwitcher />
                  </div>

                  {/* Mobile Auth */}
                  {!mounted || authState.isLoading ? (
                    <div className="w-full flex items-center justify-center py-2">
                      <div className="h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : authState.isAuthenticated ? (
                    <div className="w-full">
                      <UserMenu key={`user-menu-mobile-${authState.isAuthenticated}-${forceRefresh}`} />
                    </div>
                  ) : (
                    <ClientLoginButton
                      className="w-full"
                      onLoginClick={() => setIsMenuOpen(false)}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Appbar;
