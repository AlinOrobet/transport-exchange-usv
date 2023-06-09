"use client";
import React from "react";
import {AiOutlineEdit, AiOutlineDelete} from "react-icons/ai";

interface EditProps {
  label: string;
  onClick: () => void;
}

const Edit: React.FC<EditProps> = ({label, onClick}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-row items-center gap-1 cursor-pointer hover:opacity-75"
    >
      <div className="text-sm font-light">{label}</div>
      {label === "Delete" ? <AiOutlineDelete /> : <AiOutlineEdit />}
    </div>
  );
};

export default Edit;
