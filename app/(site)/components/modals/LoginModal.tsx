"use client";
import React, {useCallback, useState} from "react";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {AiFillLock} from "react-icons/ai";
import Input from "@/app/components/inputs/Input";
import Heading from "@/app/components/Heading";
import toast from "react-hot-toast";
import {signIn} from "next-auth/react";
import useChangePasswordModal from "@/app/hooks/useChangePasswordModal";
import MultiStepModal from "@/app/components/modals/MultiStepModal";
import AuthSocialButton from "@/app/components/AuthSocialButton";
import {BsGithub, BsGoogle} from "react-icons/bs";
const LoginModal = () => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const changePasswordModal = useChangePasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {errors},
    setError,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    signIn("credentials", {...data, redirect: false})
      .then((callback) => {
        if (callback?.error) {
          toast.error("Something went wrong.");
          setError("email", {type: "custom", message: "Username or password incorrect."});
          setError("password", {type: "custom", message: "Username or password incorrect."});
        }
        if (callback?.ok && !callback?.error) {
          toast.success("Logged in");
          loginModal.onClose();
          router.push("/dashboard/home");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome back" subtitle="Login to your account!" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        icon={AiFillLock}
        onClickIcon={() => setShowPassword(!showPassword)}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <div className="flex flex-row items-center">
        <div className="text-dark">
          Forgot password?{" "}
          <span
            onClick={() => {
              loginModal.onClose();
              changePasswordModal.onOpen();
            }}
            className="underline cursor-pointer text-dark"
          >
            Change now
          </span>
        </div>
      </div>
    </div>
  );

  const toggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);
  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, {redirect: false})
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        }
      })
      .finally(() => setIsLoading(false));
  };
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-gray-500 bg-white">Or continue with</span>
        </div>
      </div>
      <div className="flex gap-2">
        <AuthSocialButton icon={BsGoogle} onClick={() => socialAction("google")} />
      </div>
      <div className="font-light text-center text-dark">
        <div className="flex flex-row items-center justify-center">
          <div>
            First time using?{" "}
            <span onClick={toggle} className="underline cursor-pointer text-dark">
              Create an account
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MultiStepModal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Continue"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
