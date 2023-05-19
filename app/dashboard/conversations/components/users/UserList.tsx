"use client";
import {User} from "@prisma/client";
import React from "react";
import {MdOutlineGroupAdd} from "react-icons/md";
import UserBox from "./UserBox";

interface UserListProps {
  connections: User[];
}

const UserList: React.FC<UserListProps> = ({connections}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-2xl font-bold text-dark dark:text-light">People</div>
        <div className="flex items-center justify-center p-2 rounded-full cursor-pointer bg-light dark:bg-dark hover:opacity-75">
          <MdOutlineGroupAdd size={20} className="text-dark dark:text-light" />
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto">
        {connections.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default UserList;
