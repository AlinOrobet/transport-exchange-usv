import prisma from "@/app/libs/prismadb";

export default async function getCompanyStats(currentCompanyId: string, companyType: string) {
  if (!currentCompanyId || !companyType) {
    return [];
  }
  try {
    if (companyType === "goods") {
      const ordersPlaced = await prisma.order.count({
        where: {
          user: {
            companyId: currentCompanyId,
          },
          status: "Posted",
        },
      });
      const ordersCompleted = await prisma.order.count({
        where: {
          user: {
            companyId: currentCompanyId,
          },
          status: "Completed",
        },
      });
      const ordersInProgress = await prisma.order.count({
        where: {
          user: {
            companyId: currentCompanyId,
          },
          status: "In progress",
        },
      });
      const orders = await prisma.order.findMany({
        where: {
          user: {
            companyId: currentCompanyId,
          },
        },
        include: {
          bets: true,
        },
      });
      const totalOrders = orders.length;
      let totalBets = 0;
      for (const order of orders) {
        totalBets += order.bets.length;
      }
      const betsPerOrder = Math.trunc(totalBets / totalOrders);
      return [
        {
          label: "Orders placed",
          value: ordersPlaced,
        },
        {
          label: "Orders completed",
          value: ordersCompleted,
        },
        {
          label: "Orders in progress",
          value: ordersInProgress,
        },
        {
          label: "Bets per order",
          value: betsPerOrder,
        },
      ];
    }
    const numberOfBets = await prisma.bet.count({
      where: {
        user: {
          companyId: currentCompanyId,
        },
      },
    });
    const wonBets = await prisma.bet.count({
      where: {
        winningUser: {
          companyId: currentCompanyId,
        },
      },
    });
    const numberOfDrivers = await prisma.user.count({
      where: {
        companyId: currentCompanyId,
        role: "Truck driver",
      },
    });
    return [
      {
        label: "Won bets",
        value: wonBets,
      },
      {
        label: "Number of bets",
        value: numberOfBets,
      },
      {
        label: "Number of drivers",
        value: numberOfDrivers,
      },
    ];
  } catch (error: any) {
    return [];
  }
}
