import getCompanyUsers from "@/app/actions/getCompanyUsers";
import getCurrentCompany from "@/app/actions/getCurrentCompany";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getOrders, {IOrdersParams} from "@/app/actions/getOrders";
import React from "react";
import OrdersClient from "./OrdersClient";

interface OrdersProps {
  searchParams: IOrdersParams;
}

const OrdersPage = async ({searchParams}: OrdersProps) => {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  const {orders, count, totalCount} = await getOrders({
    ...searchParams,
    currentUser: currentUser,
    currentCompany: currentCompany,
  });
  const companyUsers = await getCompanyUsers();
  return (
    <>
      <OrdersClient
        orders={orders}
        ordersCount={count}
        totalOrdersCount={totalCount}
        currentUser={currentUser}
        currentCompany={currentCompany}
        companyUsers={companyUsers}
      />
    </>
  );
};

export default OrdersPage;
