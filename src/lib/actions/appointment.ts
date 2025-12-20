"use server";

import { AppointmentEvent } from "@/app/[locale]/property/[id]/appointment/page";
import prisma from "../prisma";
import { AppointmentState } from "@prisma/client";
import { createNotificationService } from "@/lib/whatsapp/notifications";

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
      const { state, ...rest } = appointment;
      const AddedAppointment = await tx.appointment.create({
        data: {
          ...rest,
          ...(state
            ? { state: state as AppointmentState }
            : { state: AppointmentState.PENDING }),
        },
      });
      return AddedAppointment;
    });

    const allAppointmentsByProperty = await getAppointmentsByProperty(
      appointment.propertyId
    );

    // Send WhatsApp notification if enabled
    try {
      const account = await prisma.whatsAppAccount.findFirst({
        where: { isActive: true, isVerified: true },
      });

      if (account) {
        const notificationService = createNotificationService(account.id);
        // Get user locale from property or default to 'fr'
        const property = await prisma.property.findUnique({
          where: { id: appointment.propertyId },
          include: { user: true },
        });
        const locale = 'fr'; // TODO: Get from user preferences or property locale
        
        // Send confirmation to visitor
        await notificationService.sendAppointmentConfirmation(result.id, locale).catch((err) => {
          console.error('[Appointment] Failed to send WhatsApp confirmation:', err);
        });

        // Send notification to property owner
        if (property?.contact?.phone) {
          await notificationService.sendOwnerAppointmentNotification(
            result.id,
            property.contact.phone,
            locale
          ).catch((err) => {
            console.error('[Appointment] Failed to send owner notification:', err);
          });
        }
      }
    } catch (error) {
      console.error('[Appointment] WhatsApp notification error:', error);
      // Don't fail the appointment creation if notification fails
    }

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
    if (updatedAppointment.state !== AppointmentState.PENDING) {
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
    const { state, ...rest } = appointment;
    const result = await prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        ...rest,
        ...(state ? { state: state as AppointmentState } : {}),
      },
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
      deletedAppointment.state === AppointmentState.CONFIRMED
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
    const today = new Date();
    await prisma.appointment.deleteMany({
      where: {
        start: {
          lt: today,
        },
      },
    });

    const allAppointmentsByProperty = await prisma.appointment.findMany({
      where: { propertyId },
      include: {
        user: true,
        property: {
          include: {
            user: true,
            location: true,
          },
        },
      },
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

export const changeAppointmentState = async (
  id: number,
  state: AppointmentState,
  propertyId: number
) => {
  try {
    if (state === AppointmentState.CONFIRMED) {
      await prisma.appointment.update({
        where: { id },
        data: { state },
      });
    } else {
      await prisma.appointment.delete({ where: { id } });
    }

    const results = await getAppointmentsByProperty(propertyId);

    return results;
  } catch (error) {
    console.error("Erreur lors du changement de state :", error);
    return {
      success: false,
      message: "Erreur lors du changement de state",
      data: [],
    };
  }
};
