import {create} from "zustand";

interface CreateCompanyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCreateCompanyModal = create<CreateCompanyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}));

export default useCreateCompanyModal;
