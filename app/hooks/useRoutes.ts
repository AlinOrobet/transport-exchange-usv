import {usePathname} from "next/navigation";
import {useMemo} from "react";
import {AiOutlineTeam, AiOutlineMessage} from "react-icons/ai";
import {BiSearchAlt} from "react-icons/bi";
import {RiFileList2Line, RiDashboardFill} from "react-icons/ri";
import {FiSettings} from "react-icons/fi";

interface IProps {
  accountType: string | undefined;
  notificationChat: boolean | undefined;
  notificationSettings: boolean | undefined;
}

const useRoutes = ({accountType, notificationChat, notificationSettings}: IProps) => {
  const pathname = usePathname();
  const goodsRoutes = useMemo(
    () => [
      {
        id: 0,
        label: "Home",
        href: "/dashboard/home",
        icon: RiDashboardFill,
        active: pathname === "/dashboard/home",
      },
      {
        id: 1,
        label: "Orders",
        href: "/dashboard/orders",
        icon: RiFileList2Line,
        active: pathname === "/dashboard/orders",
      },
      {
        id: 2,
        label: "Search transport",
        href: "/dashboard/home",
        icon: BiSearchAlt,
        active: pathname === "/dashboard",
      },
      {
        id: 3,
        label: "Team",
        href: "/dashboard/team",
        icon: AiOutlineTeam,
        active: pathname === "/dashboard/team",
      },
      {
        id: 4,
        label: "Chat",
        href: "/dashboard/conversations",
        icon: AiOutlineMessage,
        active: pathname?.includes("/dashboard/conversations"),
        notification: notificationChat,
      },
      {
        id: 5,
        label: "Settings",
        href: "/dashboard/settings",
        icon: FiSettings,
        active: pathname === "/dashboard/settings",
        notification: notificationSettings,
      },
    ],
    [pathname, notificationSettings, notificationChat]
  );
  if (accountType === "goods") {
    return goodsRoutes;
  } else return [];
};
export default useRoutes;
