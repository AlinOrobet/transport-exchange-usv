import Button from "@/app/components/Button";
import ThemeMode from "@/app/components/ThemeMode";
import {useRouter} from "next/navigation";
import React from "react";
import {navbarItems} from "./Navbar";
import NavItem from "./NavItem";
import {BsGithub, BsLinkedin} from "react-icons/bs";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import {SafeUser} from "@/app/types";
interface NavListProps {
  currentUser: SafeUser | null;
  row?: boolean;
  closeMobileNavbar?: () => void;
}

const NavList: React.FC<NavListProps> = ({currentUser, row, closeMobileNavbar}) => {
  const router = useRouter();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  return (
    <div
      className={`flex items-center ${
        row ? "flex-row justify-between" : "flex-col text-light dark:text-dark"
      }`}
    >
      <div className={`${row ? "flex flex-row" : "flex flex-col"} items-center`}>
        {navbarItems.map((item, index) => (
          <NavItem key={index} name={item.name} href={item.href} />
        ))}
      </div>
      {row ? (
        <div className="flex flex-row items-center space-x-2">
          {currentUser ? (
            <>
              <Button onClick={() => router.push("/dashboard/home")}>Dashboard</Button>
            </>
          ) : (
            <>
              <Button secondary onClick={loginModal.onOpen}>
                Sign in
              </Button>
              <Button onClick={registerModal.onOpen}>Sign up</Button>
            </>
          )}
          <ThemeMode />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {currentUser ? (
            <NavItem name="Dashboard" href="/dashboard" />
          ) : (
            <div className="flex flex-col items-center">
              <NavItem
                name="Sign in"
                displayModal={loginModal.onOpen}
                handleOpen={closeMobileNavbar}
              />
              <NavItem
                name="Sign up"
                displayModal={registerModal.onOpen}
                handleOpen={closeMobileNavbar}
              />
            </div>
          )}
          <div className="flex flex-row items-center mt-2 space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-dark dark:bg-light">
              <BsGithub size={28} className="text-light dark:text-dark" />
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer bg-dark dark:bg-light">
              <BsLinkedin size={24} className="text-light dark:text-dark" />
            </div>
            <ThemeMode />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavList;
