// "use client";

// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "@nextui-org/modal";
// import { Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";
// import React from "react";
// import { toast } from "react-toastify";

// // Type pour les catégories de feedback
// export type FeedbackCategory =
//   | "bug"
//   | "feature"
//   | "improvement"
//   | "performance"
//   | "security"
//   | "other";

// // Les options de catégories de feedback
// const FEEDBACK_CATEGORIES = [
//   {
//     value: "bug",
//     label: "Signalement de bug",
//     description: "Signaler un problème ou un comportement inattendu",
//   },
//   {
//     value: "feature",
//     label: "Nouvelle fonctionnalité",
//     description: "Suggérer une nouvelle fonctionnalité",
//   },
//   {
//     value: "improvement",
//     label: "Amélioration",
//     description: "Suggérer des améliorations pour une fonctionnalité existante",
//   },
//   {
//     value: "performance",
//     label: "Performance",
//     description: "Signaler des problèmes de performance",
//   },
//   {
//     value: "security",
//     label: "Sécurité",
//     description: "Signaler un problème de sécurité",
//   },
//   { value: "other", label: "Autre", description: "Autre type de feedback" },
// ] as const;

// interface FeedbackModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (formData: FeedbackFormData) => Promise<void>;
// }

// export interface FeedbackFormData {
//   category: FeedbackCategory;
//   name: string;
//   email: string;
//   phone: string;
//   message: string;
// }

// interface ValidationErrors {
//   category?: string;
//   name?: string;
//   email?: string;
//   phone?: string;
//   message?: string;
// }

// const FeedbackModal: React.FC<FeedbackModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
// }) => {
//   const [formData, setFormData] = React.useState<FeedbackFormData>({
//     category: "bug", // Valeur par défaut
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//   const [errors, setErrors] = React.useState<ValidationErrors>({});
//   const [touched, setTouched] = React.useState<Record<string, boolean>>({});
//   const [isLoading, setIsLoading] = React.useState(false);

//   const validateField = (name: string, value: string): string | undefined => {
//     switch (name) {
//       case "category":
//         if (!value) return "La catégorie est requise";
//         if (
//           !FEEDBACK_CATEGORIES.map((c) => c.value).includes(
//             value as FeedbackCategory
//           )
//         )
//           return "Catégorie invalide";
//         return undefined;
//       case "email":
//         if (!value) return "L'email est requis";
//         if (!/\S+@\S+\.\S+/.test(value)) return "Format d'email invalide";
//         return undefined;
//       case "phone":
//         if (!value) return "Le téléphone est requis";
//         // Validation internationale plus permissive :
//         // - Permet les caractères +()-.
//         // - Autorise les espaces entre les groupes de chiffres
//         // - Exige au moins 8 chiffres et pas plus de 15 chiffres (standard E.164)
//         // - Permet le + au début pour l'indicatif international
//         const digitsOnly = value.replace(/[^0-9]/g, "");
//         if (!/^[+]?[0-9\s().-]{8,}$/.test(value)) {
//           return "Format de téléphone invalide";
//         }
//         if (digitsOnly.length < 8 || digitsOnly.length > 15) {
//           return "Le numéro doit contenir entre 8 et 15 chiffres";
//         }
//         return undefined;
//       case "name":
//         if (!value.trim()) return "Le nom est requis";
//         if (value.trim().length < 2)
//           return "Le nom doit contenir au moins 2 caractères";
//         return undefined;
//       case "message":
//         if (!value.trim()) return "Le message est requis";
//         if (value.trim().length < 10)
//           return "Le message doit contenir au moins 10 caractères";
//         return undefined;
//       default:
//         return undefined;
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: ValidationErrors = {};
//     let isValid = true;

//     Object.keys(formData).forEach((key) => {
//       const error = validateField(key, formData[key as keyof FeedbackFormData]);
//       if (error) {
//         newErrors[key as keyof ValidationErrors] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleBlur = (field: keyof FeedbackFormData) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     const error = validateField(field, formData[field]);
//     setErrors((prev) => ({ ...prev, [field]: error }));
//   };

//   const handleChange = (field: keyof FeedbackFormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (touched[field]) {
//       const error = validateField(field, value);
//       setErrors((prev) => ({ ...prev, [field]: error }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       if (!validateForm()) {
//         setIsLoading(false);
//         toast.error("Veuillez corriger les erreurs dans le formulaire.");
//         return;
//       }

//       await onSubmit(formData);

//       // Réinitialisation du formulaire
//       setFormData({
//         category: "bug",
//         name: "",
//         email: "",
//         phone: "",
//         message: "",
//       });
//       setErrors({});
//       setTouched({});
//       onClose();
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du feedback:", error);
//       toast.error(
//         "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = () => {
//     return Object.keys(formData).every(
//       (key) => !validateField(key, formData[key as keyof FeedbackFormData])
//     );
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onOpenChange={onClose}
//       size="lg"
//       scrollBehavior="inside"
//       classNames={{
//         base: "m-0 sm:m-4",
//         wrapper: "p-0 sm:p-4",
//         body: "p-4 sm:p-6",
//         header: "p-4 sm:p-6 border-b",
//         footer: "p-4 sm:p-6 border-t",
//       }}
//     >
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader className="flex flex-col gap-1">
//               <h2 className="text-xl sm:text-2xl font-bold">Feedback</h2>
//             </ModalHeader>
//             <ModalBody>
//               <form
//                 id="feedback-form"
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//                 noValidate
//               >
//                 <div className="space-y-4">
//                   <div>
//                     <Select
//                       id="category"
//                       label="Type de feedback"
//                       labelPlacement="outside"
//                       placeholder="Sélectionnez une catégorie"
//                       selectedKeys={[formData.category]}
//                       onChange={(e) => handleChange("category", e.target.value)}
//                       onBlur={() => handleBlur("category")}
//                       isRequired
//                       isInvalid={!!errors.category && touched.category}
//                       errorMessage={touched.category && errors.category}
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         trigger: "h-12",
//                         value: "text-base",
//                       }}
//                     >
//                       {FEEDBACK_CATEGORIES.map((category) => (
//                         <SelectItem
//                           key={category.value}
//                           value={category.value}
//                           description={category.description}
//                         >
//                           {category.label}
//                         </SelectItem>
//                       ))}
//                     </Select>
//                   </div>

//                   <div>
//                     <Input
//                       id="name"
//                       aria-labelledby="name-label"
//                       label="Nom complet"
//                       labelPlacement="outside"
//                       placeholder="Votre nom"
//                       value={formData.name}
//                       onChange={(e) => handleChange("name", e.target.value)}
//                       onBlur={() => handleBlur("name")}
//                       variant="bordered"
//                       radius="sm"
//                       isRequired
//                       isInvalid={!!errors.name && touched.name}
//                       errorMessage={touched.name && errors.name}
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                         errorMessage: "text-sm text-red-500",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       id="email"
//                       type="email"
//                       label="Email"
//                       labelPlacement="outside"
//                       placeholder="votre@email.com"
//                       value={formData.email}
//                       onChange={(e) => handleChange("email", e.target.value)}
//                       onBlur={() => handleBlur("email")}
//                       variant="bordered"
//                       radius="sm"
//                       isRequired
//                       isInvalid={!!errors.email && touched.email}
//                       errorMessage={touched.email && errors.email}
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                         errorMessage: "text-sm text-red-500",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       label="Téléphone"
//                       labelPlacement="outside"
//                       placeholder="+1234567890 ou 0612345678"
//                       value={formData.phone}
//                       onChange={(e) => handleChange("phone", e.target.value)}
//                       onBlur={() => handleBlur("phone")}
//                       variant="bordered"
//                       radius="sm"
//                       isRequired
//                       description="Format international accepté (ex: +1234567890)"
//                       isInvalid={!!errors.phone && touched.phone}
//                       errorMessage={touched.phone && errors.phone}
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                         errorMessage: "text-sm text-red-500",
//                         description: "text-sm text-gray-500",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <Textarea
//                       id="message"
//                       label="Message"
//                       labelPlacement="outside"
//                       placeholder="Votre message ..."
//                       value={formData.message}
//                       onChange={(e) => handleChange("message", e.target.value)}
//                       onBlur={() => handleBlur("message")}
//                       variant="bordered"
//                       radius="sm"
//                       minRows={3}
//                       isRequired
//                       isInvalid={!!errors.message && touched.message}
//                       errorMessage={touched.message && errors.message}
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                         errorMessage: "text-sm text-red-500",
//                       }}
//                     />
//                   </div>
//                 </div>
//               </form>
//             </ModalBody>
//             <ModalFooter>
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
//                 <Button
//                   color="default"
//                   variant="light"
//                   onPress={onClose}
//                   radius="sm"
//                   className="w-full sm:w-auto order-2 sm:order-1"
//                 >
//                   Annuler
//                 </Button>
//                 <Button
//                   type="submit"
//                   form="feedback-form"
//                   color="primary"
//                   radius="sm"
//                   disabled={!isFormValid() || isLoading}
//                   className={`w-full sm:w-auto order-1 sm:order-2 ${
//                     isLoading || !isFormValid()
//                       ? "opacity-50 cursor-not-allowed"
//                       : "bg-gradient-to-r from-green-500 to-emerald-600"
//                   }`}
//                 >
//                   {isLoading ? "Envoi en cours..." : "Envoyer le feedback"}
//                 </Button>
//               </div>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

// export default FeedbackModal;

// "use client";

// import { useTranslations } from "next-intl";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "@nextui-org/modal";
// import { Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";
// import React from "react";
// import { toast } from "react-toastify";

// export type FeedbackCategory =
//   | "bug"
//   | "feature"
//   | "improvement"
//   | "performance"
//   | "security"
//   | "other";

// const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
//   const t = useTranslations("feedback");

//   const FEEDBACK_CATEGORIES = [
//     {
//       value: "bug",
//       label: t("categories.bug"),
//       description: t("descriptions.bug"),
//     },
//     {
//       value: "feature",
//       label: t("categories.feature"),
//       description: t("descriptions.feature"),
//     },
//     {
//       value: "improvement",
//       label: t("categories.improvement"),
//       description: t("descriptions.improvement"),
//     },
//     {
//       value: "performance",
//       label: t("categories.performance"),
//       description: t("descriptions.performance"),
//     },
//     {
//       value: "security",
//       label: t("categories.security"),
//       description: t("descriptions.security"),
//     },
//     {
//       value: "other",
//       label: t("categories.other"),
//       description: t("descriptions.other"),
//     },
//   ];

//   const [formData, setFormData] = React.useState({
//     category: "bug",
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });
//   const [errors, setErrors] = React.useState({});
//   const [touched, setTouched] = React.useState({});
//   const [isLoading, setIsLoading] = React.useState(false);

//   const validateField = (name, value) => {
//     switch (name) {
//       case "category":
//         if (!value) return t("errors.categoryRequired");
//         return undefined;
//       case "email":
//         if (!value) return t("errors.emailRequired");
//         if (!/\S+@\S+\.\S+/.test(value)) return t("errors.emailInvalid");
//         return undefined;
//       case "phone":
//         if (!value) return t("errors.phoneRequired");
//         if (!/^[+]?[0-9\s().-]{8,}$/.test(value))
//           return t("errors.phoneInvalid");
//         return undefined;
//       case "name":
//         if (!value.trim()) return t("errors.nameRequired");
//         if (value.trim().length < 2) return t("errors.nameShort");
//         return undefined;
//       case "message":
//         if (!value.trim()) return t("errors.messageRequired");
//         if (value.trim().length < 10) return t("errors.messageShort");
//         return undefined;
//       default:
//         return undefined;
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     let isValid = true;

//     Object.keys(formData).forEach((key) => {
//       const error = validateField(key, formData[key]);
//       if (error) {
//         newErrors[key] = error;
//         isValid = false;
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     const error = validateField(field, formData[field]);
//     setErrors((prev) => ({ ...prev, [field]: error }));
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     if (touched[field]) {
//       const error = validateField(field, value);
//       setErrors((prev) => ({ ...prev, [field]: error }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     if (!validateForm()) {
//       setIsLoading(false);
//       toast.error(t("errors.formInvalid"));
//       return;
//     }

//     try {
//       await onSubmit(formData);
//       setFormData({
//         category: "bug",
//         name: "",
//         email: "",
//         phone: "",
//         message: "",
//       });
//       setErrors({});
//       setTouched({});
//       onClose();
//     } catch (error) {
//       console.error("Erreur lors de l'envoi du feedback:", error);
//       toast.error(t("errors.submitError"));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
//       <ModalContent>
//         {(onClose) => (
//           <>
//             <ModalHeader>
//               <h2 className="text-xl sm:text-2xl font-bold">{t("title")}</h2>
//             </ModalHeader>
//             <ModalBody>
//               <form
//                 id="feedback-form"
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//                 noValidate
//               >
//                 <Select
//                   id="category"
//                   label={t("categoryLabel")}
//                   selectedKeys={[formData.category]}
//                   onChange={(e) => handleChange("category", e.target.value)}
//                   onBlur={() => handleBlur("category")}
//                   isRequired
//                   isInvalid={!!errors.category && touched.category}
//                   errorMessage={touched.category && errors.category}
//                 >
//                   {FEEDBACK_CATEGORIES.map((category) => (
//                     <SelectItem
//                       key={category.value}
//                       value={category.value}
//                       description={category.description}
//                     >
//                       {category.label}
//                     </SelectItem>
//                   ))}
//                 </Select>

//                 <Input
//                   id="name"
//                   label={t("nameLabel")}
//                   placeholder={t("namePlaceholder")}
//                   value={formData.name}
//                   onChange={(e) => handleChange("name", e.target.value)}
//                   onBlur={() => handleBlur("name")}
//                   isRequired
//                   isInvalid={!!errors.name && touched.name}
//                   errorMessage={touched.name && errors.name}
//                 />

//                 <Input
//                   id="email"
//                   type="email"
//                   label={t("emailLabel")}
//                   placeholder={t("emailPlaceholder")}
//                   value={formData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   onBlur={() => handleBlur("email")}
//                   isRequired
//                   isInvalid={!!errors.email && touched.email}
//                   errorMessage={touched.email && errors.email}
//                 />

//                 <Input
//                   id="phone"
//                   type="tel"
//                   label={t("phoneLabel")}
//                   placeholder={t("phonePlaceholder")}
//                   value={formData.phone}
//                   onChange={(e) => handleChange("phone", e.target.value)}
//                   onBlur={() => handleBlur("phone")}
//                   isRequired
//                   isInvalid={!!errors.phone && touched.phone}
//                   errorMessage={touched.phone && errors.phone}
//                 />

//                 <Textarea
//                   id="message"
//                   label={t("messageLabel")}
//                   placeholder={t("messagePlaceholder")}
//                   value={formData.message}
//                   onChange={(e) => handleChange("message", e.target.value)}
//                   onBlur={() => handleBlur("message")}
//                   isRequired
//                   isInvalid={!!errors.message && touched.message}
//                   errorMessage={touched.message && errors.message}
//                 />
//               </form>
//             </ModalBody>
//             <ModalFooter>
//               <Button color="default" variant="light" onPress={onClose}>
//                 {t("cancel")}
//               </Button>
//               <Button
//                 type="submit"
//                 form="feedback-form"
//                 color="primary"
//                 disabled={!validateForm() || isLoading}
//               >
//                 {isLoading ? t("submitting") : t("submit")}
//               </Button>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

// export default FeedbackModal;

// deepseeker
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";
import React from "react";
import { toast } from "react-toastify";
import { useTranslations, useLocale } from "next-intl";

// Type pour les catégories de feedback
export type FeedbackCategory =
  | "bug"
  | "feature"
  | "improvement"
  | "performance"
  | "security"
  | "other";

// Les options de catégories de feedback
const FEEDBACK_CATEGORIES = [
  {
    value: "bug",
    label: "feedback.categories.bug.label",
    description: "feedback.categories.bug.description",
  },
  {
    value: "feature",
    label: "feedback.categories.feature.label",
    description: "feedback.categories.feature.description",
  },
  {
    value: "improvement",
    label: "feedback.categories.improvement.label",
    description: "feedback.categories.improvement.description",
  },
  {
    value: "performance",
    label: "feedback.categories.performance.label",
    description: "feedback.categories.performance.description",
  },
  {
    value: "security",
    label: "feedback.categories.security.label",
    description: "feedback.categories.security.description",
  },
  {
    value: "other",
    label: "feedback.categories.other.label",
    description: "feedback.categories.other.description",
  },
] as const;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FeedbackFormData) => Promise<void>;
}

export interface FeedbackFormData {
  category: FeedbackCategory;
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ValidationErrors {
  category?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const t = useTranslations("FeedbackModal");
  const locale = useLocale();
  const [formData, setFormData] = React.useState<FeedbackFormData>({
    category: "bug", // Valeur par défaut
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "category":
        if (!value) return t("errors.category.required");
        if (
          !FEEDBACK_CATEGORIES.map((c) => c.value).includes(
            value as FeedbackCategory
          )
        )
          return t("errors.category.invalid");
        return undefined;
      case "email":
        if (!value) return t("errors.email.required");
        if (!/\S+@\S+\.\S+/.test(value)) return t("errors.email.invalid");
        return undefined;
      case "phone":
        if (!value) return t("errors.phone.required");
        const digitsOnly = value.replace(/[^0-9]/g, "");
        if (!/^[+]?[0-9\s().-]{8,}$/.test(value)) {
          return t("errors.phone.invalidFormat");
        }
        if (digitsOnly.length < 8 || digitsOnly.length > 15) {
          return t("errors.phone.invalidLength");
        }
        return undefined;
      case "name":
        if (!value.trim()) return t("errors.name.required");
        if (value.trim().length < 2) return t("errors.name.tooShort");
        return undefined;
      case "message":
        if (!value.trim()) return t("errors.message.required");
        if (value.trim().length < 10) return t("errors.message.tooShort");
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FeedbackFormData]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof FeedbackFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof FeedbackFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!validateForm()) {
        setIsLoading(false);
        toast.error(t("errors.formValidationFailed"));
        return;
      }

      await onSubmit(formData);

      // Réinitialisation du formulaire
      setFormData({
        category: "bug",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
      setTouched({});
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error);
      toast.error(t("errors.submissionFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(
      (key) => !validateField(key, formData[key as keyof FeedbackFormData])
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "m-0 sm:m-4",
        wrapper: "p-0 sm:p-4",
        body: "p-4 sm:p-6",
        header: "p-4 sm:p-6 border-b",
        footer: "p-4 sm:p-6 border-t",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl sm:text-2xl font-bold">{t("title")}</h2>
            </ModalHeader>
            <ModalBody>
              <form
                id="feedback-form"
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                <div className="space-y-4">
                  <div>
                    <Select
                      id="category"
                      label={t("form.category.label")}
                      labelPlacement="outside"
                      placeholder={t("form.category.placeholder")}
                      selectedKeys={[formData.category]}
                      onChange={(e) => handleChange("category", e.target.value)}
                      onBlur={() => handleBlur("category")}
                      isRequired
                      isInvalid={!!errors.category && touched.category}
                      errorMessage={touched.category && errors.category}
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        trigger: "h-12",
                        value: "text-base",
                      }}
                    >
                      {FEEDBACK_CATEGORIES.map((category) => (
                        <SelectItem
                          key={category.value}
                          value={category.value}
                          description={t(
                            `feedback.categories.${category.value}.description`
                          )}
                        >
                          {t(`feedback.categories.${category.value}.label`)}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Input
                      id="name"
                      aria-labelledby="name-label"
                      label={t("form.name.label")}
                      labelPlacement="outside"
                      placeholder={t("form.name.placeholder")}
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      variant="bordered"
                      radius="sm"
                      isRequired
                      isInvalid={!!errors.name && touched.name}
                      errorMessage={touched.name && errors.name}
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                        errorMessage: "text-sm text-red-500",
                      }}
                    />
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="email"
                      label={t("form.email.label")}
                      labelPlacement="outside"
                      placeholder={t("form.email.placeholder")}
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      variant="bordered"
                      radius="sm"
                      isRequired
                      isInvalid={!!errors.email && touched.email}
                      errorMessage={touched.email && errors.email}
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                        errorMessage: "text-sm text-red-500",
                      }}
                    />
                  </div>

                  <div>
                    <Input
                      id="phone"
                      type="tel"
                      label={t("form.phone.label")}
                      labelPlacement="outside"
                      placeholder={t("form.phone.placeholder")}
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      variant="bordered"
                      radius="sm"
                      isRequired
                      description={t("form.phone.description")}
                      isInvalid={!!errors.phone && touched.phone}
                      errorMessage={touched.phone && errors.phone}
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                        errorMessage: "text-sm text-red-500",
                        description: "text-sm text-gray-500",
                      }}
                    />
                  </div>

                  <div>
                    <Textarea
                      id="message"
                      label={t("form.message.label")}
                      labelPlacement="outside"
                      placeholder={t("form.message.placeholder")}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                      variant="bordered"
                      radius="sm"
                      minRows={3}
                      isRequired
                      isInvalid={!!errors.message && touched.message}
                      errorMessage={touched.message && errors.message}
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                        errorMessage: "text-sm text-red-500",
                      }}
                    />
                  </div>
                </div>
              </form>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  radius="sm"
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  {t("buttons.cancel")}
                </Button>
                <Button
                  type="submit"
                  form="feedback-form"
                  color="primary"
                  radius="sm"
                  disabled={!isFormValid() || isLoading}
                  className={`w-full sm:w-auto order-1 sm:order-2 ${
                    isLoading || !isFormValid()
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                >
                  {isLoading ? t("buttons.submitting") : t("buttons.submit")}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FeedbackModal;
