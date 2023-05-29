import {NextResponse} from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.error();
  }
  const body = await request.json();
  const order = await prisma.order.create({
    data: {
      ...body,
      userId: currentUser.id,
      weight: body.weight ? parseFloat(body.weight) : null,
      height: body.height ? parseFloat(body.height) : null,
      width: body.width ? parseFloat(body.width) : null,
      price: parseInt(body.price, 10),
    },
  });
  return NextResponse.json(order);
}
