"use client";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import React from "react";
import GetStarted from "./GetStarted";
import {motion} from "framer-motion";
const Hero = () => {
  const registerModal = useRegisterModal();
  return (
    <section id="home" className="flex flex-col lg:h-[calc(100vh-7rem)] lg:flex-row">
      <div className="flex flex-col items-start justify-center flex-1">
        <div
          className="flex flex-row items-center px-4 py-2 mb-2 rounded-md cursor-pointer bg-light_shadow dark:bg-dark_shadow"
          onClick={() => registerModal.onOpen()}
        >
          <img src="/assets/Discount.svg" alt="discount" className="w-[32px]h-[32px]" />
          <p className="font-semibold dark:font-normal text-dark dark:text-light">
            <span className="font-bold">20%</span> Discount for{" "}
            <span className="font-bold">12 Monts</span> Subscription
          </p>
        </div>
        <div className="flex flex-row items-center justify-between w-full pt-5">
          <h1 className="flex-1 font-bold text-4xl md:text-6xl lg:text-7xl leading-[50px] lg:leading-[75px]">
            Simplifying <br className="hidden sm:block" />
            <span>Freight</span>
          </h1>
          <div className="hidden mr-0 sm:inline-flex md:mr-4">
            <GetStarted />
          </div>
        </div>
        <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl leading-[50px] lg:leading-[75px]">
          Transportation.
        </h1>
        <p className="text-lg md:text-xl font-semibold text-dark dark:text-light leading-[30.8px] max-w-[700px] mt-5">
          With our vast network of trusted carriers and user-friendly interface, we streamline the
          entire shipping process from start to finish, ensuring that your shipments arrive on time
          and within budget. Join our community today and experience the future of freight
          transportation
        </p>
      </div>
      <div className="relative flex items-center justify-center flex-1 my-10 md:my-0">
        <motion.img
          initial={{opacity: 0, x: 50}}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 1,
            },
          }}
          src="/assets/robot.png"
          alt="homePage"
          className="relative w-full h-full"
        />
        {/* gradient start */}
        <div className="absolute z-50 w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-50 w-[80%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-50 w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>
      <div className="flex items-center justify-center sm:hidden">
        <GetStarted />
      </div>
    </section>
  );
};

export default Hero;
