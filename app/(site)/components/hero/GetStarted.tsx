"use client";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import React from "react";
import {HiArrowUpRight} from "react-icons/hi2";
import {motion} from "framer-motion";
const GetStarted = () => {
  const registerModal = useRegisterModal();
  return (
    <motion.div
      initial={{opacity: 0, scale: 0.5}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 1}}
      className="flex items-center justify-center w-[140px] h-[140px] rounded-full bg-dark dark:bg-light p-1 cursor-pointer"
      onClick={() => registerModal.onOpen()}
    >
      <div className="flex flex-col items-center justify-center w-full h-full rounded-full bg-light dark:bg-dark">
        <div className="flex flex-row items-start justify-center space-x-2">
          <p className="text-lg font-bold leading-6 text-dark dark:text-light">Get</p>
          <HiArrowUpRight className="" />
        </div>
        <p className="text-lg font-bold leading-6 text-dark dark:text-light">Started</p>
      </div>
    </motion.div>
  );
};

export default GetStarted;
