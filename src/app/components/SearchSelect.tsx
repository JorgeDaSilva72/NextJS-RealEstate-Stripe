"use client";
import { Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import useFilterChange, {
  FilterValueTypes,
  SetArrayNumberAndStringType,
} from "../hooks/useFilterChange";
import { ReadonlyURLSearchParams } from "next/navigation";
import { SelectNameType } from "../data/filters";

interface SearchSelectPropsType {
  value: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  searchParams: ReadonlyURLSearchParams;
  values: FilterValueTypes;
  name: SelectNameType;
  ariaLabel: string;
  placeholder: string;
}

const SearchSelect = ({
  ariaLabel,
  placeholder,
  value,
  setValue,
  values,
  searchParams,
  name,
}: SearchSelectPropsType) => {
  const handleFilterChange = useFilterChange();

  // console.log("VALUE", value);
  return (
    <Select
      aria-label={ariaLabel}
      placeholder={placeholder}
      variant="bordered"
      value={value}
      selectedKeys={[value]}
      className="flex-grow max-w-full p-2 shadow-lg bg-white text-gray-700 rounded"
      selectionMode="single"
      onSelectionChange={(value) =>
        handleFilterChange(
          value as string,
          setValue as SetArrayNumberAndStringType,
          searchParams,
          name,
          values
        )
      }
    >
      {values.map((item) => {
        // console.log('item', item)
        return (
          <SelectItem key={item.id} value={item.id}>
            {item.value}
          </SelectItem>
        )
      })}
    </Select>
  );
};

export default SearchSelect;
