// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Input, Textarea, cn } from "@nextui-org/react";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }
// const Location = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "location.streetAddress",
//         "location.city",
//         "location.state",
//         "location.zip",
//         "location.region",
//       ])
//     )
//       props.next();
//   };
//   return (
//     <Card
//       className={cn(
//         "p-2  grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("location.streetAddress")}
//         errorMessage={errors.location?.streetAddress?.message}
//         isInvalid={!!errors.location?.streetAddress}
//         label="Adresse"
//         name="location.streetAddress"
//         defaultValue={getValues().location?.streetAddress}
//       />

//       <Input
//         {...register("location.zip")}
//         errorMessage={errors.location?.zip?.message}
//         isInvalid={!!errors.location?.zip}
//         label="Numéro de boîte postale"
//         defaultValue={getValues().location?.zip}
//       />

//       <Input
//         {...register("location.city")}
//         errorMessage={errors.location?.city?.message}
//         isInvalid={!!errors.location?.city}
//         label="Ville"
//         defaultValue={getValues().location?.city}
//       />

//       <Input
//         {...register("location.state")}
//         errorMessage={errors.location?.state?.message}
//         isInvalid={!!errors.location?.state}
//         label="Etat"
//         defaultValue={getValues().location?.state}
//       />

//       <Input
//         {...register("location.region")}
//         errorMessage={errors.location?.region?.message}
//         isInvalid={!!errors.location?.region}
//         label="Région"
//         className="col-span-2"
//         defaultValue={getValues().location?.region}
//       />

//       <Textarea
//         {...register("location.landmark")}
//         errorMessage={errors.location?.landmark?.message}
//         isInvalid={!!errors.location?.landmark}
//         label="Informations complémentaires"
//         className="col-span-2"
//         defaultValue={getValues().location?.landmark}
//       />
//       <div className="flex justify-center col-span-2 gap-3">
//         <Button
//           onClick={props.prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={handleNext}
//           endContent={<ChevronRightIcon className="w-6" />}
//           color="primary"
//           className="w-36"
//         >
//           Suivant
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Location;

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Textarea,
  cn,
} from "@nextui-org/react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { citiesOfMorocco } from "@/app/data/cities";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}

const Location = (props: Props) => {
  const {
    register,
    formState: { errors },
    trigger,
    setValue,
    getValues,
  } = useFormContext<AddPropertyInputType>();

  const handleNext = async () => {
    if (
      await trigger([
        "location.streetAddress",
        "location.city",
        "location.state",
        "location.zip",
        "location.region",
      ])
    ) {
      props.next();
    }
  };

  return (
    <Card
      className={cn(
        "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
        props.className
      )}
    >
      <Input
        {...register("location.streetAddress")}
        errorMessage={errors.location?.streetAddress?.message}
        isInvalid={!!errors.location?.streetAddress}
        label="Adresse"
        name="location.streetAddress"
        defaultValue={getValues().location?.streetAddress}
      />

      <Input
        {...register("location.zip")}
        errorMessage={errors.location?.zip?.message}
        isInvalid={!!errors.location?.zip}
        label="Numéro de boîte postale"
        defaultValue={getValues().location?.zip}
      />

      {/* <Input
        {...register("location.city")}
        errorMessage={errors.location?.city?.message}
        isInvalid={!!errors.location?.city}
        label="Ville"
        defaultValue={getValues().location?.city}
      /> */}

      {/* Select pour la ville */}
      <Select
        // {...register("cityId", { setValueAs: (v: any) => v.toString() })}
        {...register("location.city")}
        errorMessage={errors.location?.city?.message}
        isInvalid={!!errors.location?.city}
        label="Ville"
        placeholder="Choisissez une ville"
        selectionMode="single"
        value={
          citiesOfMorocco.find(
            (city) => city.value === getValues().location?.city
          )?.id || "" // Trouve l'id correspondant à la valeur stockée dans la base
        } // Assure que l'id correspondant à la value soit sélectionné
        onChange={(event) => {
          const selectedId = event.target.value; // Récupérer l id de l'élément sélectionné
          const city = citiesOfMorocco.find(
            (city) => city.id === selectedId // Trouver la ville par id
          );
          if (city) {
            setValue("location.city", city.value); // Enregistre le nom de la ville et non l id
          }
        }}
        // onChange={(event) => setValue("location.city", event.target.value)}
        // defaultSelectedKeys={[
        //   getValues().cityId ? getValues().cityId.toString() : "0",
        // ]}
      >
        {citiesOfMorocco.map((city) => (
          <SelectItem key={city.id} value={city.id}>
            {city.value}
          </SelectItem>
        ))}
      </Select>

      <Input
        {...register("location.state")}
        errorMessage={errors.location?.state?.message}
        isInvalid={!!errors.location?.state}
        label="Etat"
        defaultValue={getValues().location?.state}
      />

      <Input
        {...register("location.region")}
        errorMessage={errors.location?.region?.message}
        isInvalid={!!errors.location?.region}
        label="Région"
        className="col-span-1 md:col-span-2"
        defaultValue={getValues().location?.region}
      />

      <Textarea
        {...register("location.landmark")}
        errorMessage={errors.location?.landmark?.message}
        isInvalid={!!errors.location?.landmark}
        label="Informations complémentaires"
        className="col-span-1 md:col-span-2"
        defaultValue={getValues().location?.landmark}
      />

      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          Précédent
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          Suivant
        </Button>
      </div>
    </Card>
  );
};

export default Location;
