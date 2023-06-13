"use client";
import {SafeBet, SafeCompany, SafeUser} from "@/app/types";
import axios from "axios";
import {formatDistanceToNow} from "date-fns";
import {useRouter} from "next/navigation";
import React, {useCallback, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {FiAlertTriangle} from "react-icons/fi";
import Avatar from "../../components/Avatar";
import ConfirmModal from "../../components/modals/ConfirmModal";
import Edit from "../../settings/components/Edit";
import BetDetailsModal from "./modals/BetDetailsModal";

interface BetCardProps {
  bet: SafeBet;
  user: SafeUser & {company: SafeCompany};
  currentUser?: SafeUser | null;
  isOwnOrder: boolean;
  driver: SafeUser;
}

const BetCard: React.FC<BetCardProps> = ({bet, user, currentUser, isOwnOrder, driver}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const name = useMemo(() => {
    if (user?.firstName && user?.lastName) {
      return user.lastName + " " + user.firstName;
    }
    return user.email.split("@")[0];
  }, [user]);
  const isOwnBet = useMemo(() => {
    return user.id === currentUser?.id;
  }, [user, currentUser]);
  const postedTime = useMemo(() => {
    if (bet?.createdAt) {
      return `${formatDistanceToNow(new Date(bet.createdAt), {addSuffix: true})}`;
    }
    return "";
  }, [bet?.createdAt]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/bet/${bet.id}`)
      .then(() => {
        toast.success("Bet deleted successfully!");
        setConfirmModalOpen(false);
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [router, bet.id]);
  const [showDetailsModalOpen, setDetailsModalOpen] = useState(false);
  return (
    <>
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Delete bet"
        subtitle="Are you sure you want to delete your bet? This action cannot be undone."
        icon={FiAlertTriangle}
        onDelete={onDelete}
        isLoading={isLoading}
      />
      <BetDetailsModal
        isOpen={showDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        user={user}
        driver={driver}
        bet={bet}
      />
      <div className="flex flex-row items-center justify-between w-full h-full p-2">
        <div className="flex flex-row items-center w-3/4">
          <Avatar url={user ? user.company.image : null} type="Company" />
          <div className="flex flex-col w-full ml-3">
            <h1 className="font-bold text-left">{user.company.companyName}</h1>
            <p className="text-sm font-medium">Bet by {name}</p>
            {isOwnOrder || isOwnBet ? (
              <p className="text-sm font-bold">
                <span className="font-normal">Bet :</span> {bet.price}RON
              </p>
            ) : (
              <span>{postedTime}</span>
            )}
          </div>
        </div>
        {isOwnBet ? (
          <Edit label="Delete" onClick={() => setConfirmModalOpen(true)} />
        ) : (
          <div
            onClick={() => setDetailsModalOpen(true)}
            className="text-sm font-light underline cursor-pointer hover:opacity-75"
          >
            Details
          </div>
        )}
      </div>
    </>
  );
};

export default BetCard;
