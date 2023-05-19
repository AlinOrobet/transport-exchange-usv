"use client";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {AiOutlineClose} from "react-icons/ai";

const SidebarCTA = () => {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  if (!open) {
    return null;
  }
  return (
    <div className="w-full p-3 mt-4 rounded-md bg-dark_shadow dark:bg-light_shadow text-light dark:text-dark">
      <div className="flex items-center justify-between w-full">
        <div className="px-4 py-2 font-bold rounded-md bg-light dark:bg-dark text-dark dark:text-light">
          Beta
        </div>
        <div className="flex items-center justify-center p-2 duration-300 rounded-full hover:bg-dark hover:dark:bg-light">
          <AiOutlineClose size={20} onClick={() => setOpen(false)} className="cursor-pointer" />
        </div>
      </div>
      <p className="pt-2 text-sm font-medium">
        Consider adding more people to your team. It can bring in fresh ideas and boost success.
        Best of luck!
      </p>
      <p
        onClick={() => router.push("/dashboard/team")}
        className="pt-2 text-sm font-extrabold underline cursor-pointer"
      >
        Add more people
      </p>
    </div>
  );
};

export default SidebarCTA;
