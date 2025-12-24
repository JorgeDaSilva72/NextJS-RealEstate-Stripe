"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { Heart, FileText, LogOut, Crown } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserMenu() {
  // ✅ ALL HOOKS AT THE TOP - UNCONDITIONAL
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();
  const [userData, setUserData] = useState<any>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();

  // Mark as mounted after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user data and subscription from database
  useEffect(() => {
    if (isAuthenticated && user?.id && mounted) {
      // Fetch user data from database with caching
      fetch(`/api/user/${user.id}`, { 
        cache: "force-cache",
        credentials: "include",
        headers: {
          'Cache-Control': 'max-age=300', // Cache for 5 minutes
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("User not found");
        })
        .then((data) => {
          setUserData(data);
          // If Google picture is available, it will be prioritized in avatarUrl calculation
        })
        .catch(() => {
          // Fallback to Kinde user data
          // Note: We don't set avatarUrl here because we prioritize user.picture (Google image) from Kinde
          setUserData({
            firstname: user.given_name || "",
            lastname: user.family_name || "",
            // avatarUrl will use user.picture from Kinde (Google account image) instead
          });
        });

      // Fetch current subscription
      fetch(`/api/user/${user.id}/subscription`, {
        cache: "no-store",
        credentials: "include",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return null;
        })
        .then((data) => {
          if (data && data.subscription) {
            setCurrentSubscription(data.subscription);
          }
        })
        .catch(() => {
          // Silently fail if subscription fetch fails
        });
    } else if (!isAuthenticated) {
      // Clear user data when logged out
      setUserData(null);
      setCurrentSubscription(null);
    }
  }, [isAuthenticated, user?.id, mounted]);

  // Show loading state briefly, but don't block rendering
  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
    );
  }

  // Don't render if not authenticated (after mounted)
  if (!isAuthenticated || !user) {
    return null;
  }

  const fullName = userData
    ? `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
    : `${user.given_name || ""} ${user.family_name || ""}`.trim() ||
      user.email?.split("@")[0] ||
      "User";

  // Prioritize Google account image (from Kinde user.picture) over database avatarUrl
  // user.picture from Kinde contains Google profile photo if user signed in with Google
  const avatarUrl = user.picture || userData?.avatarUrl || "/user.png";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 rounded-full">
          <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="bg-orange-500 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-semibold">
          {fullName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/user/profile" className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/user/favoriteProperties" className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            Mes favoris
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link 
            href="/user/properties" 
            className="cursor-pointer no-underline hover:no-underline focus:no-underline active:no-underline visited:no-underline focus:outline-none focus:ring-0"
          >
            <FileText className="mr-2 h-4 w-4" />
            Mes annonces
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/user/subscription" className="cursor-pointer">
            <Crown className="mr-2 h-4 w-4" />
            <div className="flex flex-col">
              <span>Mon abonnement</span>
              {currentSubscription?.plan && (
                <span className="text-xs text-gray-500 mt-0.5">
                  {currentSubscription.plan.namePlan}
                </span>
              )}
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
          <LogoutLink
            postLogoutRedirectURL={
              typeof window !== "undefined"
                ? `${window.location.origin}/${locale}`
                : `http://localhost:3000/${locale}`
            }
            className="cursor-pointer w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

