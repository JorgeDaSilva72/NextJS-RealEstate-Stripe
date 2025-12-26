// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";

// import { PropertyStatus, PropertyType } from "@prisma/client";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   className?: string;
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   next: () => void;
// }
// const Basic = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();
//   const handleNext = async () => {
//     if (await trigger(["name", "description", "typeId", "statusId", "price"]))
//       props.next();
//   };
//   return (
//     <Card
//       className={cn(
//         "p-2 gap-3 grid grid-cols-1 md:grid-cols-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("name")}
//         errorMessage={errors.name?.message}
//         isInvalid={!!errors.name}
//         label="Titre de l'annonce"
//         className="md:col-span-3"
//         name="name"
//         defaultValue={getValues().name}
//       />
//       <Textarea
//         {...register("description")}
//         errorMessage={errors.description?.message}
//         isInvalid={!!errors.description}
//         label="Description"
//         className="md:col-span-3"
//         name="description"
//         defaultValue={getValues().description}
//       />

//       <Select
//         // {...register("typeId")}
//         {...register("typeId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.typeId?.message}
//         isInvalid={!!errors.typeId}
//         label="Type"
//         selectionMode="single"
//         name="typeId"
//         defaultSelectedKeys={[
//           getValues().typeId!! ? getValues().typeId.toString() : "0",
//         ]}

//         // defaultSelectedKeys={[getValues().typeId.toString()]}
//       >
//         {props.types.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>
//       <Select
//         // {...register("statusId")}
//         {...register("statusId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.statusId?.message}
//         isInvalid={!!errors.statusId}
//         label="Statut"
//         selectionMode="single"
//         name="statusId"
//         defaultSelectedKeys={[
//           getValues().statusId!! ? getValues().statusId.toString() : "0",
//         ]}
//         // defaultSelectedKeys={[getValues().statusId.toString()]}
//       >
//         {props.statuses.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>
//       <Input
//         // {...register("price")}
//         {...register("price", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.price?.message}
//         isInvalid={!!errors.price}
//         label="Prix"
//         name="price"
//         defaultValue={getValues().price!! ? getValues().price.toString() : "0"}
//         // defaultValue={getValues().price.toString()}
//       />
//       <div className="flex justify-center col-span-3 gap-3">
//         <Button
//           isDisabled
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

// export default Basic;
//------------------------------------------------------

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   className?: string;
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   next: () => void;
// }

// const Basic = (props: Props) => {
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (await trigger(["name", "description", "typeId", "statusId", "price"]))
//       props.next();
//   };

//   return (
//     <Card
//       className={cn(
//         "p-2 gap-3 grid grid-cols-1 md:grid-cols-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("name")}
//         errorMessage={errors.name?.message}
//         isInvalid={!!errors.name}
//         label="Titre de l'annonce"
//         className="col-span-1 md:col-span-3"
//         name="name"
//         defaultValue={getValues().name}
//       />
//       <Textarea
//         {...register("description")}
//         errorMessage={errors.description?.message}
//         isInvalid={!!errors.description}
//         label="Description"
//         className="col-span-1 md:col-span-3"
//         name="description"
//         defaultValue={getValues().description}
//       />
//       <Select
//         {...register("typeId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.typeId?.message}
//         isInvalid={!!errors.typeId}
//         label="Type de bien recherché"
//         selectionMode="single"
//         name="typeId"
//         defaultSelectedKeys={[
//           getValues().typeId ? getValues().typeId.toString() : "0",
//         ]}
//       >
//         {props.types.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>
//       <Select
//         {...register("statusId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.statusId?.message}
//         isInvalid={!!errors.statusId}
//         label="Type de transaction"
//         selectionMode="single"
//         name="statusId"
//         defaultSelectedKeys={[
//           getValues().statusId ? getValues().statusId.toString() : "0",
//         ]}
//       >
//         {props.statuses.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>
//       <Input
//         {...register("price", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.price?.message}
//         isInvalid={!!errors.price}
//         label="Prix en euros"
//         name="price"
//         defaultValue={getValues().price ? getValues().price.toString() : "0"}
//       />
//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-3 gap-3 mt-4">
//         <Button
//           isDisabled
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

// export default Basic;

// ----------------------------------------------------------
// next-intl with claude
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";
// import { PropertyStatus, PropertyType } from "@prisma/client";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { useTranslations } from "next-intl";

// interface Props {
//   className?: string;
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   next: () => void;
// }

// const Basic = (props: Props) => {
//   const t = useTranslations("PropertyForm.Basic");
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   const handleNext = async () => {
//     if (await trigger(["name", "description", "typeId", "statusId", "price"]))
//       props.next();
//   };

//   return (
//     <Card
//       className={cn(
//         "p-2 gap-3 grid grid-cols-1 md:grid-cols-3",
//         props.className
//       )}
//     >
//       <Input
//         {...register("name")}
//         errorMessage={errors.name?.message}
//         isInvalid={!!errors.name}
//         label={t("title")}
//         className="col-span-1 md:col-span-3"
//         name="name"
//         defaultValue={getValues().name}
//       />
//       <Textarea
//         {...register("description")}
//         errorMessage={errors.description?.message}
//         isInvalid={!!errors.description}
//         label={t("description")}
//         className="col-span-1 md:col-span-3"
//         name="description"
//         defaultValue={getValues().description}
//       />
//       <Select
//         {...register("typeId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.typeId?.message}
//         isInvalid={!!errors.typeId}
//         label={t("propertyType")}
//         selectionMode="single"
//         name="typeId"
//         defaultSelectedKeys={[
//           getValues().typeId ? getValues().typeId.toString() : "0",
//         ]}
//       >
//         {props.types.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>
//       <Select
//         {...register("statusId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.statusId?.message}
//         isInvalid={!!errors.statusId}
//         label={t("transactionType")}
//         selectionMode="single"
//         name="statusId"
//         defaultSelectedKeys={[
//           getValues().statusId ? getValues().statusId.toString() : "0",
//         ]}
//       >
//         {props.statuses.map((item) => (
//           <SelectItem key={item.id} value={item.id}>
//             {item.value}
//           </SelectItem>
//         ))}
//       </Select>
//       <Input
//         {...register("price", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.price?.message}
//         isInvalid={!!errors.price}
//         label={t("priceInEuros")}
//         name="price"
//         defaultValue={getValues().price ? getValues().price.toString() : "0"}
//       />
//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-3 gap-3 mt-4">
//         <Button
//           isDisabled
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

// export default Basic;

// 08/12/2025 pour s adapter au nouveau prisma feature/multlingual-countries

// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// import {
//   Button,
//   Card,
//   Input,
//   // Select,
//   SelectItem,
//   Textarea,
//   cn,
// } from "@nextui-org/react";
// // ❌ Supprimer les imports de types Prisma bruts (ne sont plus utilisés)
// // import { PropertyStatus, PropertyType } from "@prisma/client";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
// import { useTranslations } from "next-intl";

// // ✅ NOUVEAU TYPE : Structure des données traduites (doit être définie ici ou importée)
// interface TranslatedClientItem {
//   id: number;
//   code: string;
//   name: string; // Le nom traduit du type/statut (que nous voulons afficher)
// }

// interface Props {
//   className?: string;
//   // ✅ Utiliser les types traduits
//   types: TranslatedClientItem[];
//   statuses: TranslatedClientItem[];
//   next: () => void;
// }

// const Basic = (props: Props) => {
//   const t = useTranslations("PropertyForm.Basic");
//   const {
//     register,
//     formState: { errors },
//     trigger,
//     getValues,
//     watch, // Ajouté
//   } = useFormContext<AddPropertyInputType>();

//   // Surveiller les IDs pour le rendu
//   const watchedTypeId = watch("typeId");
//   const watchedStatusId = watch("statusId");

//   // La valeur initiale pour l'édition (string)
//   const formValues = getValues();
//   const initialTypeId = formValues.typeId;
//   const initialStatusId = formValues.statusId;

//   // ✅ Extraire une valeur string pour les champs potentiellement multilingues
//   const getLocalizedValue = (value: unknown): string => {
//     if (typeof value === "string") return value;
//     if (value && typeof value === "object") {
//       const obj = value as Record<string, unknown>;
//       // Priorité au français, sinon premier champ dispo, sinon chaîne vide
//       if (typeof obj.fr === "string") return obj.fr;
//       const first = Object.values(obj).find((v) => typeof v === "string");
//       return (first as string) ?? "";
//     }
//     return "";
//   };

//   const defaultName = getLocalizedValue(formValues.name);
//   const defaultDescription = getLocalizedValue(formValues.description);

//   // 🎯 LOG DE DÉBOGAGE
//   console.log("--- DÉBOGAGE BASIC.TSX (EDITION) ---");
//   console.log(
//     "1. ID du Type RHF (attendue: string):",
//     initialTypeId,
//     typeof initialTypeId
//   );
//   console.log("2. Liste des types (ID/Nom):", props.types);
//   console.log("-------------------------------------");

//   const handleNext = async () => {
//     // La validation des IDs doit être vérifiée avant de passer à l'étape suivante
//     if (await trigger(["name", "description", "typeId", "statusId", "price"]))
//       props.next();
//   };

//   return (
//     <Card
//       className={cn(
//         "p-2 gap-3 grid grid-cols-1 md:grid-cols-3",
//         props.className
//       )}
//     >
//       {/* ... (Input Title et Description inchangés) ... */}
//       <Input
//         // {...register("name")}
        
//         // errorMessage={errors.name?.message}
//         // isInvalid={!!errors.name}
//         // label={t("title")}
//         // className="col-span-1 md:col-span-3"
//         // name="name"
//         // defaultValue={defaultName}
//         {...register(`name.${currentLocale}`)}
//         errorMessage={errors.name?.message}
//         isInvalid={!!errors.name?.[currentLocale]}
//         label={t("title")}
//         className="col-span-1 md:col-span-3"
//         name="name"
//         defaultValue={defaultName}
//       />
//       <Textarea
//         // {...register("description")}
//         // errorMessage={errors.description?.message}
//         // isInvalid={!!errors.description}
//         // label={t("description")}
//         // className="col-span-1 md:col-span-3"
//         // name="description"
//         // defaultValue={defaultDescription}
//         {...register(`description.${currentLocale}`)}
//         errorMessage={errors.description?.message}
//         isInvalid={!!errors.description?.[currentLocale]}
//         label={t("description")}
//         className="col-span-1 md:col-span-3"
//         name="description"
//         defaultValue={defaultDescription}
//       />

//       {/* SÉLECTION DU TYPE DE BIEN (PROPERTY TYPE) */}
//       {/* <Select
//         // Conversion de la valeur de retour en string, ce qui est correct pour les IDs
//         {...register("typeId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.typeId?.message}
//         isInvalid={!!errors.typeId}
//         label={t("propertyType")}
//         selectionMode="single"
//         name="typeId"
//         // defaultSelectedKeys={[
//         //   getValues().typeId ? getValues().typeId.toString() : "0",
//         // ]}
//         selectedKeys={watchedTypeId ? [watchedTypeId] : []}
//       >
//         {props.types.map((item) => (
//           <SelectItem
//             key={item.id}
//             value={item.id.toString()} // S'assurer que la valeur est l'ID string
//           >
//             {item.name}
//           </SelectItem>
//         ))}
//       </Select> */}

//       {/* SÉLECTION DU TYPE DE BIEN (HTML Select natif stylisé) */}
//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium text-gray-700">
//           {t("propertyType")}
//         </label>
//         <select
//           {...register("typeId", {
//             setValueAs: (v) => v.toString(),
//             // Assurez-vous que la validation est effectuée si nécessaire
//           })}
//           className={cn(
//             "p-3 border rounded-lg bg-gray-50 appearance-none",
//             "focus:border-blue-500 focus:ring-blue-500",
//             { "border-red-500": !!errors.typeId }
//           )}
//           name="typeId"
//           defaultValue={watchedTypeId || initialTypeId || ""}
//         >
//           {/* Option par défaut vide pour min(1) */}
//           <option value="" disabled>
//             {t("propertyTypePlaceholder") || "Choisir un type"}
//           </option>
//           {props.types.map((item) => (
//             <option key={item.id} value={item.id.toString()}>
//               {item.name} {/* Nom traduit */}
//             </option>
//           ))}
//         </select>
//         {errors.typeId && (
//           <p className="text-red-500 text-xs mt-1">{errors.typeId.message}</p>
//         )}
//       </div>

//       {/* SÉLECTION DU TYPE DE TRANSACTION (PROPERTY STATUS) */}
//       {/* <Select
//         {...register("statusId", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.statusId?.message}
//         isInvalid={!!errors.statusId}
//         label={t("transactionType")}
//         selectionMode="single"
//         name="statusId"
//         // defaultSelectedKeys={[
//         //   getValues().statusId ? getValues().statusId.toString() : "0",
//         // ]}
//         selectedKeys={watchedStatusId ? [watchedStatusId] : []}
//       >
//         {props.statuses.map((item) => (
//           <SelectItem
//             key={item.id}
//             value={item.id.toString()} // S'assurer que la valeur est l'ID string
//           >
//             {item.name}
//           </SelectItem>
//         ))}
//       </Select> */}

//       {/* SÉLECTION DU TYPE DE TRANSACTION (HTML Select natif stylisé) */}
//       <div className="flex flex-col gap-2">
//         <label className="text-sm font-medium text-gray-700">
//           {t("transactionType")}
//         </label>
//         <select
//           {...register("statusId", {
//             setValueAs: (v) => v.toString(),
//             // Assurez-vous que la validation est effectuée si nécessaire
//           })}
//           className={cn(
//             "p-3 border rounded-lg bg-gray-50 appearance-none",
//             "focus:border-blue-500 focus:ring-blue-500",
//             { "border-red-500": !!errors.statusId }
//           )}
//           name="statusId"
//           defaultValue={watchedStatusId || initialStatusId || ""}
//         >
//           <option value="" disabled>
//             {t("transactionTypePlaceholder") || "Choisir une transaction"}
//           </option>
//           {props.statuses.map((item) => (
//             <option key={item.id} value={item.id.toString()}>
//               {item.name} {/* Nom traduit */}
//             </option>
//           ))}
//         </select>
//         {errors.statusId && (
//           <p className="text-red-500 text-xs mt-1">{errors.statusId.message}</p>
//         )}
//       </div>

//       {/* ... (Input Price et Boutons inchangés) ... */}
//       <Input
//         {...register("price", { setValueAs: (v: any) => v.toString() })}
//         errorMessage={errors.price?.message}
//         isInvalid={!!errors.price}
//         label={t("priceInEuros")}
//         name="price"
//         defaultValue={getValues().price ? getValues().price.toString() : "0"}
//       />

//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-3 gap-3 mt-4">
//         <Button
//           isDisabled
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

// export default Basic;


// 17/12/2025


"use client"; // Important pour utiliser useParams

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  Button,
  Card,
  Input,
  Textarea,
  cn,
} from "@nextui-org/react";
import React from "react";
import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";
import { PropertyFormInputType as AddPropertyInputType } from "@/lib/schemas/property2";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation"; // ✅ Pour récupérer la locale client-side

interface TranslatedClientItem {
  id: number;
  code: string;
  name: string;
}

interface Props {
  className?: string;
  types: TranslatedClientItem[];
  statuses: TranslatedClientItem[];
  next: () => void;
}

const Basic = (props: Props) => {
  const t = useTranslations("PropertyForm.Basic");
  const params = useParams();
  const currentLocale = (params.locale as string) || "fr"; // ✅ Détermine la langue active

  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    watch,
  } = useFormContext<AddPropertyInputType>();

  const watchedTypeId = watch("typeId");
  const watchedStatusId = watch("statusId");

  const formValues = getValues();
  const initialTypeId = formValues.typeId;
  const initialStatusId = formValues.statusId;

  // Récupération de la valeur par défaut pour l'affichage (mode édition)
  const getLocalizedValue = (field: "name" | "description"): string => {
    const value = formValues[field];
    if (value && typeof value === "object") {
      return (value as any)[currentLocale] || (value as any)["fr"] || "";
    }
    return "";
  };

  const handleNext = async () => {
    // ✅ Validation adaptée aux champs imbriqués
    const isValid = await trigger([
      `name.${currentLocale}` as any,
      `description.${currentLocale}` as any,
      "typeId",
      "statusId",
      "price"
    ]);
    if (isValid) props.next();
  };

  return (
    <Card className={cn("p-2 gap-3 grid grid-cols-1 md:grid-cols-3", props.className)}>
      
      {/* TITRE DE L'ANNONCE (Multilingue) */}
      <Input
       {...register(`name.${currentLocale}` as any)} // Le cast 'any' ici est souvent nécessaire pour les clés imbriquées dynamiques . Enregistre dans name.fr ou name.en
        errorMessage={(errors.name as any)?.[currentLocale]?.message} // ✅ Cast temporaire en any pour l'erreur, Erreur spécifique à la langue
        isInvalid={!!(errors.name as any)?.[currentLocale]}
        label={t("title")}
        placeholder={t("titlePlaceholder")}
        className="col-span-1 md:col-span-3"
        defaultValue={getLocalizedValue("name")}
      />

      {/* DESCRIPTION (Multilingue) */}
      <Textarea
        {...register(`description.${currentLocale}` as any)} // ✅ Enregistre dans description.fr ou description.en
        errorMessage={(errors.description as any)?.[currentLocale]?.message}
        isInvalid={!!(errors.description as any)?.[currentLocale]}
        label={t("description")}
        placeholder={t("descriptionPlaceholder")}
        className="col-span-1 md:col-span-3"
        defaultValue={getLocalizedValue("description")}
      />

      {/* TYPE DE BIEN */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">{t("propertyType")}</label>
        <select
          {...register("typeId", { setValueAs: (v) => v.toString() })}
          className={cn(
            "p-3 border rounded-lg bg-gray-50 appearance-none focus:border-blue-500 focus:ring-blue-500",
            { "border-red-500": !!errors.typeId }
          )}
          defaultValue={watchedTypeId || initialTypeId || ""}
        >
          <option value="" disabled>{t("propertyTypePlaceholder") || "Choisir un type"}</option>
          {props.types.map((item) => (
            <option key={item.id} value={item.id.toString()}>{item.name}</option>
          ))}
        </select>
        {errors.typeId && <p className="text-red-500 text-xs mt-1">{errors.typeId.message}</p>}
      </div>

      {/* TYPE DE TRANSACTION */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">{t("transactionType")}</label>
        <select
          {...register("statusId", { setValueAs: (v) => v.toString() })}
          className={cn(
            "p-3 border rounded-lg bg-gray-50 appearance-none focus:border-blue-500 focus:ring-blue-500",
            { "border-red-500": !!errors.statusId }
          )}
          defaultValue={watchedStatusId || initialStatusId || ""}
        >
          <option value="" disabled>{t("transactionTypePlaceholder") || "Choisir une transaction"}</option>
          {props.statuses.map((item) => (
            <option key={item.id} value={item.id.toString()}>{item.name}</option>
          ))}
        </select>
        {errors.statusId && <p className="text-red-500 text-xs mt-1">{errors.statusId.message}</p>}
      </div>

      {/* PRIX */}
      <Input
        {...register("price", { setValueAs: (v) => v.toString() })}
        errorMessage={errors.price?.message}
        isInvalid={!!errors.price}
        label={t("priceInEuros")}
        type="number"
        defaultValue={getValues().price?.toString() || "0"}
      />

      {/* BOUTONS DE NAVIGATION */}
      <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-3 gap-3 mt-4">
        <Button
          isDisabled
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

export default Basic;