import React from "react";
import {useTheme} from "next-themes";
import Image from "next/image";
const ThemeMode = () => {
  const {theme, setTheme} = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`${
        theme === "dark" ? "bg-light_shadow hover:bg-light" : "bg-dark_shadow hover:bg-dark"
      } h-10 w-10 rounded-full flex items-center justify-center`}
    >
      {theme === "dark" ? (
        <Image
          src="/moon-filled-to-sunny-filled-loop-transition.svg"
          alt=""
          width="30"
          height="30"
        />
      ) : (
        <Image
          src="/sunny-filled-loop-to-moon-filled-loop-transition.svg"
          alt=""
          width="30"
          height="30"
        />
      )}
    </button>
  );
};

export default ThemeMode;
