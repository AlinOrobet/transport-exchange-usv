"use client";
import React, {useState} from "react";
import Footer from "../footer/Footer";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import SupportItem from "./SupportItem";
import {FaHeadset, FaRegNewspaper, FaBug} from "react-icons/fa";
import {MdCurrencyExchange} from "react-icons/md";
import axios from "axios";
import {toast} from "react-hot-toast";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Button";
import TextArea from "@/app/components/inputs/TextArea";
import {motion} from "framer-motion";
const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      contactEmail: "",
      contactName: "",
      contactMessage: "",
      contactCopyMessage: true,
    },
  });
  const contactEmail = watch("contactEmail");
  const contactName = watch("contactName");
  const contactMessage = watch("contactMessage");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    axios
      .post("/api/contact", data)
      .then(() => {
        reset();
        toast.success("Success!");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const supportItems = [
    {
      id: 1,
      icon: FaHeadset,
      title: "Technical support",
      subtitle: "support@example.com",
      contactInfo: "+1 234-567-89",
    },
    {
      id: 2,
      icon: MdCurrencyExchange,
      title: "Sales questions",
      subtitle: "sales@example.com",
      contactInfo: "+1 234-567-89",
    },
    {
      id: 3,
      icon: FaRegNewspaper,
      title: "Press",
      subtitle: "press@example.com",
      contactInfo: "+1 234-567-89",
    },
    {
      id: 4,
      icon: FaBug,
      title: "Bug report",
      subtitle: "bugs@example.com",
      contactInfo: "+1 234-567-89",
    },
  ];
  return (
    <section id="contact" className="flex flex-col justify-between pt-28">
      <div className="max-w-screen-md mx-auto mb-4 text-center lg:mb-4">
        <motion.h2
          initial={{opacity: 0, x: -50}}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 1,
            },
          }}
          className="mb-4 text-4xl font-extrabold tracking-tight text-dark dark:text-light"
        >
          Designed for business teams like yours
        </motion.h2>
      </div>
      <div className="w-full h-full mb-5 rounded-md bg-light_shadow dark:bg-dark_shadow">
        <div className="flex justify-center">
          <h1 className="px-6 my-10 text-4xl font-bold font-extrabold tracking-tight text-dark dark:text-light">
            Contact us
          </h1>
        </div>
        <div className="flex flex-wrap md:mb-10">
          <div className="w-full px-3 mb-12 grow-0 shrink-0 basis-auto lg:mb-0 lg:w-5/12 lg:px-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <Input
                  id="contactName"
                  placeholder="Name"
                  value={contactName}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="mb-6">
                <Input
                  id="contactEmail"
                  placeholder="Email"
                  type="email"
                  value={contactEmail}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="mx-0.5 mb-12">
                <TextArea
                  id="contactMessage"
                  placeholder="Message"
                  value={contactMessage}
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </form>
          </div>
          <div className="w-full mt-1 grow-0 shrink-0 basis-auto lg:w-7/12">
            <div className="flex grid flex-wrap grid-cols-1 sm:grid-cols-2">
              {supportItems.map((item) => (
                <SupportItem
                  key={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  contactInfo={item.contactInfo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Contact;
