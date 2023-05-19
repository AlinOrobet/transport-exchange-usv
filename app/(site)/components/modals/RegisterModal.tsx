"use client";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import React, {useState, useMemo, useCallback} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import {AiFillLock} from "react-icons/ai";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import AddressSelect from "@/app/components/inputs/AddressSelect";
import GoogleMapComp from "@/app/components/GoogleMap";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
enum STEPS {
  ACCOUNT = 0,
  VERIFY_EMAIL = 1,
  DETAILS = 2,
  ADDRESS = 3,
}

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.ACCOUNT);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      verifyEmail: "",
      fiscalCode: "",
      companyName: "",
      address: null,
      latitude: undefined,
      longitude: undefined,
      accountType: "transport",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const verifyEmail = watch("verifyEmail");
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

  const [code, setCode] = useState("");

  const sendEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/sendEmail", {email: email});
      setCode(res.data);
      return res.data;
    } catch (error) {
      toast.error("Something went wrong.");
      setError("email", {type: "manual", message: "Email has been used"});
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step === STEPS.ACCOUNT) {
      const res = await sendEmail(data.email);
      if (res === undefined) {
        setIsLoading(false);
        return;
      } else {
        setCode(res);
        setIsLoading(false);
        return onNext();
      }
    } else if (step === STEPS.VERIFY_EMAIL) {
      try {
        setIsLoading(true);
        await axios.post("/api/verifyEmail", {verifyEmail: data.verifyEmail, code});
        toast.success("Success!");
        return onNext();
      } catch (error) {
        toast.error("Something went wrong.");
        setError("verifyEmail", {type: "manual", message: "Verify code is not correct!"});
        return;
      } finally {
        setIsLoading(false);
      }
    } else if (step !== STEPS.ADDRESS) {
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
        email: data.email,
        password: data.password,
      };
      await axios
        .post("/api/register", userData)
        .then(() => {
          toast.success("Succes!");
          registerModal.onClose();
          loginModal.onOpen();
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
    if (step === STEPS.ACCOUNT) {
      return undefined;
    }

    return "Back";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to CargoConnect" subtitle="Register your company!" />
      <Input
        id="email"
        label="Email"
        type="email"
        value={email}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        value={password}
        label="Password"
        type={showPassword ? "text" : "password"}
        icon={AiFillLock}
        onClickIcon={() => setShowPassword(!showPassword)}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const toggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [loginModal, registerModal]);

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div className="font-light text-center text-neutral-500 dark:text-neutral-100">
        <div className="flex flex-row items-center justify-center">
          <div className="text-dark">
            Already have an account?{" "}
            <span onClick={toggle} className="underline cursor-pointer text-dark">
              Log in
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (step === STEPS.VERIFY_EMAIL) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Verify Email" subtitle="Please enter the code sent to your email" />
        <Input
          id="verifyEmail"
          value={verifyEmail}
          label="Enter code"
          register={register}
          errors={errors}
          required
        />
        <p className="font-light text-dark">
          Have you not received your email confirmation code yet?{" "}
          <span onClick={() => sendEmail(email)} className="underline cursor-pointer text-dark ">
            Resend the code now.
          </span>
        </p>
      </div>
    );
  }
  if (step === STEPS.DETAILS) {
    bodyContent = (
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
  }
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
      isOpen={registerModal.isOpen}
      title="Register"
      actionLabel={actionLabel}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={
        step === STEPS.ACCOUNT || step === STEPS.VERIFY_EMAIL || step === STEPS.DETAILS
          ? undefined
          : onBack
      }
      body={bodyContent}
      footer={step === STEPS.ACCOUNT ? footerContent : undefined}
    />
  );
};

export default RegisterModal;
