import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUsersParams {
  page?: number;
  companyId?: string;
  searchValue?: string;
}

export default async function getUsers(params: IUsersParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    throw new Error("Invalid ID");
  }
  const {page = 1, companyId = "", searchValue = ""} = params;

  const perPage = currentUser?.role === "Owner" ? 8 : 9;

  const where: any = searchValue
    ? {
        companyId,
        OR: [
          {firstName: {contains: searchValue, mode: "insensitive"}},
          {lastName: {contains: searchValue, mode: "insensitive"}},
        ],
      }
    : {companyId, id: {not: currentUser.id}};

  const take = parseInt(perPage.toString());

  const users = await prisma.user.findMany({
    where,
    skip: (page - 1) * perPage,
    take,
  });

  const filteredUsers = users.filter((user) => user.id !== currentUser.id);

  const safeUsers = filteredUsers.map((user) =>
    Object.assign(user, {
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  );

  const count = await prisma.user.count({where});

  return {users: safeUsers, count};
}
