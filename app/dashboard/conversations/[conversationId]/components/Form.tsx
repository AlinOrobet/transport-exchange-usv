"use client";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import React from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import {HiPhoto, HiPaperAirplane} from "react-icons/hi2";
import MessageInput from "./MessageInput";
import {CldUploadButton} from "next-cloudinary";
const Form = () => {
  const {conversationId} = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", {shouldValidate: true});
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div className="flex items-center w-full gap-2 py-4 border-t border-dark dark:border-light lg:gap-4">
      <CldUploadButton options={{maxFiles: 1}} onUpload={handleUpload} uploadPreset="mtajxqgs">
        <HiPhoto size={30} className="text-dark dark:text-light" />
      </CldUploadButton>

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center w-full gap-2 lg:gap-4">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="p-2 transition rounded-full cursor-pointer bg-light dark:bg-dark hover:opacity-75"
        >
          <HiPaperAirplane size={18} className="text-dark dark:text-light" />
        </button>
      </form>
    </div>
  );
};

export default Form;
