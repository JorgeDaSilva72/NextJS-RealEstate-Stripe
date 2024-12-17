"use server";

import { AppointmentEvent } from "@/app/property/[id]/appointment/page";
import prisma from "../prisma";

export const createAppointment = async (appointment: AppointmentEvent) => {
  if (!appointment?.userId) {
    console.error("Utilisateur non authentifié");
    return { success: false, message: "Utilisateur non authentifié", data: [] };
  }
  if (!appointment?.propertyId) {
    console.error("Propriété non reconnue");
    return { success: false, message: "Propriété non reconnue", data: [] };
  }

  try {
    const isPropertyToUser = await prisma.property.findUnique({
      where: { id: appointment.propertyId, userId: appointment.userId },
    });

    if (isPropertyToUser) {
      console.error(
        "Pas de Rendez-vous dans une propriété qui vous appartiennent"
      );
      return {
        success: false,
        message: "Pas de Rendez-vous dans une propriété qui vous appartiennent",
        data: [],
      };
    }

    const result = await prisma.$transaction(async (tx) => {
      const AddedAppointment = await tx.appointment.create({
        data: { ...appointment },
      });
      return AddedAppointment;
    });

    const allAppointmentsByProperty = await getAppointmentsByProperty(
      appointment.propertyId
    );

    console.log("Rendez-vous sauvegarder ", { result });
    return {
      ...allAppointmentsByProperty,
      message: allAppointmentsByProperty.success
        ? "Rendez-vous ajouté"
        : "Erreur lors de l'ajout du rendez-vous",
    };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du Rendez-vous : ", error);
    return {
      success: false,
      message: "Erreur lors de l'enregistrement du Rendez-vous",
      data: [],
    };
  }
};

export const getAppointmentsByProperty = async (propertyId: number) => {
  try {
    const allAppointmentsByProperty = await prisma.appointment.findMany({
      where: { propertyId },
    });

    return { success: true, data: allAppointmentsByProperty };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du donnée des rendez-vous : ",
      error
    );
    return {
      success: false,
      message: "Erreur lors de la récupération du donnée des rendez-vous",
      data: [],
    };
  }
};
