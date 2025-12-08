// "use client";

// import React, { useCallback, useEffect } from "react";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   useDisclosure,
// } from "@nextui-org/react";
// import { PropertyType, PropertyStatus, SubscriptionPlan } from "@prisma/client";
// import AddPropertyForm from "./AddPropertyForm";
// import Link from "next/link";
// import SubModal from "./SubModal";

// interface AddPropertyClientProps {
//   showModal: boolean;
//   modalMessage: string;
//   types: PropertyType[];
//   statuses: PropertyStatus[];
//   planDetails?: Pick<
//     SubscriptionPlan,
//     | "namePlan"
//     | "premiumAds"
//     | "photosPerAd"
//     | "shortVideosPerAd"
//     | "youtubeVideoDuration"
//   > | null; // Ajout de `null`;
// }

// const AddPropertyClient: React.FC<AddPropertyClientProps> = ({
//   showModal,
//   modalMessage,
//   types,
//   statuses,
//   planDetails,
// }) => {
//   const { isOpen, onOpen } = useDisclosure();

//   const handleOpen = useCallback(() => {
//     if (showModal) {
//       onOpen();
//     }
//   }, [showModal, onOpen]);

//   useEffect(() => {
//     handleOpen();
//   }, [handleOpen]);

//   return (
//     <>
//       {/* Désactive le contrôle de fermeture de la modale */}
//       {/* <Modal isOpen={isOpen} onOpenChange={() => {}} closeButton={false}>
//         <ModalContent>
//           <ModalHeader className="flex flex-col gap-1">
//             Abonnement requis
//           </ModalHeader>
//           <ModalBody>
//             <p>{modalMessage}</p>
//           </ModalBody>
//           <ModalFooter>
//             <Link href="/user/subscription">
//               <Button color="primary">Voir les abonnements</Button>
//             </Link>
//           </ModalFooter>
//         </ModalContent>
//       </Modal> */}
//       <SubModal isOpen={isOpen} modalMessage={modalMessage} />
//       <div>
//         {/* {planDetails && (
//           <div className="mb-6 bg-gray-100 p-4 rounded shadow">
//             <h3 className="font-semibold text-lg">
//               Détails de votre abonnement
//             </h3>
//             <p>
//               <strong>Plan :</strong> {planDetails.namePlan}
//             </p>
//             <p>
//               <strong>Annonces premium autorisées :</strong>{" "}
//               {planDetails.premiumAds || 1}
//             </p>
//             <p>
//               <strong>Photos par annonce :</strong>{" "}
//               {planDetails.photosPerAd || "Illimité"}
//             </p>
//             <p>
//               <strong>Vidéos courtes par annonce :</strong>{" "}
//               {planDetails.shortVideosPerAd || "Non autorisé"}
//             </p>
//             {planDetails.youtubeVideoDuration && (
//               <p>
//                 <strong>Durée max. vidéo YouTube :</strong>{" "}
//                 {planDetails.youtubeVideoDuration} minutes
//               </p>
//             )}
//           </div>
//         )} */}
//         <AddPropertyForm
//           types={types}
//           statuses={statuses}
//           planDetails={planDetails}
//         />
//       </div>
//     </>
//   );
// };

// export default AddPropertyClient;

// 08/12/2025

"use client";

import React, { useCallback, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
// PropertyType et PropertyStatus ne sont plus les types bruts Prisma, ils sont traduits
import { SubscriptionPlan } from "@prisma/client";
import AddPropertyForm from "./AddPropertyForm";
import Link from "next/link";
import SubModal from "./SubModal";

// ⚠️ NOUVEAU TYPE : Structure des données traduites (ID + Nom traduit)
interface TranslatedClientItem {
  id: number;
  code: string;
  name: string; // Le nom traduit du type/statut
}

interface AddPropertyClientProps {
  showModal: boolean;
  modalMessage: string;

  // ✅ Types et Status sont désormais des tableaux de l'interface traduite
  types: TranslatedClientItem[];
  statuses: TranslatedClientItem[];

  countries: TranslatedClientItem[] | undefined;
  cities: TranslatedClientItem[] | undefined;

  // ✅ NOUVELLES PROPS : Limites des médias (calculées côté serveur)
  photoLimit: number;
  shortVideoLimit: number;

  planDetails?: Pick<
    SubscriptionPlan,
    | "namePlan"
    | "premiumAds"
    | "photosPerAd"
    | "shortVideosPerAd"
    | "youtubeVideoDuration"
  > | null;
}

const AddPropertyClient: React.FC<AddPropertyClientProps> = ({
  showModal,
  modalMessage,
  types,
  statuses,
  cities,
  countries,
  planDetails,
  // Déstructuration des nouvelles props
  photoLimit,
  shortVideoLimit,
}) => {
  const { isOpen, onOpen } = useDisclosure();

  const handleOpen = useCallback(() => {
    if (showModal) {
      onOpen();
    }
  }, [showModal, onOpen]);

  useEffect(() => {
    handleOpen();
  }, [handleOpen]);

  return (
    <>
      <SubModal isOpen={isOpen} modalMessage={modalMessage} />
      <div>
        {/* Vous avez commenté cette section, mais si vous la réactivez, 
            les limites sont maintenant disponibles via les props photoLimit/shortVideoLimit */}

        {/* {planDetails && (
          <div className="mb-6 bg-gray-100 p-4 rounded shadow">
            ...
            <p>
              <strong>Photos par annonce :</strong>{" "}
              {photoLimit}
            </p>
            <p>
              <strong>Vidéos courtes par annonce :</strong>{" "}
              {shortVideoLimit}
            </p>
            ...
          </div>
        )} */}

        <AddPropertyForm
          types={types}
          statuses={statuses}
          countries={countries || []}
          cities={cities || []}
          planDetails={planDetails}
          // ✅ Passage des limites au formulaire
          photoLimit={photoLimit}
          shortVideoLimit={shortVideoLimit}
        />
      </div>
    </>
  );
};

export default AddPropertyClient;
