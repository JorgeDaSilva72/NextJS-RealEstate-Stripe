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

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { AddPropertyInputType } from "./AddPropertyForm";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ✅ NOUVEAU TYPE : Structure des données traduites (doit être définie ici ou importée)
interface TranslatedClientItem {
  id: number;
  code: string;
  name: string; // Le nom traduit du type/statut (que nous voulons afficher)
}

interface Props {
  className?: string;
  // ✅ Utiliser les types traduits
  types: TranslatedClientItem[];
  statuses: TranslatedClientItem[];
  next: () => void;
}

const Basic = (props: Props) => {
  const t = useTranslations("PropertyForm.Basic");
  const methods = useFormContext<AddPropertyInputType>();
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    watch,
    setValue,
    control,
  } = methods;

  // Surveiller les IDs pour le rendu
  const watchedTypeId = watch("typeId");
  const watchedStatusId = watch("statusId");

  // La valeur initiale pour l'édition (string)
  const formValues = getValues();
  const initialTypeId = formValues.typeId;
  const initialStatusId = formValues.statusId;

  // ✅ Extraire une valeur string pour les champs potentiellement multilingues
  const getLocalizedValue = (value: unknown): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      // Priorité au français, sinon premier champ dispo, sinon chaîne vide
      if (typeof obj.fr === "string") return obj.fr;
      const first = Object.values(obj).find((v) => typeof v === "string");
      return (first as string) ?? "";
    }
    return String(value);
  };

  const defaultName = getLocalizedValue(formValues.name);
  const defaultDescription = getLocalizedValue(formValues.description);

  const handleNext = async () => {
    // La validation des IDs doit être vérifiée avant de passer à l'étape suivante
    if (await trigger(["name", "description", "typeId", "statusId", "price"]))
      props.next();
  };

  return (
    <Card className={cn("w-full", props.className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("title") || "Informations de base"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            {t("title")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder={t("titlePlaceholder") || "Titre de l'annonce"}
            className={cn(
              "w-full",
              errors.name && "border-red-500 focus-visible:ring-red-500"
            )}
            defaultValue={defaultName}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description Textarea */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            {t("description")} <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder={t("descriptionPlaceholder") || "Description détaillée de la propriété"}
            className={cn(
              "w-full min-h-[120px]",
              errors.description && "border-red-500 focus-visible:ring-red-500"
            )}
            defaultValue={defaultDescription}
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Property Type and Transaction Type in Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Property Type Select */}
          <div className="space-y-2">
            <Label htmlFor="typeId" className="text-sm font-medium">
              {t("propertyType")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="typeId"
              control={methods.control}
              render={({ field }) => (
                <Select
                  value={typeof field.value === 'string' && field.value ? field.value : ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("typeId", value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger
                    id="typeId"
                    className={cn(
                      "w-full",
                      errors.typeId && "border-red-500 focus:ring-red-500"
                    )}
                  >
                    <SelectValue placeholder={t("propertyTypePlaceholder") || "Choisir un type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {props.types.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.typeId && (
              <p className="text-sm text-red-500 mt-1">{errors.typeId.message}</p>
            )}
          </div>

          {/* Transaction Type Select */}
          <div className="space-y-2">
            <Label htmlFor="statusId" className="text-sm font-medium">
              {t("transactionType")} <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="statusId"
              control={methods.control}
              render={({ field }) => (
                <Select
                  value={typeof field.value === 'string' ? field.value : ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("statusId", value, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger
                    id="statusId"
                    className={cn(
                      "w-full",
                      errors.statusId && "border-red-500 focus:ring-red-500"
                    )}
                  >
                    <SelectValue placeholder={t("transactionTypePlaceholder") || "Choisir une transaction"} />
                  </SelectTrigger>
                  <SelectContent>
                    {props.statuses.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.statusId && (
              <p className="text-sm text-red-500 mt-1">{errors.statusId.message}</p>
            )}
          </div>
        </div>

        {/* Price Input */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">
            {t("priceInEuros")} <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            {...register("price", { 
              setValueAs: (v: any) => v.toString(),
              valueAsNumber: false
            })}
            placeholder="0"
            className={cn(
              "w-full",
              errors.price && "border-red-500 focus-visible:ring-red-500"
            )}
            defaultValue={getValues("price") ? String(getValues("price") || "0") : "0"}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
          <Button
            isDisabled
            startContent={<ChevronLeftIcon className="w-5 h-5" />}
            color="primary"
            className="w-full md:w-auto"
          >
            {t("previous")}
          </Button>
          <Button
            onPress={handleNext}
            endContent={<ChevronRightIcon className="w-5 h-5" />}
            color="primary"
            className="w-full md:w-auto"
          >
            {t("next")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Basic;
