import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { AppointmentEvent } from "../page";

export interface AppointmentValue {
  start: Date | string;
  end: Date | string;
  title: string;
}

interface AppointmentFormProps {
  onClose: () => void;
  onSubmit: (data: AppointmentValue) => void;
  initialData?: Partial<AppointmentEvent>;
}

const AppointmentForm = ({
  onClose,
  onSubmit,
  initialData,
}: AppointmentFormProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const validationSchema = Yup.object({
    start: Yup.date().required("La date de début est obligatoire"),
    end: Yup.date()
      .required("La date de fin est obligatoire")
      .min(
        Yup.ref("start"),
        "La date de fin doit être postérieure à la date de début"
      )
      .test(
        "same-day",
        "La date de fin doit être le même jour que la date de début.",
        function (value) {
          const { start } = this.parent;
          if (!value || !start) return true;
          return (
            value.getFullYear() === start.getFullYear() &&
            value.getMonth() === start.getMonth() &&
            value.getDate() === start.getDate()
          );
        }
      ),
  });

  return (
    <motion.div
      initial={{ x: "100%" }} 
      animate={{ x: isVisible ? "0%" : "100%" }} 
      exit={{ x: "100%" }} 
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed top-0 right-0 h-full w-full sm:w-1/4 bg-white shadow-lg z-50 p-6"
    >
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 500); 
        }}
        className="absolute text-2xl top-2 left-2 text-gray-500 hover:text-red-500"
      >
        X
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center mt-6 text-blue-500">
        {initialData ? "Modifier le Rendez-vous" : "Ajouter un Rendez-vous"}
      </h2>

      <Formik
        initialValues={{
          start: initialData?.start || "",
          end: initialData?.end || "",
          title: initialData?.title || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="start"
                className="block text-sm font-medium text-gray-700"
              >
                Date de Début
              </label>
              <Field
                type="datetime-local"
                id="start"
                name="start"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="start"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="end"
                className="block text-sm font-medium text-gray-700"
              >
                Date de Fin
              </label>
              <Field
                type="datetime-local"
                id="end"
                name="end"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="end"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Description du Rendez-vous
              </label>
              <Field
                as="textarea"
                id="title"
                name="title"
                rows="3"
                className="mt-1 block w-full h-[100px] p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-sm text-red-500"
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4">
              {initialData?.id && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600"
                >
                  Supprimer
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-600"
              >
                {initialData?.id ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
};

export default AppointmentForm;
