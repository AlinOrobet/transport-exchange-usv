"use client";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
import React, {useEffect, useMemo, useState} from "react";
import {Libraries, useGoogleMapsScript} from "use-google-maps-script";
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
const libraries: Libraries = ["places"];

const RenderPlanner: React.FC<PlannerProps> = ({orders, drivers, currentUser, currentCompany}) => {
  const {isLoaded, loadError} = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });
  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;
  return (
    <Planner
      orders={orders}
      drivers={drivers}
      currentCompany={currentCompany}
      currentUser={currentUser}
    />
  );
};
export default RenderPlanner;
const Planner: React.FC<PlannerProps> = ({orders, drivers, currentUser, currentCompany}) => {
  const extractedLocations = useMemo(() => {
    return orders.flatMap((order) => [
      {
        address: order.startAddress,
        startPeriod: order.pickupTimeStart,
        endPeriod: order.pickupTimeEnd,
        lat: order.startAddressLat,
        lng: order.startAddressLng,
      },
      {
        address: order.stopAddress,
        startPeriod: order.shippingTimeStart,
        endPeriod: order.shippingTimeEnd,
        lat: order.stopAddressLat,
        lng: order.stopAddressLng,
      },
    ]);
  }, [orders]);

  const sortedLocations = useMemo(() => {
    return [...extractedLocations].sort((a, b) => {
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
  }, [extractedLocations]);
  function convertDurationToMinutes(durationText: string) {
    const durationParts = durationText.split(" ");

    let totalMinutes = 0;

    for (let i = 0; i < durationParts.length; i += 2) {
      const value = parseInt(durationParts[i]);
      const unit = durationParts[i + 1];

      if (unit.includes("day")) {
        totalMinutes += value * 24 * 60;
      } else if (unit.includes("hour")) {
        totalMinutes += value * 60;
      } else if (unit.includes("min")) {
        totalMinutes += value;
      }
    }

    return totalMinutes;
  }
  const [calculatedDurations, setCalculatedDurations] = useState<number[]>([]);
  const [validatedOrders, setValidatedOrders] = useState<any[]>([]);

  useEffect(() => {
    const calculateDurations = async () => {
      const newDurations: number[] = [];
      for (let i = 0; i < sortedLocations.length - 1; i++) {
        const startLocation = sortedLocations[i];
        const endLocation = sortedLocations[i + 1];

        const directionsService = new google.maps.DirectionsService();
        const request = {
          origin: new google.maps.LatLng(startLocation.lat, startLocation.lng),
          destination: new google.maps.LatLng(endLocation.lat, endLocation.lng),
          travelMode: google.maps.TravelMode.DRIVING,
        };

        await new Promise<void>((resolve) => {
          directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              const duration = result?.routes[0]?.legs[0]?.duration?.text;
              duration ? newDurations.push(convertDurationToMinutes(duration)) : null;
            }
            resolve();
          });
        });
      }

      setCalculatedDurations(newDurations);
    };
    const checkTransportFeasibility = () => {
      const okOrders: any[] = [];
      for (let i = 0; i < sortedLocations.length - 1; i++) {
        const currentLocation = sortedLocations[i];
        const nextLocation = sortedLocations[i + 1];
        const travelTime = calculatedDurations[i] * 60 * 1000;

        const pickUpStartDate = new Date(currentLocation.startPeriod);
        const pickUpEndDate = new Date(currentLocation.endPeriod);
        const deliveryStartDate = new Date(nextLocation.startPeriod);
        const deliveryEndDate = new Date(nextLocation.endPeriod);

        let ok = false;
        for (let i = pickUpStartDate.getDate(); i <= pickUpEndDate.getDate(); i++) {
          const preluare: Date = new Date(i);
          const livrare: Date = new Date(preluare.getTime() + travelTime);
          if (livrare >= deliveryStartDate && livrare <= deliveryEndDate) {
            ok = true;
            break;
          }
        }
        if (ok) {
          okOrders.push(currentLocation);
        }
      }
      setValidatedOrders(okOrders);
    };

    calculateDurations();
    checkTransportFeasibility();
  }, [sortedLocations, calculatedDurations]);

  const sumLat = sortedLocations.reduce((acc, location) => {
    return acc + location.lat;
  }, 0);

  const sumLng = sortedLocations.reduce((acc, location) => {
    return acc + location.lng;
  }, 0);

  const centerLat = sortedLocations.length > 0 ? sumLat / sortedLocations.length : 0;
  const centerLng = sortedLocations.length > 0 ? sumLng / sortedLocations.length : 0;

  const ordersPrice = orders.reduce((accumulator, order) => {
    return accumulator + order.price;
  }, 0);

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
          <div className="">All orders details</div>
        </div>
      </Section>
      <Section fit="h-full w-full xl:w-3/5 flex flex-col">
        <GoogleMapMultiRoute
          center={[centerLat, centerLng]}
          locations={extractedLocations}
          ordersPrice={ordersPrice}
          details
        />
      </Section>
    </>
  );
};
