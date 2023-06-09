import getCurrentCompany from "@/app/actions/getCurrentCompany";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getUsers, {IUsersParams} from "@/app/actions/getUsers";
import React from "react";
import CompanyDetails from "../components/CompanyDetails";
import Section from "../components/Section";
import TeamList from "./components/TeamList";
interface TeamProps {
  searchParams: IUsersParams;
}
const Team = async ({searchParams}: TeamProps) => {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  const {users, count} = await getUsers({
    ...searchParams,
    companyId: currentUser?.companyId ? currentUser.companyId : "",
  });
  return (
    <>
      <Section fit="w-full xl:w-3/5">
        <TeamList
          isOwner={currentUser ? (currentUser?.role === "Owner" ? true : false) : undefined}
          users={users}
          numberOfUsers={count}
          currentCompany={currentCompany}
        />
      </Section>
      <Section fit="hidden xl:inline xl:w-2/5">
        <CompanyDetails currentUser={currentUser} currentCompany={currentCompany} />
      </Section>
    </>
  );
};

export default Team;
