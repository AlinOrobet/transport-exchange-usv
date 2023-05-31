"use client";
import {SafeUser} from "@/app/types";
import React, {useState} from "react";
import Avatar from "../../components/Avatar";
import ProfileDrawer from "../../components/modals/ProfileDrawer";
import UserDetails from "../../components/UserDetails";
interface UserCardProps {
  user: SafeUser | null;
  isOwner?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({user, isOwner}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <UserDetails
          user={user}
          type="User"
          confirmModalTitle="Delete member"
          confrimModalSubtitle="Are you sure you want to delete this member? This action cannot be undone."
          onCloseDrawer={() => setDrawerOpen(false)}
          userIsOwner={isOwner}
        />
      </ProfileDrawer>
      <div className="relative w-full h-[12rem] px-2 py-3 rounded-md bg-light dark:bg-dark text-dark dark:text-light">
        <div className="flex flex-col items-center justify-between h-full">
          <div className="flex flex-col items-center">
            <Avatar
              url={user ? user.image : null}
              type="User"
              userEmail={user ? user.email : null}
            />
            <div className="pt-2 font-bold text-center">
              {user?.lastName || user?.firstName ? (
                <div className="flex flex-row items-center space-x-2">
                  <h1>{user?.lastName || "Nume"}</h1>
                  <h2>{user?.firstName || "Prenume"}</h2>
                </div>
              ) : (
                <div>{user?.email}</div>
              )}
              <p className="pt-1 font-semibold">{user?.role}</p>
            </div>
          </div>
          <p className="font-semibold underline cursor-pointer" onClick={() => setDrawerOpen(true)}>
            Details
          </p>
        </div>
      </div>
    </>
  );
};

export default UserCard;
