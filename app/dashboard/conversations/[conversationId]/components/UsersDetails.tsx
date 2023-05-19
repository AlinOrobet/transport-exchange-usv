import useOtherUser from "@/app/hooks/useOtherUser";
import {Conversation, User} from "@prisma/client";
import React, {useMemo} from "react";
import {format} from "date-fns";
import AvatarGroup from "@/app/dashboard/components/AvatarGroup";
import Avatar from "@/app/dashboard/components/Avatar";
import {IoTrash} from "react-icons/io5";
import useActiveList from "@/app/hooks/useActiveList";
interface UsersDetailsProps {
  data: Conversation & {
    users: User[];
  };
}

const UsersDetails: React.FC<UsersDetailsProps> = ({data}) => {
  const otherUser = useOtherUser(data);
  const {members} = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    if (data.name) {
      return data.name;
    }
    if (otherUser?.lastName && otherUser?.firstName) {
      return otherUser.lastName + " " + otherUser?.firstName;
    }
    return otherUser.email;
  }, [otherUser.lastName, otherUser.firstName, otherUser.email, data.name]);
  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [data, isActive]);
  return (
    <div className="relative flex-1 px-4 mt-6 sm:px-6 text-dark dark:text-light">
      <div className="flex flex-col items-center">
        <div className="mb-2">
          {data.isGroup ? (
            <AvatarGroup users={data.users} />
          ) : (
            <Avatar userEmail={otherUser.email} url={otherUser.image} type="User" />
          )}
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
            {data.isGroup && (
              <div className="text-dark dark:text-light">
                <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Emails</dt>
                <dd className="mt-1 text-sm sm:col-span-2">
                  {data.users.map((user) => user.email).join(", ")}
                </dd>
              </div>
            )}
            {!data.isGroup && (
              <div className="text-dark dark:text-light">
                <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Email</dt>
                <dd className="mt-1 text-sm sm:col-span-2">{otherUser.email}</dd>
              </div>
            )}
            {!data.isGroup && (
              <>
                <hr />
                <div className="text-dark dark:text-light">
                  <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Joined</dt>
                  <dd className="mt-1 text-sm sm:col-span-2">
                    <time dateTime={joinedDate}>{joinedDate}</time>
                  </dd>
                </div>
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UsersDetails;
