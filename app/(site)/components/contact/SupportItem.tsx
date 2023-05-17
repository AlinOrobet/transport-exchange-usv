"use client";
import React from "react";
import {IconType} from "react-icons";
import {motion} from "framer-motion";
interface SupportItemProps {
  icon: IconType;
  title: string;
  subtitle: string;
  contactInfo: string;
}

const SupportItem: React.FC<SupportItemProps> = ({icon: Icon, title, subtitle, contactInfo}) => {
  return (
    <div className="w-full col-span-1 px-3 mb-12 grow-0 shrink-0 basis-auto lg:w-6/12 lg:px-6">
      <div className="flex items-start">
        <motion.div
          whileHover={{y: -2}}
          whileTap={{scale: 0.9}}
          className="cursor-pointer shrink-0"
        >
          <div className="flex items-center justify-center w-16 h-16 p-4 rounded-md shadow-md bg-dark_shadow hover:bg-dark dark:bg-light_shadow hover:dark:bg-light">
            <Icon size={30} className="text-light dark:text-dark" />
          </div>
        </motion.div>
        <div className="ml-6 grow text-dark dark:text-light">
          <p className="font-bold cursor-pointer">{title}</p>
          <p className="font-semibold cursor-pointer">{subtitle}</p>
          <p className="font-semibold cursor-pointer">{contactInfo}</p>
        </div>
      </div>
    </div>
  );
};

export default SupportItem;
