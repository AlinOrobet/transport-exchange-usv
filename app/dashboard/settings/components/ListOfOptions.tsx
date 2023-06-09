"use client";
import React from "react";

interface ListOfOptionsProps {
  variant: string;
  setVariant: (variant: string) => void;
  options: any[];
}

const ListOfOptions: React.FC<ListOfOptionsProps> = ({variant, setVariant, options}) => {
  return (
    <div className="flex flex-row items-center space-x-2">
      {options.map((option) => (
        <p
          key={option.id}
          onClick={() => setVariant(option.value)}
          className={`${
            variant === option.value ? "font-bold" : "font-normal"
          } cursor-pointer text-sm sm:text-medium ${
            option.value === "MyCompany" ? "xl:hidden" : ""
          }`}
        >
          {option.label}
        </p>
      ))}
    </div>
  );
};

export default ListOfOptions;
