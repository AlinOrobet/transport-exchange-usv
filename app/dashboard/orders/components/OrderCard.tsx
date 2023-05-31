"use client";
import React, {useMemo, useState} from "react";
import {IoIosArrowDown} from "react-icons/io";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";
import OrderDetailsCard from "./OrderDetailsCard";
import useCountries from "@/app/hooks/useCountries";
import Flag from "react-world-flags";
import {format} from "date-fns";

interface OrderCardProps {
  data: SafeOrder;
  currentUser?: SafeUser | null;
  currentCompany?: SafeCompany | null;
  setOrder: (order: SafeOrder) => void;
  setVariantMobile?: (variant: string) => void;
  companyUsers: SafeUser[];
}
const OrderCard: React.FC<OrderCardProps> = ({
  data,
  currentUser,
  currentCompany,
  setOrder,
  setVariantMobile,
  companyUsers,
}) => {
  const [open, setOpen] = useState(false);
  const {getByLabel} = useCountries();
  const name = useMemo(() => {
    const startAddressArr = data?.startAddress.split(" ");
    const stopAddressArr = data?.stopAddress.split(" ");
    const startCountryIso = getByLabel(startAddressArr[startAddressArr.length - 1])?.value;
    const stopCountryIso = getByLabel(stopAddressArr[stopAddressArr.length - 1])?.value;
    let startCityName = "";
    let stopCityName = "";
    if (startAddressArr.length > 1 && stopAddressArr.length > 1) {
      startCityName = startAddressArr[startAddressArr.length - 2].replace(",", " ");
      stopCityName = stopAddressArr[stopAddressArr.length - 2].replace(",", " ");
    }
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <div className="flex flex-row items-center space-x-1">
            <Flag code={startCountryIso} className="w-5 h-5" />
            <p className="text-sm">
              {startCityName}
              {startCountryIso}
            </p>
          </div>
          <div className="flex flex-row items-center space-x-1">
            <Flag code={stopCountryIso} className="w-5 h-5" />
            <p className="text-sm">
              {stopCityName}
              {stopCountryIso}
            </p>
          </div>
        </div>
        <div className="flex flex-col text-sm">
          <div className="flex flex-row items-center space-x-1">
            <p> {format(new Date(data?.pickupTimeStart), "dd/MM")}</p>
            <span>-</span>
            <p> {format(new Date(data?.pickupTimeEnd), "dd/MM")}</p>
          </div>
          <div className="flex flex-row items-center space-x-1">
            <p> {format(new Date(data?.shippingTimeStart), "dd/MM")}</p>
            <span>-</span>
            <p> {format(new Date(data?.shippingTimeEnd), "dd/MM")}</p>
          </div>
        </div>
      </div>
    );
  }, [data, getByLabel]);
  const {hasFavorited, toggleFavorite} = useFavorite({
    orderId: data.id,
    currentUser: currentUser,
  });
  return (
    <div className="w-full border dark:border-dark first:rounded-t-md last:rounded-b-md bg-dark_shadow dark:bg-light_shadow text-light dark:text-dark">
      <div className="relative overflow-hidden">
        <div className="flex flex-row items-center p-4">
          <div onClick={toggleFavorite} className="cursor-pointer">
            {!hasFavorited ? <AiOutlineStar size={24} /> : <AiFillStar size={20} />}
          </div>
          <div
            className="flex flex-row items-center justify-between w-full pl-2 cursor-pointer"
            onClick={() => {
              setOpen(!open);
              setOrder(data);
            }}
          >
            <div className="w-3/4 font-semibold">{name}</div>
            <IoIosArrowDown size={20} className={`${open ? "rotate-180" : ""} `} />
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-500 max-h-0 ${
            open && "max-h-[500px]"
          } h-full`}
        >
          <OrderDetailsCard
            data={data}
            currentUser={currentUser}
            setVariantMobile={setVariantMobile}
            currentCompany={currentCompany}
            companyUsers={companyUsers}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
