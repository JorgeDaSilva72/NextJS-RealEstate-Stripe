// Cedrico 10/12/2024

"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { User as PrismaUser } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { checkFileExists } from "@/lib/upload";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { userOptions } from "../data/userOptions";

interface Props {
  user: PrismaUser;
}

const UserProfilePanel = ({ user }: Props) => {
  const [isAvatar, setIsAvatar] = useState(false);
  const pathname = usePathname();
  const optionsRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Vérification de l'avatar utilisateur uniquement après le montage côté client
    if (user.avatarUrl) {
      (async () => {
        const avatarFileName = user.avatarUrl?.split("/").at(-1);
        if (avatarFileName) {
          const isAvatar = await checkFileExists("avatars", avatarFileName);
          setIsAvatar(isAvatar);
        }
      })();
    }
  }, [user.avatarUrl]);

  // Gestion de la largeur de fenêtre
  // Ce useEffect est déclenché une fois que le composant est monté côté client
  useEffect(() => {
    // Mise à jour de la largeur de la fenêtre côté client
    const updateWindowWidth = () => setWindowWidth(window.innerWidth);

    // Initialiser la largeur de la fenêtre après le montage
    updateWindowWidth();

    // Écouter les changements de taille de la fenêtre
    window.addEventListener("resize", updateWindowWidth);

    // Nettoyage de l'événement à la destruction du composant
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

  // const optionClassName =
  //   "option hover:scale-95 hover:text-white shadow-md border border-[#ccc] cursor-pointer rounded-md text-[#333] bg-[#f9f9f9] p-3 flex items-center gap-3 transition-all duration-300 ease-in-out transform ";

  const handleLinkClick = () => {
    // Ferme le menu lorsqu'un lien est cliqué
    setIsOpen(false);
  };

  // Gestion de la largeur de fenêtre
  const getMenuPositionClass = () => {
    if (windowWidth < 600 && pathname !== "/") return "top-[9vh] right-[5vw]";
    return "top-[6.5vh] right-[2.5vw]";
  };

  const isMenuVisible = isOpen
    ? "opacity-100 pointer-events-auto scale-100"
    : "opacity-0 pointer-events-none scale-0";

  const getOptionClass = (url: string) =>
    `option hover:scale-95 hover:text-white shadow-md border border-[#ccc] cursor-pointer rounded-md text-[#333] bg-[#f9f9f9] p-3 flex items-center gap-3 transition-all duration-300 ease-in-out transform ${
      url === "/logout"
        ? "hover:bg-red-600"
        : url === "/user/favoriteProperties"
        ? "hover:bg-[#e685c2d4]"
        : url === "/user/properties"
        ? "hover:bg-blue-500"
        : "hover:bg-gray-600"
    }`;

  const getRedirectURL = () =>
    process.env.NODE_ENV === "production"
      ? "https://afriqueavenirimmobilier.com/"
      : "http://localhost:3000/";

  const getName = (name: {firstName: string, lastName: string}) => {
    const lastName = name.lastName.split(" ")[0].length > 15 ? name.lastName.split(" ")[0].slice(0, 13) + " ..." : name.lastName.split(" ")[0];
    const firstName = name.firstName[0].toUpperCase() + ".";
    return firstName + " " + lastName;
  }

  return (
    <>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`transition duration-300 ease-in-out flex justify-center items-center cursor-pointer w-12 h-12 rounded-full overflow-hidden flex-shrink-0 active:scale-90 ${
          pathname == "/" ? "animate-shadowPulse" : "animate-shadowPulseBlue"
        }`}
      >
        <Image
          // src={isAvatar && user.avatarUrl ? user.avatarUrl : "/user.png"}
          src={user.avatarUrl || "/user.png"}
          onError={(e) => (e.currentTarget.src = "/user.png")}
          alt="Image profil"
          width={48}
          height={48}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {/* <div
        className={`w-auto h-auto flex flex-col gap-2 transition-all duration-300 ease-in-out absolute md:top-[3vh] md:right-[4.7vw] top-[6.5vh] right-[2.5vw] ${
          windowWidth < 600 && pathname !== "/" ? "top-[9vh]" : "top-[6.5vh]"
        } ${
          isOpen
            ? "opacity-100 pointer-events-auto scale-100"
            : "opacity-0 pointer-events-none scale-0"
        }`}
        ref={optionsRef}
        // style={{
        //   backdropFilter: "blur(20px)", // Applique le flou de l'arrière-plan
        //   backgroundColor: "rgba(255, 255, 255, 0.6)", // Arrière-plan légèrement transparent
        // }}
      > */}
      <div
        className={` w-auto h-auto flex flex-col gap-2 transition-all duration-300 ease-in-out absolute md:top-[3vh] md:right-[4.7vw] ${getMenuPositionClass()} ${isMenuVisible} z-[1000] bg-white/90 rounded-lg`}
        ref={optionsRef}
      >
        {userOptions.map((option, index) => (
          <div key={index}>
            {option.url === "/logout" ? (
              <LogoutLink
                // className={`${optionClassName} hover:bg-red-600`}
                className={getOptionClass(option.url)}
                postLogoutRedirectURL={getRedirectURL()}
                onClick={() => {
                  setTimeout(() => {
                    router.push(getRedirectURL());
                  }, 1000);
                }}
                // onClick={handleLinkClick} // Ferme le menu au clic sur Déconnexion
              >
                {option.svg}
                <span>{option.name}</span>
              </LogoutLink>
            ) : (
              <Link
                href={option.url}
                className={getOptionClass(option.url)}
                // className={`${optionClassName} ${
                //   option.url == "/user/favoriteProperties"
                //     ? "hover:bg-[#e685c2d4]"
                //     : option.url == "/user/properties"
                //     ? "hover:bg-blue-500"
                //     : "hover:bg-gray-600"
                // }`}
                onClick={handleLinkClick} // Ferme le menu au clic sur un lien
              >
                {option.svg}
                <span>
                  {option.url == "/user/profile"
                    ? getName(user)
                    : option.name}
                </span>
              </Link>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default UserProfilePanel;
