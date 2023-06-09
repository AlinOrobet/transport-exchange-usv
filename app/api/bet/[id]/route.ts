import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";

interface IParams {
  id?: string;
}

export async function POST(request: Request, {params}: {params: IParams}) {
  const {id} = params;
  if (!id || typeof id !== "string") {
    throw new Error("Invalid ID");
  }
  try {
    const body = await request.json();
    const bet = await prisma.bet.update({
      where: {
        id,
      },
      data: body,
    });
    return NextResponse.json(bet);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function DELETE(request: Request, {params}: {params: IParams}) {
  const {id} = params;
  if (!id || typeof id !== "string") {
    throw new Error("Invalid ID");
  }
  try {
    const bet = await prisma.bet.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(bet);
  } catch (error) {
    return NextResponse.error();
  }
}
