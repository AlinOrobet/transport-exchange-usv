"use client";
import React from "react";
import {useRouter} from "next/navigation";
interface NavItemProps {
  href?: string;
  name: string;
  displayModal?: () => void;
  handleOpen?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({href, name, handleOpen, displayModal}) => {
  const router = useRouter();
  const handleClick = () => {
    if (!href) {
      displayModal?.();
    } else {
      router.push(href);
    }
    handleOpen?.();
  };
  return (
    <div
      onClick={handleClick}
      className="relative mx-3 mt-2 text-lg font-semibold cursor-pointer group lg:mt-0"
    >
      {name}
      <span className="h-[1px] absolute left-0 -bottom-0.5 bg-dark dark:bg-light group-hover:w-full transition-[width] ease duration-600 w-0"></span>
    </div>
  );
};

export default NavItem;
