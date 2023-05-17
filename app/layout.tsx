import "./globals.css";
import {Montserrat} from "next/font/google";
import ClientOnly from "./components/ClientOnly";
import ThemeContext from "./context/ThemeContext";
import ToasterContext from "./context/ToasterContext";
const font = Montserrat({
  subsets: ["latin"],
});

export const metadata = {
  title: "Cargo connect",
  description: "Orobet Alin",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${font.className} bg-light dark:bg-dark`}>
        <ClientOnly>
          <ToasterContext />
          <ThemeContext>
            <div>{children}</div>
          </ThemeContext>
        </ClientOnly>
      </body>
    </html>
  );
}
