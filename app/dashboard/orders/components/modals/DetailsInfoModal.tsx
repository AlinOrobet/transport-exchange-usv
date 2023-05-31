"use client";
import Heading from "@/app/components/Heading";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
import {SafeOrder} from "@/app/types";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useMemo, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {vehicles} from "./CreateOrderModal";

interface DetailsInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOrder: SafeOrder;
}

enum STEPS {
  TRUCK = 1,
  DETAILS = 2,
  SIZES = 3,
}

const DetailsInfoModal: React.FC<DetailsInfoModalProps> = ({isOpen, onClose, currentOrder}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.TRUCK);
  const [truckCategory, setTruckCategory] = useState<string[]>(currentOrder?.truckCategory || []);
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
      name: currentOrder.name || "",
      description: currentOrder.description || "",
      image: currentOrder.image || "",
      price: currentOrder.price || "",
      weight: currentOrder.weight || "",
      width: currentOrder.width || "",
      height: currentOrder.height || "",
    },
  });
  const name = watch("name");
  const description = watch("description");
  const image = watch("image");
  const price = watch("price");
  const weight = watch("weight");
  const width = watch("width");
  const height = watch("height");
  const actionLabel = useMemo(() => {
    if (step === STEPS.SIZES) {
      return "Create";
    }
    return "Next";
  }, [step]);
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.TRUCK) {
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
    if (step !== STEPS.SIZES) {
      return onNext();
    }
    setIsLoading(true);
    axios
      .post(`/api/order/${currentOrder.id}`, {
        ...data,
        truckCategory: truckCategory,
      })
      .then(() => {
        toast.success("Order updated successfully!");
        setStep(STEPS.TRUCK);
        onClose();
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };
  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Which of these vehicles describes your order?"
        subtitle="Pick a category (Optional)"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="col-span-1">
            <CategoryInput
              onClick={(category) => {
                if (!truckCategory.includes(category)) {
                  setTruckCategory((current) => [...current, category]);
                } else {
                  setTruckCategory((current) => current.filter((item) => item !== category));
                }
              }}
              selected={truckCategory.includes(vehicle.label)}
              label={vehicle.label}
              icon={vehicle.icon}
            />
          </div>
        ))}
      </div>
    </div>
  );
  if (step === STEPS.DETAILS) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Listing your items for transport"
          subtitle="A guide to describing your transported objects"
        />
        <Input
          id="name"
          label="Order Name"
          register={register}
          errors={errors}
          value={name}
          small
        />
        <Input
          id="price"
          label="Price"
          register={register}
          errors={errors}
          value={price}
          small
          type="number"
        />
        <ImageUpload
          label="Order image"
          value={image}
          onChange={(image) => setCustomValue("image", image)}
          small
        />
      </div>
    );
  }
  if (step === STEPS.SIZES) {
    bodyContent = (
      <div className="flex flex-col gap-2">
        <Heading title="List dimensions for order" subtitle="Enter dimensions for order" />
        <Input
          id="weight"
          label="Weight"
          register={register}
          errors={errors}
          value={weight}
          small
          type="number"
        />
        <Input
          id="width"
          label="Width"
          register={register}
          errors={errors}
          value={width}
          small
          type="number"
        />
        <Input
          id="height"
          label="Height"
          register={register}
          errors={errors}
          value={height}
          small
          type="number"
        />
        <TextArea
          id="description"
          register={register}
          errors={errors}
          value={description}
          label="Description"
        />
      </div>
    );
  }
  return (
    <MultiStepModal
      isOpen={isOpen}
      onClose={onClose}
      disabled={isLoading}
      title="Update Order Details"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.TRUCK ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default DetailsInfoModal;
