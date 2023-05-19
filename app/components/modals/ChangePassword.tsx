"use client";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import Input from "../inputs/Input";
import Heading from "../Heading";
import {toast} from "react-hot-toast";
import useChangePasswordModal from "@/app/hooks/useChangePasswordModal";
import {AiFillLock} from "react-icons/ai";
import axios from "axios";
import {useRouter} from "next/navigation";
import MultiStepModal from "./MultiStepModal";

enum STEPS {
  EMAIL = 0,
  VERIFY_EMAIL = 1,
  CHANGE_PASSWORD = 2,
}

const ChangePasswordModal = () => {
  const changePasswordModal = useChangePasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [step, setStep] = useState(STEPS.EMAIL);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    watch,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
      verifyEmail: "",
    },
  });

  const email = watch("email");
  const password = watch("password");
  const verifyEmail = watch("verifyEmail");

  const [code, setCode] = useState("");

  const sendEmail = async (email: string, type?: string) => {
    try {
      setIsLoading(true);
      const res = await axios.post("/api/sendEmail", {email: email, type: type});
      setCode(res.data);
      return res.data;
    } catch (error) {
      toast.error("Something went wrong.");
      setError("email", {type: "manual", message: "Email is not registered"});
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const onNext = () => {
    setStep((value) => value + 1);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (step === STEPS.EMAIL) {
      setIsLoading(true);
      const res = await sendEmail(data.email, "Forgot password");
      if (res === undefined) {
        setIsLoading(false);
        return;
      } else {
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
    }
    setIsLoading(true);
    try {
      await axios
        .post("/api/editAccount", {email: data.email, password: data.password})
        .then(() => {
          toast.success("Success!");
          changePasswordModal.onClose();
        });
      reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  let bodyContent;
  if (step === STEPS.EMAIL) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading
          title="Forgot password?"
          subtitle="Don't worry! It happens. Please enter the email address associated with your account"
        />
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.VERIFY_EMAIL) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading title="Verify Email" subtitle="Please enter the code sent to your email" />
        <Input id="verifyEmail" label="Enter code" register={register} errors={errors} required />
        <p className="font-light text-dark">
          Have you not received your email confirmation code yet?{" "}
          <span
            onClick={async () => sendEmail(email, "Forgot password")}
            className="underline cursor-pointer text-dark "
          >
            Resend the code now.
          </span>
        </p>
      </div>
    );
  }

  if (step === STEPS.CHANGE_PASSWORD) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="Reset Password" />
        <Input
          id="password"
          label="New password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          type={showPassword ? "text" : "password"}
          icon={AiFillLock}
          onClickIcon={() => setShowPassword(!showPassword)}
        />
      </div>
    );
  }

  return (
    <MultiStepModal
      disabled={isLoading}
      isOpen={changePasswordModal.isOpen}
      title="Account security"
      actionLabel="Continue"
      onClose={changePasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default ChangePasswordModal;
