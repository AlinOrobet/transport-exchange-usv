"use client";
import {SafeUser} from "@/app/types";
import React, {useMemo} from "react";
import Avatar from "../../components/Avatar";
import {format} from "date-fns";
interface UserCardProps {
  user: SafeUser | null;
  isOwner?: boolean;
  setUserProfile: () => void;
}

const UserCard: React.FC<UserCardProps> = ({user, isOwner, setUserProfile}) => {
  const joinedDate = useMemo(() => {
    if (user?.createdAt) {
      return format(new Date(user.createdAt), "PP");
    }
    return null;
  }, [user?.createdAt]);

  return (
    <div className="relative w-full h-[12rem] px-2 py-3 rounded-md bg-light dark:bg-dark text-dark dark:text-light">
      <div className="flex flex-col items-center space-y-2">
        <Avatar user={user} />
        <div className="font-semibold text-center">
          {user?.lastName || user?.firstName ? (
            <div className="flex flex-row items-center space-x-2">
              <h1>{user?.lastName || "Nume"}</h1>
              <h2>{user?.firstName || "Prenume"}</h2>
            </div>
          ) : (
            <div>{user?.email}</div>
          )}
        </div>
        <p className="font-medium">Joined {joinedDate}</p>
        <p className="font-semibold underline cursor-pointer" onClick={() => setUserProfile()}>
          Details
        </p>
      </div>
    </div>
  );
};

export default UserCard;
