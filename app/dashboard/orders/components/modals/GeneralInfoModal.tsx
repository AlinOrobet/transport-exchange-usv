"use client";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
import {SafeOrder} from "@/app/types";
import React, {useMemo, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {Range} from "react-date-range";
import AddressSelect from "@/app/components/inputs/AddressSelect";
import Heading from "@/app/components/Heading";
import GoogleMapComp from "@/app/components/GoogleMap";
import Calendar from "@/app/components/inputs/Calendar";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
interface GeneralInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: SafeOrder;
}

enum STEPS {
  ADDRESS = 1,
  PICKUP_DATE = 2,
  SHIPPING_DATE = 3,
}

const GeneralInfoModal: React.FC<GeneralInfoModalProps> = ({isOpen, onClose, currentOrder}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.ADDRESS);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    setError,
    reset,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      startAddress: currentOrder.startAddress || null,
      startAddressLat: currentOrder.startAddressLat || undefined,
      startAddressLng: currentOrder.startAddressLng || undefined,
      stopAddress: currentOrder.stopAddress || null,
      stopAddressLat: currentOrder.stopAddressLat || undefined,
      stopAddressLng: currentOrder.stopAddressLng || undefined,
    },
  });

  const startAddress = watch("startAddress");
  const startAddressLat = watch("startAddressLat");
  const startAddressLng = watch("startAddressLng");
  const stopAddress = watch("stopAddress");
  const stopAddressLat = watch("stopAddressLat");
  const stopAddressLng = watch("stopAddressLng");

  const [startDateRange, setStartDateRange] = useState<Range>({
    startDate: currentOrder.pickupTimeStart ? new Date(currentOrder.pickupTimeStart) : new Date(),
    endDate: currentOrder.pickupTimeEnd ? new Date(currentOrder.pickupTimeEnd) : new Date(),
    key: "selection",
  });
  const [endDateRange, setEndDateRange] = useState<Range>({
    startDate: currentOrder.shippingTimeStart
      ? new Date(currentOrder.shippingTimeStart)
      : new Date(),
    endDate: currentOrder.shippingTimeEnd ? new Date(currentOrder.shippingTimeEnd) : new Date(),
    key: "selection",
  });

  const actionLabel = useMemo(() => {
    if (step === STEPS.SHIPPING_DATE) {
      return "Update";
    }
    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.ADDRESS) {
      return undefined;
    }

    return "Back";
  }, [step]);

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.SHIPPING_DATE) {
      return onNext();
    }
    setIsLoading(true);
    axios
      .post(`/api/order/${currentOrder.id}`, {
        ...data,
        pickupTimeStart: startDateRange.startDate,
        pickupTimeEnd: startDateRange.endDate,
        shippingTimeStart: endDateRange.startDate,
        shippingTimeEnd: endDateRange.endDate,
      })
      .then(() => {
        toast.success("Order updated successfully!");
        setStep(STEPS.ADDRESS);
        onClose();
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Enter pickup and destination addresses" subtitle="Type the address" />
      <AddressSelect
        address={startAddress}
        onSelectAddress={(address, latitude, longitude) => {
          setCustomValue("startAddress", address);
          setCustomValue("startAddressLat", latitude);
          setCustomValue("startAddressLng", longitude);
        }}
        // errors={startAddressError}
        id="startAddress"
      />
      <AddressSelect
        address={stopAddress}
        onSelectAddress={(address, latitude, longitude) => {
          setCustomValue("stopAddress", address);
          setCustomValue("stopAddressLat", latitude);
          setCustomValue("stopAddressLng", longitude);
        }}
        //errors={stopAddressError}
        id="stopAddress"
      />
      <GoogleMapComp
        center={
          startAddress && stopAddress
            ? [
                (startAddressLat + stopAddressLat) /
                  (startAddressLat === 0 || stopAddressLat === 0 ? 1 : 2),
                (startAddressLng + stopAddressLng) /
                  (startAddressLng === 0 || stopAddressLng === 0 ? 1 : 2),
              ]
            : undefined
        }
        startAddress={startAddress ? [startAddressLat, startAddressLng] : undefined}
        endAddress={stopAddress ? [stopAddressLat, stopAddressLng] : undefined}
        small
      />
    </div>
  );
  if (step === STEPS.PICKUP_DATE) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="In what period do you want the order to be taken over?"
          subtitle="Select period"
        />
        <Calendar onChange={(value) => setStartDateRange(value.selection)} value={startDateRange} />
      </div>
    );
  }
  if (step === STEPS.SHIPPING_DATE) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="In what period do you want the order to be shipped?"
          subtitle="Select period"
        />
        <Calendar onChange={(value) => setEndDateRange(value.selection)} value={endDateRange} />
      </div>
    );
  }
  return (
    <MultiStepModal
      isOpen={isOpen}
      onClose={onClose}
      disabled={isLoading}
      title="Update Order"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.ADDRESS ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default GeneralInfoModal;
