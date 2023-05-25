"use client";
import useActiveList from "@/app/hooks/useActiveList";
import Image from "next/image";
import React, {useMemo} from "react";

interface AvatarProps {
  userEmail?: string | null;
  url: string | null;
  large?: boolean;
  type: "Company" | "User";
}

const Avatar: React.FC<AvatarProps> = ({url, large, type, userEmail}) => {
  const {members} = useActiveList();
  const isActive = useMemo(() => {
    if (userEmail) {
      return members.indexOf(userEmail) !== -1;
    }
  }, [userEmail, members]);
  return (
    <div className="relative">
      <div
        className={`relative inline-block ${
          large ? "w-20 h-20 md:w-24 md:h-24" : "w-16 h-16"
        } overflow-hidden rounded-full`}
      >
        <Image
          fill
          src={url || "/assets/placeholder.jpg"}
          alt="Avatar"
          className="object-cover object-center"
        />
      </div>
      {isActive && type !== "Company" ? (
        <span className="absolute top-0 right-0 block w-2 h-2 bg-green-500 rounded-full ring-2 ring-white md:h-3 md:w-3" />
      ) : null}
    </div>
  );
};

export default Avatar;
