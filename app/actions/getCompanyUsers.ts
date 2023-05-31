import prisma from "@/app/libs/prismadb";
import getCurrentCompany from "./getCurrentCompany";
import getCurrentUser from "./getCurrentUser";

export default async function getCompanyUsers() {
  const currentCompany = await getCurrentCompany();
  const currentUser = await getCurrentUser();

  if (!currentCompany || !currentUser) {
    return [];
  }
  if (currentCompany.accountType !== "transport") {
    return [];
  }
  try {
    const companyUsers = await prisma.user.findMany({
      where: {
        companyId: currentCompany.id,
        id: {not: currentUser.id},
      },
    });
    const safeUsers = companyUsers.map((user) =>
      Object.assign(user, {
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })
    );
    return safeUsers;
  } catch (error) {
    return [];
  }
}
