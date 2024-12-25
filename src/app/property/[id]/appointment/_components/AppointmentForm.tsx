import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { motion } from "framer-motion";
import { AppointmentEvent } from "../page";
import { appointmentValidationSchema } from "@/lib/validations/appointmentValidation";
import { appointmentFormFields } from "@/data/appointments";

export interface AppointmentValue {
  start: Date | string;
  end: Date | string;
  title: string;
}

interface AppointmentFormProps {
  onClose: () => void;
  onSubmit: (data: AppointmentValue) => void;
  initialData?: Partial<AppointmentEvent>;
  onDelete: () => void;
}

const AppointmentForm = ({
  onClose,
  onSubmit,
  initialData,
  onDelete,
}: AppointmentFormProps) => {
  const [isVisible, setIsVisible] = useState(true);

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
        validationSchema={appointmentValidationSchema}
        onSubmit={(values) => {
          onSubmit(values);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {appointmentFormFields.map((field, index) => (
              <div key={index}>
                <label
                  htmlFor={field.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
                {field.type == "textarea" ? (
                  <Field
                    as={field.type}
                    id={field.id}
                    name={field.id}
                    className={field.className}
                    rows={field.rows}
                  />
                ) : (
                  <Field
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    className={field.className}
                  />
                )}
                <ErrorMessage
                  name={field.id}
                  component="div"
                  className="text-sm text-red-500"
                />
              </div>
            ))}

            {/* Boutons */}
            <div className="flex justify-end space-x-4">
              {initialData?.id && (
                <button
                  onClick={() => onDelete()}
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
