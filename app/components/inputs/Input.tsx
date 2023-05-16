"use client";

import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";
import {IconType} from "react-icons";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  icon?: IconType;
  onClickIcon?: () => void;
  value?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  register,
  required,
  errors,
  type = "text",
  disabled,
  icon: Icon,
  onClickIcon,
  value,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block text-sm font-medium leading-6 ${
          errors[id] ? "text-rose-500" : "text-dark"
        }`}
      >
        {errors[id] ? errors[id]?.message?.toString() || errors[id]?.type?.toString() : label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          value={value}
          {...register(id, {required})}
          className={`form-input
          block 
          w-full 
          rounded-md 
          border-0 
          py-4
          text-gray-900 
          shadow-sm 
          ring-1 
          ring-inset 
          ring-gray-300 
          placeholder:text-gray-400 
          focus:ring-2 
          focus:ring-inset 
          focus:ring-dark
          sm:text-sm 
          sm:leading-6 ${errors[id] && "focus:ring-rose-500"} ${
            disabled && "opacity-50 cursor-default"
          }`}
        />
        <span className="absolute right-4 top-4 text-dark">
          {Icon && <Icon onClick={onClickIcon} size={24} className="cursor-pointer" />}
        </span>
      </div>
    </div>
  );
};

export default Input;
