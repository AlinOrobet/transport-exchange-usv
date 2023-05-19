import Button from "@/app/components/Button";
import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Modal from "@/app/components/modals/Modal";
import axios from "axios";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import toast from "react-hot-toast";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompany: string | undefined;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({isOpen, onClose, currentCompany}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    setError,
    reset,
    formState: {errors},
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      role: "",
    },
  });
  const role = watch("role");
  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    try {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }
      await axios.post("/api/register", {
        email: data.email,
        password: code,
        role: data.role.value,
        companyId: currentCompany,
        hasDefaultPassword: true,
      });
      try {
        await axios.post("/api/sendEmail", {
          email: data.email,
          defaultPassword: code,
          type: "Register team mate",
        });
        toast.success("Success!");
      } catch (error) {
        toast.error("Something went wrong");
      }
      onClose();
      reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
      setError("email", {type: "manual", message: "Email has been used"});
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Heading
          title="Add someone"
          subtitle="Adding more people in your team can boost succes. Best of luck!"
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
        <Select
          label="Role"
          value={role}
          onChange={(value) => setCustomValue("role", value)}
          options={options}
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

export default InviteMemberModal;
const options = [{value: "Owner"}, {value: "Staff"}, {value: "Employee"}];
