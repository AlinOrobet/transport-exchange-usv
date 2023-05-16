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
        light: "#C9C9C9",
        light_shadow: "#E0E0E0",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")({strategy: "class"})],
};
