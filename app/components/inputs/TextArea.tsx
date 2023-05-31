"use client";
import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";

interface TextAreaProps {
  id: string;
  placeholder?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  value?: any;
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  placeholder,
  register,
  required,
  errors,
  value,
  label,
}) => {
  return (
    <>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium leading-6 ${
            errors[id] ? "text-rose-500" : "text-dark"
          }`}
        >
          {errors[id] ? errors[id]?.message?.toString() || errors[id]?.type?.toString() : label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        value={value}
        placeholder={errors[id] ? errors[id]?.type?.toString() : placeholder}
        {...register(id, {required})}
        className={`form-input
          block 
          w-full 
          rounded-md 
          border-0 
          py-2
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
          sm:leading-6 ${errors[id] && "focus:ring-rose-500 placeholder:text-rose-500"}`}
      ></textarea>
    </>
  );
};

export default TextArea;
