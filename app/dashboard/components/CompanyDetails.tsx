"use client";
import {SafeCompany} from "@/app/types";
import React, {useMemo} from "react";
import {format} from "date-fns";
import Avatar from "./Avatar";
import Details from "@/app/components/Details";
import CompanyRating from "./CompanyRating";
interface CompanyDetailsProps {
  currentCompany: SafeCompany | null;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({currentCompany}) => {
  const joinedDate = useMemo(() => {
    if (currentCompany?.createdAt) {
      return format(new Date(currentCompany.createdAt), "PP");
    }
  }, [currentCompany?.createdAt]);
  return (
    <div className="relative flex-1 px-4 mt-6 text-dark dark:text-light">
      <div className="flex flex-col items-center">
        <div className="mb-2">
          <Avatar type="Company" large url={currentCompany ? currentCompany.image : null} />
        </div>
        <div className="text-2xl font-bold">{currentCompany?.companyName}</div>
        <div className="font-semibold text-gray-900 dark:text-gray-300">Ceva</div>
        <div className="w-full pt-5 pb-5">
          <dl className="px-4 space-y-5 sm:space-y-3">
            <div className="text-dark dark:text-light">
              <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Address</dt>
              <dd>{currentCompany?.address}</dd>
            </div>
            <div className="flex flex-col items-center">
              <Details label="Orders placed" value="1234" />
              <Details label="Orders completed" value="1234" />
              <Details label="Employees" value="1234" />
            </div>
            <div className="text-dark dark:text-light">
              <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">Joined</dt>
              <dd className="mt-1 text-sm sm:col-span-2">
                <time dateTime={joinedDate}>{joinedDate}</time>
              </dd>
            </div>
            <CompanyRating />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
