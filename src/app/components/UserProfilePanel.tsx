"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  Dropdown,
  DropdownTrigger,
  User,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { User as PrismaUser, SavedSearch } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import prisma from "@/lib/prisma";
// import { getUserIdFromToken } from '@/app/components/savedSearch';


interface Props {
  user: PrismaUser;
  filter: SavedSearch[]
}
const UserProfilePanel = ({ user, filter }: Props) => {
  const [hasFilter, setHasFilter] = useState(false);

  useEffect(() => {
    // Si le nom du filtre existe, on met à jour l'état en `true`
    if (filter.length > 0 && filter[0].name) {
      setHasFilter(true);
    } else {
      setHasFilter(false);
    }
  }, [filter]);

  const filterName = filter.length > 0 ? filter[0].name : '';
  console.log('filtre nom', filterName)


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
          name={`${user.firstName} ${user.lastName}`}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem>
          <Link href="/user/profile">Mon Profil</Link>
        </DropdownItem>
        <DropdownItem>
          <Link href="/user/properties">Mes Annonces</Link>
        </DropdownItem>
        <DropdownItem>
          {!hasFilter && (
            <Link href="/user/search">{filterName}</Link>
          )}
        </DropdownItem>
        <DropdownItem key="logout" color="danger">
          <LogoutLink>Se Déconnecter</LogoutLink>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default UserProfilePanel;
