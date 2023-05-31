"use client";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/modals/Modal";
import {SafeBet, SafeOrder, SafeUser} from "@/app/types";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useMemo, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: SafeOrder;
  companyUsers: SafeUser[];
  currentBets: SafeBet[];
}

const BetModal: React.FC<BetModalProps> = ({isOpen, onClose, order, companyUsers, currentBets}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const options = useMemo(() => {
    return companyUsers.map((user) => ({
      id: user.id,
      label:
        user.firstName || user.lastName ? `${user.firstName} ${user.firstName}` : `${user.email}`,
      value: user.id,
    }));
  }, [companyUsers]);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      driver: "",
      price: "",
    },
  });
  const driver = watch("driver");

  const price = watch("price");
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (!data.price && !data.driver) {
      //TODO errors
    }
    const validBet = currentBets.some(
      (bet) => bet.price === parseInt(data.price, 10) && bet.beneficiaryId === data.driver.id
    );
    if (!validBet) {
      axios
        .post("/api/bet", {price: data.price, orderId: order.id, beneficiaryId: data.driver.id})
        .then(() => {
          toast.success("Your bet has been placed.");
          reset();
          onClose();
          router.refresh();
        })
        .catch(() => toast.error("Something went wrong."))
        .finally(() => setIsLoading(false));
    } else {
      toast.error("You already have this type of bid.");
      setIsLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Heading title={`Betting section`} subtitle={`You are betting for ${order.name}`} />
        <Select
          label="Select driver"
          value={driver}
          onChange={(value) => setCustomValue("driver", value)}
          options={options}
        />
        <Input
          id="price"
          label="Your price"
          register={register}
          disabled={isLoading}
          errors={errors}
          value={price}
          small
          required
        />
        <div className="flex items-center justify-end gap-x-3">
          <Button disabled={isLoading} type="button" transparent>
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Confirm
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BetModal;
