import React from "react";
import { SVGPropsType } from "./FilterSVG";

const PropertySVG = ({ width, height, className }: SVGPropsType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M21 7.485c0-1.098 0-1.646-.276-2.11S19.939 4.609 18.922 4l-1.294-.774c-1.597-.956-2.396-1.434-3.012-1.138S14 3.245 14 4.967V22h7zM22 22H2M14 9h-4m4 6h-4M3 7.485c0-1.098 0-1.646.276-2.11S4.061 4.609 5.078 4l1.294-.774C7.97 2.269 8.768 1.79 9.384 2.087S10 3.245 10 4.967V22H3zM6.501 8h-.009m.01 4h-.01m.01 4h-.01m11.009-8h-.009m.01 4h-.01m.01 4h-.01"
        color="currentColor"
      />
    </svg>
  );
};

export default PropertySVG;
