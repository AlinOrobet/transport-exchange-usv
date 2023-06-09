import prisma from "@/app/libs/prismadb";
import getCompanyStats from "./getCompanyStats";
import getCurrentCompany from "./getCurrentCompany";
import getCurrentUser from "./getCurrentUser";

export interface IWonOrdersParams {
  driverId?: string;
}

export default async function getWonOrders(params: IWonOrdersParams) {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  if (!currentUser || !currentCompany) {
    return [];
  }
  const {driverId} = params;
  const where: any = {};
  const include: any = {};
  include.user = {
    include: {
      company: true,
    },
  };
  if (currentUser.role === "Owner") {
    where.winningUser = {
      companyId: currentCompany.id,
    };
    include.bets = {
      where: {
        winningUser: {
          companyId: currentCompany.id,
        },
        beneficiaryId: driverId,
      },
    };
    if (driverId) {
      include.bets.where.beneficiaryId = driverId;
    }
  } else {
    where.winningUserId = currentUser.id;
    include.bets = {
      where: {
        winningUserId: currentUser.id,
      },
    };
    if (driverId) {
      include.bets.where.beneficiaryId = driverId;
    }
  }
  const orders = await prisma.order.findMany({
    where: {
      ...where,
      isWon: true,
    },
    orderBy: {
      pickupTimeStart: "asc",
    },
    include,
  });
  const safeOrders = await Promise.all(
    orders.map(async (order: any) => {
      const companyStats = await getCompanyStats(order.user.company.id, order.user.accountType);
      return {
        ...order,
        user: {
          ...order.user,
          createdAt: order.user.createdAt.toISOString(),
          updatedAt: order.user.updatedAt.toISOString(),
          company: {
            ...order.user.company,
            createdAt: order.user.company.createdAt.toISOString(),
            updatedAt: order.user.company.updatedAt.toISOString(),
            stats: companyStats,
          },
        },
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        pickupTimeStart: order.pickupTimeStart.toISOString(),
        pickupTimeEnd: order.pickupTimeEnd.toISOString(),
        shippingTimeStart: order.shippingTimeStart.toISOString(),
        shippingTimeEnd: order.shippingTimeEnd.toISOString(),
      };
    })
  );
  return safeOrders;
}
