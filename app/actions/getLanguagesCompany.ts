import prisma from "@/app/libs/prismadb";
import getCurrentCompany from "./getCurrentCompany";

export default async function getLanguagesCompany() {
  const currentCompany = await getCurrentCompany();
  if (!currentCompany) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({where: {companyId: currentCompany.id}});
    let languages: string[] = [];

    for (const user of users) {
      for (const language of user.languages) {
        if (!languages.includes(language)) {
          languages.push(language);
        }
      }
    }
    return languages.sort();
  } catch (error) {
    return [];
  }
}
