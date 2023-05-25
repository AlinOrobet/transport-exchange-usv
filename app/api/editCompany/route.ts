import {NextResponse} from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentCompany from "@/app/actions/getCurrentCompany";
export async function POST(request: Request) {
  try {
    const currentCompany = await getCurrentCompany();
    if (!currentCompany) {
      return NextResponse.error();
    }
    const body = await request.json();
    const updateUser = await prisma.company.update({
      where: {
        id: currentCompany.id,
      },
      data: body,
    });
    return NextResponse.json(updateUser);
  } catch (error) {
    return NextResponse.error();
  }
}
