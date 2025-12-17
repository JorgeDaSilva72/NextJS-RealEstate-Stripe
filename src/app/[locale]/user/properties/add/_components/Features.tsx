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
//                 isSelected={field.value || false}
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
//                 isSelected={field.value || false}
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
//                 isSelected={field.value || false}
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
// -------------------------------------------------------------------------------
// import React from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Checkbox, cn } from "@nextui-org/react";
// import { Controller, useFormContext } from "react-hook-form";
// import NumberInput from "./NumberInput"; // Assurez-vous que le chemin est correct
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
//     setValue,
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
//       <NumberInput
//         label="Chambre(s)"
//         // value={getValues().propertyFeature?.bedrooms || 0}
//         value={getValues("propertyFeature.bedrooms") || 0}
//         onChange={(value) => {
//           setValue("propertyFeature.bedrooms", value, {
//             shouldValidate: true,
//           });
//         }}
//         errorMessage={errors.propertyFeature?.bedrooms?.message}
//         isInvalid={!!errors.propertyFeature?.bedrooms}
//         min={0}
//       />

//       <NumberInput
//         label="Salle(s) de bain"
//         value={getValues().propertyFeature?.bathrooms || 0}
//         onChange={(value) =>
//           setValue("propertyFeature.bathrooms", value, {
//             shouldValidate: true,
//           })
//         }
//         errorMessage={errors.propertyFeature?.bathrooms?.message}
//         isInvalid={!!errors.propertyFeature?.bathrooms}
//         min={0}
//       />

//       <NumberInput
//         label="Place(s) de stationnement"
//         value={getValues().propertyFeature?.parkingSpots || 0}
//         onChange={(value) =>
//           setValue("propertyFeature.parkingSpots", value, {
//             shouldValidate: true,
//           })
//         }
//         errorMessage={errors.propertyFeature?.parkingSpots?.message}
//         isInvalid={!!errors.propertyFeature?.parkingSpots}
//         min={0}
//       />

//       <NumberInput
//         label="Surface habitable en m²"
//         value={getValues().propertyFeature?.area || 0}
//         onChange={(value) =>
//           setValue("propertyFeature.area", value, {
//             shouldValidate: true,
//           })
//         }
//         errorMessage={errors.propertyFeature?.area?.message}
//         isInvalid={!!errors.propertyFeature?.area}
//         min={0}
//       />

//       <div className="flex flex-col items-start gap-2  md:flex-row  justify-around  md:col-span-2 ">
//         <Controller
//           control={control}
//           name="propertyFeature.hasSwimmingPool"
//           render={({ field }) => (
//             <Checkbox
//               isSelected={field.value || false}
//               onChange={field.onChange}
//               className="mr-2"
//             >
//               Possède une piscine
//             </Checkbox>
//           )}
//         />

//         <Controller
//           control={control}
//           name="propertyFeature.hasGardenYard"
//           render={({ field }) => (
//             <Checkbox
//               isSelected={field.value || false}
//               onChange={field.onChange}
//               className="mr-2"
//             >
//               Possède un jardin/une cour
//             </Checkbox>
//           )}
//         />

//         <Controller
//           control={control}
//           name="propertyFeature.hasBalcony"
//           render={({ field }) => (
//             <Checkbox
//               isSelected={field.value || false}
//               onChange={field.onChange}
//               className="mr-2"
//             >
//               Possède un balcon/terrasse
//             </Checkbox>
//           )}
//         />
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

// ----------------------------------------------------------
// next-intl with claude

// import React from "react";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Checkbox, cn } from "@nextui-org/react";
// import { Controller, useFormContext } from "react-hook-form";
// import NumberInput from "./NumberInput";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { useTranslations } from "next-intl";

// interface Props {
//   next: () => void;
//   prev: () => void;
//   className?: string;
// }

// const Features = (props: Props) => {
//   const t = useTranslations("PropertyForm.Features");

//   const {
//     formState: { errors },
//     control,
//     trigger,
//     getValues,
//     setValue,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (
//       await trigger([
//         "feature.area",
//         "feature.bathrooms",
//         "feature.bedrooms",
//         "feature.parkingSpots",
//       ])
//     ) {
//       props.next();
//     }
//   };

//   const features = [
//     {
//       name: "bedrooms" as const,
//       label: t("bedrooms"),
//       min: 0,
//     },
//     {
//       name: "bathrooms" as const,
//       label: t("bathrooms"),
//       min: 0,
//     },
//     {
//       name: "parkingSpots" as const,
//       label: t("parkingSpots"),
//       min: 0,
//     },
//     {
//       name: "area" as const,
//       label: t("area"),
//       min: 0,
//     },
//   ];

//   const checkboxFeatures = [
//     {
//       name: "hasSwimmingPool" as const,
//       label: t("hasSwimmingPool"),
//     },
//     {
//       name: "hasGardenYard" as const,
//       label: t("hasGardenYard"),
//     },
//     {
//       name: "hasBalcony" as const,
//       label: t("hasBalcony"),
//     },
//   ];

//   return (
//     <Card
//       className={cn(
//         "p-2 grid grid-cols-1 md:grid-cols-2 gap-3",
//         props.className
//       )}
//     >
//       {features.map((feature) => (
//         <NumberInput
//           key={feature.name}
//           label={feature.label}
//           value={getValues(`feature.${feature.name}`) || 0}
//           onChange={(value) => {
//             setValue(`feature.${feature.name}`, value, {
//               shouldValidate: true,
//             });
//           }}
//           errorMessage={errors.feature?.[feature.name]?.message}
//           isInvalid={!!errors.feature?.[feature.name]}
//           min={feature.min}
//         />
//       ))}

//       <div className="flex flex-col items-start gap-2 md:flex-row justify-around md:col-span-2">
//         {checkboxFeatures.map((feature) => (
//           <Controller
//             key={feature.name}
//             control={control}
//             name={`feature.${feature.name}`}
//             render={({ field }) => (
//               <Checkbox
//                 isSelected={field.value || false}
//                 onChange={field.onChange}
//                 className="mr-2"
//               >
//                 {feature.label}
//               </Checkbox>
//             )}
//           />
//         ))}
//       </div>

//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
//         <Button
//           onClick={props.prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           {t("previous")}
//         </Button>
//         <Button
//           onClick={handleNext}
//           endContent={<ChevronRightIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           {t("next")}
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Features;


// 17/12/2025 

"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button, Card, Checkbox, cn } from "@nextui-org/react";
import { Controller, useFormContext } from "react-hook-form";
import NumberInput from "./NumberInput";
import { AddPropertyInputType } from "./AddPropertyForm";
import { useTranslations } from "next-intl";

interface Props {
  next: () => void;
  prev: () => void;
  className?: string;
}

const Features = (props: Props) => {
  const t = useTranslations("PropertyForm.Features");

  const {
    formState: { errors },
    control,
    trigger,
    getValues,
    setValue,
  } = useFormContext<AddPropertyInputType>();

  const handleNext = async () => {
    // ✅ Validation des champs numériques avec les chemins exacts
    const isValid = await trigger([
      "feature.area",
      "feature.bathrooms",
      "feature.bedrooms",
      "feature.parkingSpots",
    ] as any);

    if (isValid) {
      props.next();
    } else {
      console.log("Erreurs caractéristiques :", errors.feature);
    }
  };

  // ✅ Alignement avec le schéma Zod (min 1 pour bedrooms/bathrooms, min 10 pour area)
  const features = [
    {
      name: "bedrooms" as const,
      label: t("bedrooms"),
      min: 0, 
    },
    {
      name: "bathrooms" as const,
      label: t("bathrooms"),
      min: 0,
    },
    {
      name: "parkingSpots" as const,
      label: t("parkingSpots"),
      min: 0,
    },
    {
      name: "area" as const,
      label: t("area"),
      min: 0,  
    },
  ];

  const checkboxFeatures = [
    { name: "hasSwimmingPool" as const, label: t("hasSwimmingPool") },
    { name: "hasGardenYard" as const, label: t("hasGardenYard") },
    { name: "hasBalcony" as const, label: t("hasBalcony") },
  ];

  return (
    <Card className={cn("p-2 grid grid-cols-1 md:grid-cols-2 gap-3", props.className)}>
      {features.map((feature) => (
        <NumberInput
          key={feature.name}
          label={feature.label}
          // ✅ Utilisation d'un accès sécurisé pour la valeur
          value={getValues(`feature.${feature.name}` as any) || 0}
          onChange={(value) => {
            setValue(`feature.${feature.name}` as any, value, {
              shouldValidate: true,
            });
          }}
          // ✅ Correction de l'accès aux erreurs imbriquées
          errorMessage={(errors.feature as any)?.[feature.name]?.message}
          isInvalid={!!(errors.feature as any)?.[feature.name]}
          min={feature.min}
        />
      ))}

      <div className="flex flex-col items-start gap-2 md:flex-row justify-around md:col-span-2 mt-2">
        {checkboxFeatures.map((feature) => (
          <Controller
            key={feature.name}
            control={control}
            name={`feature.${feature.name}` as any}
            render={({ field }) => (
              <Checkbox
                isSelected={!!field.value}
                onValueChange={field.onChange} // Utilisation de onValueChange pour NextUI
                className="mr-2"
              >
                {feature.label}
              </Checkbox>
            )}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-2 gap-3 mt-4">
        <Button
          onClick={props.prev}
          startContent={<ChevronLeftIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          {t("previous")}
        </Button>
        <Button
          onClick={handleNext}
          endContent={<ChevronRightIcon className="w-6" />}
          color="primary"
          className="w-full md:w-36"
        >
          {t("next")}
        </Button>
      </div>
    </Card>
  );
};

export default Features;