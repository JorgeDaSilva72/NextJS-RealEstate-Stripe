import React from "react";

interface ButtonClosePropsType {
  height: string;
  width: string;
  top: string;
  right: string;
  onClick: () => void;
}

const ButtonClose = ({
  height,
  width,
  top,
  right,
  onClick,
}: ButtonClosePropsType) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={
        height +
        " " +
        width +
        " " +
        top +
        " " +
        right +
        " " +
        "absolute z-50 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
      }
    >
      ✕
    </button>
  );
};

export default ButtonClose;
