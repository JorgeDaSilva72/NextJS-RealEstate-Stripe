// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Checkbox, Input, cn } from "@nextui-org/react";
// import React from "react";

// import { Controller, useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }
// const Features = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     control,
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();
//   const handleNext = async () => {
//     if (
//       await trigger([
//         "propertyFeature.area",
//         "propertyFeature.bathrooms",
//         "propertyFeature.bedrooms",
//         "propertyFeature.parkingSpots",
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
//         {...register("propertyFeature.bedrooms", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         // {...register("propertyFeature.bedrooms")}
//         errorMessage={errors.propertyFeature?.bedrooms?.message}
//         isInvalid={!!errors.propertyFeature?.bedrooms}
//         label="Chambre(s)"
//         defaultValue={getValues().propertyFeature?.bedrooms?.toString()}
//       />

//       <Input
//         {...register("propertyFeature.bathrooms", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         // {...register("propertyFeature.bathrooms")}
//         errorMessage={errors.propertyFeature?.bathrooms?.message}
//         isInvalid={!!errors.propertyFeature?.bathrooms}
//         label="Salle(s) de bain"
//         defaultValue={getValues().propertyFeature?.bathrooms?.toString()}
//       />
//       <Input
//         {...register("propertyFeature.parkingSpots", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         // {...register("propertyFeature.parkingSpots")}
//         errorMessage={errors.propertyFeature?.parkingSpots?.message}
//         isInvalid={!!errors.propertyFeature?.parkingSpots}
//         label="Place(s) de stationnement"
//         defaultValue={getValues().propertyFeature?.parkingSpots?.toString()}
//       />

//       <Input
//         {...register("propertyFeature.area", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         // {...register("propertyFeature.area")}
//         errorMessage={errors.propertyFeature?.area?.message}
//         isInvalid={!!errors.propertyFeature?.area}
//         label="Superficie en m²"
//         defaultValue={getValues().propertyFeature?.area?.toString()}
//       />
//       <div className="flex flex-col  md:flex-row  items-center justify-around ">
//         <Controller
//           {...register("propertyFeature.hasSwimmingPool")}
//           control={control}
//           name="propertyFeature.hasSwimmingPool"
//           render={({ field }) => (
//             <>
//               {/* {console.log("hasSwimmingPool value:", field.value)} */}

//               <Checkbox
//                 checked={field.value || false}
//                 onChange={field.onChange}
//                 onBlur={field.onBlur}
//               >
//                 Possède une piscine
//               </Checkbox>
//             </>
//           )}
//         />

//         <Controller
//           {...register("propertyFeature.hasGardenYard")}
//           control={control}
//           name="propertyFeature.hasGardenYard"
//           render={({ field }) => (
//             <>
//               {/* {console.log("hasGardenYard value:", field.value)} */}
//               <Checkbox
//                 onChange={field.onChange}
//                 checked={field.value || false}
//               >
//                 Possède un jardin/une cour
//               </Checkbox>
//             </>
//           )}
//         />

//         <Controller
//           {...register("propertyFeature.hasBalcony")}
//           control={control}
//           name="propertyFeature.hasBalcony"
//           render={({ field }) => (
//             <>
//               {/* {console.log("hasBalcony value:", field.value)} */}
//               <Checkbox
//                 onChange={field.onChange}
//                 onBlur={field.onBlur}
//                 checked={field.value || false}
//               >
//                 Possède un balcon/terrasse
//               </Checkbox>
//             </>
//           )}
//         />
//       </div>
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

// export default Features;

//-----------------------------------------------------

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Checkbox, Input, cn } from "@nextui-org/react";
// import React from "react";
// import { Controller, useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const Features = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     control,
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "propertyFeature.area",
//         "propertyFeature.bathrooms",
//         "propertyFeature.bedrooms",
//         "propertyFeature.parkingSpots",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   return (
//     <Card
//       className={cn(
//         "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("propertyFeature.bedrooms", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         type="number"
//         errorMessage={errors.propertyFeature?.bedrooms?.message}
//         isInvalid={!!errors.propertyFeature?.bedrooms}
//         label="Chambre(s)"
//         // labelPlacement="outside"
//         startContent={
//           <div className="pointer-events-none flex items-center">
//             <span className="text-default-400 text-small">🛏️</span>
//           </div>
//         }
//         defaultValue={getValues().propertyFeature?.bedrooms?.toString() || ""}
//       />

//       <Input
//         {...register("propertyFeature.bathrooms", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         type="number"
//         errorMessage={errors.propertyFeature?.bathrooms?.message}
//         isInvalid={!!errors.propertyFeature?.bathrooms}
//         label="Salle(s) de bain"
//         startContent={
//           <div className="pointer-events-none flex items-center">
//             <span className="text-default-400 text-small">🚿</span>
//           </div>
//         }
//         defaultValue={getValues().propertyFeature?.bathrooms?.toString()}
//       />

//       <Input
//         {...register("propertyFeature.parkingSpots", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         type="number"
//         errorMessage={errors.propertyFeature?.parkingSpots?.message}
//         isInvalid={!!errors.propertyFeature?.parkingSpots}
//         label="Place(s) de stationnement"
//         startContent={
//           <div className="pointer-events-none flex items-center">
//             <span className="text-default-400 text-small">🚗</span>
//           </div>
//         }
//         defaultValue={getValues().propertyFeature?.parkingSpots?.toString()}
//       />

//       <Input
//         {...register("propertyFeature.area", {
//           setValueAs: (v: any) => v.toString(),
//         })}
//         type="number"
//         errorMessage={errors.propertyFeature?.area?.message}
//         isInvalid={!!errors.propertyFeature?.area}
//         label="Surface habitable en m²"
//         startContent={
//           <div className="pointer-events-none flex items-center">
//             <span className="text-default-400 text-small">📏</span>
//           </div>
//         }
//         defaultValue={getValues().propertyFeature?.area?.toString()}
//       />

//       <div className="flex flex-col md:flex-row items-center justify-around col-span-1 md:col-span-2 gap-2">
//         <div className="flex items-center">
//           <Controller
//             control={control}
//             name="propertyFeature.hasSwimmingPool"
//             render={({ field }) => (
//               <Checkbox
//                 checked={field.value || false}
//                 onChange={field.onChange}
//                 className="mr-2"
//               >
//                 Possède une piscine
//               </Checkbox>
//             )}
//           />
//         </div>

//         <div className="flex items-center">
//           <Controller
//             control={control}
//             name="propertyFeature.hasGardenYard"
//             render={({ field }) => (
//               <Checkbox
//                 checked={field.value || false}
//                 onChange={field.onChange}
//                 className="mr-2"
//               >
//                 Possède un jardin/une cour
//               </Checkbox>
//             )}
//           />
//         </div>

//         <div className="flex items-center">
//           <Controller
//             control={control}
//             name="propertyFeature.hasBalcony"
//             render={({ field }) => (
//               <Checkbox
//                 checked={field.value || false}
//                 onChange={field.onChange}
//                 className="mr-2"
//               >
//                 Possède un balcon/terrasse
//               </Checkbox>
//             )}
//           />
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
//         <Button
//           onClick={props.prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           onClick={handleNext}
//           endContent={<ChevronRightIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Suivant
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Features;

//-----------------------------------------------

// JhnRavelo fixer le bug de la suppression de l'image

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
        {...register("propertyFeature.bedrooms", {
          setValueAs: (v: any) => v.toString(),
        })}
        type="number"
        errorMessage={errors.propertyFeature?.bedrooms?.message}
        isInvalid={!!errors.propertyFeature?.bedrooms}
        label="Chambre(s)"
        // labelPlacement="outside"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">🛏️</span>
          </div>
        }
        defaultValue={getValues().propertyFeature?.bedrooms?.toString() || ""}
      />

      <Input
        {...register("propertyFeature.bathrooms", {
          setValueAs: (v: any) => v.toString(),
        })}
        type="number"
        errorMessage={errors.propertyFeature?.bathrooms?.message}
        isInvalid={!!errors.propertyFeature?.bathrooms}
        label="Salle(s) de bain"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">🚿</span>
          </div>
        }
        defaultValue={getValues().propertyFeature?.bathrooms?.toString()}
      />

      <Input
        {...register("propertyFeature.parkingSpots", {
          setValueAs: (v: any) => v.toString(),
        })}
        type="number"
        errorMessage={errors.propertyFeature?.parkingSpots?.message}
        isInvalid={!!errors.propertyFeature?.parkingSpots}
        label="Place(s) de stationnement"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">🚗</span>
          </div>
        }
        defaultValue={getValues().propertyFeature?.parkingSpots?.toString()}
      />

      <Input
        {...register("propertyFeature.area", {
          setValueAs: (v: any) => v.toString(),
        })}
        type="number"
        errorMessage={errors.propertyFeature?.area?.message}
        isInvalid={!!errors.propertyFeature?.area}
        label="Surface habitable en m²"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">📏</span>
          </div>
        }
        defaultValue={getValues().propertyFeature?.area?.toString()}
      />

      <div className="flex flex-col md:flex-row items-center justify-around col-span-1 md:col-span-2 gap-2">
        <div className="flex items-center">
          <Controller
            control={control}
            name="propertyFeature.hasSwimmingPool"
            render={({ field }) => (
              <Checkbox
                isSelected={field.value || false}
                onChange={field.onChange}
                className="mr-2"
              >
                Possède une piscine
              </Checkbox>
            )}
          />
        </div>

        <div className="flex items-center">
          <Controller
            control={control}
            name="propertyFeature.hasGardenYard"
            render={({ field }) => (
              <Checkbox
                isSelected={field.value || false}
                onChange={field.onChange}
                className="mr-2"
              >
                Possède un jardin/une cour
              </Checkbox>
            )}
          />
        </div>

        <div className="flex items-center">
          <Controller
            control={control}
            name="propertyFeature.hasBalcony"
            render={({ field }) => (
              <Checkbox
                isSelected={field.value || false}
                onChange={field.onChange}
                className="mr-2"
              >
                Possède un balcon/terrasse
              </Checkbox>
            )}
          />
        </div>
      </div>

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

export default Features;
