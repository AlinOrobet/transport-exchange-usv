"use client";
import React from "react";
import {motion} from "framer-motion";
interface StatsProps {
  users: string;
  companies: string;
  orders: string;
}

const Stats: React.FC<StatsProps> = ({users, orders, companies}) => {
  const stats = [
    {
      id: "stats-1",
      title: "User Active",
      value: users,
    },
    {
      id: "stats-2",
      title: "Trusted by Company",
      value: companies,
    },
    {
      id: "stats-3",
      title: "Orders",
      value: orders,
    },
  ];
  return (
    <div className="flex flex-col flex-wrap items-start justify-center md:items-center md:flex-row">
      {stats.map((stat) => (
        <motion.div
          initial={{opacity: 0, scale: 0.5}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 2}}
          key={stat.id}
          className="flex flex-row items-center justify-center flex-1 m-3"
        >
          <h1 className="text-4xl tracking-tight font-extrabold leading-[44px]">{stat.value}+</h1>
          <p className="font-bold text-md md:text-xl lg:text-2xl ml-3 leading-[20px] uppercase">
            {stat.title}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Stats;
