"use client";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import Pagination from "../components/Pagination";
import Section from "../components/Section";
import qs from "query-string";
import {AiOutlineSearch} from "react-icons/ai";
import ListOfOptions from "../settings/components/ListOfOptions";
import CreateOrderModal from "./components/modals/CreateOrderModal";
import {SafeOrder, SafeUser} from "@/app/types";
import SearchOrderModal from "./components/modals/SearchOrderModal";
import OrderCard from "./components/OrderCard";
import EmptyState from "../conversations/components/EmptyState";
import GoogleMapComp from "@/app/components/GoogleMap";
import ListOfOrders from "./components/ListOfOrders";
import {BiArrowBack} from "react-icons/bi";

interface OrdersClientProps {
  orders: SafeOrder[];
  ordersCount: number;
  currentUser: SafeUser | null;
  totalOrdersCount: number;
}

const OrdersClient: React.FC<OrdersClientProps> = ({
  orders,
  ordersCount,
  currentUser,
  totalOrdersCount,
}) => {
  const [variant, setVariant] = useState<string>("MyOrders");
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
          totalOrdersCount={totalOrdersCount}
          variant={variant}
          setVariant={(variant: string) => setVariant(variant)}
          setOrder={(order: SafeOrder) => setOrder(order)}
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
            totalOrdersCount={totalOrdersCount}
            variant={variant}
            setVariant={(variant: string) => setVariant(variant)}
            setOrder={(order: SafeOrder) => setOrder(order)}
            setVariantMobile={(variant: string) => setVariantMobile(variant)}
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
          />
        )}
      </Section>
    </>
  );
};

export default OrdersClient;
