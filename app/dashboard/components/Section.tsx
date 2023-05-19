import React from "react";

interface SectionProps {
  fit: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({children, fit}) => {
  return (
    <div
      className={`${fit} h-full p-5 rounded-md shadow-xl bg-light_shadow dark:bg-dark_shadow shadow-xl`}
    >
      {children}
    </div>
  );
};

export default Section;
