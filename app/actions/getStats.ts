import prisma from "@/app/libs/prismadb";

const transform = (number: number) => {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(0) + "K";
  } else {
    return number.toString();
  }
};

export default async function getStats() {
  try {
    const users = transform(await prisma?.user.count());
    const companies = transform(await prisma?.company.count());
    //const orders = transform(await prisma?.order.count());
    return {users, companies, orders: transform(19994231)};
  } catch (error: any) {
    throw new Error(error);
  }
}
