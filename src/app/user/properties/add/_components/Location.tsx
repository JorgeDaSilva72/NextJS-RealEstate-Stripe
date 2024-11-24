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
import { countries } from "@/app/data/countries";

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
    <>
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
          {...register("location.state")}
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

        {/* Select pour le pays */}

        <Select
          {...register("location.state")}
          errorMessage={errors.location?.state?.message}
          isInvalid={!!errors.location?.state}
          label="Pays"
          placeholder="Choisissez un pays"
          // Plus besoin de conversion toString() car les IDs sont déjà des strings
          value={getValues().location?.state || ""}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedId = event.target.value;
            const country = countries.find(
              (country) => country.id === selectedId // Comparaison directe car les deux sont des strings
            );
            if (country) {
              setValue("location.state", country.id);
            }
          }}
        >
          {countries.map((country) => (
            <SelectItem key={country.id} value={country.id}>
              {country.value}
            </SelectItem>
          ))}
        </Select>

        {/* Select pour la ville */}

        <Select
          {...register("location.city")}
          errorMessage={errors.location?.city?.message}
          isInvalid={!!errors.location?.city}
          label="Ville"
          placeholder="Choisissez une ville"
          // Plus besoin de conversion toString() car les IDs sont déjà des strings
          value={getValues().location?.city || ""}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedId = event.target.value;
            const city = citiesOfMorocco.find(
              (city) => city.id === selectedId // Comparaison directe car les deux sont des strings
            );
            if (city) {
              setValue("location.city", city.id);
            }
          }}
        >
          {citiesOfMorocco.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.value}
            </SelectItem>
          ))}
        </Select>

        {/* <Select
          {...register("location.city")}
          errorMessage={errors.location?.city?.message}
          isInvalid={!!errors.location?.city}
          label="Ville"
          placeholder="Choisissez une ville"
          // On utilise maintenant la value stockée dans la base de données
          value={getValues().location?.city || ""}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectedValue = event.target.value;
            const city = citiesOfMorocco.find(
              (city) => city.value === selectedValue
            );
            if (city) {
              setValue("location.city", city.value); // On stocke la value plutôt que l'id
            }
          }}
        >
          {citiesOfMorocco.map((city) => (
            // On utilise maintenant city.value comme value du SelectItem
            <SelectItem key={city.id} value={city.value}>
              {city.value}
            </SelectItem>
          ))}
        </Select> */}
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
    </>
  );
};

export default Location;
