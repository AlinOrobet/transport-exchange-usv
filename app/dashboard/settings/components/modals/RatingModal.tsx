"use client";
import Modal from "@/app/components/modals/Modal";
import Avatar from "@/app/dashboard/components/Avatar";
import CompanyRating from "@/app/dashboard/settings/components/modals/CompanyRating";
import {SafeCompany} from "@/app/types";
import Flag from "react-world-flags";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: SafeCompany | null;
}

const RatingModal: React.FC<RatingModalProps> = ({isOpen, onClose, currentCompany}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 text-dark">
        <div className="flex flex-row items-center">
          <Avatar url={currentCompany ? currentCompany.image : null} type="Company" large />
          <div className="flex flex-col ml-3">
            <h1 className="font-bold md:text-lg">{currentCompany?.companyName}</h1>
            <p className="text-sm font-medium md:text-medium">{currentCompany?.address}</p>
            <div className="flex items-center space-x-2">
              {currentCompany?.languages.map((language, index) => (
                <Flag key={index} code={language} className="w-5 h-5" />
              ))}
            </div>
          </div>
        </div>
        <CompanyRating currentCompany={currentCompany} />
      </div>
    </Modal>
  );
};

export default RatingModal;
