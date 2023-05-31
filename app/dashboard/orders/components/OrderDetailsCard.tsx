"use client";
import {SafeCompany, SafeOrder, SafeUser} from "@/app/types";
import {format} from "date-fns";
import React, {useMemo, useState} from "react";
import {BiMap} from "react-icons/bi";
import Avatar from "../../components/Avatar";
import ProfileDrawer from "../../components/modals/ProfileDrawer";
import RatingModal from "../../settings/components/modals/RatingModal";
import Details from "../../settings/components/myProfile/Details";
import OrderDetails from "./OrderDetails";

interface OrderDetailsCardProps {
  data: SafeOrder;
  currentUser?: SafeUser | null;
  currentCompany?: SafeCompany | null;
  setVariantMobile?: (variant: string) => void;
  companyUsers: SafeUser[];
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  data,
  currentUser,
  currentCompany,
  setVariantMobile,
  companyUsers,
}) => {
  const postedDate = useMemo(() => {
    if (data?.createdAt) {
      return `at ${format(new Date(data.createdAt), "PP")}`;
    }
    return "";
  }, [data?.createdAt]);
  const postAuth = useMemo(() => {
    return data?.user?.company?.companyName;
  }, [data?.user?.company]);
  const pickUpAddress = useMemo(() => {
    const pickUpAddressArr = data?.startAddress.split(",");
    if (pickUpAddressArr.length > 2) {
      return pickUpAddressArr.slice(0, pickUpAddressArr.length - 1);
    }
    return pickUpAddressArr.join(", ");
  }, [data]);
  const shippingAddress = useMemo(() => {
    const shippingAddressArr = data?.stopAddress.split(",");
    if (shippingAddressArr.length > 2) {
      return shippingAddressArr.slice(0, shippingAddressArr.length - 1);
    }
    return shippingAddressArr.join(", ");
  }, [data]);
  const isOwn = useMemo(() => {
    return data?.userId === currentUser?.id;
  }, [data?.userId, currentUser?.id]);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [companyDetailsModalOpen, setCompanyDetailsModalOpen] = useState(false);
  return (
    <>
      <ProfileDrawer isOpen={detailsDrawerOpen} onClose={() => setDetailsDrawerOpen(false)}>
        <OrderDetails
          onClose={() => setDetailsDrawerOpen(false)}
          data={data}
          postAuth={postAuth}
          postedDate={postedDate}
          pickUpAddress={pickUpAddress}
          shippingAddress={shippingAddress}
          isOwn={isOwn}
          currentCompany={currentCompany}
          companyUsers={companyUsers}
          currentUser={currentUser}
        />
      </ProfileDrawer>
      <RatingModal
        isOpen={companyDetailsModalOpen}
        onClose={() => setCompanyDetailsModalOpen(false)}
        currentCompany={data?.user?.company}
      />
      <div className="flex flex-col w-full h-full px-4 pb-4">
        <div className="relative flex flex-row items-center w-full">
          <Avatar url={data?.image || null} type="Company" />
          <div className="flex flex-col w-3/5 ml-3">
            <h1 className="overflow-hidden font-bold text-left text-ellipsis">{data?.name}</h1>
            <p className="text-sm font-medium">
              Posted by{" "}
              <span
                onClick={() => setCompanyDetailsModalOpen(true)}
                className="underline cursor-pointer"
              >
                {postAuth}
              </span>
            </p>
            <span className="text-xs font-light">{postedDate}</span>
          </div>
          <div className="absolute top-0 right-0 flex flex-col items-end space-y-1">
            <div
              onClick={() => {
                if (setVariantMobile) {
                  setVariantMobile("Map");
                }
              }}
              className="flex flex-row items-center space-x-1 underline cursor-pointer xl:hidden hover:opacity-75"
            >
              <BiMap size={15} />
              <div className="text-sm font-light">Map</div>
            </div>
            <div
              onClick={() => setDetailsDrawerOpen(true)}
              className="text-sm font-light underline cursor-pointer hover:opacity-75"
            >
              Details
            </div>
            {currentCompany?.accountType === "transport" && !data.isWon && (
              <div
                onClick={() => setDetailsDrawerOpen(true)}
                className="text-sm font-light underline cursor-pointer hover:opacity-75"
              >
                Bet
              </div>
            )}
          </div>
        </div>
        <p className="font-bold dark:text-dark_shadow text-light_shadow">Address informations</p>
        <div className="text-light dark:text-dark">
          <Details
            data={[
              {id: 1, label: "Pick up address", value: pickUpAddress},
              {id: 2, label: "Shipping address", value: shippingAddress},
            ]}
          />
        </div>
        <p className="pt-1 font-bold dark:text-dark_shadow text-light_shadow">Order details</p>
        <div className="text-light dark:text-dark">
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
        </div>
      </div>
    </>
  );
};

export default OrderDetailsCard;
