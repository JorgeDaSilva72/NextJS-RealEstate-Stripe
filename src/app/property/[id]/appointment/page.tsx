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
  deleteAppointment,
  getAppointmentsByProperty,
  updateAppointment,
} from "@/lib/actions/appointment";
import ModalDelete from "@/app/components/ModalDelete";

const localizer = momentLocalizer(moment);

export interface AppointmentEvent {
  id?: number;
  title: string;
  start: Date | string;
  end: Date | string;
  userId: string;
  propertyId: number;
  state?: string;
}

const DndCalendar = withDragAndDrop<AppointmentEvent>(BigCalendar);

const AppointmentPage = ({ params }: Props) => {
  const { user } = useKindeBrowserClient();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<AppointmentEvent>>();
  const formatDate = useGetFormatDate();

  const handleAdd = (start: Date) => {
    setInitialData(undefined);
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
  const handleEdit = (event: AppointmentEvent) => {
    if (event.userId != user?.id) {
      toast.error("Erreur vous ne pouvez pas modifier ce rendez-vous");
      return;
    }
    const startDate = formatDate(new Date(event.start));
    const endDate = formatDate(new Date(event.end));
    setInitialData({ ...event, start: startDate, end: endDate });
    setIsFormVisible(true);
  };
  const handleClose = () => {
    setInitialData(undefined);
    setIsFormVisible(false);
  };
  const handleSubmit = async (value: AppointmentValue) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(today.getDate() + 1);
    if (value.start < today) {
      toast.error("Cette date est déjà passée");
      return;
    }
    if (!user?.id) {
      toast.error("Utilisateur non authentifié");
      return;
    }
    if (!params.id) {
      toast.error("Propriété non reconnue");
      return;
    }
    if (initialData?.state != "pending") {
      toast.error("Le rendez-vous ne peut plus être modifier");
      return;
    }
    //Verifier s'il y a pas de visite simultané, il dois avoir une difference de deux heures
    const checkVisits = events
      .filter((event) => event.id != initialData.id)
      .map((event) => {
        const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 heures en millisecondes
        const valueStart = new Date(value.start).getTime();
        const valueEnd = new Date(value.end).getTime();
        const eventStart = new Date(event.start).getTime();
        const eventEnd = new Date(event.end).getTime();
        // Vérifie s'il y a une séparation d'au moins 2 heures entre les intervalles
        const isSeparated =
          valueEnd + twoHoursInMs <= eventStart || // L'intervalle 'value' se termine 2h avant 'event'
          eventEnd + twoHoursInMs <= valueStart;
        if (!isSeparated) return false;
        return true;
      });

    if (checkVisits.includes(false)) {
      toast.error("Pas de visite simultané");
      return;
    }
    let results;

    if (initialData && initialData.id) {
      results = await updateAppointment({
        id: initialData.id,
        userId: user.id,
        propertyId: parseInt(params.id),
        end: new Date(value.end).toISOString(),
        start: new Date(value.start).toISOString(),
        title: "Description : " + value.title.replace("Description : ", ""),
      });
    } else
      results = await createAppointment({
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

    setInitialData(undefined);
    setIsFormVisible(false);
  };
  const handleDelete = async () => {
    if (!initialData?.id) {
      toast.error("Erreur identifiant");
      return;
    }
    const result = await deleteAppointment(initialData.id, parseInt(params.id));
    if (result.success) {
      setEvents(result.data)
      toast.success(result.message);
    } else toast.error(result.message);
    setIsModalOpen(false);
    setInitialData(undefined);
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
          onSelectEvent={(event) => handleEdit(event)}
          onSelectSlot={({ start }) => handleAdd(start)}
          events={events}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={view}
          view={view}
          date={date}
          onView={(view) => setView(view)}
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
          onDelete={() => setIsModalOpen(true)}
        />
      )}
      <ModalDelete
        isOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        slug="le rendez-vous"
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AppointmentPage;
