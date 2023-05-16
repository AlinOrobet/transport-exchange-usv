"use client";
import {FieldErrors, FieldValues, UseFormRegister} from "react-hook-form";

interface TextAreaProps {
  id: string;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  value?: any;
}

const TextArea: React.FC<TextAreaProps> = ({
  id,
  placeholder,
  register,
  required,
  errors,
  value,
}) => {
  return (
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
          sm:leading-6 ${errors[id] && "focus:ring-rose-500 placeholder:text-rose-500"}`}
    ></textarea>
  );
};

export default TextArea;
