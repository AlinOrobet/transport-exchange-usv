"use client";
import React from "react";
import {IconType} from "react-icons/lib";
import {motion} from "framer-motion";
interface FeaturesCardProps {
  icon: IconType;
  title: string;
  content: string;
}

const FeaturesCard: React.FC<FeaturesCardProps> = ({icon: Icon, title, content}) => {
  return (
    <motion.div
      whileHover={{y: -3, x: -3}}
      whileTap={{scale: 0.9}}
      initial={{opacity: 0, x: 50}}
      animate={{
        opacity: 1,
        x: 0,
        transition: {
          duration: 1,
        },
      }}
      className="flex flex-row items-center p-6 rounded-md cursor-pointer hover:bg-light_shadow hover:dark:bg-dark_shadow"
    >
      <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center bg-dark dark:bg-light">
        <Icon size={30} className="text-light dark:text-dark" />
      </div>
      <div className="flex flex-col flex-1 ml-3">
        <h4 className="text-lg font-bold md:text-2xl">{title}</h4>
        <p className="font-semibold text-md md:text-lg"> {content}</p>
      </div>
    </motion.div>
  );
};

export default FeaturesCard;
