import getCompanyUsers from "@/app/actions/getCompanyUsers";
import getCurrentCompany from "@/app/actions/getCurrentCompany";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getWonOrders, {IWonOrdersParams} from "@/app/actions/getWonOrders";
import React from "react";
import RenderPlanner from "./components/Planner";

interface PlannerProps {
  searchParams: IWonOrdersParams;
}

const PlannerPage = async ({searchParams}: PlannerProps) => {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  const wonOrders = await getWonOrders({...searchParams});
  const companyUsers = await getCompanyUsers();
  if (currentCompany?.accountType !== "transport") {
    return null;
  }
  return (
    <RenderPlanner
      orders={wonOrders}
      drivers={companyUsers.filter((user) => user.role === "Truck driver")}
      currentCompany={currentCompany}
      currentUser={currentUser}
    />
  );
};

export default PlannerPage;
