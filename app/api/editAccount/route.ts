import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
  const body = await request.json();
  const {firstName, lastName, phoneNumber, image, email, password} = body;
  if (email) {
    if (!password) {
      return NextResponse.error();
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.update({
      where: {email: email},
      data: {
        hashedPassword,
        hasDefaultPassword: false,
      } as Record<string, any>,
    });
    return NextResponse.json(user);
  } else {
    if (!body.id) return NextResponse.error();
    const user = await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        firstName,
        lastName,
        phoneNumber,
        image,
      },
    });
    return NextResponse.json(user);
  }
}
