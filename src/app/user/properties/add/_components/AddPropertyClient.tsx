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
import { PropertyType, PropertyStatus, SubscriptionPlan } from "@prisma/client";
import AddPropertyForm from "./AddPropertyForm";
import Link from "next/link";

interface AddPropertyClientProps {
  showModal: boolean;
  modalMessage: string;
  types: PropertyType[];
  statuses: PropertyStatus[];
  planDetails?: Pick<
    SubscriptionPlan,
    | "namePlan"
    | "premiumAds"
    | "photosPerAd"
    | "shortVideosPerAd"
    | "youtubeVideoDuration"
  > | null; // Ajout de `null`;
}

const AddPropertyClient: React.FC<AddPropertyClientProps> = ({
  showModal,
  modalMessage,
  types,
  statuses,
  planDetails,
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
      <div>
        {planDetails && (
          <div className="mb-6 bg-gray-100 p-4 rounded shadow">
            <h3 className="font-semibold text-lg">
              Détails de votre abonnement
            </h3>
            <p>
              <strong>Plan :</strong> {planDetails.namePlan}
            </p>
            <p>
              <strong>Annonces premium autorisées :</strong>{" "}
              {planDetails.premiumAds || 1}
            </p>
            <p>
              <strong>Photos par annonce :</strong>{" "}
              {planDetails.photosPerAd || "Illimité"}
            </p>
            <p>
              <strong>Vidéos courtes par annonce :</strong>{" "}
              {planDetails.shortVideosPerAd || "Non autorisé"}
            </p>
            {planDetails.youtubeVideoDuration && (
              <p>
                <strong>Durée max. vidéo YouTube :</strong>{" "}
                {planDetails.youtubeVideoDuration} minutes
              </p>
            )}
          </div>
        )}
        <AddPropertyForm types={types} statuses={statuses} />
      </div>
    </>
  );
};

export default AddPropertyClient;
