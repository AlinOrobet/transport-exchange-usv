"use client";
import Link from "next/link";
import React from "react";
import {motion} from "framer-motion";
const MotionLink = motion(Link);
const Logo = () => {
  return (
    <MotionLink
      href="/"
      className="flex items-center justify-center w-16 h-16 text-2xl font-bold border border-transparent rounded-full bg-dark text-light dark:border-light"
      whileHover={{
        backgroundColor: [
          "#121212",
          "rgba(131,58,180,1)",
          "rgba(253,29,29,1)",
          "rgba(252,176,69.1)",
          "rgba(131,58,180.1)",
          "#121212",
        ],
        transition: {duration: 1, repeat: Infinity},
      }}
    >
      CC
    </MotionLink>
  );
};

export default Logo;
