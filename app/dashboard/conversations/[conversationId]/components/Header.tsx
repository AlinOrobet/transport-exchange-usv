"use client";
import Avatar from "@/app/dashboard/components/Avatar";
import AvatarGroup from "@/app/dashboard/components/AvatarGroup";
import ProfileDrawer from "@/app/dashboard/components/modals/ProfileDrawer";
import UserDetails from "@/app/dashboard/components/UserDetails";
import useActiveList from "@/app/hooks/useActiveList";
import useOtherUser from "@/app/hooks/useOtherUser";
import {Conversation, User} from "@prisma/client";
import Link from "next/link";
import React, {useMemo, useState} from "react";
import {HiChevronLeft} from "react-icons/hi";
import {HiEllipsisHorizontal} from "react-icons/hi2";
interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}
const Header: React.FC<HeaderProps> = ({conversation}) => {
  const otherUser = useOtherUser(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {members} = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [conversation, isActive]);
  const name = useMemo(() => {
    if (otherUser?.lastName && otherUser?.firstName) {
      return otherUser.lastName + " " + otherUser?.firstName;
    }
    return otherUser.email;
  }, [otherUser.lastName, otherUser.firstName, otherUser.email]);
  return (
    <>
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <UserDetails
          data={conversation}
          user={otherUser}
          type="Conversation"
          confirmModalTitle="Delete conversation"
          confrimModalSubtitle="Are you sure you want to delete this conversation? This action cannot be undone."
          onCloseDrawer={() => setDrawerOpen(false)}
          userIsOwner
        />
      </ProfileDrawer>
      <div className="w-full flex border-b-[1px] border-dark dark:border-light justify-between items-center shadow-sm pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/conversations"
            className="block transition cursor-pointer lg:hidden text-dark_shadow dark:text-light_shadow hover:text-dark hover:text-light"
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar userEmail={otherUser.email} type="User" url={otherUser.image} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || name}</div>
            <div className="text-sm font-light text-dark dark:text-light">{statusText}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="transition cursor-pointer text-dark_shadow dark:text-light_shadow hover:text-dark hover:dark:text-light"
        />
      </div>
    </>
  );
};

export default Header;
