"use client";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
import React, {useMemo} from "react";
import Section from "../../components/Section";
import OrderCard from "../../orders/components/OrderCard";
import GoogleMapMultiRoute from "./GoogleMapMultiRoute";
import SelectDriver from "./SelectDriver";
interface PlannerProps {
  orders: SafeOrder[];
  drivers: SafeUser[];
  currentUser: SafeUser | null;
  currentCompany: SafeCompany | null;
}

const Planner: React.FC<PlannerProps> = ({orders, drivers, currentUser, currentCompany}) => {
  const locationsState = useMemo(() => {
    const extractedLocations: any[] = [];
    orders.map((order) => {
      const startLocation = {
        address: order.startAddress,
        startPeriod: order.pickupTimeStart,
        endPeriod: order.pickupTimeEnd,
        lat: order.startAddressLat,
        lng: order.startAddressLng,
      };
      const stopLocation = {
        address: order.stopAddress,
        startPeriod: order.shippingTimeStart,
        endPeriod: order.shippingTimeEnd,
        lat: order.stopAddressLat,
        lng: order.stopAddressLng,
      };
      extractedLocations.push(startLocation, stopLocation);
    });
    extractedLocations.sort((a, b) => {
      const startPeriodA = new Date(a.startPeriod);
      const startPeriodB = new Date(b.startPeriod);
      const endPeriodA = new Date(a.endPeriod);
      const endPeriodB = new Date(b.endPeriod);

      if (startPeriodA < startPeriodB) {
        return -1;
      } else if (startPeriodA > startPeriodB) {
        return 1;
      } else {
        if (endPeriodA < endPeriodB) {
          return -1;
        } else if (endPeriodA > endPeriodB) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    if (extractedLocations.length === 0) return {};
    const sumLat = extractedLocations.reduce((acc, location) => {
      return acc + location.lat;
    }, 0);

    const sumLng = extractedLocations.reduce((acc, location) => {
      return acc + location.lng;
    }, 0);
    const centerLat = sumLat / extractedLocations.length;
    const centerLng = sumLng / extractedLocations.length;
    return {
      locations: extractedLocations,
      center: [centerLat, centerLng],
    };
  }, [orders]);
  const ordersPrice = useMemo(() => {
    const totalPrice = orders.reduce((accumulator, order) => {
      return accumulator + order.price;
    }, 0);
    return totalPrice;
  }, [orders]);
  return (
    <>
      <Section fit="hidden xl:inline xl:w-2/5">
        <div className="flex flex-col h-full space-y-2">
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between w-full">
              <h1 className="text-xl font-bold 2xl:text-2xl text-dark_shadow dark:text-light_shadow">
                Planner
              </h1>
            </div>
            <SelectDriver drivers={drivers} />
          </div>
          <div className="flex-1 h-full space-y-2 overflow-y-auto">
            {orders.length === 0 ? (
              <div>No data found</div>
            ) : (
              <div className="w-full h-full gap-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    data={order}
                    currentUser={currentUser}
                    setOrder={() => {}}
                    setVariantMobile={() => {}}
                    currentCompany={currentCompany}
                    companyUsers={[]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
      <Section fit="h-full w-full xl:w-3/5 flex flex-col">
        <GoogleMapMultiRoute
          center={locationsState.center}
          locations={locationsState.locations}
          ordersPrice={ordersPrice}
          details
        />
      </Section>
    </>
  );
};

export default Planner;
