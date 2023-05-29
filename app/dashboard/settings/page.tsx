import getCurrentCompany from "@/app/actions/getCurrentCompany";
import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";
import CompanyDetails from "../components/CompanyDetails";
import Section from "../components/Section";
import Settings from "./components/Settings";

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  return (
    <>
      <Section fit="w-full xl:w-3/5">
        <Settings currentUser={currentUser} currentCompany={currentCompany} />
      </Section>
      <Section fit="hidden xl:inline xl:w-2/5">
        <CompanyDetails currentUser={currentUser} currentCompany={currentCompany} />
      </Section>
    </>
  );
};

export default SettingsPage;
