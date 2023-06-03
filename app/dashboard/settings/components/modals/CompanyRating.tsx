"use client";
import Details from "@/app/components/Details";
import {SafeCompany} from "@/app/types";
import React from "react";
import {BsStarFill, BsStarHalf, BsStar} from "react-icons/bs";

interface CompayRatingProps {
  currentCompany: SafeCompany | null;
}

const CompanyRating: React.FC<CompayRatingProps> = ({currentCompany}) => {
  // const number = 5;
  // const roundedNumber = Math.round(number * 2) / 2;
  // const fullStars = Math.floor(roundedNumber);
  // const halfStars = Math.ceil(roundedNumber - fullStars);
  // const emptyStars = 5 - fullStars - halfStars;
  // const stars = [];
  // for (let i = 0; i < fullStars; i++) {
  //   stars.push({icon: BsStarFill, className: "text-yellow-500"});
  // }
  // for (let i = 0; i < halfStars; i++) {
  //   stars.push({icon: BsStarHalf, className: "text-yellow-500"});
  // }
  // for (let i = 0; i < emptyStars; i++) {
  //   stars.push({icon: BsStar, className: "text-gray-500"});
  // }

  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-bold text-dark_shadow">Rating stats</h1>
      {currentCompany?.stats.map((stat, index) => (
        <Details key={index} label={stat.label} value={stat.value} />
      ))}
      {/* <div className="flex flex-col items-center pt-2">
        <h2 className="font-semibold text-dark_shadow">Rating overview</h2>
        <div className="relative flex flex-row items-end space-x-1">
          <h3 className="text-lg font-extrabold md:text-2xl 2xl:text-4xl">{number}</h3>
          <span className="text-lg">/5</span>
        </div>
        <div className="flex items-center space-x-2">
          {stars.map((star, index) => {
            const Icon = star.icon;
            return <Icon key={index} className={star.className} />;
          })}
        </div>
      </div> */}
    </div>
  );
};

export default CompanyRating;
