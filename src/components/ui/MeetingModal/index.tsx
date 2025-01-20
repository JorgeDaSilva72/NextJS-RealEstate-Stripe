// "use client";

// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "@nextui-org/modal";
// import { Input, Textarea, Button } from "@nextui-org/react";
// import React from "react";

// interface MeetingModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (formData: MeetingFormData) => void;
//   planName: string;
// }

// export interface MeetingFormData {
//   name: string;
//   email: string;
//   phone: string;
//   message: string;
// }

// const MeetingModal: React.FC<MeetingModalProps> = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   planName,
// }) => {
//   const [formData, setFormData] = React.useState<MeetingFormData>({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//     setFormData({ name: "", email: "", phone: "", message: "" });
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
//               <h2 className="text-xl sm:text-2xl font-bold">
//                 Demande de rendez-vous - Pack {planName}
//               </h2>
//             </ModalHeader>
//             <ModalBody>
//               <form
//                 id="meeting-form"
//                 onSubmit={handleSubmit}
//                 className="space-y-6"
//               >
//                 <div className="space-y-4">
//                   <div>
//                     <Input
//                       id="name"
//                       label="Nom complet*"
//                       labelPlacement="outside"
//                       placeholder="Votre nom"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       variant="bordered"
//                       radius="sm"
//                       isRequired
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       id="email"
//                       type="email"
//                       label="Email*"
//                       labelPlacement="outside"
//                       placeholder="votre@email.com"
//                       value={formData.email}
//                       onChange={(e) =>
//                         setFormData({ ...formData, email: e.target.value })
//                       }
//                       variant="bordered"
//                       radius="sm"
//                       isRequired
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <Input
//                       id="phone"
//                       type="tel"
//                       label="Téléphone*"
//                       labelPlacement="outside"
//                       placeholder="06 XX XX XX XX"
//                       value={formData.phone}
//                       onChange={(e) =>
//                         setFormData({ ...formData, phone: e.target.value })
//                       }
//                       variant="bordered"
//                       radius="sm"
//                       isRequired
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <Textarea
//                       id="message"
//                       label="Message"
//                       labelPlacement="outside"
//                       placeholder="Votre message ou questions spécifiques..."
//                       value={formData.message}
//                       onChange={(e) =>
//                         setFormData({ ...formData, message: e.target.value })
//                       }
//                       variant="bordered"
//                       radius="sm"
//                       minRows={3}
//                       classNames={{
//                         label: "text-sm font-medium text-default-700",
//                         input: "text-base",
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
//                   form="meeting-form"
//                   color="primary"
//                   radius="sm"
//                   className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//                 >
//                   Envoyer la demande
//                 </Button>
//               </div>
//             </ModalFooter>
//           </>
//         )}
//       </ModalContent>
//     </Modal>
//   );
// };

// export default MeetingModal;
"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Input, Textarea, Button } from "@nextui-org/react";
import React from "react";
import { toast } from "react-toastify";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: MeetingFormData) => Promise<void>;
  planName: string;
}

export interface MeetingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

const MeetingModal: React.FC<MeetingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  planName,
}) => {
  const [formData, setFormData] = React.useState<MeetingFormData>({
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
      case "email":
        if (!value) return "L'email est requis";
        if (!/\S+@\S+\.\S+/.test(value)) return "Format d'email invalide";
        return undefined;
      case "phone":
        if (!value) return "Le téléphone est requis";
        // Validation internationale plus permissive :
        // - Permet les caractères +()-.
        // - Autorise les espaces entre les groupes de chiffres
        // - Exige au moins 8 chiffres et pas plus de 15 chiffres (standard E.164)
        // - Permet le + au début pour l'indicatif international
        const digitsOnly = value.replace(/[^0-9]/g, "");
        if (!/^[+]?[0-9\s().-]{8,}$/.test(value)) {
          return "Format de téléphone invalide";
        }
        if (digitsOnly.length < 8 || digitsOnly.length > 15) {
          return "Le numéro doit contenir entre 8 et 15 chiffres";
        }
        return undefined;
      case "name":
        if (!value.trim()) return "Le nom est requis";
        if (value.trim().length < 2)
          return "Le nom doit contenir au moins 2 caractères";
        return undefined;
      case "message":
        if (!value.trim()) return "Le message est requis";
        if (value.trim().length < 10)
          return "Le message doit contenir au moins 10 caractères";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof MeetingFormData]);
      if (error) {
        newErrors[key as keyof ValidationErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (field: keyof MeetingFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: keyof MeetingFormData, value: string) => {
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
        toast.error("Veuillez corriger les erreurs dans le formulaire.");
        return;
      }

      await onSubmit(formData);

      // Réinitialisation du formulaire
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setErrors({});
      setTouched({});
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande:", error);
      toast.error(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(
      (key) => !validateField(key, formData[key as keyof MeetingFormData])
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
              <h2 className="text-xl sm:text-2xl font-bold">
                Demande de rendez-vous - Pack {planName}
              </h2>
            </ModalHeader>
            <ModalBody>
              <form
                id="Meeting-form"
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
              >
                <div className="space-y-4">
                  <div>
                    <Input
                      id="name"
                      aria-labelledby="name-label"
                      label="Nom complet"
                      labelPlacement="outside"
                      placeholder="Votre nom"
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
                      label="Email"
                      labelPlacement="outside"
                      placeholder="votre@email.com"
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
                      label="Téléphone"
                      labelPlacement="outside"
                      placeholder="+1234567890 ou 0612345678"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      variant="bordered"
                      radius="sm"
                      isRequired
                      description="Format international accepté (ex: +1234567890)"
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
                      label="Message"
                      labelPlacement="outside"
                      placeholder="Votre message ..."
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
                  Annuler
                </Button>
                <Button
                  type="submit"
                  form="Meeting-form"
                  color="primary"
                  radius="sm"
                  disabled={!isFormValid() || isLoading}
                  className={`w-full sm:w-auto order-1 sm:order-2 ${
                    isLoading || !isFormValid()
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer la demande"}
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default MeetingModal;
