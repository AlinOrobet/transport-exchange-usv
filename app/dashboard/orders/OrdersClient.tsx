"use client";
import React, {useEffect, useState} from "react";
import Section from "../components/Section";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
import GoogleMapComp from "@/app/components/GoogleMap";
import ListOfOrders from "./components/ListOfOrders";
import {BiArrowBack} from "react-icons/bi";

interface OrdersClientProps {
  orders: SafeOrder[];
  ordersCount: number;
  currentUser: SafeUser | null;
  currentCompany: SafeCompany | null;
  totalOrdersCount: number;
  companyUsers: SafeUser[];
}

const OrdersClient: React.FC<OrdersClientProps> = ({
  orders,
  ordersCount,
  currentUser,
  currentCompany,
  totalOrdersCount,
  companyUsers,
}) => {
  const [variant, setVariant] = useState<string>(
    currentCompany?.accountType === "goods" ? "MyOrders" : "AllOrders"
  );
  const [variantMobile, setVariantMobile] = useState<string>("Orders");
  useEffect(() => {
    const handleResize = () => {
      const isSmallerThanXL = window.matchMedia("(max-width: 1200px)").matches;
      if (!isSmallerThanXL) {
        setVariantMobile("Map");
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [order, setOrder] = useState<SafeOrder | null>(null);
  return (
    <>
      <Section fit="hidden xl:inline xl:w-2/5">
        <ListOfOrders
          orders={orders}
          ordersCount={ordersCount}
          currentUser={currentUser}
          currentCompany={currentCompany}
          totalOrdersCount={totalOrdersCount}
          variant={variant}
          setVariant={(variant: string) => setVariant(variant)}
          setOrder={(order: SafeOrder) => setOrder(order)}
          companyUsers={companyUsers}
        />
      </Section>
      <Section fit="h-full w-full xl:w-3/5 flex flex-col">
        {variantMobile === "Map" && (
          <div className="flex flex-row items-center pb-2 space-x-1 xl:hidden">
            <div
              onClick={() => setVariantMobile("Orders")}
              className="flex items-center justify-center p-2 transition duration-300 rounded-full hover:bg-light dark:hover:bg-dark"
            >
              <BiArrowBack size={20} className="cursor-pointer" />
            </div>
            <div className="text-xl font-bold 2xl:text-2xl text-dark_shadow dark:text-light_shadow">
              Orders
            </div>
          </div>
        )}
        {variantMobile === "Orders" && (
          <ListOfOrders
            orders={orders}
            ordersCount={ordersCount}
            currentUser={currentUser}
            currentCompany={currentCompany}
            totalOrdersCount={totalOrdersCount}
            variant={variant}
            setVariant={(variant: string) => setVariant(variant)}
            setOrder={(order: SafeOrder) => setOrder(order)}
            setVariantMobile={(variant: string) => setVariantMobile(variant)}
            companyUsers={companyUsers}
          />
        )}
        {variantMobile === "Map" && (
          <GoogleMapComp
            center={
              order?.startAddress && order.stopAddress
                ? [
                    (order.startAddressLat + order.stopAddressLat) /
                      (order.startAddressLat === 0 || order.stopAddressLat === 0 ? 1 : 2),
                    (order.startAddressLng + order.stopAddressLng) /
                      (order.startAddressLng === 0 || order.stopAddressLng === 0 ? 1 : 2),
                  ]
                : undefined
            }
            startAddress={
              order?.startAddress ? [order.startAddressLat, order.startAddressLng] : undefined
            }
            endAddress={
              order?.stopAddress ? [order.stopAddressLat, order.stopAddressLng] : undefined
            }
            details
            order={{price: order?.price || undefined, truck: order?.truckCategory || undefined}}
            currentCompany={currentCompany}
          />
        )}
      </Section>
    </>
  );
};

export default OrdersClient;
