"use client";
import React from "react";

interface MapDetailsProps {
  orderDetails: {
    distance: string;
    time: string;
    price: string;
    profit: string;
    costKm: string;
  };
  companyType: string;
}

interface DetailsProps {
  label: string;
  value: string;
}

const Details: React.FC<DetailsProps> = ({label, value}) => {
  return (
    <div className="flex flex-col">
      <label className="font-light text-dark dark:text-light">{label}</label>
      <p className="font-normal">{value}</p>
    </div>
  );
};

const MapDetails: React.FC<MapDetailsProps> = ({orderDetails, companyType}) => {
  return (
    <div className="grid grid-cols-3 grid-rows-2 gap-x-3 sm:flex sm:flex-row sm:items-center sm:justify-between sm:w-full sm:space-x-2 md:space-x-5">
      <Details label="Distance" value={orderDetails.distance} />
      <Details label="Time" value={orderDetails.time} />
      <div className="hidden sm:inline">
        <Details label="Max Cost/100KM" value={orderDetails.costKm} />
      </div>
      <div className="sm:hidden">
        <Details
          label={companyType === "goods" ? "Real price" : "Profit"}
          value={orderDetails.profit}
        />
      </div>
      <div className="inline sm:hidden">
        <Details label="Max Cost/100KM" value={orderDetails.costKm} />
      </div>
      <Details label="Price" value={orderDetails.price} />
      <div className="hidden sm:inline">
        <Details
          label={companyType === "goods" ? "Real price" : "Profit"}
          value={orderDetails.profit}
        />
      </div>
    </div>
  );
};

export default MapDetails;
