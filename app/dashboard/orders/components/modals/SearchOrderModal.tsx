"use client";
import React, {useCallback, useMemo, useState} from "react";
import {Range} from "react-date-range";
import {useRouter} from "next/navigation";
import {formatISO} from "date-fns";
import Heading from "@/app/components/Heading";
import {vehicles} from "./CreateOrderModal";
import CategoryInput from "@/app/components/inputs/CategoryInput";
import AddressSelect from "@/app/components/inputs/AddressSelect";
import GoogleMapComp from "@/app/components/GoogleMap";
import Calendar from "@/app/components/inputs/Calendar";
import Counter from "@/app/components/inputs/Counter";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
import queryString from "query-string";
enum STEPS {
  TRUCK = 0,
  LOCATION = 1,
  PERIOD = 2,
}

interface SearchOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const SearchOrderModal: React.FC<SearchOrderModalProps> = ({isOpen, onClose}) => {
  const router = useRouter();
  const [step, setStep] = useState(STEPS.TRUCK);
  const [truckCategory, setTruckCategory] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [addressLat, setAddressLat] = useState<number | undefined>();
  const [addressLng, setAddressLng] = useState<number | undefined>();
  const [range, setRange] = useState(0);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.PERIOD) {
      return onNext();
    }
    const updatedQuery: any = {};

    let truckCategoryQuery: string = "";
    if (truckCategory && truckCategory.length > 0) {
      for (let i = 0; i < truckCategory.length; i++) {
        truckCategoryQuery += truckCategory[i] + "/";
      }
    }
    if (truckCategoryQuery) {
      updatedQuery.truckCategory = truckCategoryQuery;
    }
    if (address && addressLat && addressLng) {
      updatedQuery.address = address;
      updatedQuery.addressLat = addressLat;
      updatedQuery.addressLng = addressLng;
    }
    if (dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if (dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }
    if (range) {
      updatedQuery.range = range;
    }
    const url = queryString.stringifyUrl(
      {
        url: "/dashboard/orders",
        query: updatedQuery,
      },
      {skipNull: true}
    );

    setStep(STEPS.TRUCK);
    setTruckCategory([]);
    setAddressLat(undefined);
    setAddressLng(undefined);
    setAddress("");
    setRange(0);
    setDateRange(initialDateRange);
    onClose();
    router.push(url);
  }, [step, router, truckCategory, onClose, dateRange, address, addressLat, addressLng, range]);
  const actionLabel = useMemo(() => {
    if (step === STEPS.PERIOD) {
      return "Search";
    }

    return "Next";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.TRUCK) {
      return undefined;
    }

    return "Back";
  }, [step]);
  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Which of these vehicles describes your order?" subtitle="Pick a category" />
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
  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="In which area do you want to search?" subtitle="Type the location" />
        <AddressSelect
          address={address}
          onSelectAddress={(address, latitude, longitude) => {
            setAddress(address);
            setAddressLat(latitude);
            setAddressLng(longitude);
          }}
          id="address"
        />
        <Counter onChange={(value) => setRange(value)} value={range} title="Range (km)" />
        <GoogleMapComp
          center={addressLat && addressLng ? [addressLat, addressLng] : undefined}
          range={range}
          zoom={addressLat && addressLng ? true : false}
          small
        />
      </div>
    );
  }
  if (step === STEPS.PERIOD) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="In what period are you looking for orders?" subtitle="Select period" />
        <Calendar onChange={(value) => setDateRange(value.selection)} value={dateRange} />
      </div>
    );
  }
  return (
    <MultiStepModal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Order"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.TRUCK ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default SearchOrderModal;
