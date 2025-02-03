// "use client";

// import * as React from "react";
// import { Select, SelectItem, Avatar } from "@nextui-org/react";
// import { useRouter } from "next/navigation";
// import { SUPPORTED_COUNTRIES } from "@/data/countries";
// import { CountryName } from "@/types/country";
// import { SelectProps } from "@nextui-org/react";
// import { Selection } from "@nextui-org/react";

// type CountryOption = {
//   code: string;
//   label: string;
//   value: string;
//   flag: string;
// };

// interface CountrySelectorProps {
//   currentCountry: string;
//   lang: keyof CountryName;
//   color?: SelectProps["color"];
// }

// export function CountrySelector({
//   currentCountry,
//   lang,
//   color = "default",
// }: CountrySelectorProps) {
//   const router = useRouter();
//   const [selected, setSelected] = React.useState<Selection>(
//     new Set([currentCountry])
//   );

//   const countries: CountryOption[] = React.useMemo(
//     () =>
//       Object.entries(SUPPORTED_COUNTRIES).map(([code, country]) => ({
//         code,
//         label: country.name[lang] || code,
//         value: code,
//         flag: `/flags/${code.toLowerCase()}.svg`,
//       })),
//     [lang]
//   );

//   const handleSelectionChange = (keys: Selection) => {
//     const selectedValue = Array.from(keys)[0];
//     if (selectedValue) {
//       setSelected(new Set([selectedValue]));
//       router.push(`/${lang}/${selectedValue}`);
//     }
//   };

//   return (
//     <div className="flex w-full max-w-xs flex-col gap-2">
//       <Select
//         items={countries}
//         label="Sélectionnez un pays"
//         placeholder="Sélectionnez un pays"
//         selectedKeys={selected}
//         variant="bordered"
//         onSelectionChange={handleSelectionChange}
//         className="max-w-xs"
//         color={color}
//         scrollShadowProps={{
//           isEnabled: true,
//         }}
//         renderValue={(items) => {
//           return items.map((item) => (
//             <div key={item.key} className="flex items-center gap-2">
//               <Avatar
//                 alt={item?.data?.label}
//                 className="flex-shrink-0"
//                 size="sm"
//                 src={item?.data?.flag}
//               />
//               <span>{item?.data?.label}</span>
//             </div>
//           ));
//         }}
//       >
//         {(country) => (
//           <SelectItem
//             key={country.code}
//             value={country.code}
//             textValue={country.label}
//             startContent={
//               <Avatar
//                 alt={country.label}
//                 className="flex-shrink-0"
//                 size="sm"
//                 src={country.flag}
//               />
//             }
//           >
//             {country.label}
//           </SelectItem>
//         )}
//       </Select>
//     </div>
//   );
// }

"use client";

import * as React from "react";
import {
  Select,
  SelectItem,
  Avatar,
  SelectProps as NextUISelectProps,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { SUPPORTED_COUNTRIES } from "@/data/countries";
import { CountryName } from "@/types/country";
import { Selection } from "@nextui-org/react";
import { SelectedItems } from "@nextui-org/react";
import FlagIcon from "./FlagIcon";

type CountryOption = {
  code: string;
  label: string;
  value: string;
};

// Define the props type for the Select component
type CountrySelectProps = Omit<
  NextUISelectProps<CountryOption>,
  "children" | "onChange" | "onSelectionChange"
>;

interface CountrySelectorProps extends Partial<CountrySelectProps> {
  // Base props
  currentCountry: string;
  lang: keyof CountryName;

  // Style customization
  containerClassName?: string;
  selectClassName?: string;
  labelClassName?: string;

  // Behavior props
  autoFocus?: boolean;
  disableAnimation?: boolean;
  showScrollShadow?: boolean;

  // Custom handlers
  onSelectionChange?: (value: string) => void;
  onOpen?: () => void;
  onClose?: () => void;

  // Navigation
  disableNavigation?: boolean;
  customNavigationPath?: (lang: string, country: string) => string;

  // Data transformation
  transformCountryData?: (
    countries: typeof SUPPORTED_COUNTRIES
  ) => CountryOption[];
}

export function CountrySelector({
  // Base props
  currentCountry,
  lang,

  // Customization props
  color = "default",
  variant = "bordered",
  size = "md",
  label = "Sélectionnez un pays",
  placeholder = "Sélectionnez un pays",
  className = "",
  isDisabled = false,
  isRequired = false,
  isInvalid = false,
  errorMessage = "",

  // Style customization
  containerClassName = "flex w-full max-w-xs flex-col gap-2",
  selectClassName = "max-w-xs",
  labelClassName = "",

  // Behavior props
  autoFocus = false,
  disableAnimation = false,
  showScrollShadow = true,

  // Custom handlers
  onSelectionChange,
  onOpen,
  onClose,

  // Navigation
  disableNavigation = false,
  customNavigationPath,

  // Data transformation
  transformCountryData,
  ...props
}: CountrySelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = React.useState<Selection>(
    new Set([currentCountry])
  );
  const countries: CountryOption[] = React.useMemo(() => {
    const defaultTransform = () =>
      Object.entries(SUPPORTED_COUNTRIES).map(([code, country]) => ({
        code,
        label: country.name[lang] || code,
        value: code,
      }));

    return transformCountryData
      ? transformCountryData(SUPPORTED_COUNTRIES)
      : defaultTransform();
  }, [lang, transformCountryData]);

  const handleSelectionChange = (keys: Selection) => {
    const selectedValue = Array.from(keys)[0] as string;
    if (selectedValue) {
      setSelected(new Set([selectedValue]));
      onSelectionChange?.(selectedValue);

      if (!disableNavigation) {
        const path = customNavigationPath
          ? customNavigationPath(lang, selectedValue)
          : `/${lang}/${selectedValue}`;
        router.push(path);
      }
    }
  };

  const defaultRenderValue = (items: SelectedItems<CountryOption>) => {
    return items.map((item) => {
      if (!item?.data) return null;
      return (
        <div key={item.key} className="flex items-center gap-2">
          <FlagIcon countryCode={item.data.code} size="sm" />
          <span>{item.data.label}</span>
        </div>
      );
    });
  };

  return (
    <div className={containerClassName}>
      <Select<CountryOption>
        {...props}
        items={countries}
        label={label}
        placeholder={placeholder}
        selectedKeys={selected}
        variant={variant}
        size={size}
        onSelectionChange={handleSelectionChange}
        className={`${selectClassName} ${className}`}
        color={color}
        isDisabled={isDisabled}
        isRequired={isRequired}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        autoFocus={autoFocus}
        disableAnimation={disableAnimation}
        scrollShadowProps={{
          isEnabled: showScrollShadow,
        }}
        renderValue={props.renderValue || defaultRenderValue}
        labelPlacement="outside"
      >
        {(item) => (
          <SelectItem key={item.code} value={item.code} textValue={item.label}>
            <div className="flex items-center gap-2">
              <FlagIcon countryCode={item.code} size="sm" />
              <span>{item.label}</span>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
