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
    const {languages} = body;
    if (languages) {
      const users = await prisma.user.findMany({where: {companyId: currentCompany.id}});
      let languagesArr: string[] = [];
      for (const user of users) {
        for (const language of user.languages) {
          if (!languagesArr.includes(language)) {
            languagesArr.push(language);
          }
        }
      }
      const updateCompany = await prisma.company.update({
        where: {
          id: currentCompany.id,
        },
        data: {
          languages: languagesArr,
        },
      });
      return NextResponse.json(updateCompany);
    }
    const updateCompany = await prisma.company.update({
      where: {
        id: currentCompany.id,
      },
      data: body,
    });
    return NextResponse.json(updateCompany);
  } catch (error) {
    return NextResponse.error();
  }
}
