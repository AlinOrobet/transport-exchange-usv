"use client";
import Button from "@/app/components/Button";
import GoogleMapComp from "@/app/components/GoogleMap";
import Heading from "@/app/components/Heading";
import AddressSelect from "@/app/components/inputs/AddressSelect";
import Modal from "@/app/components/modals/Modal";
import {SafeCompany} from "@/app/types";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: SafeCompany | null;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  isOpen,
  onClose,
  currentCompany,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      address: currentCompany?.address || null,
      latitude: currentCompany?.latitude || undefined,
      longitude: currentCompany?.longitude || undefined,
    },
  });
  const address = watch("address");
  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    axios
      .post("/api/editCompany", data)
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
        <Heading title="Company Details" subtitle="Edit your company details" />
        <AddressSelect
          address={address}
          onSelectAddress={(address, latitude, longitude) => {
            setCustomValue("address", address);
            setCustomValue("latitude", latitude);
            setCustomValue("longitude", longitude);
          }}
          id="address"
        />
        <GoogleMapComp
          center={latitude && longitude ? [latitude, longitude] : undefined}
          zoom={address ? true : false}
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

export default CompanyDetailsModal;
