"use client";
import {SafeCompany, SafeUser} from "@/app/types";
import React, {useMemo, useState} from "react";
import {format} from "date-fns";
import Avatar from "./Avatar";
import Flag from "react-world-flags";
import Edit from "../settings/components/Edit";
import Details from "../settings/components/myProfile/Details";
import ImageModal from "../settings/components/modals/ImageModal";
import RatingModal from "../settings/components/modals/RatingModal";
import CompanyDetailsModal from "../settings/components/modals/CompanyDetailsModal";
interface CompanyDetailsProps {
  currentCompany: SafeCompany | null;
  currentUser: SafeUser | null;
  languages: string[];
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  currentCompany,
  languages,
  currentUser,
}) => {
  const joinedDate = useMemo(() => {
    if (currentCompany?.createdAt) {
      return format(new Date(currentCompany.createdAt), "PP");
    }
  }, [currentCompany?.createdAt]);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [companyDetailsModalOpen, setCompanyDetailsModalOpen] = useState(false);
  return (
    <>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        src={currentCompany?.image}
        type="Company"
        title="Company profile"
        subtitle="Edit company profile image"
      />
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        currentCompany={currentCompany}
        languages={languages}
      />
      <CompanyDetailsModal
        isOpen={companyDetailsModalOpen}
        onClose={() => setCompanyDetailsModalOpen(false)}
        currentCompany={currentCompany}
      />
      <div className="flex flex-col w-full h-full py-2 md:py-5">
        <div className="relative flex justify-center w-full">
          <Avatar type="Company" large url={currentCompany ? currentCompany.image : null} />
          {currentUser?.role === "Owner" && (
            <div className="absolute top-0 right-0">
              <Edit label="Edit" onClick={() => setImageModalOpen(true)} />
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h1 className="overflow-hidden text-lg font-bold md:text-2xl text-ellipsis text-dark_shadow dark:text-light_shadow">
            {currentCompany?.companyName}
          </h1>
          <div className="flex items-center space-x-2">
            {languages.map((language, index) => (
              <Flag key={index} code={language} className="w-5 h-5" />
            ))}
          </div>
          <p
            onClick={() => setRatingModalOpen(true)}
            className="pt-1 text-sm underline cursor-pointer"
          >
            Rating
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 md:pt-5">
          <p className="text-lg font-bold text-dark_shadow dark:text-light_shadow">
            Company Informations
          </p>
          {currentUser?.role === "Owner" && (
            <Edit label="Edit" onClick={() => setCompanyDetailsModalOpen(true)} />
          )}
        </div>
        <div className="flex flex-col pt-1 md:pt-2">
          <p className="text-sm font-light">Address</p>
          <p className="font-medium">{currentCompany?.address}</p>
        </div>
        <Details
          data={[
            {id: 1, label: "Fiscal Code", value: currentCompany?.fiscalCode || "Undefined"},
            {id: 2, label: "Joined date", value: joinedDate},
          ]}
        />
        <div className="flex items-center justify-between pt-2 md:pt-4">
          <p className="text-lg font-bold text-dark_shadow dark:text-light_shadow">
            General Informations
          </p>
        </div>
        <Details
          data={[
            {id: 1, label: "Employees", value: 1234},
            {id: 2, label: " ", value: " "},
            {id: 3, label: "Orders placed", value: 1234},
            {id: 4, label: "Orders completed", value: 1234},
          ]}
        />
      </div>
    </>
  );
};

export default CompanyDetails;
