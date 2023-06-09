import {usePathname} from "next/navigation";
import {useMemo} from "react";
import {AiOutlineTeam, AiOutlineMessage} from "react-icons/ai";
import {BiSearchAlt} from "react-icons/bi";
import {RiFileList2Line, RiDashboardFill} from "react-icons/ri";
import {FiSettings} from "react-icons/fi";
import {FaMapMarkedAlt} from "react-icons/fa";

interface IProps {
  accountType: string;
  notificationChat: boolean | undefined;
  notificationSettings: boolean | undefined;
}

const useRoutes = ({notificationChat, notificationSettings, accountType}: IProps) => {
  const pathname = usePathname();
  const routes = useMemo(
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
        label: accountType === "goods" ? "Search transport" : "Route planning",
        href: accountType === "goods" ? "/dashboard/home" : "/dashboard/planner",
        icon: accountType === "goods" ? BiSearchAlt : FaMapMarkedAlt,
        active:
          accountType === "goods" ? pathname === "/dashboard" : pathname === "/dashboard/planner",
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
    [pathname, notificationSettings, notificationChat, accountType]
  );
  return routes;
};
export default useRoutes;
