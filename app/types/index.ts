import {Company, User, Conversation, Message} from "@prisma/client";

export type SafeUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
export type SafeCompany = Omit<Company, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
