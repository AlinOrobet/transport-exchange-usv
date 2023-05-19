"use client";
import {SafeUser} from "@/app/types";
import React, {useMemo} from "react";
import Avatar from "../../components/Avatar";
import {format} from "date-fns";
import {IoTrash} from "react-icons/io5";
interface UserDetailsProps {
  user: SafeUser | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({user}) => {
  const joinedDate = useMemo(() => {
    if (user?.createdAt) {
      return format(new Date(user.createdAt), "PP");
    }
  }, [user?.createdAt]);

  const isActive = true;

  const title = useMemo(() => {
    if (user?.lastName && user?.firstName) {
      return user.lastName + " " + user.firstName;
    }
    return user?.email;
  }, [user?.lastName, user?.firstName, user?.email]);

  const statusText = useMemo(() => {
    return isActive ? "Active" : "Offline";
  }, [isActive]);
  return (
    <div className="relative flex-1 px-4 mt-6 sm:px-6 text-dark dark:text-light">
      <div className="flex flex-col items-center">
        <div className="mb-2">
          <Avatar url={user ? user.image : null} type="User" />
        </div>
        <div className="font-bold">{title}</div>
        <div className="font-semibold text-gray-900 dark:text-gray-300">{statusText}</div>
        <div className="flex gap-10 my-8">
          <div
            onClick={() => {}}
            className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-75"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-300 dark:bg-neutral-200 text-dark">
              <IoTrash size={20} />
            </div>
            <div className="text-sm font-light">Delete</div>
          </div>
        </div>
        <div className="w-full pt-5 pb-5 sm:px-0 sm:pt-0">
          <dl className="px-4 space-y-8 sm:space-y-6 sm:px-6">
            <div className="text-dark dark:text-light">
              <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Email</dt>
              <dd className="mt-1 text-sm sm:col-span-2">{user?.email}</dd>
            </div>
            <hr />
            <div className="text-dark dark:text-light">
              <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Joined</dt>
              <dd className="mt-1 text-sm sm:col-span-2">
                <time dateTime={joinedDate}>{joinedDate}</time>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
