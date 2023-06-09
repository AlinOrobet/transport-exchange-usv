"use client";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {GoogleMap, Marker, DirectionsRenderer, Circle} from "@react-google-maps/api";
import {Libraries, useGoogleMapsScript} from "use-google-maps-script";
import MapDetails from "@/app/components/MapDetails";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type DirectionsResult = google.maps.DirectionsResult;
const libraries: Libraries = ["places"];

interface GoogleMapMultiRouteProps {
  center: number[] | undefined;
  locations: any;
  ordersPrice: number;
  details: boolean;
}

const GoogleMapMultiRoute: React.FC<GoogleMapMultiRouteProps> = ({
  center,
  locations,
  details,
  ordersPrice,
}) => {
  const {isLoaded, loadError} = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries,
  });
  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;
  return <Map center={center} locations={locations} details={details} ordersPrice={ordersPrice} />;
};

export default GoogleMapMultiRoute;

const Map: React.FC<GoogleMapMultiRouteProps> = ({center, locations, details, ordersPrice}) => {
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
    const fetchDirections = (locations: any) => {
      if (!locations) return;

      const startAddressLatLng = {lat: locations[0].lat, lng: locations[0].lng};
      const endAddressLatLng = {
        lat: locations[locations.length - 1].lat,
        lng: locations[locations.length - 1].lng,
      };
      const waypoints = locations.slice(1, locations.length - 2).map((location: any) => ({
        location: {lat: location.lat, lng: location.lng, stopover: true},
      }));
      const service = new google.maps.DirectionsService();
      service.route(
        {
          origin: startAddressLatLng,
          waypoints: waypoints,
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

    fetchDirections(locations);
  }, [locations]);

  const orderDetails = useMemo(() => {
    const distance = directions?.routes[0].legs.reduce((accumulator, leg) => {
      if (leg.distance && leg.distance.text) {
        const distanceValue = parseFloat(leg.distance.text.replace(/[^0-9.]/g, ""));
        if (!isNaN(distanceValue)) {
          return accumulator + distanceValue;
        }
      }
      return accumulator;
    }, 0);
    const time = directions?.routes[0].legs.reduce((accumulator, leg) => {
      if (leg.duration && leg.duration.text) {
        const timeValue = parseFloat(leg.duration.text.replace(/[^0-9.]/g, ""));
        if (!isNaN(timeValue)) {
          return accumulator + timeValue;
        }
      }
      return accumulator;
    }, 0);
    let totalHours, totalMinutes;
    if (time) {
      totalHours = Math.floor(time / 60);
      totalMinutes = Math.ceil(time % 60);
    }
    let consumption = 40;
    const fuelCost = 5;
    let costKm = `${(consumption * fuelCost).toFixed(2)}RON`;
    let profit = "";
    if (distance && ordersPrice) {
      const fuelNeeded = (consumption * distance) / 100;
      const toatlFuelCost = fuelNeeded * fuelCost;
      profit = `${(ordersPrice - toatlFuelCost).toFixed(2)}RON`;
    }
    return {
      distance: `${distance}km` || "0.0km",
      time: `${totalHours} h ${totalMinutes} min` || "0m",
      price: `${ordersPrice}RON` || "0RON",
      profit: profit || "0RON",
      costKm: costKm || "0RON",
    };
  }, [directions, ordersPrice]);
  return (
    <div className="flex flex-col justify-between h-full gap-2">
      <GoogleMap
        zoom={5}
        center={centerMap}
        onLoad={onLoad}
        options={options}
        mapContainerClassName="h-full w-full"
      >
        {directions && (
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
      </GoogleMap>
      {details && <MapDetails orderDetails={orderDetails} companyType="transport" />}
    </div>
  );
};
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
