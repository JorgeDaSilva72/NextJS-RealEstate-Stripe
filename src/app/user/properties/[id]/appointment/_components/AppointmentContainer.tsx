"use client";
import { AppointmentEvent } from "@/app/property/[id]/appointment/page";
import {
  changeAppointmentState,
  getAppointmentsByProperty,
} from "@/lib/actions/appointment";
import { Property, PropertyLocation, User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { usePathname } from "next/navigation";
import emailjs from "@emailjs/browser";
import { isUserDiamant } from "@/lib/actions/user";
import { useRouter } from "next/router";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

interface AppointmentContainerProps {
  id: number;
}

export type AppointmentWithUserAndProperty = AppointmentEvent & {
  user: User;
  property: Property & {
    user: User;
    location: PropertyLocation | null;
  };
};

const AppointmentContainer = ({ id }: AppointmentContainerProps) => {
  const [appointments, setAppointments] = useState<
    AppointmentWithUserAndProperty[]
  >([]);
  const pathname = usePathname();
  const classNameInfo = "flex gap-7";
  const router = useRouter();
  const { user } = useKindeAuth();

  useEffect(() => {
    (async () => {
      if (user?.id) {
        const foundUser = await isUserDiamant(undefined, user.id);
        if (!foundUser) return router.back()
      }
      const result = await getAppointmentsByProperty(id);
      if (result.success) {
        setAppointments(result.data);
      } else toast.error(result.message);
    })();
  }, [id, user?.id, router]);

  const handleClick = async (
    appointment: AppointmentWithUserAndProperty,
    state: string
  ) => {
    try {
      if (!appointment.id) return;
      console.log(process.env.NEXT_PUBLIC_SERVICE_ID, state);
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!, // Remplacez par votre service ID
        process.env.NEXT_PUBLIC_TEMPLATE_ID!, // Remplacez par votre template ID
        {
          to_name: appointment.user.lastName,
          to_email: appointment.user.email,
          from_name:
            appointment.property.user.firstName +
            " " +
            appointment.property.user.lastName,
          appointment_date: new Date(appointment.start)
            .toISOString()
            .slice(0, 10),
          appointment_time: new Date(appointment.start)
            .toTimeString()
            .slice(0, 6),
          appointment_title: appointment.property.name,
          appointment_country: appointment.property.location?.state,
          appointment_location:
            appointment.property.location?.city +
            " / " +
            appointment.property.location?.region +
            " / " +
            appointment.property.location?.streetAddress,
          status_message: state == "accepted" ? "Accepté ✅" : "Refusé ❌",
          status_color: state == "accepted" ? "green" : "red",
        },
        process.env.NEXT_PUBLIC_PUBLIC_KEY_EMAIL! // Remplacez par votre clé publique
      );
      toast.success("Email envoyé avec succès !");
      const result = await changeAppointmentState(appointment.id, state, id);
      if (result.success) {
        setAppointments(result.data);
      } else toast.error(result.message);
    } catch (error) {
      toast.error("Erreur lors de l'envoi de l'email :" + error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="scrollbar-default flex md:flex-row flex-col flex-wrap gap-6 justify-between px-5 pt-5 w-full max-h-[70vh] overflow-y-auto">
        {appointments.length > 0 &&
          appointments
            .filter((appointment) => {
              if (pathname.includes("accept")) {
                return appointment.state == "accepted";
              } else return appointment.state == "pending";
            })
            .map((appointment, index) => (
              <div className="xl:w-[23%] h-[fit-content] md:w-[45%] w-full flex flex-col gap-2 border-2 border-blue-500 shadow-md rounded-md text-blue-900 p-2" key={index}>
                <div className={classNameInfo}>
                  <span>Titre :</span>
                  <span>{appointment.property.name}</span>
                </div>
                <div className={classNameInfo}>
                  <span>Date de la visite :</span>
                  <span>
                    {new Date(appointment.start).toISOString().slice(0, 10)}
                  </span>
                </div>
                <div className={classNameInfo}>
                  <span>De :</span>
                  <span>
                    {new Date(appointment.start).toTimeString().slice(0, 6)}
                  </span>
                </div>
                <div className={classNameInfo}>
                  <span>À&nbsp;&nbsp;&nbsp;:</span>
                  <span>
                    {new Date(appointment.end).toTimeString().slice(0, 6)}
                  </span>
                </div>
                <div className={classNameInfo}>
                  <span>Description :</span>
                  <span>{appointment.title.replace("Description :", "")}</span>
                </div>
                {appointment.state == "pending" && (
                  <div className="flex flex-col md:flex-row justify-between px-4 bg-white/10 backdrop-blur-sm">
                    <button
                      onClick={() => handleClick(appointment, "accepted")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded shadow-lg hover:bg-indigo-700 mb-4 md:mb-0 text-center"
                    >
                      Accepter
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded shadow-lg hover:bg-red-700  text-center"
                      onClick={() => handleClick(appointment, "refused")}
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

export default AppointmentContainer;
