"use client";
import {SafeUser} from "@/app/types";
import React, {useState} from "react";
import Billing from "./Billing";
import CompanyProfile from "./CompanyProfile";
import ListOfOptions from "./ListOfOptions";
import MyProfile from "./myProfile/MyProfile";

interface SettingsProps {
  currentUser: SafeUser | null;
}

const Settings: React.FC<SettingsProps> = ({currentUser}) => {
  const [variant, setVariant] = useState<string>("MyProfile");
  return (
    <div className="flex flex-col h-full space-y-2">
      <div className="flex flex-row items-center justify-between w-full">
        <div className="text-xl font-bold 2xl:text-2xl text-dark_shadow dark:text-light_shadow">
          Settings
        </div>
      </div>
      <ListOfOptions variant={variant} setVariant={(value) => setVariant(value)} />
      <div className="w-full h-full">
        {variant === "CompanyProfile" && <CompanyProfile />}
        {variant === "MyProfile" && <MyProfile currentUser={currentUser} />}
        {variant === "Billing" && <Billing />}
      </div>
    </div>
  );
};

export default Settings;
