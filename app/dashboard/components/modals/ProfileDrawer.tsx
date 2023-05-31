"use client";
import React, {Fragment} from "react";

import {Dialog, Transition} from "@headlessui/react";
import {IoClose} from "react-icons/io5";

interface ProfileDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({children, onClose, isOpen}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-md pointer-events-auto">
                  <div className="relative flex flex-col h-full shadow-xl bg-light_shadow dark:bg-dark_shadow">
                    <div className="absolute top-5 right-5">
                      <div className="flex items-center ml-3 h-7">
                        <button
                          onClick={onClose}
                          type="button"
                          className="text-gray-400 rounded-md bg-light_shadow dark:bg-dark_shadow text-dark_shadow dark:text-light_shadow hover:text-dark hover:dark:text-light focus:outline-none focus:ring-2 focus:dark:ring-1 focus:ring-dark focus:dark:ring-light focus:ring-offset-2"
                        >
                          <span className="sr-only">Close panel</span>
                          <IoClose size={24} />
                        </button>
                      </div>
                    </div>
                    <div className="h-full pt-3">{children}</div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ProfileDrawer;
