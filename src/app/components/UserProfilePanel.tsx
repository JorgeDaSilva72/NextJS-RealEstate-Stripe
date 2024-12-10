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
import React, { useEffect, useRef, useState } from "react";
import { checkFileExists } from "@/lib/upload";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { userOptions } from "../data/userOptions";

interface Props {
  user: PrismaUser;
}
const UserProfilePanel = ({ user }: Props) => {
  const [isAvatar, setIsAvatar] = useState(false);
  const pathname = usePathname();
  const optionsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (user.avatarUrl) {
        const avatarFileName = user.avatarUrl.split("/").at(-1);
        if (avatarFileName) {
          const isAvatar = await checkFileExists("avatars", avatarFileName);
          setIsAvatar(isAvatar);
        }
      }
    })();
  }, [user]);

  const optionClassName =
    "option hover:scale-95 hover:text-[aliceblue] shadow-md border border-[#ccc] cursor-pointer rounded-md text-[#ccc] bg-[aliceblue] p-2 flex items-center gap-2.5 transition duration-250 ease-in-out ";

  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={
          "transition duration-250 ease-in-out flex justify-center items-center cursor-pointer w-10 h-10 rounded-full overflow-hidden flex-shrink-0 active:scale-90 " +
          (pathname == "/" ? "animate-shadowPulse" : "animate-shadowPulseBlue")
        }
      >
        <Image
          src={isAvatar && user.avatarUrl ? user.avatarUrl : "/user.png"}
          alt="Image profil"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
      <div
        className={
          "w-auto h-auto flex flex-col gap-1.5 transition duration-300 ease-in-out absolute md:top-[3vh] md:right-[4.7vw] top-[6.5vh] right-[2.5vw] " +
          (window.innerWidth < 600 && pathname !== "/"
            ? "top-[9vh]"
            : "top-[6.5vh]") +
          (isOpen
            ? " opacity-1 pointer-events-all scale-1"
            : " opacity-0 pointer-events-none scale-0")
        }
        ref={optionsRef}
      >
        {userOptions.map((option, index) => (
          <>
            {option.url === "/logout" ? (
              <LogoutLink
                className={optionClassName + "hover:bg-red-600"}
                key={index}
              >
                {option.svg}
                <span>{option.name}</span>
              </LogoutLink>
            ) : (
              <Link
                href={option.url}
                key={index}
                className={
                  optionClassName +
                  (option.url == "/user/favoriteProperties"
                    ? "hover:bg-[#e685c2d4]"
                    : option.url == "/user/properties"
                    ? "hover:bg-blue-500"
                    : "hover:bg-gray-600")
                }
              >
                {option.svg}
                <span>
                  {option.url == "/user/profile"
                    ? user.lastName[0].toUpperCase() + " " + user.firstName
                    : option.name}
                </span>
              </Link>
            )}
          </>
        ))}
      </div>
    </>
    // <Dropdown placement="bottom-start">
    //   <DropdownTrigger>
    //     <User
    //       as="button"
    //       avatarProps={{
    //         isBordered: true,
    //         src: user.avatarUrl ?? "/profile.png",
    //       }}
    //       className="transition-transform"
    //       name={width < 500 ? '' : `${user.firstName[0].toUpperCase()} ${user.lastName}`}
    //     />
    //   </DropdownTrigger>
    //   <DropdownMenu aria-label="User Actions" variant="flat">
    //     <DropdownItem>
    //       <Link href="/user/profile">Mon Profil</Link>
    //     </DropdownItem>
    //     <DropdownItem>
    //       <Link href="/user/favoriteProperties">Favoris</Link>
    //     </DropdownItem>
    //     <DropdownItem>
    //       <Link href="/user/properties">Mes Annonces</Link>
    //     </DropdownItem>
    //     <DropdownItem key="logout" color="danger">
    //       <LogoutLink>Se Déconnecter</LogoutLink>
    //     </DropdownItem>
    //   </DropdownMenu>
    // </Dropdown>
  );
};

export default UserProfilePanel;
