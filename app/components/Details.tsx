"use client";
import React from "react";

interface DetailsProps {
  label: string;
  value: any;
  col?: boolean;
}

const Details: React.FC<DetailsProps> = ({label, value, col}) => {
  return (
    <div className={`flex ${col ? "flex-col" : "flex-row justify-between w-full"} items-center`}>
      <p className="text-sm font-medium sm:w-40 sm:flex-shrink-0">{label}</p>
      <span className="">{value || "Undefined"}</span>
    </div>
  );
};

export default Details;
