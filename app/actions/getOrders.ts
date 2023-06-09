import prisma from "@/app/libs/prismadb";
import getCompanyStats from "./getCompanyStats";
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
  if (variant === "OldOrders") {
    where.status = {in: ["In progress", "Completed"]};
  } else {
    where.status = "Posted";
  }

  const whereTotalCount: any = {...where};

  if (truckCategory) {
    const truckCategoryArray = truckCategory.split("/").filter(Boolean);
    if (truckCategoryArray.length > 0) {
      where.truckCategory = {hasSome: truckCategoryArray};
    }
  }

  if (address && !range) {
    where.OR = [{startAddress: {contains: address}}, {stopAddress: {contains: address}}];
  }

  if (startDate && endDate) {
    where.OR = [
      {
        pickupTimeStart: {lte: startDate},
        pickupTimeEnd: {gte: endDate},
      },
      {
        pickupTimeStart: {lte: endDate},
        pickupTimeEnd: {gte: startDate},
      },
      {
        shippingTimeStart: {lte: startDate},
        shippingTimeEnd: {gte: endDate},
      },
      {
        shippingTimeStart: {lte: endDate},
        shippingTimeEnd: {gte: startDate},
      },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: {pickupTimeStart: "asc"},
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

  const safeOrders = await Promise.all(
    orders.map(async (order: any) => {
      const companyStats = await getCompanyStats(order.user.company.id, order.user.accountType); // Apelul la acțiunea getCompanyStats pentru fiecare companie

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
            stats: companyStats, // Adăugarea statisticilor în obiectul companiei
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
                stats: await getCompanyStats(
                  order.winningUser.company.id,
                  order.winningUser.company.accountType
                ), // Apelul la acțiunea getCompanyStats pentru compania câștigătoare (dacă există)
              },
            }
          : null,
        bets: await Promise.all(
          order.bets.map(async (bet: any) => {
            const userStats = await getCompanyStats(
              bet.user.company.id,
              bet.user.company.accountType
            ); // Apelul la acțiunea getCompanyStats pentru compania utilizatorului

            return {
              ...bet,
              createdAt: bet.createdAt.toISOString(),
              user: {
                ...bet.user,
                createdAt: bet.user.createdAt.toISOString(),
                updatedAt: bet.user.updatedAt.toISOString(),
                company: {
                  ...bet.user.company,
                  createdAt: bet.user.company.createdAt.toISOString(),
                  updatedAt: bet.user.company.updatedAt.toISOString(),
                  stats: userStats, // Adăugarea statisticilor în obiectul companiei utilizatorului
                },
              },
              beneficiary: {
                ...bet.beneficiary,
                createdAt: bet.beneficiary.createdAt.toISOString(),
                updatedAt: bet.beneficiary.updatedAt.toISOString(),
                company: {
                  ...bet.beneficiary.company,
                  createdAt: bet.beneficiary.company.createdAt.toISOString(),
                  updatedAt: bet.beneficiary.company.updatedAt.toISOString(),
                  stats: await getCompanyStats(
                    bet.beneficiary.company.id,
                    bet.beneficiary.company.accountType
                  ), // Apelul la acțiunea getCompanyStats pentru compania beneficiarului
                },
              },
            };
          })
        ),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        pickupTimeStart: order.pickupTimeStart.toISOString(),
        pickupTimeEnd: order.pickupTimeEnd.toISOString(),
        shippingTimeStart: order.shippingTimeStart.toISOString(),
        shippingTimeEnd: order.shippingTimeEnd.toISOString(),
      };
    })
  );

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
