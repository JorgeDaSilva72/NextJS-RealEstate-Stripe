"use client";

import * as React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "lucide-react";

interface LanguageSelectorProps {
  currentLang: string;
  country: string;
  supportedLangs: string[];
}

export function LanguageSelector({
  currentLang,
  country,
  supportedLangs,
}: LanguageSelectorProps) {
  const router = useRouter();

  const languages = {
    en: "English",
    fr: "Français",
    ar: "العربية",
    // Ajoutez d'autres langues selon vos besoins
  };

  const handleSelectionChange = (key: React.Key) => {
    router.push(`/${key}/${country}`);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="bordered"
          className="w-[140px] justify-between"
          endContent={<ChevronDownIcon className="text-small" />}
        >
          {languages[currentLang as keyof typeof languages] || currentLang}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        onAction={handleSelectionChange}
        className="w-[140px]"
      >
        {() => (
          <>
            {supportedLangs.map((lang) => (
              <DropdownItem key={lang} className="h-12">
                {languages[lang as keyof typeof languages] || lang}
              </DropdownItem>
            ))}
          </>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
