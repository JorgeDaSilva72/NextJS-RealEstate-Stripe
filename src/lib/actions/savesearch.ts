"use server";

import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
import prisma from "../prisma";
import { Property } from "@prisma/client";


export async function deleteFilter(id: number) {
  console.log('id reçu', id)
  if (!id) {
    throw new Error("L'identifiant de la propriété est requis.");
  }

  try {
    const result = await prisma.savedSearch.delete({
      where: { id },
    });

    console.log("deleteFilter: succès", { result });
    return result;
  } catch (error) {
    console.error("Erreur lors de la suppression de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la suppression.");
  }
}

export async function getFilter(id: number) {
  if (!id) {
    throw new Error("L'identifiant de la propriété est requis.");
  }
  try {
    const filter = await prisma.savedSearch.findUnique({
      where: { id },
    });

    return filter;
  } catch (error) {
    console.error("Erreur lors de la récupération de la propriété:", error);
    throw new Error("Une erreur est survenue lors de la récupération.");
  }
}
