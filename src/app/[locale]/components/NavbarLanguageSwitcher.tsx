"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// SVG Flag Components
const FrFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#fff" d="M0 0h640v480H0z" />
      <path fill="#00267f" d="M0 0h213.3v480H0z" />
      <path fill="#f31830" d="M426.7 0H640v480H426.7z" />
    </g>
  </svg>
);

const GbFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z" />
    <path
      fill="#FFF"
      d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
    />
    <path
      fill="#C8102E"
      d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
    />
    <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
    <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
  </svg>
);

const PtFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <path fill="#046a38" d="M0 0h240v480H0z" />
    <path fill="#da291c" d="M240 0h400v480H240z" />
    <path fill="#ffd90a" d="M160 240a80 80 0 1 1-160 0 80 80 0 0 1 160 0z" />
    <path
      fill="#da291c"
      d="M110 240c0-27.6 22.4-50 50-50s50 22.4 50 50-22.4 50-50 50-50-22.4-50-50z"
    />
    <path
      fill="#fff"
      d="M130 240c0-16.6 13.4-30 30-30s30 13.4 30 30-13.4 30-30 30-30-13.4-30-30z"
    />
  </svg>
);

const ArFlag = () => (
  <svg className="w-5 h-4" viewBox="0 0 640 480">
    <path fill="#006233" d="M0 0h640v480H0z" />
    <path
      fill="#fff"
      d="M67 192a67 67 0 1 0 0 96 80 80 0 1 1 0-96m13 48l84-27-52 71v-88l52 71z"
    />
  </svg>
);

const languages = [
  { code: "fr", label: "Français", flag: FrFlag },
  { code: "en", label: "English", flag: GbFlag },
  { code: "pt", label: "Português", flag: PtFlag },
  { code: "ar", label: "العربية", flag: ArFlag },
];

export default function NavbarLanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLanguage = languages.find((lang) => lang.code === locale);
  const CurrentFlag = currentLanguage?.flag || FrFlag;

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;

    // usePathname from next-intl returns pathname WITHOUT locale prefix
    // So if we're on /fr/user/properties, pathname will be /user/properties
    let currentPath = pathname || "/";
    
    // Handle edge case: if pathname is empty or just "/", use root
    if (!currentPath || currentPath === "/") {
      currentPath = "/";
    }
    
    // Ensure we have a leading slash
    if (!currentPath.startsWith("/")) {
      currentPath = "/" + currentPath;
    }
    
    // Remove trailing slash (except for root)
    if (currentPath !== "/" && currentPath.endsWith("/")) {
      currentPath = currentPath.slice(0, -1);
    }
    
    // Build the final path with the new locale
    // For root, just use the locale; otherwise prepend locale to the path
    const finalPath = currentPath === "/" ? `/${newLocale}` : `/${newLocale}${currentPath}`;
    
    // Navigate to the new path - use window.location for full page reload to ensure locale change
    // This ensures the page reloads with the new locale and all translations update
    if (typeof window !== "undefined") {
      window.location.href = finalPath;
    } else {
      // Fallback for SSR
      router.push(finalPath);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-white hover:text-orange-500 hover:bg-white/10"
        >
          <CurrentFlag />
          <span className="hidden sm:inline text-white">{currentLanguage?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {languages.map((lang) => {
          const FlagComponent = lang.flag;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                switchLanguage(lang.code);
              }}
              className={cn(
                "cursor-pointer flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700",
                lang.code === locale && "bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
              )}
            >
              <FlagComponent />
              <span>{lang.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


