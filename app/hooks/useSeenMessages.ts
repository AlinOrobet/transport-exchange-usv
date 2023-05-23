import {create} from "zustand";

interface UnseenMessageStore {
  unseenMessages: boolean;
  setUnseenMessages: (current: boolean) => void;
}

const useUnseenMessages = create<UnseenMessageStore>((set) => ({
  unseenMessages: false,
  setUnseenMessages: (current) => set({unseenMessages: !current}),
}));

export default useUnseenMessages;
