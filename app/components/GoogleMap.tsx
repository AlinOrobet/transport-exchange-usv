"use client";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {GoogleMap, Marker, DirectionsRenderer, Circle} from "@react-google-maps/api";
import {Libraries, useGoogleMapsScript} from "use-google-maps-script";
import Details from "./Details";

interface GoogleMapComProps {
  center: number[] | undefined;
  startAddress?: number[];
  endAddress?: number[];
  small?: Boolean;
  zoom?: Boolean;
  range?: number;
  details?: Boolean;
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
  console.log(directions?.routes[0].legs[0]);
  //{directions.routes[0].legs[0]}
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

  return (
    <div className={details ? "flex flex-col justify-between h-full gap-2" : ""}>
      <div className={details ? "h-[calc(100vh-8rem)]" : "h-full"}>
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
              <Circle center={centerMap} radius={range * 100} options={closeOptions} />
            )}
          </GoogleMap>
        </div>
      </div>
      {details && (
        <div className="h-[3rem] flex flex-row items-center justify-around">
          <Details
            label="Distance"
            value={directions?.routes[0].legs[0].distance?.text || "0.0km"}
            col
          />
          <Details label="Time" value={directions?.routes[0].legs[0].duration?.text || "0m"} col />
          <Details label="Cost/KM" value="0.0 $/km" col />
          <Details label="Profit" value="0.0$" col />
          <Details label="Price" value="0.0$" col />
        </div>
      )}
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
