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
  small?: boolean;
  transparent?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
  small,
  transparent,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`flex justify-center rounded-md text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
      ${small ? "p-2" : "p-3"}
      ${disabled && "opacity-50 cursor-default"} 
      ${fullWidth && "w-full"}
      ${
        secondary
          ? "dark:text-light text-dark border-dark dark:border-light bg-light_shadow hover:bg-light dark:bg-dark_shadow hover:dark:bg-dark"
          : "dark:border-light border-dark"
      }
      ${transparent ? "bg-transparent" : "border border-[2px]"}
      ${danger && "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600 border-none"}
      ${!danger && !secondary && "text-light dark:text-dark"}
      ${
        !secondary &&
        !danger &&
        !transparent &&
        "bg-dark_shadow hover:bg-dark focus:outline-dark_shadow dark:bg-light_shadow hover:dark:bg-light focus:dark:outline-light_shadow"
      }
      `}
    >
      {children}
    </button>
  );
};

export default Button;
