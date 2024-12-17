"use client";
import PageTitle from "@/app/components/pageTitle";
import React, { useEffect, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
  View,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppointmentForm, {
  AppointmentValue,
} from "./_components/AppointmentForm";
import useGetFormatDate from "@/app/hooks/useGetFormatDate";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { toast } from "react-toastify";
import { Props } from "../page";
import {
  createAppointment,
  getAppointmentsByProperty,
} from "@/lib/actions/appointment";

const localizer = momentLocalizer(moment);

export type AppointmentState = "pending" | "accepted" | "refused";
export interface AppointmentEvent {
  id?: number;
  title: string;
  start: Date | string;
  end: Date | string;
  userId: string;
  propertyId: number;
  state?: AppointmentState;
}

export type EventItem = {
  start: Date;
  end: Date;
  data?: { appointment?: AppointmentEvent };
  isDraggable?: boolean;
};

const DndCalendar = withDragAndDrop<AppointmentEvent>(BigCalendar);

const AppointmentPage = ({ params }: Props) => {
  const { user } = useKindeBrowserClient();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [initialData, setInitialData] = useState<Partial<AppointmentEvent>>();
  const [eventUserId, setEventUserId] = useState("");
  const formatDate = useGetFormatDate();

  const handleAdd = (start: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 1);
    if (start < today) {
      toast.error("Cette date est déjà passée");
      return;
    }
    setIsFormVisible(true);
    const startDate = formatDate(start);
    setInitialData((prev) => {
      return { ...prev, start: startDate };
    });
  };
  const handleClose = () => setIsFormVisible(false);
  const handleSubmit = async (value: AppointmentValue) => {
    if (!user?.id) {
      toast.error("Utilisateur non authentifié");
      return;
    }
    if (!params.id) {
      toast.error("Propriété non reconnue");
      return;
    }

    //Verifier s'il y a pas de visite simultané, il dois avoir une difference de deux heures
    const checkVisits = events.map((event) => {
      const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 heures en millisecondes

      const valueStart = new Date(value.start).getTime();
      const valueEnd = new Date(value.end).getTime();
      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();

      // Vérifie s'il y a une séparation d'au moins 2 heures entre les intervalles
      const isSeparated =
        valueEnd + twoHoursInMs <= eventStart || // L'intervalle 'value' se termine 2h avant 'event'
        eventEnd + twoHoursInMs <= valueStart;
      if (
        (!eventUserId && !isSeparated) ||
        (eventUserId && eventUserId != user.id && !isSeparated)
      ) {
        return false;
      }
      return true;
    });

    if (checkVisits.includes(false)) {
      toast.error("Pas de visite simultané");
      return;
    }
    const results = await createAppointment({
      userId: user.id,
      propertyId: parseInt(params.id),
      end: new Date(value.end).toISOString(),
      start: new Date(value.start).toISOString(),
      title: "Description : " + value.title,
    });
    if (results.success) {
      setEvents(results.data);
      toast.success(results.message);
    } else toast.error(results.message);

    setEventUserId("");
    setIsFormVisible(false);
  };

  useEffect(() => {
    (async () => {
      const results = await getAppointmentsByProperty(parseInt(params.id));
      if (results.success) setEvents(results.data);
      else toast.error(results.message);
    })();
  }, [params.id]);

  return (
    <div className="bg-gray-50">
      <PageTitle
        title="Calendrier de Rendez-Vous"
        href="/result"
        linkCaption="Retour aux annonces"
      />
      <div className="p-5 h-[80vh]">
        <DndCalendar
          localizer={localizer}
          onSelectEvent={({ id, userId, propertyId }) =>
            console.log("START", id, userId, propertyId)
          }
          onSelectSlot={({ start }) => handleAdd(start)}
          events={events}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={view}
          view={view}
          date={date}
          onView={(view) => setView(view)}
          draggableAccessor={(event) => true}
          onNavigate={(date) => {
            setDate(new Date(date));
          }}
          selectable
        />
      </div>
      {isFormVisible && (
        <AppointmentForm
          onClose={handleClose}
          onSubmit={handleSubmit}
          initialData={initialData}
        />
      )}
    </div>
  );
};

export default AppointmentPage;
