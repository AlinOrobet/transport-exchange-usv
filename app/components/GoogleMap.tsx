"use client";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {GoogleMap, Marker, DirectionsRenderer, Circle} from "@react-google-maps/api";
import {Libraries, useGoogleMapsScript} from "use-google-maps-script";
import {vehicles} from "../dashboard/orders/components/modals/CreateOrderModal";
import MapDetails from "./MapDetails";
import {SafeCompany} from "../types";

interface GoogleMapComProps {
  center: number[] | undefined;
  startAddress?: number[];
  endAddress?: number[];
  small?: boolean;
  zoom?: boolean;
  range?: number;
  details?: boolean;
  order?: {price: number | undefined; truck: string[] | undefined};
  currentCompany?: SafeCompany | null;
}

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type DirectionsResult = google.maps.DirectionsResult;

const libraries: Libraries = ["places"];

const GoogleMapComp: React.FC<GoogleMapComProps> = ({
  center,
  startAddress,
  endAddress,
  small,
  zoom,
  range,
  details,
  order,
  currentCompany,
}) => {
  const {isLoaded, loadError} = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });
  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;
  return (
    <Map
      center={center}
      startAddress={startAddress}
      endAddress={endAddress}
      small={small}
      zoom={zoom}
      range={range}
      details={details}
      order={order}
      currentCompany={currentCompany}
    />
  );
};

const Map: React.FC<GoogleMapComProps> = ({
  center,
  startAddress,
  endAddress,
  small,
  zoom,
  range,
  details,
  order,
  currentCompany,
}) => {
  const mapRef = useRef<GoogleMap>();
  const onLoad = useCallback((map: any) => (mapRef.current = map), []);
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "b181cac70f27f5e6",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const centerMap = useMemo<LatLngLiteral>(
    () => ({lat: center ? center[0] : 45.9432, lng: center ? center[1] : 24.9668}),
    [center]
  );
  const [directions, setDirections] = useState<DirectionsResult>();
  useEffect(() => {
    const fetchDirections = (startAddress: any, endAddress: any) => {
      if (!startAddress || !endAddress) return;

      const startAddressLatLng = {lat: startAddress[0], lng: startAddress[1]};
      const endAddressLatLng = {lat: endAddress[0], lng: endAddress[1]};
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: startAddressLatLng,
          destination: endAddressLatLng,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          }
        }
      );
    };
    fetchDirections(startAddress, endAddress);
  }, [startAddress, endAddress]);

  const companyType = useMemo(() => {
    if (currentCompany) {
      return currentCompany.accountType;
    }
    return "";
  }, [currentCompany]);

  const orderDetails = useMemo(() => {
    const distance = directions?.routes[0].legs[0].distance?.text;
    const time = directions?.routes[0].legs[0].duration?.text;
    let costKm = "";
    let profit = "";
    let consumption = 0;
    const fuelCost = 5;
    if (order?.truck) {
      const totalConsume = order.truck
        .map((item) => {
          const foundVehicle = vehicles.find((vehicle) => item === vehicle.label);
          return foundVehicle ? foundVehicle.consume : 0;
        })
        .reduce((sum, consume) => sum + consume, 0);
      consumption = totalConsume / 3;
      costKm = `${(consumption * fuelCost).toFixed(2)}$`;
    }
    if (distance && order?.price) {
      const numericDistance = parseFloat(distance.replace(",", ""));
      const fuelNeeded = (consumption * numericDistance) / 100;
      const totalFuelCost = fuelNeeded * fuelCost;
      if (companyType === "goods") {
        profit = `${(order.price - totalFuelCost).toFixed(2)}$`;
      } else {
        profit = `${totalFuelCost.toFixed(2)}$`;
      }
    }
    return {
      distance: distance || "0.0km",
      time: time || "0m",
      price: order?.price ? `${order.price}$` : "0$",
      profit: profit || "0$",
      costKm: costKm || "0$",
    };
  }, [directions?.routes, order, companyType]);

  return (
    <div className="flex flex-col justify-between h-full gap-2">
      <div className={small ? "h-[35vh]" : "h-full rounded-lg"}>
        <GoogleMap
          zoom={zoom ? 16 : 5}
          center={centerMap}
          options={options}
          onLoad={onLoad}
          mapContainerClassName="h-full w-full"
        >
          {center && !startAddress && !endAddress && (
            <Marker position={{lat: center[0], lng: center[1]}} />
          )}
          {startAddress && <Marker position={{lat: startAddress[0], lng: startAddress[1]}} />}
          {endAddress && <Marker position={{lat: endAddress[0], lng: endAddress[1]}} />}
          {startAddress && endAddress && directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}
          {range && center && (
            <Circle center={centerMap} radius={range * 1000} options={closeOptions} />
          )}
        </GoogleMap>
      </div>
      {details && <MapDetails orderDetails={orderDetails} companyType={companyType} />}
    </div>
  );
};

export default GoogleMapComp;
const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
