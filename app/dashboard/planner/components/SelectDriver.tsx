"use client";
import Select from "@/app/components/inputs/Select";
import {SafeUser} from "@/app/types";
import {useRouter} from "next/navigation";
import React, {useMemo, useState} from "react";

interface SelectDriverProps {
  drivers: SafeUser[];
}

type SelectOptions = {
  label: string;
  value: string;
};

const SelectDriver: React.FC<SelectDriverProps> = ({drivers}) => {
  const router = useRouter();
  const options = useMemo(() => {
    return drivers.map((user) => ({
      id: user.id,
      label:
        user.firstName || user.lastName ? `${user.firstName} ${user.firstName}` : `${user.email}`,
      value: user.id,
    }));
  }, [drivers]);
  const [driver, setDriver] = useState<SelectOptions>();
  return (
    <Select
      label=""
      value={driver}
      onChange={(value) => {
        setDriver(value);
        router.push(`/dashboard/planner?driver=${value.value}`);
      }}
      options={options}
    />
  );
};

export default SelectDriver;
