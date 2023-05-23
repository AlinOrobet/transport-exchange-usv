import getCurrentUser from "./getCurrentUser";
import prisma from "@/app/libs/prismadb";

export default async function getUnseenMessages() {
  const currentUser = await getCurrentUser();
  if (!currentUser) return false;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    for (const conversation of conversations) {
      return conversation.messages[conversation.messages.length - 1].seenIds.length === 1;
    }
    return false;
  } catch (error) {
    return false;
  }
}
