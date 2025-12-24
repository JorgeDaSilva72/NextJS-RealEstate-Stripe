// import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Input, cn } from "@nextui-org/react";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   prev: () => void;
//   className?: string;
// }
// const Contact = ({ prev, className }: Props) => {
//   const {
//     register,
//     formState: { errors },
//     control,
//     getValues,
//   } = useFormContext<AddPropertyInputType>();
//   return (
//     <Card
//       className={cn("grid grid-cols-1 md:grid-cols-3 gap-3 p-2", className)}
//     >
//       <Input
//         {...register("contact.name")}
//         errorMessage={errors.contact?.name?.message}
//         isInvalid={!!errors.contact?.name}
//         label="Nom du contact"
//         defaultValue={getValues("contact.name")}
//       />

//       <Input
//         {...register("contact.phone")}
//         errorMessage={errors.contact?.phone?.message}
//         label="Téléphone"
//         defaultValue={getValues("contact.phone")}
//       />

//       <Input
//         {...register("contact.email")}
//         errorMessage={errors.contact?.email?.message}
//         isInvalid={!!errors.contact?.email}
//         label="Email"
//         defaultValue={getValues("contact.email")}
//       />
//       <div className="flex justify-center col-span-3 gap-3">
//         <Button
//           onClick={prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           endContent={<PlusCircleIcon className="w-6" />}
//           color="secondary"
//           className="w-36"
//           type="submit"
//         >
//           Sauvegarder
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Contact;
// end ------------------------------------------------------------------------

// import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
// import { Button, Card, Input, cn } from "@nextui-org/react";
// import React from "react";
// import { useFormContext } from "react-hook-form";
// import { AddPropertyInputType } from "./AddPropertyForm";

// interface Props {
//   prev: () => void;
//   className?: string;
// }

// const Contact = ({ prev, className }: Props) => {
//   const {
//     register,
//     formState: { errors },
//     getValues,
//   } = useFormContext<AddPropertyInputType>();

//   return (
//     <Card
//       className={cn("grid grid-cols-1 md:grid-cols-3 gap-3 p-2", className)}
//     >
//       <Input
//         {...register("contact.name")}
//         errorMessage={errors.contact?.name?.message}
//         isInvalid={!!errors.contact?.name}
//         label="Nom du contact"
//         defaultValue={getValues("contact.name")}
//       />

//       <Input
//         {...register("contact.phone")}
//         errorMessage={errors.contact?.phone?.message}
//         label="Téléphone"
//         defaultValue={getValues("contact.phone")}
//       />

//       <Input
//         {...register("contact.email")}
//         errorMessage={errors.contact?.email?.message}
//         isInvalid={!!errors.contact?.email}
//         label="Email"
//         defaultValue={getValues("contact.email")}
//       />

//       <div className="flex flex-col md:flex-row justify-center col-span-1 md:col-span-3 gap-3 mt-4">
//         <Button
//           onClick={prev}
//           startContent={<ChevronLeftIcon className="w-6" />}
//           color="primary"
//           className="w-full md:w-36"
//         >
//           Précédent
//         </Button>
//         <Button
//           endContent={<PlusCircleIcon className="w-6" />}
//           color="secondary"
//           className="w-full md:w-36"
//           type="submit"
//         >
//           Sauvegarder
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default Contact;

// end ----------------------------------------------------------
// next-intl with chatgpt

import { ChevronLeftIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import { Button } from "@nextui-org/react";
import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { AddPropertyInputType } from "./AddPropertyForm";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface Props {
  prev: () => void;
  className?: string;
}

const Contact = ({ prev, className }: Props) => {
  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<AddPropertyInputType>();

  const t = useTranslations("PropertyForm.Contact");
  const { user } = useKindeBrowserClient();

  // Auto-fill from user profile
  const handleAutoFill = () => {
    if (user) {
      const fullName = user.given_name && user.family_name
        ? `${user.given_name} ${user.family_name}`
        : user.given_name || user.family_name || "";
      
      if (fullName) {
        setValue("contact.name", fullName, { shouldValidate: true });
      }
      if (user.email) {
        setValue("contact.email", user.email, { shouldValidate: true });
      }
      // Note: Phone number is not available from Kinde user object by default
      // You may need to fetch it from your database if stored separately
    }
  };

  // Auto-fill on mount if fields are empty
  useEffect(() => {
    const currentName = getValues("contact.name");
    const currentEmail = getValues("contact.email");
    
    if (!currentName && !currentEmail && user) {
      handleAutoFill();
    }
  }, [user]);

  const hasAutoFillData = user && (user.given_name || user.family_name || user.email);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" />
          {t("title") || "Informations de contact"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto-fill Button */}
        {hasAutoFillData && (
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900">
                {t("autoFillAvailable") || "Remplir automatiquement depuis votre profil"}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                {t("autoFillHint") || "Cliquez pour remplir les champs avec vos informations"}
              </p>
            </div>
            <Button
              onPress={handleAutoFill}
              color="primary"
              size="sm"
              className="ml-4"
            >
              {t("autoFill") || "Remplir"}
            </Button>
          </div>
        )}

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact.name" className="text-sm font-medium">
              {t("name")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact.name"
              {...register("contact.name")}
              placeholder={t("namePlaceholder") || "Nom complet"}
              className={cn(
                "w-full",
                errors.contact?.name && "border-red-500 focus-visible:ring-red-500"
              )}
              defaultValue={getValues("contact.name") ? String(getValues("contact.name") || "") : ""}
            />
            {errors.contact?.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.contact.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact.phone" className="text-sm font-medium">
              {t("phone")}
            </Label>
            <Input
              id="contact.phone"
              type="tel"
              {...register("contact.phone")}
              placeholder={t("phonePlaceholder") || "+33 6 12 34 56 78"}
              className={cn(
                "w-full",
                errors.contact?.phone && "border-red-500 focus-visible:ring-red-500"
              )}
              defaultValue={getValues("contact.phone") ? String(getValues("contact.phone") || "") : ""}
            />
            {errors.contact?.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.contact.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact.email" className="text-sm font-medium">
              {t("email")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contact.email"
              type="email"
              {...register("contact.email")}
              placeholder={t("emailPlaceholder") || "email@example.com"}
              className={cn(
                "w-full",
                errors.contact?.email && "border-red-500 focus-visible:ring-red-500"
              )}
              defaultValue={getValues("contact.email") ? String(getValues("contact.email") || "") : ""}
            />
            {errors.contact?.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.contact.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            onPress={prev}
            startContent={<ChevronLeftIcon className="w-5 h-5" />}
            color="primary"
            className="w-full md:w-auto"
          >
            {t("previous")}
          </Button>
          <Button
            endContent={<PlusCircleIcon className="w-5 h-5" />}
            color="secondary"
            className="w-full md:w-auto"
            type="submit"
          >
            {t("save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;
