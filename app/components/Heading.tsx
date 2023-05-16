"use client";
import React from "react";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  underline?: boolean;
  subtitleAction?: () => void;
}
const Heading: React.FC<HeadingProps> = ({title, subtitle, center, underline, subtitleAction}) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-xl font-bold 2xl:text-2xl text-dark">{title}</div>
      {underline && subtitleAction ? (
        <div
          onClick={() => subtitleAction()}
          className="mt-2 text-sm font-semibold underline cursor-pointer text-dark"
        >
          {subtitle}
        </div>
      ) : (
        <div className="mt-2 text-sm font-semibold text-dark">{subtitle}</div>
      )}
    </div>
  );
};

export default Heading;
