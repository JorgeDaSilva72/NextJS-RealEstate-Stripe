import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface NumberInputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  errorMessage?: string;
  isInvalid?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  errorMessage,
  isInvalid,
}) => {
  const increment = () => {
    const newValue = Math.min(Number(value) + 1, max);
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Math.max(Number(value) - 1, min);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-sm mb-1">{label}</label>
      <div
        className={`flex items-center border rounded-md focus-within:ring-2 focus-within:ring-blue-500 ${
          isInvalid ? "border-red-500" : "border-gray-300"
        }`}
      >
        <button
          type="button"
          onClick={decrement}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none h-10 w-10 flex items-center justify-center"
        >
          <ChevronDownIcon className="h-5 w-5" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-2 py-1 text-center focus:outline-none text-lg"
          min={min}
          max={max}
        />
        <button
          type="button"
          onClick={increment}
          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-800 focus:outline-none h-10 w-10 flex items-center justify-center"
        >
          <ChevronUpIcon className="h-5 w-5" />
        </button>
      </div>
      {isInvalid && errorMessage && (
        <span className="text-sm text-red-500 mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

export default NumberInput;
