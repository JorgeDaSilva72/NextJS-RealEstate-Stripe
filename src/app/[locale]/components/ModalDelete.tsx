// "use client";
// import {
//   Button,
//   Modal,
//   ModalBody,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
// } from "@nextui-org/react";
// import Image from "next/image";
// import React from "react";

// interface ModalDeleteProps {
//   isOpen: boolean;
//   handleCancel: () => void;
//   handleDelete: () => void;
//   slug: string;
// }

// const ModalDelete = ({
//   isOpen,
//   handleCancel,
//   handleDelete,
//   slug,
// }: ModalDeleteProps) => {
//   return (
//     <Modal isOpen={isOpen} onOpenChange={handleCancel}>
//       <ModalContent>
//         <ModalHeader className="flex flex-col gap-1 justify-center items-center mb-3">
//           <Image
//             src="/png/poubelle.png"
//             alt="image de poubelle"
//             width={50}
//             height={50}
//           />
//           <h3 className="text-center text-[#ff3f5b] tracking-[2px] text-3xl font-extrabold">
//             {"Suppression"}
//           </h3>
//         </ModalHeader>
//         <ModalBody>
//           <p>{"Êtes-vous sûr de vouloir supprimer " + slug + " ?"}</p>
//         </ModalBody>
//         <ModalFooter>
//           <Button onClick={handleCancel}>Annuler</Button>
//           <Button onClick={handleDelete} color="danger" variant="light">
//             Supprimer
//           </Button>
//         </ModalFooter>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ModalDelete;

// end ----------------------------------------------------------
// next-intl with deepseek

"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

interface ModalDeleteProps {
  isOpen: boolean;
  handleCancel: () => void;
  handleDelete: () => void;
  slug: string;
}

const ModalDelete = ({
  isOpen,
  handleCancel,
  handleDelete,
  slug,
}: ModalDeleteProps) => {
  const t = useTranslations("ModalDelete");

  return (
    <Modal isOpen={isOpen} onOpenChange={handleCancel}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 justify-center items-center mb-3">
          <Image
            src="/png/poubelle.png"
            alt="image de poubelle"
            width={50}
            height={50}
          />
          <h3 className="text-center text-[#ff3f5b] tracking-[2px] text-3xl font-extrabold">
            {t("title")}
          </h3>
        </ModalHeader>
        <ModalBody>
          <p>{t("confirmation", { slug })}</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleCancel}>{t("cancel")}</Button>
          <Button onClick={handleDelete} color="danger" variant="light">
            {t("delete")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalDelete;
