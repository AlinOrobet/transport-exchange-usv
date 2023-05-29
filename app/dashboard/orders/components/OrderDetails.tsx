"use client";
import Button from "@/app/components/Button";
import useCountries from "@/app/hooks/useCountries";
import {SafeOrder} from "@/app/types";
import axios from "axios";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import React, {useCallback, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {FiAlertTriangle} from "react-icons/fi";
import Flag from "react-world-flags";
import Avatar from "../../components/Avatar";
import ConfirmModal from "../../components/modals/ConfirmModal";
import Edit from "../../settings/components/Edit";
import RatingModal from "../../settings/components/modals/RatingModal";
import Details from "../../settings/components/myProfile/Details";
import DetailsInfoModal from "./modals/DetailsInfoModal";
import GeneralInfoModal from "./modals/GeneralInfoModal";

interface OrderDetailsProps {
  onClose: () => void;
  data: SafeOrder;
  postAuth: string;
  postedDate: string;
  pickUpAddress: string | string[];
  shippingAddress: string | string[];
  isOwn: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  data,
  postAuth,
  postedDate,
  pickUpAddress,
  shippingAddress,
  onClose,
  isOwn,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {getByLabel} = useCountries();
  const pickUpName = useMemo(() => {
    const startAddressArr = data?.startAddress.split(" ");
    const startCountryIso = getByLabel(startAddressArr[startAddressArr.length - 1])?.value;
    let startCityName = "";
    if (startAddressArr.length > 1) {
      startCityName = startAddressArr[startAddressArr.length - 2].replace(",", " ");
    }
    return {startCountryIso, startCityName};
  }, [getByLabel, data?.startAddress]);

  const shippingName = useMemo(() => {
    const stopAddressArr = data?.stopAddress.split(" ");
    const stopCountryIso = getByLabel(stopAddressArr[stopAddressArr.length - 1])?.value;
    let stopCityName = "";
    if (stopCityName.length > 1) {
      stopCityName = stopAddressArr[stopAddressArr.length - 2].replace(",", " ");
    }
    return {stopCountryIso, stopCityName};
  }, [getByLabel, data?.stopAddress]);
  const [companyDetailsModalOpen, setCompanyDetailsModalOpen] = useState(false);
  const [generalInfoModalOpen, setGeneralInfoModalOpen] = useState(false);
  const [detailsInfoModalOpen, setDetailsInfoModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/order/${data?.id}`)
      .then(() => {
        toast.success("Order deleted successfully!");
        onClose();
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [router, data?.id, onClose]);
  return (
    <>
      <RatingModal
        isOpen={companyDetailsModalOpen}
        onClose={() => setCompanyDetailsModalOpen(false)}
        currentCompany={data?.user?.company}
      />
      <GeneralInfoModal
        isOpen={generalInfoModalOpen}
        onClose={() => setGeneralInfoModalOpen(false)}
        currentOrder={data}
      />
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Delete order"
        subtitle="Are you sure you want to delete your order? This action cannot be undone."
        icon={FiAlertTriangle}
        onDelete={onDelete}
        isLoading={isLoading}
      />
      <DetailsInfoModal
        isOpen={detailsInfoModalOpen}
        onClose={() => setDetailsInfoModalOpen(false)}
        currentOrder={data}
      />
      <div className="flex flex-col w-full h-full px-4 pt-4 dark:text-light text-dark">
        <div className="flex flex-col items-center w-full">
          <Avatar url={data?.image || null} type="Company" large />
          <h1 className="text-xl font-bold text-center text-dark_shadow dark:text-light_shadow">
            {data?.name}
          </h1>
          <p className="font-semibold">
            Posted by{" "}
            <span
              onClick={() => setCompanyDetailsModalOpen(true)}
              className="underline cursor-pointer"
            >
              {postAuth}
            </span>
          </p>
          <span className="text-sm font-medium">{postedDate}</span>
        </div>
        <div className="flex flex-row items-center justify-between w-full pt-3">
          <p className="font-bold text-dark_shadow dark:text-light_shadow">General Informations</p>
          {isOwn && <Edit label="Edit" onClick={() => setGeneralInfoModalOpen(true)} />}
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="flex flex-col">
            <p className="text-sm font-light">Pick up address</p>
            <div className="flex flex-row items-center space-x-1">
              <Flag code={pickUpName.startCountryIso} className="w-5 h-5" />
              <p className="text-sm font-medium">
                {pickUpName.startCityName} {pickUpName.startCountryIso}
              </p>
            </div>
            <p className="text-sm font-medium">{pickUpAddress}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-light">Shipping address</p>
            <div className="flex flex-row items-center space-x-1">
              <Flag code={shippingName.stopCountryIso} className="w-5 h-5" />
              <p className="text-sm font-medium">
                {shippingName.stopCityName} {shippingName.stopCountryIso}
              </p>
            </div>
            <p className="text-sm font-medium">{shippingAddress}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="flex flex-col">
            <p className="text-sm font-light">Pick up period</p>
            <div className="flex flex-row items-center space-x-1">
              <p> {format(new Date(data?.pickupTimeStart), "dd/MM")}</p>
              <span>-</span>
              <p> {format(new Date(data?.pickupTimeEnd), "dd/MM")}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-light">Shipping period</p>
            <div className="flex flex-row items-center space-x-1">
              <p> {format(new Date(data?.shippingTimeStart), "dd/MM")}</p>
              <span>-</span>
              <p> {format(new Date(data?.shippingTimeEnd), "dd/MM")}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between w-full pt-3">
          <p className="font-bold text-dark_shadow dark:text-light_shadow">Order Details</p>
          {isOwn && <Edit label="Edit" onClick={() => setDetailsInfoModalOpen(true)} />}
        </div>
        <Details
          data={[
            {id: 1, label: "Height", value: data?.height},
            {id: 2, label: "Weight", value: data?.weight},
            {id: 3, label: "Width", value: data?.width},
          ]}
          numberOfCols
        />
        <div className="flex flex-col">
          <p className="text-sm font-light">Description</p>
          <p className="text-xs font-medium">{data?.description}</p>
        </div>
        {isOwn && (
          <>
            <p className="pt-3 font-bold text-dark_shadow dark:text-light_shadow">Bidding people</p>
            <div className="w-full h-full overflow-y-auto bg-red-300"></div>
            <div className="flex flex-row items-center w-full gap-3 pt-3">
              <button onClick={onClose} type="button" className="w-full text-dark dark:text-light">
                Cancel
              </button>
              <Button type="button" danger fullWidth onClick={() => setConfirmModalOpen(true)}>
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OrderDetails;
