"use client";
import React from "react";
import {Dialog} from "@headlessui/react";
import Button from "@/app/components/Button";
import Modal from "@/app/components/modals/Modal";
import {IconType} from "react-icons";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  icon: IconType;
  title: string;
  subtitle: string;
  onDelete: () => void;
  isLoading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  icon: Icon,
  title,
  subtitle,
  onDelete,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mt-4 sm:flex sm:items-start">
        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
          <Icon className="w-6 h-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse mt-5 sm:mt-4">
        <Button disabled={isLoading} danger onClick={onDelete}>
          Delete
        </Button>
        <Button disabled={isLoading} transparent onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
