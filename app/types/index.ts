import {Company, User} from "@prisma/client";

export type SafeUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
export type SafeCompany = Omit<Company, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
