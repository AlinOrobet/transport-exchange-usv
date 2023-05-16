"use client";
import React, {ReactNode} from "react";
interface ButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  fullWidth?: boolean;
  children?: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`flex justify-center rounded-md px-3 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border border-[2px]
      ${disabled && "opacity-50 cursor-default"} 
      ${fullWidth && "w-full"}
      ${
        secondary
          ? "dark:text-light text-dark border-dark dark:border-light bg-light_shadow hover:bg-light dark:bg-dark_shadow hover:dark:bg-dark"
          : "text-light dark:text-dark dark:border-light border-dark"
      }
      ${danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600"}
      ${
        !secondary &&
        !danger &&
        "bg-dark_shadow hover:bg-dark focus:outline-dark_shadow dark:bg-light_shadow hover:dark:bg-light focus:dark:outline-light_shadow"
      }
      `}
    >
      {children}
    </button>
  );
};

export default Button;
