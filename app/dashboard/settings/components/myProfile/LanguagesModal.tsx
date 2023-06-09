"use client";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/modals/Modal";
import useCountries from "@/app/hooks/useCountries";
import {SafeUser} from "@/app/types";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

interface LanguagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SafeUser | null;
}
const LanguagesModal: React.FC<LanguagesModalProps> = ({isOpen, onClose, currentUser}) => {
  const {getAll, getByValue} = useCountries();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setValue,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      languages: currentUser?.languages || [],
    },
  });
  const languages = watch("languages");
  const transformedLanguages = languages.map((language: any) =>
    getByValue(language?.value || language)
  );
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let languages: any = [];
    if (data.languages) {
      languages = data.languages.map((language: any) => language.value);
    }
    axios
      .post("/api/editAccount", {languages: languages})
      .then(() => {
        return axios.post("/api/editCompany", {languages: languages});
      })
      .then(() => {
        router.refresh();
        toast.success("Success");
        onClose();
      })
      .catch(() => {
        toast.error("Something went wrong!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Heading title="Profile" subtitle="Edit your languages" />
        <Select
          label="Select languages"
          value={transformedLanguages}
          onChange={(value) => setCustomValue("languages", value)}
          options={getAll()}
          multi
          flags
        />
        <div className="flex items-center justify-end gap-x-3">
          <Button disabled={isLoading} type="button" transparent onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LanguagesModal;
