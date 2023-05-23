/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#141F2A",
        dark_shadow: "#1C2D39",
        dark_hover: "#19242F",
        light: "#C9C9C9",
        light_shadow: "#E0E0E0",
        light_hover: "#BFBFBF",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({strategy: "class"})],
};
