import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.error();
    }
    const body = await request.json();
    const updateUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: body,
    });
    return NextResponse.json(updateUser);
  } catch (error) {
    return NextResponse.error();
  }
}
