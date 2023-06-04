"use client";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
import {useRouter, useSearchParams} from "next/navigation";
import queryString from "query-string";
import React, {useState, useMemo} from "react";
import {AiOutlineSearch} from "react-icons/ai";
import Pagination from "../../components/Pagination";
import EmptyState from "../../conversations/components/EmptyState";
import ListOfOptions from "../../settings/components/ListOfOptions";
import CreateOrderModal from "./modals/CreateOrderModal";
import SearchOrderModal from "./modals/SearchOrderModal";
import OrderCard from "./OrderCard";

interface ListOfOrdersProps {
  orders: SafeOrder[];
  ordersCount: number;
  currentUser: SafeUser | null;
  currentCompany: SafeCompany | null;
  totalOrdersCount: number;
  variant: string;
  setVariant: (variant: string) => void;
  setOrder: (order: SafeOrder) => void;
  setVariantMobile?: (variant: string) => void;
  companyUsers: SafeUser[];
}

const ListOfOrders: React.FC<ListOfOrdersProps> = ({
  orders,
  ordersCount,
  currentUser,
  currentCompany,
  totalOrdersCount,
  variant,
  setVariant,
  setOrder,
  setVariantMobile,
  companyUsers,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const [searchModal, setSearchModal] = useState(false);
  const [createOrderModalOpen, setCreateOrderModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(ordersCount / 10);
  const companyType = useMemo(() => {
    if (currentCompany) {
      return currentCompany.accountType;
    }
    return null;
  }, [currentCompany]);
  return (
    <>
      <CreateOrderModal
        isOpen={createOrderModalOpen}
        onClose={() => setCreateOrderModalOpen(false)}
      />
      <SearchOrderModal isOpen={searchModal} onClose={() => setSearchModal(false)} />{" "}
      <div className="flex flex-col h-full space-y-2">
        <div className="flex flex-col">
          <div className="flex flex-row items-center justify-between w-full">
            <h1 className="text-xl font-bold 2xl:text-2xl text-dark_shadow dark:text-light_shadow">
              Orders
            </h1>
            <div
              onClick={() => {
                const updatedQuery: any = {
                  page: currentPage,
                  variant,
                };
                const url = queryString.stringifyUrl(
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
          {companyType === "goods" && (
            <p
              onClick={() => setCreateOrderModalOpen(true)}
              className="text-sm font-medium underline cursor-pointer hover:opacity-75 w-fit"
            >
              Create new order
            </p>
          )}
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
            const url = queryString.stringifyUrl(
              {
                url: "/dashboard/orders",
                query: updatedQuery,
              },
              {skipNull: true}
            );
            router.push(url);
          }}
          options={
            companyType === "goods"
              ? [
                  {id: 1, label: "My orders", value: "MyOrders"},
                  {id: 2, label: "Company orders", value: "CompanyOrders"},
                  {id: 3, label: "Favorites", value: "Favorites"},
                  {id: 4, label: "Old orders", value: "OldOrders"},
                ]
              : [
                  {id: 1, label: "All Orders", value: "AllOrders"},
                  {id: 2, label: "Favorties", value: "Favorites"},
                ]
          }
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
                  setVariantMobile={setVariantMobile}
                  currentCompany={currentCompany}
                  companyUsers={companyUsers}
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
                  currentQuery = queryString.parse(params.toString());
                }
                const updatedQuery: any = {
                  ...currentQuery,
                  page: current,
                };
                const url = queryString.stringifyUrl(
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
    </>
  );
};

export default ListOfOrders;
