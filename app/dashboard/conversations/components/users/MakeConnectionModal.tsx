import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Modal from "@/app/components/modals/Modal";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";

interface MakeConnectionModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const MakeConnectionModal: React.FC<MakeConnectionModalProps> = ({isOpen, onClose}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
    },
  });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    axios
      .post("/api/conversations", {
        email: data.email,
      })
      .then((data) => {
        onClose();
        router.push(`/dashboard/conversations/${data.data.id}`);
      })
      .catch(() => {
        setError("email", {
          type: "manual",
          message: "User not found. Unable to create conversation.",
        });
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Heading
          title="Invite someone"
          subtitle="Connect, Share, and Engage: Join the Conversation on CargoConnect messenger!"
        />
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          small
        />
        <div className="flex items-center justify-end gap-x-3">
          <Button disabled={isLoading} type="button" transparent onClick={onClose}>
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

export default MakeConnectionModal;
