import React from "react";
import { SVGPropsType } from "./FilterSVG";

const ContactSVG = ({ width, height, className }: SVGPropsType) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M15.833 2H9.676A5.885 5.885 0 0 0 3.8 7.66H3a.75.75 0 0 0 0 1.5h.79v5.69h-.76a.75.75 0 0 0 0 1.5h.8A5.88 5.88 0 0 0 9.706 22h6.157a5.886 5.886 0 0 0 5.887-5.89V7.89A5.9 5.9 0 0 0 15.833 2m-2.679 3.93a3.097 3.097 0 0 1 3.038 3.708a3.1 3.1 0 0 1-4.23 2.253a3.1 3.1 0 0 1-.995-5.057a3.1 3.1 0 0 1 2.187-.904m3.499 11.57a.75.75 0 0 1-.75-.75c0-1.21-1.51-2.25-2.749-2.25s-2.738 1-2.738 2.25a.75.75 0 0 1-1.5 0c0-2.15 2.24-3.75 4.238-3.75c2 0 4.248 1.6 4.248 3.75a.76.76 0 0 1-.75.75"
      />
      <path
        fill="currentColor"
        d="M14.754 9.02a1.6 1.6 0 1 1-3.2.02a1.6 1.6 0 0 1 3.2-.02"
      />
    </svg>
  );
};

export default ContactSVG;