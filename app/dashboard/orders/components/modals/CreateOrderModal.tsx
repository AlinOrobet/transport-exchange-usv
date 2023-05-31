"use client";
import GoogleMapComp from "@/app/components/GoogleMap";
import Heading from "@/app/components/Heading";
import AddressSelect from "@/app/components/inputs/AddressSelect";
import Calendar from "@/app/components/inputs/Calendar";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Input from "@/app/components/inputs/Input";
import TextArea from "@/app/components/inputs/TextArea";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
import React, {useMemo, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {AiFillCar} from "react-icons/ai";
import {FaRegSnowflake, FaShuttleVan, FaTruck, FaTruckMoving} from "react-icons/fa";
import {GiMineTruck, GiOilDrum, GiTowTruck} from "react-icons/gi";
import {Range} from "react-date-range";
import axios from "axios";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

enum STEPS {
  TRUCK = 1,
  DETAILS = 2,
  SIZES = 3,
  ADDRESS = 4,
  PICKUP_DATE = 5,
  SHIPPING_DATE = 6,
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({isOpen, onClose}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.TRUCK);
  const [truckCategory, setTruckCategory] = useState<string[]>([]);
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
      name: "",
      description: "",
      image: "",
      price: "",
      weight: "",
      width: "",
      height: "",
      startAddress: null,
      startAddressLat: undefined,
      startAddressLng: undefined,
      stopAddress: null,
      stopAddressLat: undefined,
      stopAddressLng: undefined,
    },
  });
  const name = watch("name");
  const description = watch("description");
  const image = watch("image");
  const price = watch("price");
  const weight = watch("weight");
  const width = watch("width");
  const height = watch("height");
  const startAddress = watch("startAddress");
  const startAddressLat = watch("startAddressLat");
  const startAddressLng = watch("startAddressLng");
  const stopAddress = watch("stopAddress");
  const stopAddressLat = watch("stopAddressLat");
  const stopAddressLng = watch("stopAddressLng");
  const [startDateRange, setStartDateRange] = useState<Range>(initialDateRange);
  const [endDateRange, setEndDateRange] = useState<Range>(initialDateRange);

  const actionLabel = useMemo(() => {
    if (step === STEPS.SHIPPING_DATE) {
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
    if (step !== STEPS.SHIPPING_DATE) {
      return onNext();
    }
    setIsLoading(true);
    axios
      .post("/api/order", {
        ...data,
        truckCategory: truckCategory,
        pickupTimeStart: startDateRange.startDate,
        pickupTimeEnd: startDateRange.endDate,
        shippingTimeStart: endDateRange.startDate,
        shippingTimeEnd: endDateRange.endDate,
      })
      .then(() => {
        toast.success("Order created successfully!");
        reset();
        setStartDateRange(initialDateRange);
        setEndDateRange(initialDateRange);
        setStep(STEPS.TRUCK);
        setTruckCategory([]);
        onClose();
        router.push("/dashboard/orders");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
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
  if (step === STEPS.ADDRESS) {
    bodyContent = (
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
  }
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
      title="Create Order"
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.TRUCK ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default CreateOrderModal;
export const vehicles = [
  {
    id: 1,
    label: "Car",
    icon: AiFillCar,
    description: "A four-wheeled vehicle typically used for personal transportation.",
    consume: 12,
  },
  {
    id: 2,
    label: "Van",
    icon: FaShuttleVan,
    description:
      "A vehicle with a higher roof and longer body than a car, typically used for transporting goods or people.",
    consume: 15,
  },
  {
    id: 3,
    label: "Truck",
    icon: FaTruck,
    description:
      "A large vehicle used for transporting goods, often with an open cargo area at the back.",
    consume: 40,
  },
  {
    id: 4,
    label: "Refrigerated truck",
    icon: FaRegSnowflake,
    description:
      "A truck with a refrigerated cargo area used for transporting perishable goods at low temperatures.",
    consume: 40,
  },
  {
    id: 5,
    label: "Tank truck",
    icon: GiOilDrum,
    description:
      "	A truck with a tank for transporting liquids or gases, such as fuel, water, or chemicals.",
    consume: 50,
  },
  {
    id: 6,
    label: "Dump truck",
    icon: GiMineTruck,
    description:
      "A heavy-duty truck with a rear-mounted open-box bed that can be raised at the front end to dump the contents.",
    consume: 40,
  },
  {
    id: 7,
    label: "Tow truck",
    icon: GiTowTruck,
    description:
      "Trailer truck, used to transport other vehicles, which are broken down or involved in an accident",
    consume: 25,
  },
  {
    id: 8,
    label: "Flatbed truck",
    icon: FaTruckMoving,
    description:
      "A truck with an open cargo area and no sides or roof, used for carrying heavy or oversized items.",
    consume: 35,
  },
];
