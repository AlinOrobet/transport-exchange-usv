"use client";
import React from "react";
import {IconType} from "react-icons";
import {useRouter} from "next/navigation";
interface SidebarItemProps {
  label: string;
  href: string;
  icon: IconType;
  notification?: boolean;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  notification,
  active,
}) => {
  const router = useRouter();
  return (
    <div
      className={`flex flex-row items-center p-2 cursor-pointer hover:dark:bg-dark hover:bg-light rounded-md mt-1 ${
        active && "bg-light dark:bg-dark"
      }`}
      onClick={() => router.push(href)}
    >
      <div className="relative">
        <Icon size={24} className="text-dark dark:text-light" />
        {notification && (
          <span className="absolute w-3 h-3 rounded-full -left-1 -top-1 bg-rose-500"></span>
        )}
      </div>

      <h3 className="ml-2 text-lg font-semibold text-dark dark:text-light">{label}</h3>
    </div>
  );
};

export default SidebarItem;
