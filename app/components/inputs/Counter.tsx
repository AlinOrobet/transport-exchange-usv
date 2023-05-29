"use client";
import React, {useCallback} from "react";
import {AiOutlineMinus, AiOutlinePlus} from "react-icons/ai";

interface CounterProps {
  title: string;
  subtitle?: string;
  value: number;
  onChange: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({title, subtitle, value, onChange}) => {
  const onAdd = useCallback(() => {
    onChange(value + 100);
  }, [onChange, value]);

  const onReduce = useCallback(() => {
    if (value === 0) {
      return;
    }
    onChange(value - 100);
  }, [onChange, value]);

  return (
    <div className="flex flex-row items-center justify-between px-2 py-3 border-2 rounded-lg text-dark">
      <div className="flex flex-col ml-2">
        <div className="font-normal">{title}</div>
        <div className="font-light">{subtitle}</div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-[1px] border-dark dark:border-light flex items-center justify-center text-dark dark:text-light cursor-pointer hover:opacity-80 transition"
          onClick={onReduce}
        >
          <AiOutlineMinus className="text-dark dark:text-light" />
        </div>
        <div className="text-xl font-semibold text-dark dark:text-light">{value}</div>
        <div
          className="w-8 h-8 rounded-full border-[1px] border-dark dark:border-light flex items-center justify-center text-dark dark:text-light cursor-pointer hover:opacity-80 transition"
          onClick={onAdd}
        >
          <AiOutlinePlus className="text-dark dark:text-light" />
        </div>
      </div>
    </div>
  );
};

export default Counter;
