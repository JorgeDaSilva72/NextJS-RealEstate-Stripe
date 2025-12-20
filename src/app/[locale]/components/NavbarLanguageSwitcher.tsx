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

    // The usePathname hook from next-intl should return pathname without locale prefix
    // But we'll clean it to prevent any locale stacking issues
    let cleanPath = pathname || "/";
    
    // Remove any locale prefixes that might exist (handles stacked locales like /fr/en)
    // This regex matches /fr, /en, /pt, /ar at the start of the path and removes them
    // Use a loop to handle multiple stacked locales
    const localePrefixPattern = /^\/(?:fr|en|pt|ar)(\/|$)/i;
    while (localePrefixPattern.test(cleanPath)) {
      cleanPath = cleanPath.replace(localePrefixPattern, "/");
    }
    
    // Ensure we have a leading slash
    if (!cleanPath.startsWith("/")) {
      cleanPath = "/" + cleanPath;
    }
    
    // Remove any double slashes that might have been created
    cleanPath = cleanPath.replace(/\/+/g, "/");
    
    // Ensure cleanPath ends with a single slash if it's root, or preserve the path
    if (cleanPath !== "/" && !cleanPath.endsWith("/")) {
      // Keep as is
    }
    
    // Build the final path with the new locale
    // For root path, just use the locale; otherwise prepend locale to the clean path
    const finalPath = cleanPath === "/" ? `/${newLocale}` : `/${newLocale}${cleanPath}`;
    
    // Navigate to the new path
    router.push(finalPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100"
        >
          <CurrentFlag />
          <span className="hidden sm:inline">{currentLanguage?.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => {
          const FlagComponent = lang.flag;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={cn(
                "cursor-pointer flex items-center gap-2",
                lang.code === locale && "bg-orange-50 text-orange-600"
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


