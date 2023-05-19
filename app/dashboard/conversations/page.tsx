import getConnections from "@/app/actions/getConnections";
import React from "react";
import Section from "../components/Section";
import EmptyState from "./components/EmptyState";
import UserList from "./components/users/UserList";
const Conversations = async () => {
  const connections = await getConnections();
  return (
    <div className="flex flex-row gap-[1.5rem] h-full w-full">
      <Section fit="w-full md:w-1/3">
        <UserList connections={connections} />
      </Section>
      <Section fit="hidden md:inline md:w-2/3">
        <EmptyState />
      </Section>
    </div>
  );
};

export default Conversations;
