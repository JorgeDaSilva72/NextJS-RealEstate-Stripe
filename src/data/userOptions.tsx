import HeartSVG from "../app/assets/svg/HeartSVG";
import LogoutSVG from "../app/assets/svg/LogoutSVG";
import PropertySVG from "../app/assets/svg/PropertySVG";
import UserSVG from "../app/assets/svg/UserSVG";
import { NavBarsType } from "./navbars";

export const userOptions: NavBarsType = [
  {
    url: "/user/profile",
    name: "Mon Profil",
    svg: <UserSVG width="25" height="25" />,
  },
  {
    url: "/user/favoriteProperties",
    name: "Mes Favoris",
    svg: <HeartSVG width="25" height="25" />,
  },
  {
    url: "/user/properties",
    name: "Mes Annonces",
    svg: <PropertySVG width="25" height="25" />,
  },
  {
    url: "/logout",
    name: "Déconnecter",
    svg: <LogoutSVG width="25" height="25" />,
  },
];