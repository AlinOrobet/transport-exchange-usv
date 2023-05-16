"use client";
import React, {useEffect, useState} from "react";
import Logo from "./Logo";
import NavList from "./NavList";
import {RxHamburgerMenu, RxCross1} from "react-icons/rx";
import {motion} from "framer-motion";
import {SafeUser} from "@/app/types";
interface NavbarProps {
  currentUser: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({currentUser}) => {
  const [show, setShow] = useState(false);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const transitionNavBar = () => {
    if (window.scrollY > 100) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", transitionNavBar);
    return () => window.removeEventListener("scroll", transitionNavBar);
  }, []);
  return (
    <div
      className={`sticky top-0 w-full py-8 ${show ? "bg-light dark:bg-dark" : "bg-transparent"}`}
    >
      <div className="lg:hidden">
        <button
          onClick={() => setMobileNavbar(!mobileNavbar)}
          className="text-dark dark:text-light"
        >
          {mobileNavbar ? <RxCross1 size={30} /> : <RxHamburgerMenu size={30} />}
        </button>
        {mobileNavbar && (
          <motion.div
            initial={{scale: 0, opacity: 0, x: "-50%", y: "-50%"}}
            animate={{scale: 1, opacity: 1}}
            className="lg:hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[75%] sm:min-w-[50vh] flex flex-col items-center justify-between bg-dark/90 dark:bg-light/75 rounded-lg backdrop-blur-md py-10 z-30"
          >
            <NavList closeMobileNavbar={() => setMobileNavbar(false)} currentUser={currentUser} />
          </motion.div>
        )}
      </div>
      <div className="hidden lg:inline">
        <NavList row currentUser={currentUser} />
      </div>
      <div className="absolute top-4 left-[50%] translate-x-[-50%]">
        <Logo />
      </div>
    </div>
  );
};

export default Navbar;

export const navbarItems = [
  {href: "/#home", name: "Home"},
  {href: "/#features", name: "Features"},
  {href: "/#subscriptions", name: "Subscriptions"},
  {href: "/#contact", name: "Contact"},
];
