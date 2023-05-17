import prisma from "@/app/libs/prismadb";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const {accountType, address, companyName, fiscalCode, latitude, longitude} = body;
  const company = await prisma.company.create({
    data: {
      accountType,
      companyName,
      fiscalCode,
      latitude,
      longitude,
      address,
    },
  });

  return NextResponse.json(company);
}
