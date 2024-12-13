"use client";
import PageTitle from "@/app/components/pageTitle";
import React, { use, useState } from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Event,
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
import { createAppointment } from "@/lib/actions/appointment";

const localizer = momentLocalizer(moment);

export interface AppointmentEvent {
  id?: number;
  title: string;
  start: Date | string;
  end: Date | string;
  userId: string;
  propertyId: number;
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
  const formatDate = useGetFormatDate();

  const handleAdd = (start: Date) => {
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
    await createAppointment({
      userId: user.id,
      propertyId: parseInt(params.id),
      end: value.end,
      start: value.start,
      title: value.title,
    });
    console.log("Value", user.id, params.id, value);
  };
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
