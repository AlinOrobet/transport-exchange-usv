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
    const bodyValues: any = {...body};
    const conversionMap: Record<string, (value: string) => number> = {
      weight: parseFloat,
      height: parseFloat,
      width: parseFloat,
      price: (value) => parseInt(value, 10),
    };
    for (const key in conversionMap) {
      if (body[key]) {
        bodyValues[key] = conversionMap[key](body[key]);
      }
    }
    const order = await prisma.order.update({
      where: {
        id,
      },
      data: bodyValues,
    });
    return NextResponse.json(order);
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
    const order = await prisma.order.delete({
      where: {
        id,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.error();
  }
}
