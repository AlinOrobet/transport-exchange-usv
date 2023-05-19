"use client";
import {User} from "@prisma/client";
import Image from "next/image";
import React from "react";

interface AvatarGroupProps {
  users: User[];
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({users = []}) => {
  const sliceUsers = users.slice(0, 3);
  const positionMap = {
    0: "top-0 left-[16px]",
    1: "bottom-0",
    2: "bottom-0 right-0",
  };
  return (
    <div className="relative w-16 h-16">
      {sliceUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block rounded-full overflow-hidden h-7 w-7 ${
            positionMap[index as keyof typeof positionMap]
          }`}
        >
          <Image alt="Avatar" src={user?.image || "/assets/placeholder.jpg"} fill />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
