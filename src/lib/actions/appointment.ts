"use server";

import { AppointmentEvent } from "@/app/property/[id]/appointment/page";
import prisma from "../prisma";

export const createAppointment = async (appointment: AppointmentEvent) => {
  if (!appointment?.id) {
    return console.error("Utilisateur non authentifié");
  }
  if (!appointment.id) {
    return console.error("Propriété non reconnue");
  }

  const result = await prisma.$transaction(async () => {
    // const Addedappointment = await prisma.appointment.create({
    //     data: {}
    // })
  })
};
