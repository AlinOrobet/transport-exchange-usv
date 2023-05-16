"use client";
import React from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {motion} from "framer-motion";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
const ViewOrder = () => {
  const router = useRouter();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      orderId: "",
    },
  });
  const orderId = watch("orderId");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (!data.orderId) return;
    reset();
    router.push(`/orders/${data.orderId}`);
  };
  return (
    <motion.div
      initial={{opacity: 0, scale: 0.5}}
      animate={{opacity: 1, scale: 1}}
      transition={{duration: 1.5}}
      className="flex items-center justify-center px-6 py-4 my-6 sm:px-16 sm:py-12 lg:flex-row flex-col bg-light_shadow dark:bg-dark_shadow rounded-[20px] box-shadow"
    >
      <div className="flex flex-col flex-1 text-dark dark:text-light">
        <h2 className="text-3xl font-extrabold md:text-4xl">Let&apos;s try our service now!</h2>
        <p className="font-semibold leading-[30px] text-xl mt-5">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nihil magni dolor tempora esse?
        </p>
      </div>
      <div className="flex items-center justify-center w-full mt-4 mb-2 md:mt-6 lg:w-96 lg:mt-2">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row w-full space-x-2">
          <Input
            register={register}
            id="orderId"
            value={orderId}
            errors={errors}
            small
            labelColorReverse
            placeholder="Order code"
          />
          <div className="mt-2">
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ViewOrder;
