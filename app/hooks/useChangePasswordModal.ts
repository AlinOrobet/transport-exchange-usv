import {create} from "zustand";

interface ChangePasswordModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useChangePasswordModal = create<ChangePasswordModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({isOpen: true}),
  onClose: () => set({isOpen: false}),
}));

export default useChangePasswordModal;
