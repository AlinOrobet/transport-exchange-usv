import {NextResponse} from "next/server";

import prisma from "@/app/libs/prismadb";

interface IParams {
  id?: string;
}

export async function DELETE(request: Request, {params}: {params: IParams}) {
  const {id} = params;
  if (!id || typeof id !== "string") {
    throw new Error("Invalid ID");
  }
  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  return NextResponse.json(user);
}
