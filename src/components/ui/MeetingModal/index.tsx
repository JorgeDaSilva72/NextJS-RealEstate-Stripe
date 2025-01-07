// "use client";

// import { Modal, ModalContent, ModalHeader } from "@nextui-org/modal";
// import { Input, Textarea } from "@nextui-org/react";
// import React from "react";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";

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
//     <Modal isOpen={isOpen} onOpenChange={onClose}>
//       <ModalContent className="sm:max-w-md">
//         <ModalHeader>Demande de rendez-vous - Pack {planName}</ModalHeader>
//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium mb-1">
//               Nom complet*
//             </label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//               required
//               placeholder="Votre nom"
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium mb-1">
//               Email*
//             </label>
//             <Input
//               id="email"
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               required
//               placeholder="votre@email.com"
//             />
//           </div>

//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium mb-1">
//               Téléphone*
//             </label>
//             <Input
//               id="phone"
//               type="tel"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//               required
//               placeholder="06 XX XX XX XX"
//             />
//           </div>

//           <div>
//             <label htmlFor="message" className="block text-sm font-medium mb-1">
//               Message
//             </label>
//             <Textarea
//               id="message"
//               value={formData.message}
//               onChange={(e) =>
//                 setFormData({ ...formData, message: e.target.value })
//               }
//               placeholder="Votre message ou questions spécifiques..."
//               className="min-h-[100px]"
//             />
//           </div>

//           <div className="flex justify-end space-x-4 mt-6">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100"
//             >
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm hover:from-green-600 hover:to-emerald-700"
//             >
//               Envoyer la demande
//             </button>
//           </div>
//         </form>
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

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: MeetingFormData) => void;
  planName: string;
}

export interface MeetingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", phone: "", message: "" });
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
                id="meeting-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <Input
                      id="name"
                      label="Nom complet*"
                      labelPlacement="outside"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      variant="bordered"
                      radius="sm"
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                      }}
                    />
                  </div>

                  <div>
                    <Input
                      id="email"
                      type="email"
                      label="Email*"
                      labelPlacement="outside"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      variant="bordered"
                      radius="sm"
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                      }}
                    />
                  </div>

                  <div>
                    <Input
                      id="phone"
                      type="tel"
                      label="Téléphone*"
                      labelPlacement="outside"
                      placeholder="06 XX XX XX XX"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      variant="bordered"
                      radius="sm"
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
                      }}
                    />
                  </div>

                  <div>
                    <Textarea
                      id="message"
                      label="Message"
                      labelPlacement="outside"
                      placeholder="Votre message ou questions spécifiques..."
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      variant="bordered"
                      radius="sm"
                      minRows={3}
                      classNames={{
                        label: "text-sm font-medium text-default-700",
                        input: "text-base",
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
                  form="meeting-form"
                  color="primary"
                  radius="sm"
                  className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Envoyer la demande
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
