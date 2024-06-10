import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Button, Card, Input, cn } from "@nextui-org/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";

interface Props {
  prev: () => void;
  className?: string;
}
const Contact = ({ prev, className }: Props) => {
  const {
    register,
    formState: { errors },
    control,
    getValues,
  } = useFormContext<AddPropertyInputType>();
  return (
    <Card
      className={cn("grid grid-cols-1 md:grid-cols-3 gap-3 p-2", className)}
    >
      <Input
        {...register("contact.name")}
        errorMessage={errors.contact?.name?.message}
        isInvalid={!!errors.contact?.name}
        label="Nom du contact"
      />

      <Input
        {...register("contact.phone")}
        errorMessage={errors.contact?.phone?.message}
        label="Téléphone"
      />

      <Input
        {...register("contact.email")}
        errorMessage={errors.contact?.email?.message}
        isInvalid={!!errors.contact?.email}
        label="Email"
      />
      <div className="flex justify-center col-span-3 gap-3">
        <Button
          onClick={prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Précédent
        </Button>
        <Button
          endContent={<PlusCircleIcon className="w-6" />}
          color="secondary"
          className="w-36"
          type="submit"
        >
          Sauvegarder
        </Button>
      </div>
    </Card>
  );
};

export default Contact;
