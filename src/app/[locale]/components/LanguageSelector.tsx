"use client";

import * as React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

interface LanguageSelectorProps {
  currentLang: string;
  country: string;
  supportedLangs: string[];
}

const languages = {
  en: { label: "English", flag: "🇬🇧" },
  fr: { label: "Français", flag: "🇫🇷" },
  ar: { label: "العربية", flag: "🇸🇦" },
  pt: { label: "Português", flag: "🇵🇹" },
};

export function LanguageSelector({
  currentLang,
  country,
  supportedLangs,
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelectionChange = (key: React.Key) => {
    const newLang = String(key);
    if (newLang === currentLang) return;

    // Get the current pathname (includes full path with locale)
    let currentPath = pathname || "/";
    
    // Remove any existing locale/lang prefixes (fr, en, pt, ar) from the path
    // This handles cases where locales might be stacked like /fr/en/...
    const localePattern = /^\/(?:fr|en|pt|ar)(\/|$)/i;
    while (localePattern.test(currentPath)) {
      currentPath = currentPath.replace(localePattern, "/");
    }
    
    // Clean up any double slashes
    currentPath = currentPath.replace(/\/+/g, "/");
    
    // Ensure leading slash
    if (!currentPath.startsWith("/")) {
      currentPath = "/" + currentPath;
    }
    
    // For the [locale]/[lang]/[country] route structure:
    // The pathname from next/navigation will include the locale, e.g., /en/fr/ma/buy
    // We need to extract the parts after the locale and replace the lang
    
    const pathParts = currentPath.split("/").filter(Boolean);
    
    // Find where the country appears in the path
    const countryIndex = pathParts.indexOf(country);
    
    if (countryIndex > 0) {
      // Country found - we're in [lang]/[country]/[rest] structure
      // Replace the lang (which should be at countryIndex - 1) with newLang
      const beforeCountry = pathParts.slice(0, countryIndex);
      const afterCountry = pathParts.slice(countryIndex + 1);
      
      // The lang should be the last element before country
      const rest = afterCountry.length > 0 ? "/" + afterCountry.join("/") : "";
      const finalPath = `/${newLang}/${country}${rest}`;
      router.push(finalPath);
    } else {
      // Country not in path - build simple path with newLang and country
      const rest = pathParts.length > 0 ? "/" + pathParts.join("/") : "";
      const finalPath = `/${newLang}/${country}${rest}`;
      router.push(finalPath);
    }
  };

  const currentLanguage = languages[currentLang as keyof typeof languages] || {
    label: currentLang,
    flag: "🌐",
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="w-[140px] justify-between"
          endContent={<ChevronDownIcon className="text-small" />}
        >
          <span className="flex items-center gap-2">
            <span>{currentLanguage.flag}</span>
            <span>{currentLanguage.label}</span>
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={handleSelectionChange}
        className="w-[140px]"
      >
        {() => (
          <>
            {supportedLangs.map((lang) => {
              const langData = languages[lang as keyof typeof languages] || {
                label: lang,
                flag: "🌐",
              };
              return (
                <DropdownItem
                  key={lang}
                  className="h-12"
                  textValue={langData.label}
                >
                  <span className="flex items-center gap-2">
                    <span>{langData.flag}</span>
                    <span>{langData.label}</span>
                  </span>
                </DropdownItem>
              );
            })}
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
