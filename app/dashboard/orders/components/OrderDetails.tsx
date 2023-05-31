"use client";
import Button from "@/app/components/Button";
import useCountries from "@/app/hooks/useCountries";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
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
import BetCard from "./BetCard";
import BetModal from "./modals/BetModal";
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
  currentCompany?: SafeCompany | null;
  companyUsers: SafeUser[];
  currentUser?: SafeUser | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  data,
  postAuth,
  postedDate,
  pickUpAddress,
  shippingAddress,
  onClose,
  isOwn,
  currentCompany,
  companyUsers,
  currentUser,
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

  const [betModalOpen, setBetModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        userId: data.userId,
      })
      .then(() => {
        onClose();
        router.push(`/dashboard/conversations/${data.userId}`);
      })
      .finally(() => setIsLoading(false));
  }, [data.userId, router, onClose]);

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
      <BetModal
        isOpen={betModalOpen}
        onClose={() => setBetModalOpen(false)}
        order={data}
        companyUsers={companyUsers}
        currentBets={data.bets.filter((bet) => bet.userId === currentUser?.id)}
      />
      <div className="flex flex-col w-full h-full px-4 pt-4 pb-2 dark:text-light text-dark">
        <div className="flex flex-col">
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
          <div className="flex flex-row items-center justify-between w-full pt-2">
            <p className="font-bold text-dark_shadow dark:text-light_shadow">
              General Informations
            </p>
            {isOwn && <Edit label="Edit" onClick={() => setGeneralInfoModalOpen(true)} />}
          </div>
          <div className="grid grid-cols-2 gap-2">
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
          <div className="grid grid-cols-2 gap-2">
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
          <div className="flex flex-row items-center justify-between w-full pt-2">
            <p className="font-bold text-dark_shadow dark:text-light_shadow">Order Details</p>
            {isOwn && <Edit label="Edit" onClick={() => setDetailsInfoModalOpen(true)} />}
          </div>
          <Details
            data={
              currentCompany?.accountType === "transport"
                ? [
                    {id: 1, label: "Height", value: data?.height || 0},
                    {id: 2, label: "Weight", value: data?.weight || 0},
                    {id: 3, label: "Width", value: data?.width || 0},
                    {
                      id: 4,
                      label: "Price",
                      value: data?.price,
                    },
                  ]
                : [
                    {id: 1, label: "Height", value: data?.height || 0},
                    {id: 2, label: "Weight", value: data?.weight || 0},
                    {id: 3, label: "Width", value: data?.width || 0},
                  ]
            }
            numberOfCols={currentCompany?.accountType === "transport" ? false : true}
          />
          <div className="flex flex-col">
            <p className="text-sm font-light">Description</p>
            <p className="text-xs font-medium">{data?.description}</p>
          </div>
          <p className="pt-2 font-bold text-dark_shadow dark:text-light_shadow">
            {!data.isWon && "Bidding people"}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {data?.bets.length === 0 && !data.isWon ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg font-semibold text-center text-dark dark:text-light">
                Oh, it seems like no one has placed a bet for this order yet
              </p>
            </div>
          ) : (
            <>
              {data.isWon && currentUser?.id !== data.userId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-lg font-semibold text-center text-dark dark:text-light">
                    {currentUser?.id !== data.winningUserId ? (
                      "The bidding for this order has concluded. Thank you to all participants for your bids and interest!"
                    ) : (
                      <div className="flex flex-col items-center">
                        <p>
                          Congratulations! You have won this auction! We are excited to inform you
                          that your bid has been selected as the winning one.
                        </p>
                        <p
                          onClick={handleClick}
                          className="pt-2 text-sm underline cursor-pointer hover:opacity-75"
                        >
                          Send message
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="">
                    {data?.bets.map((bet) => (
                      <BetCard
                        key={bet.id}
                        bet={bet}
                        user={bet.user}
                        currentUser={currentUser}
                        isOwnOrder={isOwn}
                        driver={bet.beneficiary}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="flex flex-row items-center w-full gap-3 pt-3">
          {isOwn && (
            <>
              <button onClick={onClose} type="button" className="w-full text-dark dark:text-light">
                Cancel
              </button>
              <Button type="button" danger fullWidth onClick={() => setConfirmModalOpen(true)}>
                Delete
              </Button>
            </>
          )}
          {currentCompany?.accountType === "transport" && !data?.isWon && (
            <>
              <button onClick={onClose} type="button" className="w-full text-dark dark:text-light">
                Cancel
              </button>
              <Button type="button" fullWidth onClick={() => setBetModalOpen(true)}>
                Bet
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
