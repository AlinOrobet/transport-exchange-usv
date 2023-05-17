"use client";
import React from "react";
import PricingCard from "./PricingCard";
import {motion} from "framer-motion";
const Subscriptions = () => {
  return (
    <section id="subscriptions" className="relative flex flex-col pt-36 lg:h-screen">
      <div>
        {/* gradient start */}
        <div className="absolute z-50 -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
        <div className="absolute z-50 w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient hidden dark:inline" />
        <div className="absolute z-50 w-[20%] h-[30%] bottom-1/2 right-0 rounded-full blue__gradient hidden dark:inline" />
        {/* gradient end */}
      </div>
      <div className="max-w-screen-xl mx-auto">
        <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <motion.h2
            initial={{opacity: 0, x: -50}}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 1,
              },
            }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-dark dark:text-light"
          >
            Designed for business teams like yours
          </motion.h2>
          <motion.p
            initial={{opacity: 0, x: 50}}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                duration: 1,
              },
            }}
            className="mb-5 font-sembibold text-dark dark:text-light sm:text-xl"
          >
            Here at Flowbite we focus on markets where technology, innovation, and capital can
            unlock long-term value and drive economic growth.
          </motion.p>
        </div>
        <motion.div
          initial={{opacity: 0, scale: 0.5}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 1}}
          className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0"
        >
          {pricingCards.map((card) => (
            <PricingCard
              key={card.id}
              title={card.title}
              subtitle={card.subtitle}
              price={card.price}
              listOfOptions={card.listOfOptions}
              onSelect={() => {}}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Subscriptions;
export const pricingCards = [
  {
    id: 1,
    title: "Starter",
    subtitle: "Best option for personal use & for your next projects.",
    price: "$29",
    listOfOptions: [
      {id: 1, description: "Individual configuration"},
      {id: 2, description: "Premium support: ", details: "6 months"},
      {id: 3, description: "Free updates: ", details: "6 months"},
      {id: 4, description: "Premium support: ", details: "6 months"},
      {id: 5, description: "Free updates: ", details: "6 months"},
    ],
  },
  {
    id: 2,
    title: "Company",
    subtitle: "Relevant for multiple users & premium support.",
    price: "$99",
    listOfOptions: [
      {id: 1, description: "Individual configuration"},
      {id: 2, description: "Premium support: ", details: "6 months"},
      {id: 3, description: "Free updates: ", details: "6 months"},
      {id: 4, description: "Premium support: ", details: "6 months"},
      {id: 5, description: "Free updates: ", details: "6 months"},
    ],
  },
  {
    id: 3,
    title: "Enterprise",
    subtitle: "Best for large scale uses and extended redistribution.",
    price: "$499",
    listOfOptions: [
      {id: 1, description: "Individual configuration"},
      {id: 2, description: "Premium support: ", details: "6 months"},
      {id: 3, description: "Free updates: ", details: "6 months"},
      {id: 4, description: "Premium support: ", details: "6 months"},
      {id: 5, description: "Free updates: ", details: "6 months"},
    ],
  },
];
