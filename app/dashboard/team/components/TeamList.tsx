"use client";
import Button from "@/app/components/Button";
import {SafeUser} from "@/app/types";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import Pagination from "../../components/Pagination";
import ProfileDrawer from "../../components/modals/ProfileDrawer";
import UserCard from "./UserCard";
import UserDetails from "./UserDetails";
import InviteMemberModal from "./InviteMemberModal";

interface TeamListProps {
  isOwner: boolean | undefined;
  users: SafeUser[];
  numberOfUsers: number;
  currentCompany: string | undefined;
}

const TeamList: React.FC<TeamListProps> = ({isOwner, users, numberOfUsers, currentCompany}) => {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<SafeUser | null>(null);

  const [inviteMemberModal, setInviteMemberModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(numberOfUsers / (isOwner ? 8 : 9));
  return (
    <>
      <ProfileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <UserDetails user={userProfile} />
      </ProfileDrawer>
      <InviteMemberModal
        isOpen={inviteMemberModal}
        onClose={() => setInviteMemberModal(false)}
        currentCompany={currentCompany}
      />
      <div className="flex flex-col h-full space-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-xl font-bold 2xl:text-2xl text-dark dark:text-light">Team</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
            {isOwner && (
              <div className="w-full h-[12rem] p-4 rounded-md bg-light dark:bg-dark text-dark dark:text-light flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="text-2xl font-bold">Add someone</div>
                  <div className="mt-2 text-sm font-semibold text-neutral-500 dark:text-neutral-100">
                    Adding more people in your team can boost succes
                  </div>
                </div>
                <Button onClick={() => setInviteMemberModal(true)} small>
                  Invite People
                </Button>
              </div>
            )}
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isOwner={isOwner}
                setUserProfile={() => {
                  setDrawerOpen(true);
                  setUserProfile(user);
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center w-full pt-2">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onChange={(current: number) => {
              setCurrentPage(current);
              router.push(`/dashboard/team?page=${current}`);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TeamList;
