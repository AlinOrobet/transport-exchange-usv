"use client";
import React from "react";
import {BsStarFill, BsStarHalf, BsStar} from "react-icons/bs";
const CompanyRating = () => {
  const number = 3.6;
  const roundedNumber = Math.round(number * 2) / 2;
  const fullStars = Math.floor(roundedNumber);
  const halfStars = Math.ceil(roundedNumber - fullStars);
  const emptyStars = 5 - fullStars - halfStars;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push({icon: BsStarFill, className: "text-yellow-500"});
  }
  for (let i = 0; i < halfStars; i++) {
    stars.push({icon: BsStarHalf, className: "text-yellow-500"});
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push({icon: BsStar, className: "text-gray-500"});
  }
  return (
    <>
      <div className="flex justify-center w-full">
        <h1 className="text-2xl font-bold">Rating overview</h1>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative flex flex-row items-end space-x-1">
          <h3 className="text-2xl font-extrabold 2xl:text-4xl">{number}</h3>
          <span className="text-lg">/5</span>
        </div>
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            {stars.map((star, index) => {
              const Icon = star.icon;
              return <Icon key={index} className={star.className} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyRating;
