import React from "react";

interface SectionProps {
  fit: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({children, fit}) => {
  return (
    <div className="flex flex-col xl:flex-row shadow-xl mx-[0.5rem] lg:mx-0 mb-[0.5rem] lg:mr-[2rem] h-full xl:h-[calc(100vh-11.5rem)]">
      <div className={`${fit} h-full p-5 rounded-md shadow-xl bg-light_shadow dark:bg-dark_shadow`}>
        {children}
      </div>
    </div>
  );
};

export default Section;
