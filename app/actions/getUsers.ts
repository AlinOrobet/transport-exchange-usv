import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUsersParams {
  page?: number;
  companyId?: string;
  orderBy?: string;
  value?: string;
  filterBy?: string;
}

export default async function getUsers(params: IUsersParams) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {users: [], count: 0};
  }
  const {page = 1, companyId = "", value = "", orderBy = "", filterBy = ""} = params;

  const where: any = value
    ? {
        companyId,
        id: {not: currentUser.id},
        OR: [],
      }
    : {companyId, id: {not: currentUser.id}};

  const order: any = [];

  if (filterBy.includes("Role") && value) {
    where.OR.push({role: {contains: value, mode: "insensitive"}});
  }
  if (filterBy.includes("Email") && value) {
    where.OR.push({email: {contains: value, mode: "insensitive"}});
  }
  if (filterBy.includes("FirstName") && value) {
    where.OR.push({firstName: {contains: value, mode: "insensitive"}});
  }
  if (filterBy.includes("LastName") && value) {
    where.OR.push({lastName: {contains: value, mode: "insensitive"}});
  }

  const orderByValue = orderBy === "DESC" ? "desc" : "asc";
  if (!filterBy) {
    order.push({createdAt: orderByValue});
  } else {
    if (filterBy.includes("Role")) {
      order.push({role: orderByValue});
    }
    if (filterBy.includes("Email")) {
      order.push({email: orderByValue});
    }
    if (filterBy.includes("LastName")) {
      order.push({lastName: orderByValue});
    }
    if (filterBy.includes("FirstName")) {
      order.push({firstName: orderByValue});
    }
  }

  const perPage = currentUser?.role === "Owner" ? 8 : 9;
  const take = parseInt(perPage.toString());
  const users = await prisma.user.findMany({
    where,
    skip: (page - 1) * perPage,
    take,
    orderBy: order,
  });

  const filteredUsers = users.filter((user) => user.id !== currentUser.id);

  const safeUsers = users.map((user) =>
    Object.assign(user, {
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  );

  const count = await prisma.user.count({where});

  return {users: safeUsers, count};
}
