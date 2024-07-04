import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button, Card, Checkbox, Input, cn } from "@nextui-org/react";
import React from "react";

import { Controller, useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}
const Features = (props: Props) => {
  const {
    register,
    formState: { errors },
    control,
    trigger,
    getValues,
  } = useFormContext<AddPropertyInputType>();
  const handleNext = async () => {
    if (
      await trigger([
        "propertyFeature.area",
        "propertyFeature.bathrooms",
        "propertyFeature.bedrooms",
        "propertyFeature.parkingSpots",
      ])
    )
      props.next();
  };
  return (
    <Card
      className={cn(
        "p-2  grid grid-cols-1 md:grid-cols-2 gap-3",
        props.className
      )}
    >
      <Input
        {...register("propertyFeature.bedrooms", {
          setValueAs: (v: any) => v.toString(),
        })}
        // {...register("propertyFeature.bedrooms")}
        errorMessage={errors.propertyFeature?.bedrooms?.message}
        isInvalid={!!errors.propertyFeature?.bedrooms}
        label="Chambre(s)"
        defaultValue={getValues().propertyFeature?.bedrooms?.toString()}
      />

      <Input
        {...register("propertyFeature.bathrooms", {
          setValueAs: (v: any) => v.toString(),
        })}
        // {...register("propertyFeature.bathrooms")}
        errorMessage={errors.propertyFeature?.bathrooms?.message}
        isInvalid={!!errors.propertyFeature?.bathrooms}
        label="Salle(s) de bain"
        defaultValue={getValues().propertyFeature?.bathrooms?.toString()}
      />
      <Input
        {...register("propertyFeature.parkingSpots", {
          setValueAs: (v: any) => v.toString(),
        })}
        // {...register("propertyFeature.parkingSpots")}
        errorMessage={errors.propertyFeature?.parkingSpots?.message}
        isInvalid={!!errors.propertyFeature?.parkingSpots}
        label="Place(s) de stationnement"
        defaultValue={getValues().propertyFeature?.parkingSpots?.toString()}
      />

      <Input
        {...register("propertyFeature.area", {
          setValueAs: (v: any) => v.toString(),
        })}
        // {...register("propertyFeature.area")}
        errorMessage={errors.propertyFeature?.area?.message}
        isInvalid={!!errors.propertyFeature?.area}
        label="Superficie en m²"
        defaultValue={getValues().propertyFeature?.area?.toString()}
      />
      <div className="flex flex-col  md:flex-row  items-center justify-around ">
        <Controller
          control={control}
          name="propertyFeature.hasSwimmingPool"
          render={({ field }) => (
            <Checkbox
              onChange={field.onChange}
              onBlur={field.onBlur}
              defaultValue={
                getValues().propertyFeature?.hasSwimmingPool ? "true" : "false"
              }
            >
              Possède une piscine
            </Checkbox>
          )}
        />

        <Controller
          control={control}
          name="propertyFeature.hasGardenYard"
          render={({ field }) => (
            <Checkbox
              onChange={field.onChange}
              onBlur={field.onBlur}
              defaultValue={
                getValues().propertyFeature?.hasGardenYard ? "true" : "false"
              }
            >
              Possède un jardin/une cour
            </Checkbox>
          )}
        />

        <Controller
          control={control}
          name="propertyFeature.hasBalcony"
          render={({ field }) => (
            <Checkbox
              onChange={field.onChange}
              onBlur={field.onBlur}
              defaultValue={
                getValues().propertyFeature?.hasBalcony ? "true" : "false"
              }
            >
              Possède un balcon/terrasse
            </Checkbox>
          )}
        />
      </div>
      <div className="flex justify-center col-span-2 gap-3">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-36"
        >
          Suivant
        </Button>
      </div>
    </Card>
  );
};

export default Features;
