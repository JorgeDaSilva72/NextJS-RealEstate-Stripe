"use client";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderPropertiesWrapper = () => {
  const pathName = usePathname();
  return (
    <>
      {!pathName.includes("appointment") && (
        <div className="bg-primary-400 flex justify-between items-center p-2">
          <h2 className="text-white text-xl font-semibold px-2">
            Mes annonces
          </h2>
          <Button color="secondary">
            <Link href="/user/properties/add">Créer une annonce</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default HeaderPropertiesWrapper;
