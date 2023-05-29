"use client";
import {SafeUser} from "@/app/types";
import {format} from "date-fns";
import React, {useCallback, useMemo, useState} from "react";
import Avatar from "../../../components/Avatar";
import Edit from "../Edit";
import Details from "./Details";
import Flag from "react-world-flags";
import ChangePasswordModal from "@/app/components/modals/ChangePassword";
import useChangePasswordModal from "@/app/hooks/useChangePasswordModal";
import ConfirmModal from "@/app/dashboard/components/modals/ConfirmModal";
import {FiAlertTriangle} from "react-icons/fi";
import ImageModal from "../modals/ImageModal";
import UserDetailsModal from "./UserDetailsModal";
import LanguagesModal from "./LanguagesModal";
import axios from "axios";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {signOut} from "next-auth/react";
interface MyProfileProps {
  currentUser: SafeUser | null;
}

const MyProfile: React.FC<MyProfileProps> = ({currentUser}) => {
  const router = useRouter();
  const name = useMemo(() => {
    if (currentUser?.firstName && currentUser?.lastName) {
      return currentUser.lastName + " " + currentUser.firstName;
    }
    return "Undefined";
  }, [currentUser]);
  const joinedDate = useMemo(() => {
    if (currentUser?.createdAt) {
      return format(new Date(currentUser.createdAt), "PP");
    }
  }, [currentUser?.createdAt]);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [languagesModalOpen, setLanguagesModalOpen] = useState(false);
  const changePasswordModal = useChangePasswordModal();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = useCallback(() => {
    setIsLoading(true);
    axios
      .delete(`/api/editAccount/${currentUser?.id}`)
      .then(() => {
        if (currentUser?.role === "Owner") {
          return axios.delete(`/api/editCompany/${currentUser?.companyId}`);
        }
      })
      .then(() => {
        toast.success("Account deleted successfully");
        router.refresh();
        setConfirmOpen(false);
        signOut();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [currentUser, router]);
  return (
    <>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        src={currentUser?.image}
        type="User"
        title="Profile"
        subtitle="Edit your profile image"
      />
      <UserDetailsModal
        isOpen={userDetailsModalOpen}
        onClose={() => setUserDetailsModalOpen(false)}
        currentUser={currentUser}
      />
      <LanguagesModal
        isOpen={languagesModalOpen}
        onClose={() => setLanguagesModalOpen(false)}
        currentUser={currentUser}
      />
      <ChangePasswordModal />
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete account"
        subtitle="Are you sure you want to delete your account? This action cannot be undone."
        icon={FiAlertTriangle}
        onDelete={onDelete}
        isLoading={isLoading}
      />
      <div className="flex flex-col w-full h-full pt-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-row items-center">
            <Avatar large url={currentUser ? currentUser.image : null} type="User" />
            <div className="flex flex-col ml-3">
              <h1 className="font-bold md:text-lg">{name}</h1>
              <p className="text-sm font-medium md:text-medium">{currentUser?.role}</p>
              <span className="text-xs font-light md:text-sm">{joinedDate}</span>
            </div>
          </div>
          <Edit label="Edit" onClick={() => setImageModalOpen(true)} />
        </div>
        <div className="flex items-center justify-between pt-5">
          <p className="text-lg font-bold text-dark_shadow dark:text-light_shadow">
            Personal Information
          </p>
          <Edit label="Edit" onClick={() => setUserDetailsModalOpen(true)} />
        </div>
        <div className="text-dark dark:text-light">
          <Details
            data={[
              {id: 1, label: "First Name", value: currentUser?.firstName || "Undefined"},
              {id: 2, label: "Last Name", value: currentUser?.lastName || "Undefined"},
              {id: 3, label: "Email address", value: currentUser?.email},
              {id: 4, label: "Phone", value: currentUser?.phoneNumber || "Undefined"},
            ]}
          />
        </div>
        <div className="flex items-center justify-between pt-5">
          <p className="text-lg font-bold text-dark_shadow dark:text-light_shadow">Languages</p>
          <Edit label="Edit" onClick={() => setLanguagesModalOpen(true)} />
        </div>
        <div className="flex flex-row pt-2 space-x-2">
          {currentUser?.languages.map((language, index) => (
            <div key={index} className="flex flex-row">
              <Flag code={language} className="w-5 h-5" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-5">
          <p className="text-lg font-bold text-dark_shadow dark:text-light_shadow">Security</p>
        </div>
        <div className="flex flex-col pt-2 space-y-1.5">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-bold text-dark_shadow dark:text-light_shadow">
              Change password
            </p>
            <Edit label="Edit" onClick={() => changePasswordModal.onOpen()} />
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-bold text-dark_shadow dark:text-light_shadow">
              Delete account
            </p>
            <Edit label="Delete" onClick={() => setConfirmOpen(true)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
