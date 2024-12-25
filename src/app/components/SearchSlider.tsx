"use client";
import { Slider } from "@nextui-org/react";
import { ReadonlyURLSearchParams } from "next/navigation";
import useFilterChange, {
  SetArrayNumberAndStringType,
} from "../hooks/useFilterChange";
import { SelectNameType } from "../../data/filters";
import { Dispatch } from "react";

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
  const handleFilterChange = useFilterChange();
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
          setValue as SetArrayNumberAndStringType,
          searchParams,
          name,
          undefined,
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
