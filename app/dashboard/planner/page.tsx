import getCurrentCompany from "@/app/actions/getCurrentCompany";
import getCurrentUser from "@/app/actions/getCurrentUser";
import React from "react";

const Planner = async () => {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  if (currentCompany?.accountType !== "transport") {
    return null;
  }
  return <div>Planner</div>;
};

export default Planner;
