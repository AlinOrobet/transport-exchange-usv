"use client";
import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import ImageUpload from "@/app/components/inputs/ImageUpload";
import Modal from "@/app/components/modals/Modal";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}
const ImageModal: React.FC<ImageModalProps> = ({src, isOpen, onClose}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {handleSubmit, setValue, watch, reset} = useForm<FieldValues>({
    defaultValues: {
      image: src,
    },
  });
  const image = watch("image");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post("/api/editAccount", data)
      .then(() => {
        router.refresh();
        toast.success("Success");
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="">
            <Heading title="Profile" subtitle="Edit your profile image" />
            <div className="mt-4">
              <ImageUpload
                label="Profile image"
                value={image}
                onChange={(image) => setValue("image", image)}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end mt-6 gap-x-3">
          <Button disabled={isLoading} transparent type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ImageModal;
