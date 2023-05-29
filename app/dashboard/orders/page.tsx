import getCurrentUser from "@/app/actions/getCurrentUser";
import getOrders, {IOrdersParams} from "@/app/actions/getOrders";
import React from "react";
import OrdersClient from "./OrdersClient";

interface OrdersProps {
  searchParams: IOrdersParams;
}

const OrdersPage = async ({searchParams}: OrdersProps) => {
  const {orders, count, totalCount} = await getOrders({...searchParams});
  const currentUser = await getCurrentUser();
  return (
    <>
      <OrdersClient
        orders={orders}
        ordersCount={count}
        totalOrdersCount={totalCount}
        currentUser={currentUser}
      />
    </>
  );
};

export default OrdersPage;
