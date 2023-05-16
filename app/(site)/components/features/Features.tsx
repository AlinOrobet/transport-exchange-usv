"use client";
import React from "react";
import Business from "./Business";
import Stats from "./Stats";
import ViewOrder from "./ViewOrder";
interface FeaturesProps {
  users: string;
  companies: string;
  orders: string;
}
const Features: React.FC<FeaturesProps> = ({users, companies, orders}) => {
  return (
    <section id="features" className="flex flex-col pt-28">
      <Stats users={users} companies={companies} orders={orders} />
      <Business />
      <ViewOrder />
    </section>
  );
};

export default Features;
