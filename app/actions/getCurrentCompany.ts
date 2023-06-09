import getSession from "./getSession";
import prisma from "@/app/libs/prismadb";
import getCompanyStats from "./getCompanyStats";

export default async function getCurrentCompany() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    if (!currentUser) {
      return null;
    }

    const company = await prisma.company.findUnique({
      where: {
        id: currentUser.companyId,
      },
    });
    if (!company) {
      return null;
    }
    return {
      ...company,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      stats: await getCompanyStats(company.id, company.accountType),
    };
  } catch (error: any) {
    return null;
  }
}
