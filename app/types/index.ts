import {Company, User, Conversation, Message, Order, Bet} from "@prisma/client";

export type SafeUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type Stats = {
  label: string;
  value: number;
};

export type SafeCompany = Omit<Company, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
} & {
  stats: Stats[];
};
export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type SafeBet = Omit<Bet, "createdAt"> & {
  createdAt: string;
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
  user: SafeUser & {
    company: SafeCompany;
  };
  bets: (SafeBet & {
    user: SafeUser & {
      company: SafeCompany;
    };
    beneficiary: SafeUser & {
      company: SafeCompany;
    };
  })[];
  winningUser:
    | (SafeUser & {
        company: SafeCompany;
      })
    | null;
  createdAt: string;
  updatedAt: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  shippingTimeStart: string;
  shippingTimeEnd: string;
};
