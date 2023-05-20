import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConnections = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            conversations: {
              some: {
                users: {
                  some: {
                    id: currentUser.id,
                  },
                },
              },
            },
          },
          {
            companyId: currentUser.companyId,
          },
        ],
        NOT: {
          id: currentUser.id,
        },
      },
      include: {
        conversations: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error: any) {
    return [];
  }
};

export default getConnections;
