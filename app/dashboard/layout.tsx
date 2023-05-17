import React from "react";
import getCurrentCompany from "../actions/getCurrentCompany";
import getCurrentUser from "../actions/getCurrentUser";
import Sidebar from "./components/sidebar/Sidebar";

const Layout = async ({children}: {children: React.ReactNode}) => {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  return (
    <div>
      <div className="h-[5rem] lg:h-[8rem] bg-dark_shadow dark:bg-light_shadow w-full fixed top-0" />
      <Sidebar currentUser={currentUser} currentCompany={currentCompany} />
      <div className="lg:pl-[18rem] lg:pt-[10rem] pt-[6rem]">{children}</div>
    </div>
  );
};

export default Layout;
//lg:pl-[9rem] pt-[3.5rem] lg:pt-[5rem]
