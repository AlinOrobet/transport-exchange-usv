"use client";
import React, {Fragment, ReactElement, useCallback} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {IoClose} from "react-icons/io5";
import Button from "../Button";
interface TransitionModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: ReactElement;
  footer?: ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}
const TransitionModal: React.FC<TransitionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    onSubmit();
  }, [disabled, onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full p-6 my-8 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:w-full sm:max-w-lg">
                <div className="absolute top-0 right-0 z-10 block pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-dark_shadow hover:text-dark focus:outline-none focus:ring-2 focus:ring-dark focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IoClose size={20} className="w-6 h-6" />
                  </button>
                </div>
                {/* HEADER */}
                <div className="flex items-center p-4 rounded-t justify-center relative border-b-[1px]">
                  <div className="text-lg font-bold text-dark">{title}</div>
                </div>
                {/* BODY */}
                <div className="relative flex-auto p-6">{body}</div>
                {/* FOOTER */}
                <div className="flex flex-col gap-2 p-6">
                  <div className="flex flex-row items-center w-full gap-4">
                    {secondaryAction && secondaryActionLabel && (
                      <Button
                        fullWidth
                        disabled={disabled}
                        onClick={handleSecondaryAction}
                        secondary
                      >
                        {secondaryActionLabel}
                      </Button>
                    )}
                    <Button fullWidth disabled={disabled} onClick={handleSubmit}>
                      {actionLabel}
                    </Button>
                  </div>
                  {footer}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TransitionModal;
