import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Link from "next/link";
import React from "react";

const SubModal = ({
  isOpen,
  modalMessage,
}: {
  isOpen: boolean;
  modalMessage: string;
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={() => {}} closeButton={false}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Abonnement requis
        </ModalHeader>
        <ModalBody>
          <p>{modalMessage}</p>
        </ModalBody>
        <ModalFooter>
          {/* Bouton qui redirige vers la page d'abonnement sans possibilité de fermer la modale autrement */}
          <Link href="/user/subscription">
            <Button color="primary">Voir les abonnements</Button>
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SubModal;
