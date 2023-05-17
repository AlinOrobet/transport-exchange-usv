"use client";
import React, {useState} from "react";
import {ListItem} from "./ListItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Button from "@/app/components/Button";
interface Options {
  id: number;
  description: string;
  details?: string;
}

interface PricingCardProps {
  title: string;
  subtitle: string;
  price: string;
  listOfOptions: Options[];
  canSelect?: boolean;
  onSelect: (value: string) => void;
  isSelected?: boolean;
  miniCard?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  subtitle,
  price,
  listOfOptions,
  canSelect,
  onSelect,
  isSelected,
  miniCard,
}) => {
  const registerModal = useRegisterModal();
  return (
    <>
      {miniCard ? (
        <div
          onClick={() => {
            if (isSelected) {
              onSelect("");
            } else onSelect(title);
          }}
          className="relative w-full p-4 border rounded-lg cursor-pointer border-dark dark:border-light text-dark dark:text-light bg-light_shadow dark:bg-dark_shadow"
        >
          {canSelect && (
            <div className="absolute top-0 right-0 p-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full dark:bg-dark bg-light">
                {isSelected && (
                  <div className="text-dark dark:text-light">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-start">
              <h3 className="mb-2 text-3xl font-bold">{title}</h3>
              <p className="w-4/5 font-light font-semibold text-left sm:text-lg">{subtitle}</p>
            </div>
            <div className="flex items-baseline justify-center my-8">
              <span className="mr-1 text-5xl font-extrabold">{price}</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-6 mx-auto text-center shadow border-rounded-lg border-dark dark:border-light text-dark dark:text-light bg-light_shadow dark:bg-dark_shadow xl:p-8">
          <h3 className="mb-4 text-3xl font-bold">{title}</h3>
          <p className="font-light font-semibold sm:text-lg">{subtitle}</p>
          <div className="flex items-baseline justify-center my-8">
            <span className="mr-2 text-5xl font-extrabold">{price}</span>
            <span className="text-gray-500 dark:text-gray-400">/month</span>
          </div>
          <ul className="grid mb-4 space-y-2 text-left sm:grid-cols-2 lg:grid-cols-1">
            {listOfOptions.map((option) => (
              <ListItem
                key={option.id}
                description={option.description}
                details={option?.details}
              />
            ))}
          </ul>
          <Button
            onClick={() => {
              registerModal.onOpen();
            }}
          >
            Get started
          </Button>
        </div>
      )}
    </>
  );
};

export default PricingCard;
