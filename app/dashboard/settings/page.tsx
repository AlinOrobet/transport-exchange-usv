import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";
import Section from "../components/Section";
import Settings from "./components/Settings";

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();
  return (
    <>
      <Section fit="w-full xl:w-3/5">
        <Settings currentUser={currentUser} />
      </Section>
      <Section fit="hidden xl:inline xl:w-2/5">
        <div>Company</div>
      </Section>
    </>
  );
};

export default SettingsPage;
