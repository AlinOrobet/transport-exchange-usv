"use client";
import React from "react";
import ReactSelect from "react-select";
import Flag from "react-world-flags";

type SelectOptions = {
  label: string;
  value: string;
};

interface SelectProps {
  multi?: boolean;
  label: string;
  value?: SelectOptions;
  onChange: (value: any) => void;
  options: SelectOptions[];
  disabled?: boolean;
  flags?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
  multi = false,
  flags,
}) => {
  return (
    <div className="z-40">
      <label className="block text-sm font-medium leading-6 text-gray-900">{label}</label>
      <div className="mt-2">
        <ReactSelect
          required
          isMulti={multi}
          isDisabled={disabled}
          value={value}
          onChange={(value) => onChange(value)}
          isClearable
          options={options}
          menuPortalTarget={document.body}
          formatOptionLabel={(option: any) => (
            <div className="flex flex-row items-center gap-3 font-normal text-dark">
              {flags && <Flag code={option.value} className="w-5 h-5" />}
              {option.label}
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
