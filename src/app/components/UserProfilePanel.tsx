"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { User as PrismaUser } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Props {
  user: PrismaUser;
}
const UserProfilePanel = ({ user }: Props) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, [])

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user.avatarUrl ?? "/profile.png",
          }}
          className="transition-transform"
          name={width < 500 ? '' : `${user.firstName[0].toUpperCase()} ${user.lastName}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem>
          <Link href="/user/profile">Mon Profil</Link>
        </DropdownItem>
        <DropdownItem>
          <Link href="/user/favoriteProperties">Favoris</Link>
        </DropdownItem>
        <DropdownItem>
          <Link href="/user/properties">Mes Annonces</Link>
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          <LogoutLink>Se Déconnecter</LogoutLink>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfilePanel;
