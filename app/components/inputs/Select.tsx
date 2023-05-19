"use client";
import React from "react";
import ReactSelect from "react-select";

type SelectOptions = {
  value: string;
};

interface SelectProps {
  label: string;
  value?: SelectOptions;
  onChange: (value: SelectOptions) => void;
  options: SelectOptions[];
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({label, value, onChange, options, disabled}) => {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={(value) => onChange(value as SelectOptions)}
          isClearable
          options={options}
          menuPortalTarget={document.body}
          formatOptionLabel={(option: any) => (
            <div className="flex flex-row items-center gap-3 font-normal text-dark">
              {option.value}
            </div>
          )}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () => "text-sm p-2",
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 6,
            colors: {
              ...theme.colors,
              primary: "#e3dede",
              primary25: "#e3e3e3",
            },
          })}
        />
      </div>
    </div>
  );
};

export default Select;
