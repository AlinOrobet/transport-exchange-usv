import {SafeUser} from "@/app/types";
import {Conversation, User} from "@prisma/client";
import React, {useCallback, useMemo, useState} from "react";
import {format} from "date-fns";
import {IoTrash} from "react-icons/io5";
import Avatar from "./Avatar";
import ConfirmModal from "./modals/ConfirmModal";
import {FiAlertTriangle} from "react-icons/fi";
import useActiveList from "@/app/hooks/useActiveList";
import AvatarGroup from "./AvatarGroup";
import axios from "axios";
import useConversation from "@/app/hooks/useConversation";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
interface UsersDetailsProps {
  data?: Conversation & {
    users: User[];
  };
  type: "Conversation" | "User";
  user: SafeUser | User | null;
  confirmModalTitle: string;
  confrimModalSubtitle: string;
  onCloseDrawer: () => void;
  userIsOwner?: boolean;
}

const UserDetails: React.FC<UsersDetailsProps> = ({
  data,
  user,
  type,
  confirmModalTitle,
  confrimModalSubtitle,
  onCloseDrawer,
  userIsOwner,
}) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const joinedDate = useMemo(() => {
    if (user?.createdAt) {
      return format(new Date(user.createdAt), "PP");
    }
  }, [user?.createdAt]);

  const title = useMemo(() => {
    if (data?.name) {
      return data.name;
    }
    if (user?.lastName && user?.firstName) {
      return user.lastName + " " + user.firstName;
    }
    return user?.email;
  }, [data?.name, user?.lastName, user?.firstName, user?.email]);

  const {members} = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  const statusText = useMemo(() => {
    if (data?.isGroup) {
      return `${data.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [data?.isGroup, data?.users.length, isActive]);

  const {conversationId} = useConversation();

  const onDelete = useCallback(() => {
    setIsLoading(true);
    if (type === "Conversation") {
      axios
        .delete(`/api/conversations/${conversationId}`)
        .then(() => {
          router.refresh();
          setConfirmOpen(false);
          onCloseDrawer();
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    } else if (type === "User") {
      if (userIsOwner && user?.role !== "Owner") {
        axios
          .delete(`/api/editAccount/${user?.id}`)
          .then(() => {
            router.refresh();
            setConfirmOpen(false);
            onCloseDrawer();
          })
          .catch(() => toast.error("Something went wrong!"))
          .finally(() => setIsLoading(false));
      } else {
        toast.error("Cannot remove an owner");
        setConfirmOpen(false);
        onCloseDrawer();
      }
    } else {
      setIsLoading(false);
      return null;
    }
  }, [
    conversationId,
    setConfirmOpen,
    type,
    onCloseDrawer,
    user?.id,
    userIsOwner,
    user?.role,
    router,
  ]);
  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmModalTitle}
        subtitle={confrimModalSubtitle}
        icon={FiAlertTriangle}
        onDelete={onDelete}
        isLoading={isLoading}
      />
      <div className="relative flex-1 px-4 mt-6 sm:px-6 text-dark dark:text-light">
        <div className="flex flex-col items-center">
          <div className="mb-2">
            {data?.isGroup ? (
              <AvatarGroup users={data.users} />
            ) : (
              <Avatar
                url={user ? user.image : null}
                type="User"
                userEmail={user ? user.email : null}
              />
            )}
          </div>
          <div className="font-bold">{title}</div>
          <div className="font-semibold text-gray-900 dark:text-gray-300">{statusText}</div>

          {userIsOwner && (
            <div className="flex gap-10 my-8">
              <div
                onClick={() => setConfirmOpen(true)}
                className="flex flex-col items-center gap-3 cursor-pointer hover:opacity-75"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-300 dark:bg-neutral-200 text-dark">
                  <IoTrash size={20} />
                </div>
                <div className="text-sm font-light">Delete</div>
              </div>
            </div>
          )}
          <div className="w-full pt-5 pb-5 sm:px-0 sm:pt-0">
            <dl className="px-4 space-y-8 sm:space-y-6 sm:px-6">
              {data?.isGroup ? (
                <div className="text-dark dark:text-light">
                  <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Emails</dt>
                  <dd className="mt-1 text-sm sm:col-span-2">
                    {data.users.map((user) => user.email).join(", ")}
                  </dd>
                </div>
              ) : (
                <div className="text-dark dark:text-light">
                  <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Email</dt>
                  <dd className="mt-1 text-sm sm:col-span-2">{user?.email}</dd>
                </div>
              )}
              <hr />
              {!data?.isGroup && (
                <div className="text-dark dark:text-light">
                  <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Joined</dt>
                  <dd className="mt-1 text-sm sm:col-span-2">
                    <time dateTime={joinedDate}>{joinedDate}</time>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetails;
