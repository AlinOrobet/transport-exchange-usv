import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {email, password, companyId, role, hasDefaultPassword, haveCompanyDetails} = body;

  if (!email || !companyId || !password) return NextResponse.error();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (existingUser) {
    return NextResponse.error();
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      companyId,
      email,
      hashedPassword,
      role: role ? role : "Owner",
      hasDefaultPassword: hasDefaultPassword ? true : false,
      haveCompanyDetails: haveCompanyDetails ? true : false,
    },
  });
  return NextResponse.json(user);
}
