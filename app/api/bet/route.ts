import {NextResponse} from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  try {
    const body = await request.json();
    const bet = await prisma.bet.create({
      data: {
        price: parseInt(body.price, 10),
        orderId: body.orderId,
        userId: currentUser.id,
        beneficiaryId: body.beneficiaryId,
      },
    });
    return NextResponse.json(bet);
  } catch (error) {
    return NextResponse.error();
  }
}
