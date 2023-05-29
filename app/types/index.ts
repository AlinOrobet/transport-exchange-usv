import {Company, User, Conversation, Message, Order} from "@prisma/client";

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

export type SafeOrder = Omit<
  Order,
  | "createdAt"
  | "updatedAt"
  | "pickupTimeStart"
  | "pickupTimeEnd"
  | "shippingTimeStart"
  | "shippingTimeEnd"
> & {
  user: Omit<User, "createdAt" | "updatedAt"> & {
    createdAt: string;
    updatedAt: string;
    company: SafeCompany;
  };
  createdAt: string;
  updatedAt: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  shippingTimeStart: string;
  shippingTimeEnd: string;
};
