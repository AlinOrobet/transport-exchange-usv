"use client";
import {SafeCompany, SafeUser} from "@/app/types";
import React, {useState} from "react";
import Billing from "./billing/Billing";
import ListOfOptions from "./ListOfOptions";
import MyProfile from "./myProfile/MyProfile";
import CompanyDetails from "../../components/CompanyDetails";

interface SettingsProps {
  currentUser: SafeUser | null;
  currentCompany: SafeCompany | null;
  languages: string[];
}

const Settings: React.FC<SettingsProps> = ({currentUser, currentCompany, languages}) => {
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
        {variant === "MyCompany" && (
          <CompanyDetails
            currentUser={currentUser}
            currentCompany={currentCompany}
            languages={languages}
          />
        )}
        {variant === "MyProfile" && <MyProfile currentUser={currentUser} />}
        {variant === "Billing" && <Billing />}
      </div>
    </div>
  );
};

export default Settings;
