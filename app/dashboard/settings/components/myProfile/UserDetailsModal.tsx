"use client";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Modal from "@/app/components/modals/Modal";
import {SafeUser} from "@/app/types";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SafeUser | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({isOpen, onClose, currentUser}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      phoneNumber: currentUser?.phoneNumber || "",
    },
  });
  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const phoneNumber = watch("phoneNumber");
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    axios
      .post("/api/editAccount", data)
      .then(() => {
        router.refresh();
        toast.success("Success");
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Heading title="Profile" subtitle="Edit your profile details" />
        <Input
          id="lastName"
          label="Last name"
          disabled={isLoading}
          register={register}
          errors={errors}
          value={lastName}
          small
        />
        <Input
          id="firstName"
          label="First name"
          disabled={isLoading}
          register={register}
          errors={errors}
          value={firstName}
          small
        />
        <Input
          id="phoneNumber"
          label="Phone number"
          disabled={isLoading}
          register={register}
          value={phoneNumber}
          errors={errors}
          small
        />
        <div className="flex items-center justify-end gap-x-3">
          <Button disabled={isLoading} type="button" transparent onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserDetailsModal;
