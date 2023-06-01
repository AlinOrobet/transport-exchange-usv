import prisma from "@/app/libs/prismadb";
import {SafeCompany, SafeUser} from "../types";
import getCurrentCompany from "./getCurrentCompany";
import getCurrentUser from "./getCurrentUser";

export interface IOrdersParams {
  page?: number;
  variant?: string;
  truckCategory?: string;
  address?: string;
  addressLat?: number;
  addressLng?: number;
  range?: number;
  startDate?: string;
  endDate?: string;
}

// Funcție pentru convertirea unghiului din grade în radiani
function toRadians(angle: number): number {
  return angle * (Math.PI / 180);
}

// Funcție pentru calcularea distanței în linie dreaptă folosind formula Haversine
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // Raza Pământului în kilometri
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export default async function getOrders(params: IOrdersParams) {
  const currentUser = await getCurrentUser();
  const currentCompany = await getCurrentCompany();
  if (!currentUser || !currentCompany) {
    return {orders: [], count: 0, totalCount: 0};
  }

  const {
    page = 1,
    variant = currentCompany.accountType === "goods" ? "MyOrders" : "AllOrders",
    truckCategory,
    address,
    addressLat,
    addressLng,
    range,
    startDate,
    endDate,
  } = params;

  const where: any = {};

  if (variant === "MyOrders") {
    where.userId = currentUser.id;
  } else if (variant === "CompanyOrders") {
    where.user = {company: {id: currentUser.companyId}};
  } else if (variant === "Favorites") {
    where.id = {
      in: [...(currentUser.favoriteIds || [])],
    };
  }

  const whereTotalCount: any = {...where};

  if (truckCategory) {
    const truckCategoryArray = truckCategory.split("/").filter(Boolean);
    if (truckCategoryArray.length > 0) {
      where.truckCategory = {hasSome: truckCategoryArray};
    }
  }

  if (address && !range) {
    where.AND = {OR: [{startAddress: {contains: address}}, {stopAddress: {contains: address}}]};
  }

  if (startDate && endDate) {
    where.AND = {
      OR: [
        {
          pickupTimeStart: {lte: startDate},
          pickupTimeEnd: {gte: endDate},
        },
        {
          shippingTimeStart: {lte: startDate},
          shippingTimeEnd: {gte: endDate},
        },
      ],
    };
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: {createdAt: "desc"},
    skip: (page - 1) * 10,
    take: 10,
    include: {
      user: {
        include: {
          company: true,
        },
      },
      winningUser: {
        include: {
          company: true,
        },
      },
      bets: {
        include: {
          user: {
            include: {
              company: true,
            },
          },
          beneficiary: {
            include: {
              company: true,
            },
          },
        },
      },
    },
  });

  const safeOrders = orders.map((order: any) => ({
    ...order,
    user: {
      ...order.user,
      createdAt: order.user.createdAt.toISOString(),
      updatedAt: order.user.updatedAt.toISOString(),
      company: {
        ...order.user.company,
        createdAt: order.user.company.createdAt.toISOString(),
        updatedAt: order.user.company.updatedAt.toISOString(),
      },
    },
    winningUser: order.winningUser
      ? {
          ...order.winningUser,
          createdAt: order.winningUser.createdAt.toISOString(),
          updatedAt: order.winningUser.updatedAt.toISOString(),
          company: {
            ...order.winningUser.company,
            createdAt: order.winningUser.company.createdAt.toISOString(),
            updatedAt: order.winningUser.company.updatedAt.toISOString(),
          },
        }
      : null,
    bets: order.bets.map((bet: any) => ({
      ...bet,
      createdAt: bet.createdAt.toISOString(),
      user: {
        ...bet.user,
        createdAt: bet.user.company.createdAt.toISOString(),
        updatedAt: bet.user.company.updatedAt.toISOString(),
        company: {
          ...bet.user.company,
          createdAt: bet.user.company.createdAt.toISOString(),
          updatedAt: bet.user.company.updatedAt.toISOString(),
        },
      },
      beneficiary: {
        ...bet.beneficiary,
        createdAt: bet.beneficiary.company.createdAt.toISOString(),
        updatedAt: bet.beneficiary.company.updatedAt.toISOString(),
        company: {
          ...bet.beneficiary.company,
          createdAt: bet.beneficiary.company.createdAt.toISOString(),
          updatedAt: bet.beneficiary.company.updatedAt.toISOString(),
        },
      },
    })),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    pickupTimeStart: order.pickupTimeStart.toISOString(),
    pickupTimeEnd: order.pickupTimeEnd.toISOString(),
    shippingTimeStart: order.shippingTimeStart.toISOString(),
    shippingTimeEnd: order.shippingTimeEnd.toISOString(),
  }));

  const count = await prisma.order.count({where});
  const totalCount = await prisma.order.count({where: whereTotalCount});

  // Filtrare în funcție de distanță
  if (addressLat && addressLng && range) {
    const result = safeOrders.filter((order: any) => {
      const distanceStart = calculateDistance(
        order.startAddressLat,
        order.startAddressLng,
        addressLat,
        addressLng
      );
      const distanceStop = calculateDistance(
        order.stopAddressLat,
        order.stopAddressLng,
        addressLat,
        addressLng
      );
      return distanceStart <= range || distanceStop <= range;
    });
    return {orders: result, count: result.length, totalCount};
  }

  return {orders: safeOrders, count, totalCount};
}
