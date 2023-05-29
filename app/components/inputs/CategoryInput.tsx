"use client";
import React from "react";
import {IconType} from "react-icons";

interface CategoryInputProps {
  icon: IconType;
  label: string;
  selected?: boolean;
  onClick: (category: string) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({icon: Icon, label, onClick, selected}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`border-2 mr-2 md:mr-0 text-dark flex flex-row items-center p-2 gap-2 cursor-pointer h-[4rem] rounded-xl hover:opacity-75 ${
        selected ? "border-dark" : ""
      }`}
    >
      <Icon size={30} />
      <div className="text-sm font-semibold">{label}</div>
    </div>
  );
};

export default CategoryInput;
