"use client";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";
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
  const router = useRouter();
  const params = useSearchParams();

  const [searchModal, setSearchModal] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);

  const [variant, setVariant] = useState<string>("MyOrders");

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ordersCount / 10);

  const [order, setOrder] = useState<SafeOrder | null>(null);
  return (
    <>
      <CreateOrderModal
        isOpen={createOrderModalOpen}
        onClose={() => setCreateOrderModalOpen(false)}
      />
      <SearchOrderModal isOpen={searchModal} onClose={() => setSearchModal(false)} />
      <Section fit="hidden xl:inline xl:w-2/5">
        <div className="flex flex-col h-full space-y-2">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="text-xl font-bold 2xl:text-2xl text-dark_shadow dark:text-light_shadow">
                Orders
              </div>
              <div
                onClick={() => {
                  const updatedQuery: any = {
                    page: currentPage,
                    variant,
                  };
                  const url = qs.stringifyUrl(
                    {
                      url: "/dashboard/orders",
                      query: updatedQuery,
                    },
                    {skipNull: true}
                  );
                  router.push(url);
                  setSearchModal(true);
                }}
                className="p-1.5 rounded-full bg-dark_shadow dark:bg-light_shadow hover:opacity-75"
              >
                <AiOutlineSearch className="cursor-pointer dark:text-dark text-light" size={18} />
              </div>
            </div>
            <p
              onClick={() => setCreateOrderModalOpen(true)}
              className="text-sm font-medium underline cursor-pointer hover:opacity-75 w-fit"
            >
              Create new order
            </p>
          </div>
          <ListOfOptions
            variant={variant}
            setVariant={(variant) => {
              setVariant(variant);
              // let currentQuery = {};
              // if (params) {
              //   currentQuery = qs.parse(params.toString());
              // }
              const updatedQuery: any = {
                variant: variant,
              };
              const url = qs.stringifyUrl(
                {
                  url: "/dashboard/orders",
                  query: updatedQuery,
                },
                {skipNull: true}
              );
              router.push(url);
            }}
            options={[
              {id: 1, label: "My orders", value: "MyOrders"},
              {id: 2, label: "Company orders", value: "CompanyOrders"},
              {id: 3, label: "Favorites", value: "Favorites"},
            ]}
          />
          <div className="flex-1 h-full pt-2 space-y-2 overflow-y-auto">
            {ordersCount === 0 ? (
              <EmptyState variant={variant} searchNotFound={totalOrdersCount !== ordersCount} />
            ) : (
              <div className="w-full h-full gap-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    data={order}
                    currentUser={currentUser}
                    setOrder={(order: SafeOrder) => setOrder(order)}
                  />
                ))}
              </div>
            )}
          </div>
          {ordersCount === 0 ? null : (
            <div className="flex items-center justify-center w-full pt-2">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onChange={(current: number) => {
                  setCurrentPage(current);
                  let currentQuery = {};
                  if (params) {
                    currentQuery = qs.parse(params.toString());
                  }
                  const updatedQuery: any = {
                    ...currentQuery,
                    page: current,
                  };
                  const url = qs.stringifyUrl(
                    {
                      url: "/dashboard/orders",
                      query: updatedQuery,
                    },
                    {skipNull: true}
                  );
                  router.push(url);
                }}
              />
            </div>
          )}
        </div>
      </Section>
      <Section fit="h-full w-full xl:w-3/5">
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
          endAddress={order?.stopAddress ? [order.stopAddressLat, order.stopAddressLng] : undefined}
          details
          order={{price: order?.price || undefined, truck: order?.truckCategory || undefined}}
        />
      </Section>
    </>
  );
};

export default OrdersClient;
