"use client";
import React from "react";

import {
  FaDribbbleSquare,
  FaFacebookSquare,
  FaGithubSquare,
  FaInstagram,
  FaTwitterSquare,
} from "react-icons/fa";
import Logo from "../navbar/Logo";
import IconItem from "./IconItem";
const Footer = () => {
  const FooterData = [
    {
      id: 1,
      title: "About",
      items: [
        {
          id: 1,
          title: "Analytics",
        },
        {
          id: 2,
          title: "Marketing",
        },
        {
          id: 3,
          title: "Commerce",
        },
      ],
    },
    {
      id: 2,
      title: "Support",
      items: [
        {
          id: 1,
          title: "Pricing",
        },
        {
          id: 2,
          title: "Document",
        },
        {
          id: 3,
          title: "Guides",
        },
      ],
    },
    {
      id: 3,
      title: "Company",
      items: [
        {
          id: 1,
          title: "About",
        },
        {
          id: 2,
          title: "Blog",
        },
        {
          id: 3,
          title: "Jobs",
        },
      ],
    },
    {
      id: 4,
      title: "Legal",
      items: [
        {
          id: 1,
          title: "Claim",
        },
        {
          id: 2,
          title: "Policy",
        },
        {
          id: 3,
          title: "Terms",
        },
      ],
    },
  ];
  const linkUtil = [
    {id: 1, href: "", icon: FaFacebookSquare},
    {id: 2, href: "", icon: FaDribbbleSquare},
    {id: 3, href: "", icon: FaInstagram},
    {id: 4, href: "", icon: FaGithubSquare},
    {id: 5, href: "", icon: FaTwitterSquare},
  ];
  return (
    <div className="grid gap-5 md:gap-10 lg:grid-cols-3">
      <div>
        <div className="flex items-center space-x-2">
          <Logo />
          <h1 className="text-2xl font-bold text-dark dark:text-light">CargoConnect</h1>
        </div>
        <p className="py-4 font-semibold">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet in accusantium possimus
          minus quasi laborum
        </p>
        <div className="flex justify-between md:w-[75%] my-4 md:my-6">
          {linkUtil.map((link) => (
            <IconItem key={link.id} href={link.href} icon={link.icon} />
          ))}
        </div>
      </div>
      <div className="flex justify-between mb-3 lg:col-span-2">
        {FooterData.map((item) => (
          <div key={item.id}>
            <h6 className="font-bold">{item.title}</h6>
            {item.items.map((subitem) => (
              <ul key={subitem.id}>
                <li className="py-2 text-sm font-medium text-dark_shadow dark:text-light_shadow">
                  {subitem.title}
                </li>
              </ul>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Footer;
