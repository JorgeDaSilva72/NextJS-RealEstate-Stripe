export interface FormField {
  id: string;
  type: string;
  className: string;
  label: string;
  rows?: string;
}

export type FormFields = FormField[];

const labelClassName =
  "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

export const appointmentFormFields: FormFields = [
  {
    id: "start",
    type: "datetime-local",
    className: labelClassName,
    label: "Date de Début",
  },
  {
    id: "end",
    type: "datetime-local",
    className: labelClassName,
    label: "Date de Fin",
  },
  {
    id: "title",
    type: "textarea",
    rows: "3",
    className: labelClassName + " h-[100px]",
    label: "Description du Rendez-vous",
  },
];
