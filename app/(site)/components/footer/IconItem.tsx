"use client";
import React from "react";
import {IconType} from "react-icons";
import {motion} from "framer-motion";
interface IconItemProps {
  href: string;
  icon: IconType;
}
const IconItem: React.FC<IconItemProps> = ({href, icon: Icon}) => {
  return (
    <motion.a href={href} target={"_blank"} whileHover={{y: -2}} whileTap={{scale: 0.9}}>
      <Icon size={30} className="cursor-pointer" />
    </motion.a>
  );
};

export default IconItem;
