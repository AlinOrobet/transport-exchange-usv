import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConnections = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return [];
  }
  try {
    const connections = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          id: currentUser.id,
        },
      },
    });
    return connections;
  } catch (error: any) {
    return [];
  }
};

export default getConnections;
