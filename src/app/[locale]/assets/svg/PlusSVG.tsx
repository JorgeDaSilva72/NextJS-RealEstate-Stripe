import React from "react";

interface SvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const PlusSVG: React.FC<SvgProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke={color}
      width={size}
      height={size}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};

export default PlusSVG;
