"use client";
import Button from "@/app/components/Button";
import Modal from "@/app/components/modals/Modal";
import Avatar from "@/app/dashboard/components/Avatar";
import RatingModal from "@/app/dashboard/settings/components/modals/RatingModal";
import {SafeBet, SafeCompany, SafeUser} from "@/app/types";
import axios from "axios";
import {format} from "date-fns";
import {useRouter} from "next/navigation";
import React, {useCallback, useMemo, useState} from "react";
import toast from "react-hot-toast";
import Flag from "react-world-flags";

interface BetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SafeUser & {company: SafeCompany};
  driver: SafeUser;
  bet: SafeBet;
}

const BetDetailsModal: React.FC<BetDetailsModalProps> = ({isOpen, onClose, user, driver, bet}) => {
  const router = useRouter();
  const name = useMemo(() => {
    if (user.lastName && user.firstName) {
      return `${user.lastName} ${user.firstName}`;
    }
    return user.email;
  }, [user]);

  const driverName = useMemo(() => {
    if (driver.lastName && driver.firstName) {
      return `${driver.lastName} ${driver.firstName}`;
    }
    return driver.email;
  }, [driver]);
  const joinedDate = useMemo(() => {
    if (driver?.createdAt) {
      return format(new Date(driver.createdAt), "PP");
    }
  }, [driver?.createdAt]);
  const [companyDetailsModalOpen, setCompanyDetailsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        userId: user.id,
      })
      .then(() => {
        onClose();
        router.push(`/dashboard/conversations/${user.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [user, router, onClose]);

  const onSubmit = useCallback(() => {
    setIsLoading(true);
    axios
      .post(`/api/order/${bet.orderId}`, {
        isWon: true,
        winningUserId: user.id,
        status: "In progress",
      })
      .then(() => {
        return axios.post(`/api/bet/${bet.id}`, {winningUserId: user.id});
      })
      .then(() => {
        router.refresh();
        toast.success("Order have now a winner!");
        onClose();
      })
      .catch(() => toast.error("Something went wrong."))
      .finally(() => setIsLoading(false));
  }, [bet.orderId, bet.id, user.id, onClose, router]);
  return (
    <>
      <RatingModal
        isOpen={companyDetailsModalOpen}
        onClose={() => setCompanyDetailsModalOpen(false)}
        currentCompany={user.company}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col text-dark">
          <div className="flex flex-row items-center">
            <Avatar url={user ? user.image : null} type="User" />
            <div className="flex flex-col ml-3">
              <h1 className="font-bold">{name}</h1>
              <div
                className="flex flex-row items-center space-x-1 text-sm font-medium cursor-pointer md:text-medium hover:opacity-75"
                onClick={() => {
                  setCompanyDetailsModalOpen(true);
                }}
              >
                <span>Works at</span>
                <span className="underline"> {user.company.companyName}</span>
              </div>
              <div className="flex items-center space-x-2">
                {user?.languages.map((language, index) => (
                  <Flag key={index} code={language} className="w-5 h-5" />
                ))}
              </div>
            </div>
          </div>
          <p className="pt-2 font-bold text-dark_shadow">Bet informations</p>
          <div className="grid grid-cols-2">
            <div className="flex flex-col">
              <label className="text-sm font-light">Driver</label>
              <p className="font-medium">{driverName}</p>
              {driver?.languages.map((language, index) => (
                <Flag key={index} code={language} className="w-5 h-5" />
              ))}
              <time dateTime={joinedDate} className="text-xs font-light">
                Since {joinedDate}
              </time>
            </div>
            <div className="flex flex-col">
              <label className="pt-1 text-sm font-light">Price</label>
              <p className="font-medium">{bet.price}$</p>
            </div>
          </div>
          <h3 className="pt-2 text-sm">
            Not sure yet? Feel free to send them a message if you have any questions or need more
            information.{" "}
            <span onClick={handleClick} className="underline cursor-pointer hover:opacity-75">
              Contact him
            </span>
          </h3>
          <div className="flex items-center justify-end pt-2 gap-x-3">
            <Button disabled={isLoading} type="button" transparent>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onSubmit}>
              Choose
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BetDetailsModal;
