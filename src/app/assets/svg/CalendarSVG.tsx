import React from "react";
import { SVGPropsType } from "./FilterSVG";

const CalendarSVG = ({height, width, className}:SVGPropsType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
    >
      <g fill="none">
        <rect
          width="18"
          height="15"
          x="3"
          y="6"
          stroke="currentColor"
          strokeWidth="2"
          rx="2"
        />
        <path
          fill="currentColor"
          d="M3 10c0-1.886 0-2.828.586-3.414S5.114 6 7 6h10c1.886 0 2.828 0 3.414.586S21 8.114 21 10z"
        />
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M7 3v3m10-3v3"
        />
        <rect width="4" height="2" x="7" y="12" fill="currentColor" rx=".5" />
        <rect width="4" height="2" x="7" y="16" fill="currentColor" rx=".5" />
        <rect width="4" height="2" x="13" y="12" fill="currentColor" rx=".5" />
        <rect width="4" height="2" x="13" y="16" fill="currentColor" rx=".5" />
      </g>
    </svg>
  );
};

export default CalendarSVG;