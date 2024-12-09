import React from "react";
import AboutSVG from "../assets/svg/AboutSVG";
import HomeSVG from "../assets/svg/HomeSVG";
import ContactSVG from "../assets/svg/ContactSVG";

type NavBarsType = {
  url: string;
  name: string;
  svg: React.ReactNode;
}[];

export const navBars: NavBarsType = [
  {
    url: "/",
    name: "Accueil",
    svg: <HomeSVG width="40" height="40" />,
  },
  {
    url: "/about",
    name: "À Propos",
    svg: <AboutSVG width="40" height="40" />,
  },
  {
    url: "/contact",
    name: "Contact",
    svg: <ContactSVG width="40" height="40" />,
  },
];
