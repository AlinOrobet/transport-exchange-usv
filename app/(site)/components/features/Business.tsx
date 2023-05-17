"use client";
import React from "react";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import {AiFillStar} from "react-icons/ai";
import {BsShieldFillCheck, BsFillSendFill} from "react-icons/bs";
import FeaturesCard from "./FeaturesCard";
import Button from "@/app/components/Button";
import {motion} from "framer-motion";
const Business = () => {
  const registerModal = useRegisterModal();

  return (
    <div className="flex flex-col py-6 lg:items-center lg:justify-around lg:flex-row">
      <motion.div
        initial={{opacity: 0, x: -50}}
        animate={{
          opacity: 1,
          x: 0,
          transition: {
            duration: 1,
          },
        }}
        className="flex flex-col"
      >
        <h2 className="text-4xl tracking-tight font-extrabold leading-[40px] lg:leading-[50px]">
          Lorem ipsum dolor, <br className="hidden sm:block" /> sit amet consectetur adipisicing.
        </h2>
        <p className="max-w-[500px] text-xl font-semibold my-5 leading-[30px] lg:leading-[35px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque corrupti expedita,
          ipsam, suscipit laborum provident, molestiae iure incidunt officia aperiam beatae
          praesentium ea vel tempore debitis qui soluta unde dolor.
        </p>
        <Button onClick={() => registerModal.onOpen()}>Start now</Button>
      </motion.div>
      <div className="w-full lg:w-[75vh]">
        {features.map((feature) => (
          <FeaturesCard
            key={feature.id}
            icon={feature.icon}
            content={feature.content}
            title={feature.title}
          />
        ))}
      </div>
    </div>
  );
};

export default Business;
export const features = [
  {
    id: "feature-1",
    icon: AiFillStar,
    title: "Rewards",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam rem itaque asperiores!",
  },
  {
    id: "feature-2",
    icon: BsShieldFillCheck,
    title: "100% Secured",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam rem itaque asperiores!",
  },
  {
    id: "feature-3",
    icon: BsFillSendFill,
    title: "Balance Transfer",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit.Quisquam rem itaque asperiores!",
  },
];
