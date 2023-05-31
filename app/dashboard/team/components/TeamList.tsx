"use client";
import Button from "@/app/components/Button";
import {SafeUser} from "@/app/types";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";
import Pagination from "../../components/Pagination";
import UserCard from "./UserCard";
import InviteMemberModal from "./InviteMemberModal";
import {AiOutlineSearch} from "react-icons/ai";
import SearchModal from "../../components/modals/SearchModal";
import queryString from "query-string";

interface TeamListProps {
  isOwner: boolean | undefined;
  users: SafeUser[];
  numberOfUsers: number;
  currentCompany: string | undefined;
}

const TeamList: React.FC<TeamListProps> = ({isOwner, users, numberOfUsers, currentCompany}) => {
  const router = useRouter();
  const params = useSearchParams();

  const [inviteMemberModal, setInviteMemberModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(numberOfUsers / (isOwner ? 8 : 9));
  return (
    <>
      <InviteMemberModal
        isOpen={inviteMemberModal}
        onClose={() => setInviteMemberModal(false)}
        currentCompany={currentCompany}
      />
      <SearchModal
        isOpen={searchModal}
        onClose={() => setSearchModal(false)}
        title="Search team mates"
        subtitle="habarnma"
        options={options}
      />
      <div className="flex flex-col h-full space-y-2">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-xl font-bold 2xl:text-2xl text-dark dark:text-light">Team</div>
          <div
            onClick={() => setSearchModal(true)}
            className="p-1.5 rounded-full bg-dark_shadow dark:bg-light_shadow hover:opacity-75"
          >
            <AiOutlineSearch className="cursor-pointer dark:text-dark text-light" size={18} />
          </div>
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
              <UserCard key={user.id} user={user} isOwner={isOwner} />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center w-full pt-2">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onChange={(current: number) => {
              setCurrentPage(current);
              let currentQuery = {};
              if (params) {
                currentQuery = queryString.parse(params.toString());
              }
              const updatedQuery: any = {
                ...currentQuery,
                page: current,
              };
              const url = queryString.stringifyUrl(
                {
                  url: "/dashboard/team",
                  query: updatedQuery,
                },
                {skipNull: true}
              );
              router.push(url);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TeamList;
const options = [
  {value: "Email", label: "E-mail"},
  {value: "FirstName", label: "First name"},
  {value: "LastName", label: "Last name"},
  {value: "Role", label: "Role"},
];
