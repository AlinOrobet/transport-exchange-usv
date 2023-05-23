"use client";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/modals/Modal";
import {useRouter, useSearchParams} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import qs from "query-string";
type SelectOptions = {
  label: string;
  value: string;
};
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  options: SelectOptions[];
}

const SearchModal: React.FC<SearchModalProps> = ({isOpen, onClose, title, subtitle, options}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      filterBy: [],
      value: "",
      orderBy: "DESC",
    },
  });

  const filterBy = watch("filterBy");
  const orderBy = watch("orderBy");
  const value = watch("value");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString());
    }
    let filterBy = "";
    if (data.filterBy) {
      filterBy = data.filterBy.map((option: any) => `${option.value}`).join(" ");
    }
    const updatedQuery: any = {
      ...currentQuery,
      orderBy: data?.orderBy,
      value: data?.value,
      filterBy: filterBy,
    };
    const url = qs.stringifyUrl(
      {
        url: "/dashboard/team",
        query: updatedQuery,
      },
      {skipNull: true}
    );
    setIsLoading(false);
    onClose();
    router.push(url);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Heading title={title} subtitle={subtitle} />
        <Select
          label="Filter by"
          value={filterBy}
          onChange={(value) => setCustomValue("filterBy", value)}
          options={options}
          multi
        />
        <Input
          id="value"
          label="Search by value"
          disabled={isLoading}
          register={register}
          errors={errors}
          value={value}
          small
        />
        <div className="flex items-center space-x-5">
          <div
            onClick={() => setCustomValue("orderBy", "DESC")}
            className={`h-[3.5rem] w-1/2 rounded-lg font-bold text-center border border-dark ${
              orderBy === "DESC" ? "bg-dark text-light" : "text-dark dark:text-light"
            } flex items-center justify-center cursor-pointer`}
          >
            Descendent
          </div>
          <div
            onClick={() => setCustomValue("orderBy", "ASC")}
            className={`h-[3.5rem] w-1/2 rounded-lg font-bold text-center border border-dark ${
              orderBy === "ASC" ? "bg-dark text-light" : "text-dark dark:text-light"
            } flex items-center justify-center cursor-pointer`}
          >
            Ascendent
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-3">
          <Button
            disabled={isLoading}
            type="button"
            transparent
            onClick={() => {
              reset();
              router.push("/dashboard/team");
              onClose();
            }}
          >
            Reset
          </Button>
          <Button disabled={isLoading} type="submit">
            Search
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SearchModal;
