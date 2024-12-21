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

export const updateAppointment = async (appointment: AppointmentEvent) => {
  if (!appointment?.id) {
    console.error("Erreur données envoyé manquant");
    return {
      success: false,
      message: "Erreur données envoyé manquant",
      data: [],
    };
  }

  try {
    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
    });
    if (!updatedAppointment) {
      console.error("Erreur rendez-vous non trouvé");
      return {
        success: false,
        message: "Erreur rendez-vous non trouvé",
        data: [],
      };
    }
    if (updatedAppointment.state != "pending") {
      console.error("Erreur le rendez-vous ne peut plus être modifier");
      return {
        success: false,
        message: "Le rendez-vous ne peut plus être modifier",
        data: [],
      };
    }
    if (updatedAppointment.userId != appointment.userId) {
      console.error("Erreur vous ne pouvez pas modifier ce rendez-vous");
      return {
        success: false,
        message: "Erreur vous ne pouvez pas modifier ce rendez-vous",
        data: [],
      };
    }
    const result = await prisma.appointment.update({
      where: { id: appointment.id },
      data: { ...appointment },
    });
    console.log("Modification rendez-vous réussie : ", { result });
    const allAppointmentsByProperty = await getAppointmentsByProperty(
      appointment.propertyId
    );
    return {
      ...allAppointmentsByProperty,
      message: allAppointmentsByProperty.success
        ? "Rendez-vous modifié"
        : "Erreur lors de modification du rendez-vous",
    };
  } catch (error) {
    console.error("Erreur lors de la modification : ", error);
    return {
      success: false,
      message: "Erreur lors de la modification",
      data: [],
    };
  }
};

export const deleteAppointment = async (id: number, propertyId: number) => {
  try {
    const deletedAppointment = await prisma.appointment.findUnique({
      where: { id },
    });
    if (!deletedAppointment) {
      console.error("Erreur données non trouvés");
      return {
        success: false,
        message: "Erreur données non trouvés",
        data: [],
      };
    }
    const date = new Date();
    if (
      deletedAppointment.start > date &&
      deletedAppointment.state != "pending"
    ) {
      console.error(
        "Erreur vous n'avez plus le droit d'annuler le rendez-vous"
      );
      return {
        success: false,
        message: "Erreur vous n'avez plus le droit d'annuler le rendez-vous",
        data: [],
      };
    }
    await prisma.appointment.delete({ where: { id } });
    console.log("Suppression du rendez-vous réussie");
    const allAppointmentsByProperty = await getAppointmentsByProperty(
      propertyId
    );
    return {
      ...allAppointmentsByProperty,
      message: allAppointmentsByProperty.success
        ? "Rendez-vous annulé avec succès"
        : "Erreur lors de l'annulation du rendez-vous",
    };
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous");
    return {
      success: false,
      message: "Erreur lors de l'annulation du rendez-vous",
      data: [],
    };
  }
};

export const getAppointmentsByProperty = async (propertyId: number) => {
  try {
    //Supprimer les rendez-vous qui sont déjà passer
    const yesterday = new Date();
    yesterday.setHours(59, 59, 59, 999);
    yesterday.setDate(yesterday.getDate() - 1);
    await prisma.appointment.deleteMany({
      where: {
        start: {
          lt: yesterday,
        },
      },
    });

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
