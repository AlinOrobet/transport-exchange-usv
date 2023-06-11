"use client";
import GoogleMapComp from "@/app/components/GoogleMap";
import Heading from "@/app/components/Heading";
import AddressSelect from "@/app/components/inputs/AddressSelect";
import Input from "@/app/components/inputs/Input";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
import useCreateCompanyModal from "@/app/hooks/useCreateCompanyModal";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useMemo, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";
enum STEPS {
  DETAILS = 0,
  ADDRESS = 1,
}
const CreateCompany = () => {
  const router = useRouter();
  const createCompanyModal = useCreateCompanyModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.DETAILS);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      fiscalCode: "",
      companyName: "",
      address: null,
      latitude: undefined,
      longitude: undefined,
      accountType: "transport",
    },
  });
  const accountType = watch("accountType");
  const fiscalCode = watch("fiscalCode");
  const companyName = watch("companyName");
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

  const onBack = () => {
    setStep((value) => value - 1);
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step !== STEPS.ADDRESS) {
      return onNext();
    }
    setIsLoading(true);
    try {
      const companyData = {
        accountType: data.accountType,
        fiscalCode: data.fiscalCode,
        companyName: data.companyName,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      };
      const res = await axios.post("/api/registerCompany", companyData).catch(() => {
        toast.error("Something went wrong on Register Company");
      });
      const userData = {
        companyId: res?.data.id,
        haveCompanyDetails: true,
      };
      await axios
        .post("/api/editAccount", userData)
        .then(() => {
          toast.success("Success!");
          createCompanyModal.onClose();
          router.push("/dashboard/home");
        })
        .catch(() => {
          toast.error("Something went wrong on Register User");
        });
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  const actionLabel = useMemo(() => {
    if (step === STEPS.ADDRESS) {
      return "Create";
    }

    return "Next";
  }, [step]);
  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.DETAILS) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Account details" />
      <div className="flex items-center space-x-5">
        <div
          onClick={() => setCustomValue("accountType", "transport")}
          className={`h-[4.5rem] w-1/2 rounded-lg font-bold text-center border border-dark ${
            accountType === "transport" ? "bg-dark text-light" : "text-dark dark:text-light"
          } flex items-center justify-center cursor-pointer`}
        >
          Transport
        </div>
        <div
          onClick={() => setCustomValue("accountType", "goods")}
          className={`h-[4.5rem] w-1/2 rounded-lg font-bold text-center border border-dark ${
            accountType === "goods" ? "bg-dark text-light" : "text-dark dark:text-light"
          } flex items-center justify-center cursor-pointer`}
        >
          Goods
        </div>
      </div>
      <Input
        id="companyName"
        value={companyName}
        label="Company name"
        register={register}
        errors={errors}
        required
      />
      <Input
        id="fiscalCode"
        value={fiscalCode}
        label="Fiscal code"
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  if (step === STEPS.ADDRESS) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Where is your company located?" subtitle="Help people find you!" />
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
      </div>
    );
  }
  return (
    <MultiStepModal
      disabled={isLoading}
      isOpen={createCompanyModal.isOpen}
      title="Register"
      actionLabel={actionLabel}
      onClose={createCompanyModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.DETAILS ? undefined : onBack}
      body={bodyContent}
    />
  );
};

export default CreateCompany;
