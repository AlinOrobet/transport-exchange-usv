"use client";
import React, {useCallback, useMemo, useState} from "react";
import {User} from "@prisma/client";
import {useRouter} from "next/navigation";
import axios from "axios";
import Avatar from "@/app/dashboard/components/Avatar";
interface UserBoxProps {
  data: User;
}

const UserBox: React.FC<UserBoxProps> = ({data}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const name = useMemo(() => {
    if (data?.lastName && data?.firstName) {
      return data.lastName + " " + data?.firstName;
    }
    return data.email;
  }, [data.lastName, data.firstName, data.email]);

  const handleClick = useCallback(() => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        userId: data.id,
      })
      .then((data) => {
        router.push(`/dashboard/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      <div
        onClick={handleClick}
        className="relative flex items-center w-full p-3 mt-1 space-x-3 transition duration-200 rounded-lg cursor-pointer bg-light hover:dark:bg-dark text-dark dark:text-light hover:bg-light_hover dark:bg-dark_hover"
      >
        <Avatar url={data.image} type="User" userEmail={data ? data.email : null} />
        <div className="flex-1 min-w-0">
          <div className="focus:outline-none">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">{name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
