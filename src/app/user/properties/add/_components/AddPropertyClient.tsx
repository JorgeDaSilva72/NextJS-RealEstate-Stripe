"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { PropertyType, PropertyStatus } from "@prisma/client";
import AddPropertyForm from "./AddPropertyForm";
import Link from "next/link";

interface AddPropertyClientProps {
  showModal: boolean;
  types: PropertyType[];
  statuses: PropertyStatus[];
}

const AddPropertyClient: React.FC<AddPropertyClientProps> = ({
  showModal,
  types,
  statuses,
}) => {
  const { isOpen, onOpen } = useDisclosure();

  useEffect(() => {
    if (showModal) {
      onOpen();
    }
  }, [showModal, onOpen]);

  return (
    <>
      {/* Désactive le contrôle de fermeture de la modale */}
      <Modal isOpen={isOpen} onOpenChange={() => {}} closeButton={false}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Abonnement requis
          </ModalHeader>
          <ModalBody>
            <p>
              Vous devez souscrire à un abonnement pour ajouter des annonces.
            </p>
          </ModalBody>
          <ModalFooter>
            {/* Bouton qui redirige vers la page d'abonnement sans possibilité de fermer la modale autrement */}
            <Link href="/user/subscription">
              <Button color="primary">Voir les abonnements</Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AddPropertyForm types={types} statuses={statuses} />
    </>
  );
};

export default AddPropertyClient;
