"use client";
import Image from "next/image";
import React from "react";

interface AvatarProps {
  url: string | null;
  large?: boolean;
  type: "Company" | "User";
}

const Avatar: React.FC<AvatarProps> = ({url, large, type}) => {
  const isActive = true;
  return (
    <div className="relative">
      <div
        className={`relative inline-block ${
          large ? "w-24 h-24" : "w-16 h-16"
        } overflow-hidden rounded-full`}
      >
        <Image fill src={url || "/assets/placeholder.jpg"} alt="Avatar" />
      </div>
      {isActive && type !== "Company" ? (
        <span className="absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full ring-2 ring-white md:h-3 md:w-3" />
      ) : null}
    </div>
  );
};

export default Avatar;
