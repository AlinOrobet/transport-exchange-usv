"use client";
import React, {Fragment, ReactElement, useCallback} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {IoClose} from "react-icons/io5";
import Button from "../Button";
import Modal from "./Modal";
interface MultiStepModalProps {
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
const MultiStepModal: React.FC<MultiStepModalProps> = ({
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
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* HEADER */}
      <div className="flex items-center p-4 rounded-t justify-center relative border-b-[1px]">
        <div className="text-lg font-bold text-dark">{title}</div>
      </div>
      {/* BODY */}
      <div className="relative flex-auto p-2 md:p-6">{body}</div>
      {/* FOOTER */}
      <div className="flex flex-col gap-2 px-6">
        <div className="flex flex-row items-center w-full gap-4">
          {secondaryAction && secondaryActionLabel && (
            <Button fullWidth disabled={disabled} onClick={handleSecondaryAction} secondary>
              {secondaryActionLabel}
            </Button>
          )}
          <Button fullWidth disabled={disabled} onClick={handleSubmit}>
            {actionLabel}
          </Button>
        </div>
        {footer}
      </div>
    </Modal>
  );
};

export default MultiStepModal;
