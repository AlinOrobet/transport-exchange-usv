"use client";
import {SafeCompany, SafeUser} from "@/app/types";
import React, {useState} from "react";
import {AiOutlineClose} from "react-icons/ai";
import {RiMenu2Fill} from "react-icons/ri";
import SidebarItem from "./SidebarItem";
import SidebarCTA from "./SidebarCTA";
import useRoutes from "@/app/hooks/useRoutes";
import Button from "@/app/components/Button";
import {signOut} from "next-auth/react";
import ThemeMode from "@/app/components/ThemeMode";
interface SidebarProps {
  currentUser: SafeUser | null;
  currentCompany: SafeCompany | null;
}

const Sidebar: React.FC<SidebarProps> = ({currentUser, currentCompany}) => {
  const [open, setOpen] = useState(false);
  const routes = useRoutes({
    accountType: currentCompany?.accountType || undefined,
    notification: currentUser?.hasDefaultPassword || undefined,
  });
  return (
    <>
      <div className="fixed top-[1.75rem] left-[1rem] lg:hidden" onClick={() => setOpen(!open)}>
        <RiMenu2Fill
          className={`${
            open ? "hidden" : ""
          } text-3xl md:text-4xl dark:text-dark text-light cursor-pointer`}
        />
      </div>
      <div
        className={`absolute top-[2.5rem] lg:top-[3rem] left-[1rem] w-[15rem] h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-4.5rem)] rounded-md shadow-xl bg-light_shadow dark:bg-dark_shadow duration-300 transition ${
          open ? "inline" : "hidden lg:inline"
        }`}
      >
        <div className="flex flex-col justify-between h-full p-2 lg:p-4">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between px-2 pt-4 pb-6">
              <h1 className="text-lg font-extrabold">CargoConnect</h1>
              <div onClick={() => setOpen(!open)} className="cursor-pointer lg:hidden">
                <AiOutlineClose size={24} />
              </div>
            </div>
            {routes.map((item) => (
              <SidebarItem
                key={item.id}
                label={item.label}
                href={item.href}
                icon={item.icon}
                active={item.active}
                notification={item.notification}
              />
            ))}
            {currentUser?.role === "Owner" && (
              <div className="hidden sm:inline">
                <SidebarCTA />
              </div>
            )}
          </div>
          <div className="flex flex-row items-center w-full space-x-2">
            <Button onClick={() => signOut()} fullWidth>
              Logout
            </Button>
            <div className="">
              <ThemeMode square />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
