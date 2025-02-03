// "use client";
// import { Slider } from "@nextui-org/react";
// import { ReadonlyURLSearchParams } from "next/navigation";
// import useFilterChange, {
//   SetArrayNumberAndStringType,
// } from "../hooks/useFilterChange";
// import { Dispatch } from "react";
// import { SelectNameType } from "@/data/filters";

// interface SearchSliderPropsType {
//   ariaLabel: string;
//   value: number[];
//   step: number;
//   rangeValue: number[];
//   searchParams: ReadonlyURLSearchParams;
//   setValue?: React.Dispatch<React.SetStateAction<number[]>>;
//   name: SelectNameType;
//   formatOptions?: Intl.NumberFormatOptions;
//   rangeName: string[];
// }

// const SearchSlider = ({
//   ariaLabel,
//   value,
//   step,
//   rangeValue,
//   searchParams,
//   setValue,
//   name,
//   formatOptions,
//   rangeName,
// }: SearchSliderPropsType) => {
//   const handleFilterChange = useFilterChange();
//   return (
//     <Slider
//       label={ariaLabel}
//       value={value}
//       step={step}
//       minValue={rangeValue[0]}
//       maxValue={rangeValue[1]}
//       onChange={(value) =>
//         handleFilterChange(
//           value as number[],
//           setValue as SetArrayNumberAndStringType,
//           searchParams,
//           name,
//           undefined,
//           rangeName
//         )
//       }
//       formatOptions={formatOptions}
//       className="w-full shadow-lg bg-white p-2 rounded"
//       showTooltip
//     />
//   );
// };

// export default SearchSlider;

// end ----------------------------------------------------------
// next-intl with claude

"use client";
import { Slider } from "@nextui-org/react";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Dispatch } from "react";
import { SelectNameType } from "@/data/filters";
import { usePathname, useRouter } from "@/i18n/routing";

interface SearchSliderPropsType {
  ariaLabel: string;
  value: number[];
  step: number;
  rangeValue: number[];
  searchParams: ReadonlyURLSearchParams;
  setValue?: React.Dispatch<React.SetStateAction<number[]>>;
  name: SelectNameType;
  formatOptions?: Intl.NumberFormatOptions;
  rangeName: string[];
}

const SearchSlider = ({
  ariaLabel,
  value,
  step,
  rangeValue,
  searchParams,
  setValue,
  name,
  formatOptions,
  rangeName,
}: SearchSliderPropsType) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (
    newValue: number[],
    setValue: React.Dispatch<React.SetStateAction<number[]>>,
    searchParams: ReadonlyURLSearchParams,
    name: SelectNameType,
    rangeName: string[]
  ) => {
    setValue(newValue);
    const params = new URLSearchParams(searchParams.toString());

    if (rangeName && rangeName.length === 2) {
      params.set(rangeName[0], newValue[0].toString());
      params.set(rangeName[1], newValue[1].toString());
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Slider
      label={ariaLabel}
      value={value}
      step={step}
      minValue={rangeValue[0]}
      maxValue={rangeValue[1]}
      onChange={(value) =>
        handleFilterChange(
          value as number[],
          setValue as React.Dispatch<React.SetStateAction<number[]>>,
          searchParams,
          name,
          rangeName
        )
      }
      formatOptions={formatOptions}
      className="w-full shadow-lg bg-white p-2 rounded"
      showTooltip
    />
  );
};

export default SearchSlider;
